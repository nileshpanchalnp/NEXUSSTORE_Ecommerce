import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Package } from 'lucide-react';

export const TrackOrder: React.FC = () => {
    const [orderId, setOrderId] = useState('');

    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <div className="bg-white border rounded-3xl p-8 shadow-sm">
                <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
                <p className="text-gray-500 mb-8">Enter your Order ID and Billing Email to see status.</p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <Input label="Order ID" placeholder="e.g. #NEX-12345" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
                    <Input label="Billing Email" type="email" placeholder="email@example.com" />
                    <Button fullWidth className="py-4">Track Status</Button>
                </form>

                {/* Mock Status (Only show if orderId is entered) */}
                {orderId && (
                    <div className="mt-12 pt-12 border-t">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-full"><Package size={20} /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                                    <p className="font-bold">In Transit</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium">Est. Delivery: Jan 5, 2026</p>
                        </div>
                        {/* Progress Bar */}
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-[#0d6efd] w-2/3"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};