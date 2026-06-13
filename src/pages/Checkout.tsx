import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';

import { useCart } from '../contexts/CartContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Ticket, Loader2 } from 'lucide-react';


const loadScript = (src: string) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const Checkout: React.FC = () => {
    const { cart, subtotal, clearCart } = useCart();
    const navigate = useNavigate();

    // 1. FORM STATE
    const [customerName, setCustomerName] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [area, setArea] = useState('');
    const [landmark, setLandmark] = useState('');
    const [pincode, setPincode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // 2. SHIPPING STATE
    const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

    // 3. CALCULATIONS
    const { taxAmount, shippingCost, finalTotal } = useMemo(() => {
        const discount = cart.reduce((acc, item) => {
            const itemCoupon = item.Coupon?.[0];
            return itemCoupon ? acc + (Number(itemCoupon.discountAmount) || 0) : acc;
        }, 0);

        const standardShipping = subtotal > 1000 ? 0 : 150;
        const currentShipping = shippingMethod === 'express' ? 150.00 : standardShipping;

        const taxRate = 0.18;
        const tax = (subtotal - discount) * taxRate;
        const total = subtotal - discount + currentShipping + tax;

        return {
            totalDiscount: discount,
            taxAmount: tax,
            shippingCost: currentShipping,
            finalTotal: total
        };
    }, [cart, subtotal, shippingMethod]);

    // 4. RAZORPAY HANDLER
    const handleRazorpay = async () => {
        const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!isLoaded) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // setIsProcessing(true);

        try {
            // Create Order on Backend
            const response = await api.post("api/payment/create-payment", {
                amount: finalTotal,
            });

            const { data } = response.data;

            const options = {
                key: "rzp_test_BzZtWGTclpXVBE",
                amount: Math.round(finalTotal * 100), // Razorpay expects paise
                currency: "INR",
                order_id: data.id,
                handler: async (response: any) => {
                    // console.log("Payment Verifieddd:", response);
                    try {
                        const verificationResponse = await api.post("api/payment/verify-payment", {
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            paymentMethod: "Razorpay",
                            address: {
                                landmark: landmark,
                                area: area,
                                city: city,
                                state: state,
                                pincode: pincode
                            },
                            prefill: {
                                name: customerName,
                                contact: customerNumber,
                                email: email
                            },
                            customerName: customerName,
                            amount: finalTotal,
                            taxAmount: taxAmount,
                            shippingCost: shippingCost,
                            items: cart
                        });
                        const orderId = verificationResponse.data.data._id;

                        if (verificationResponse.data.success && orderId) {
                            clearCart();
                            navigate(`/order-success/${orderId}`);
                        } else {
                            alert("Payment verification failed.");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Error verifying payment.");
                    }
                },
                prefill: {
                    name: customerName,
                    contact: customerNumber,
                    email: email
                },
                theme: { color: "#0d6efd" },
                modal: {
                    ondismiss: () => setIsProcessing(false)
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Order creation error:", error);
            alert("Error processing payment.");
            setIsProcessing(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleRazorpay();
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Billing Details */}
                <div className="lg:col-span-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Billing Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Full Name" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                            <Input label="Phone" type="tel" placeholder="+91 00000 00000" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} required />
                            <Input label="Email Address" type="email" placeholder="john@example.com" className="md:col-span-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input label="Area / Colony" placeholder="Sector 4" value={area} onChange={(e) => setArea(e.target.value)} required />
                            <Input label="Landmark" placeholder="Near Railway Station" value={landmark} onChange={(e) => setLandmark(e.target.value)} required />
                            <Input label="City" placeholder="Ahmedabad" value={city} onChange={(e) => setCity(e.target.value)} required />
                            <Input label="State" placeholder="Gujarat" value={state} onChange={(e) => setState(e.target.value)} required />
                            <Input label="ZIP Code" placeholder="380001" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
                        <div className="space-y-3">
                            <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-[#0d6efd] bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="w-4 h-4 text-[#0d6efd]" />
                                    <div>
                                        <span className="font-medium block">Standard Delivery</span>
                                        <span className="text-xs text-gray-500">3-5 Business Days</span>
                                    </div>
                                </div>
                                <span className="font-bold">{subtotal > 1000 ? 'FREE' : `₹150.00`}</span>
                            </label>
                            <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-[#0d6efd] bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="w-4 h-4 text-[#0d6efd]" />
                                    <div>
                                        <span className="font-medium block">Express Shipping</span>
                                        <span className="text-xs text-gray-500">1-2 Business Days</span>
                                    </div>
                                </div>
                                <span className="font-bold">₹150.00</span>
                            </label>
                        </div>
                    </section>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-gray-50 p-6 rounded-xl border sticky top-24">
                        <h3 className="text-xl font-bold mb-6">Your Order</h3>
                        <div className="space-y-4 mb-6">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-gray-700 font-medium">{item.productName}</span>
                                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-3 mb-6 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                            {cart.map((item, idx) => {
                                const itemCoupon = item.Coupon?.[0];
                                if (!itemCoupon) return null;
                                return (
                                    <div key={idx} className="flex justify-between text-xs text-green-600">
                                        <span className="flex items-center gap-1">
                                            <Ticket size={12} />{item.productName}  {itemCoupon.couponCode}
                                        </span>
                                        <span>- ₹{Number(itemCoupon.discountAmount).toFixed(2)}</span>
                                    </div>
                                );
                            })}

                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className={shippingCost === 0 ? "text-green-600 font-bold" : ""}>
                                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>GST (18%)</span>
                                <span>₹{taxAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between font-black text-xl pt-4 border-t border-gray-200 text-gray-900">
                                <span>Total</span>
                                <span className="text-[#0d6efd]">₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button type="submit" onClick={handleRazorpay} fullWidth disabled={isProcessing} className="py-4 shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                            {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : "Pay Now"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};