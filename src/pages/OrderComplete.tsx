import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../api/config';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const OrderComplete: React.FC = () => {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`api/order/oneorder/${orderId}`);
                setOrderData(response.data.data);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        if (orderId) fetchOrderDetails();
    }, [orderId]);

    const generatePDF = () => {
        if (!orderData) return;

        const doc = new jsPDF();
        const blueColor: [number, number, number] = [13, 110, 253];
        const greyColor = "#444444";
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- 1. Top Branding & Invoice Title ---
        doc.setFontSize(24);
        doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("SALE INVOICE", 14, 22);

        doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
        doc.setLineWidth(0.8);
        doc.line(14, 26, pageWidth - 14, 26);

        // --- 2. Invoice Details (Right Aligned Header) ---
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        
        const infoX = pageWidth - 14;
        doc.text(`Invoice No: ${orderData.orderId || orderId}`, infoX, 35, { align: 'right' });
        
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${new Date(orderData.createdAt).toLocaleDateString()}`, infoX, 41, { align: 'right' });
        doc.text(`Payment Status: ${orderData.paymentDetails?.status || 'Confirmed'}`, infoX, 47, { align: 'right' });
        doc.text(`Payment Method: ${orderData.paymentDetails?.method || 'Razorpay'}`, infoX, 53, { align: 'right' });
        
        doc.setFont("helvetica", "bold");
        doc.text(`Transaction ID: ${orderData.paymentDetails?.transactionId || 'N/A'}`, infoX, 59, { align: 'right' });

        // --- 3. Seller Info (Sold By - Left) ---
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("SOLD BY:", 14, 35);
        
        doc.setFontSize(10);
        doc.text("NEXUS STORE PVT LTD", 14, 42);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(greyColor);
        doc.text("123 Tech Park, SG Highway,", 14, 47);
        doc.text("Ahmedabad, Gujarat - 380054", 14, 52);
        doc.setTextColor(0);
        doc.text(`GSTIN: 24AAACN1234F1Z5`, 14, 58);

        // --- 4. Party Details Section (Bill To / Ship To) ---
        doc.setDrawColor(220);
        doc.setLineWidth(0.3);
        doc.line(14, 65, pageWidth - 14, 65);

        const addr = orderData.address;
        const addressString = `${addr.area || ''}, ${addr.landmark || ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
        const splitAddress = doc.splitTextToSize(addressString, 85);

        doc.setFont("helvetica", "bold");
        doc.text("BILL TO:", 14, 75);
        doc.setTextColor(0);
        doc.text(`${orderData.paymentDetails?.name || 'Customer'}`, 14, 82);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(greyColor);
        doc.text(`Contact: ${orderData.user?.contact || orderData.customerNumber || 'N/A'}`, 14, 87);
        doc.text(splitAddress, 14, 92);

        const col2X = pageWidth / 2 + 5;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("SHIP TO:", col2X, 75);
        doc.text(`${orderData.paymentDetails?.name || 'Customer'}`, col2X, 82);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(greyColor);
        doc.text(`Delivery Address:`, col2X, 87);
        doc.text(splitAddress, col2X, 92);

        // --- 5. Product Table (Updated with Color & Size) ---
        const tableRows = orderData.items.map((item: any) => {
            // Combine Name, Size, and Color into a single string with line breaks
            const productDetails = [
                item.productName,
                item.size ? `Size: ${item.size}` : null,
                item.colorName ? `Color: ${item.colorName}` : null
            ].filter(Boolean).join('\n');

            return [
                productDetails,
                item.quantity,
                `INR ${item.price.toFixed(2)}`,
                `INR ${(item.price * item.quantity).toFixed(2)}`
            ];
        });

        autoTable(doc, {
            head: [["Item Description", "Qty", "Unit Price", "Total Amount"]],
            body: tableRows,
            startY: 115,
            styles: { 
                valign: 'middle', 
                overflow: 'linebreak',
                cellPadding: 3 
            },
            headStyles: { 
                fillColor: blueColor, 
                textColor: 255, 
                fontSize: 10, 
                fontStyle: 'bold',
                halign: 'left' 
            },
            bodyStyles: { 
                fontSize: 9, 
                textColor: 50 
            },
            columnStyles: {
                0: { cellWidth: 85 }, // Description Column
                1: { halign: 'center', cellWidth: 20 },
                2: { halign: 'right', cellWidth: 35 },
                3: { halign: 'right', cellWidth: 35 },
            },
            theme: 'grid',
            margin: { left: 14, right: 14 }
        });

        // --- 6. Financial Summary ---
        let finalY = (doc as any).lastAutoTable.finalY + 10;
        const summaryLabelX = pageWidth - 85;
        const summaryValueX = pageWidth - 14;

        doc.setFontSize(10);
        doc.setTextColor(0);
        
        const subtotal = orderData.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", summaryLabelX, finalY);
        doc.text(`INR ${subtotal.toFixed(2)}`, summaryValueX, finalY, { align: 'right' });

        // Coupon Discounts
        orderData.items.forEach((item: any) => {
            if (item.Coupon && item.Coupon[0]) {
                const coupon = item.Coupon[0];
                finalY += 7;
                doc.setTextColor(200, 0, 0);
                doc.text(`${coupon.productName} (${coupon.couponCode}):`, summaryLabelX, finalY);
                doc.text(`- INR ${Number(coupon.discountAmount).toFixed(2)}`, summaryValueX, finalY, { align: 'right' });
                doc.setTextColor(0);
            }
        });

        if (orderData.paymentDetails?.taxAmount) {
            finalY += 7;
            doc.text("GST (18%):", summaryLabelX, finalY);
            doc.text(`+ INR ${Number(orderData.paymentDetails.taxAmount).toFixed(2)}`, summaryValueX, finalY, { align: 'right' });
        }

        if (orderData.paymentDetails?.shippingCost !== undefined) {
            finalY += 7;
            doc.text("Shipping Charges:", summaryLabelX, finalY);
            doc.text(`+ INR ${Number(orderData.paymentDetails.shippingCost).toFixed(2)}`, summaryValueX, finalY, { align: 'right' });
        }

        // --- 7. Grand Total Highlight ---
        finalY += 10;
        doc.setFillColor(245, 247, 255);
        doc.rect(summaryLabelX - 5, finalY - 7, 76, 12, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
        doc.text("Grand Total:", summaryLabelX, finalY);
        const grandTotal = orderData.paymentDetails?.amount || orderData.amount || 0;
        doc.text(`INR ${Number(grandTotal).toFixed(2)}`, summaryValueX, finalY, { align: 'right' });

        // --- 8. Footer Section ---
        const footerY = 275;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for shopping with NEXUS STORE!", pageWidth / 2, footerY, { align: 'center' });
        doc.text("This is a computer-generated invoice and does not require a physical signature.", pageWidth / 2, footerY + 5, { align: 'center' });

        doc.save(`Invoice_${orderData.orderId || orderId}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500">Preparing your order summary...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-8">
                <CheckCircle size={40} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-10 max-w-md mx-auto">
                Thank you {orderData?.paymentDetails?.name || 'Customer'}! Your order <b>#{orderId}</b> has been received.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                    <Button variant="outline">Continue Shopping</Button>
                </Link>
                <Button onClick={generatePDF} className="flex items-center gap-2">
                    <Download size={18} /> Download Invoice
                </Button>
            </div>
        </div>
    );
};