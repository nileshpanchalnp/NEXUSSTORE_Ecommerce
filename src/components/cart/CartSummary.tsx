import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ShieldCheck, Truck, Trash2, Ticket,Loader2 } from 'lucide-react';
import { couponService } from '../../services/couponService';
import { useCart } from '../../contexts/CartContext';
interface CartSummaryProps {
  subtotal: number;
  cartItems: any[]; 
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, cartItems }) => {
  const { fetchCart } = useCart(); // Get the refresh function
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  

  // 1. CALCULATIONS
  const shipping = subtotal > 1000 ? 0 : 150;
  const taxRate = 0.18;

  // Calculate global discount from all products
  const totalDiscount = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      // Accessing Coupon[0] as per your console screenshot
      const itemCoupon = item.Coupon?.[0];
      if (itemCoupon) {
        return acc + (Number(itemCoupon.discountAmount) || 0);
      }
      return acc;
    }, 0);
  }, [cartItems]);

  const taxAmount = (subtotal - totalDiscount) * taxRate;
  const finalTotal = subtotal - totalDiscount + shipping + taxAmount;

  // 2. HANDLERS
const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplying(true);
    setCouponError('');

    try {
      // Step A: Apply coupon to the user's cart in DB
       await couponService.applyCoupon(couponCode);
      await fetchCart(); 
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code');
    } finally {
      setIsApplying(false);
    }
  };

const removeAllCoupons = async () => {
  try {
    setIsApplying(true); // Start loader
    await couponService.removeCoupon();
    await fetchCart();    // Refresh cart data
    setAppliedCoupon(null);
    setCouponError('');
  } catch (err) {
    console.error("Failed to remove coupon:", err);
    setCouponError('Failed to remove coupon. Please try again.');
  } finally {
    setIsApplying(false); // Stop loader
  }
};

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
      <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h3>

      {/* 3. ITEMS DETAIL */}
      <div className="space-y-3 mb-6 max-h-40 overflow-y-auto custom-scrollbar pr-2">
        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Items Detail</label>
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex justify-between text-xs">
            <span className="text-gray-500 truncate max-w-[180px]">
              {item.quantity}x {item.productName}
            </span>
            <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* 4. PRICE BREAKDOWN */}
      <div className="space-y-4 mb-6 text-sm border-t border-dashed pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Cart Subtotal</span>
          <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* SPECIFIC PRODUCT COUPON BREAKDOWN */}
        <div className="space-y-2">
          {cartItems.map((item, idx) => {
            const itemCoupon = item.Coupon?.[0];
            if (!itemCoupon) return null;
            return (
              <div key={`disc-${idx}`} className="flex justify-between text-[11px] text-green-600 bg-green-50/50 px-2 py-1 rounded">
                <span className="flex items-center gap-1 italic">
                  <Ticket size={10} /> {item.productName} ({itemCoupon.couponCode})
                </span>
                <span className="font-bold">- ₹{Number(itemCoupon.discountAmount).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* GLOBAL COUPON SUMMARY SECTION */}


        <div className="flex justify-between text-gray-600">
          <span>Estimated Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-bold" : "font-bold text-gray-900"}>
            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>GST / Tax (18%)</span>
          <span className="font-bold text-gray-900">+ ₹{taxAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* 5. COUPON INPUT */}
      {!appliedCoupon && totalDiscount === 0 && (
        <div className="mb-6">
          <label className="text-xs font-bold uppercase text-gray-500 mb-2 block">Apply Coupon</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter Code"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0d6efd] uppercase font-mono"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplying}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isApplying ? '...' : 'Apply'}
            </button>
          </div>
          {couponError && <p className="text-[10px] text-red-500 mt-2 font-bold">{couponError}</p>}
        </div>
      )}

      {/* 6. FINAL TOTAL */}
      <div className="border-t border-gray-100 pt-6 mb-8">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-bold text-gray-900">Order Total</span>
          <span className="text-3xl font-black text-[#0d6efd]">₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/checkout">
        <Button fullWidth className="py-4 text-lg shadow-lg shadow-blue-100 mb-4 uppercase tracking-wider">
          Proceed to Checkout
        </Button>
      </Link>

{(totalDiscount > 0 || appliedCoupon) && (
  <div className="flex justify-between items-center text-green-700 font-bold bg-green-100 p-3 rounded-lg border border-green-200">
    <div className="flex flex-col">
      <span className="text-[10px] uppercase opacity-70">Applied Coupon</span>
      <span className="text-sm">
        {cartItems.find(i => i.Coupon?.[0])?.Coupon[0].couponCode || appliedCoupon?.code}
      </span>
    </div>
    
    <div className="flex items-center gap-3">
      <span className="text-lg">- ₹{totalDiscount.toFixed(2)}</span>
      <button
        onClick={removeAllCoupons}
        disabled={isApplying} // Disable button while removing
        className="p-1.5 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[32px] min-h-[32px]"
        title="Remove Coupon"
      >
        {isApplying ? (
          <Loader2 size={16} className="animate-spin" /> // Spinning loader icon
        ) : (
          <Trash2 size={16} />
        )}
      </button>
    </div>
  </div>
)}

      <div className="space-y-3 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 uppercase">
          <ShieldCheck size={16} className="text-green-500" />
          Secure SSL Checkout
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 uppercase">
          <Truck size={16} className="text-[#0d6efd]" />
          Fast Pan-India Delivery
        </div>
      </div>
    </div>
  );
};