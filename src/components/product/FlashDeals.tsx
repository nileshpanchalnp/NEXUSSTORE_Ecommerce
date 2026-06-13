import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types'; // Ensure this is imported
import { Zap } from 'lucide-react';

interface FlashDealsProps {
    products: Product[];
}

export const FlashDeals: React.FC<FlashDealsProps> = ({ products }) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Use the products passed from props
    const dealProducts = products.slice(0, 4);

    return (
        <>
            {dealProducts.length > 0 && (
                <section className="container mx-auto px-4 py-12">
                    <div className="bg-white border-2 border-orange-500 rounded-3xl overflow-hidden shadow-xl shadow-orange-50">
                        <div className="bg-orange-500 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-white">
                                <div className="p-2 bg-white/20 rounded-lg animate-pulse">
                                    <Zap size={24} fill="white" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Flash Deals</h2>
                                    <p className="text-xs font-bold opacity-90 uppercase">Limited time offer - ending soon!</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                {[
                                    { label: 'Hrs', val: timeLeft.hours },
                                    { label: 'Min', val: timeLeft.minutes },
                                    { label: 'Sec', val: timeLeft.seconds }
                                ].map((unit, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="bg-white text-orange-600 min-w-[50px] h-12 flex items-center justify-center rounded-xl text-xl font-black shadow-sm">
                                            {unit.val.toString().padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] text-white font-bold uppercase mt-1">{unit.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 md:p-10">
                            {dealProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {dealProducts.map(product => (
                                        <div key={product._id || product.id} className="relative group">
                                            <ProductCard product={product} />
                                            <div className="mt-4 px-2">
                                                <div className="flex justify-between text-[11px] font-bold mb-1.5 uppercase text-gray-500">
                                                    <span>Available: <span className="text-gray-900">{product.stock || 0}</span></span>
                                                    <span>Sold: <span className="text-gray-900">85%</span></span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-orange-500 w-[85%] rounded-full transition-all duration-1000"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 font-medium">
                                    No active deals at the moment.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )};
        </>
    );
};