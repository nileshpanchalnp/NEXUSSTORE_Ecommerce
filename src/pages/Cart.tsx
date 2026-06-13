import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/ui/Button';

export const Cart: React.FC = () => {
  const { cart, subtotal, clearCart } = useCart();

  // 1. EMPTY STATE UI
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-28 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 text-gray-300 rounded-full mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is feeling lonely.</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          It looks like you haven't added any items to your cart yet. Explore our latest arrivals and find something you love!
        </p>
        <Link to="/products">
          <Button className="px-10 py-4 shadow-xl shadow-blue-100">
            START SHOPPING
          </Button>
        </Link>
      </div>
    );
  }

  // 2. ACTIVE CART UI
  return (
    <div className="bg-gray-50/30 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumbs / Back Link */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0d6efd] transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            CONTINUE SHOPPING
          </Link>
          <span className="text-sm font-medium text-gray-400">
            {cart.length} Item{cart.length !== 1 ? 's' : ''} in your cart
          </span>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Cart Items List */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Header Row (Desktop Only) */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-4 bg-gray-50 border-b border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
                <div className="col-span-1"></div>
              </div>

              <div className="px-4 sm:px-8 divide-y divide-gray-100">
                {cart.map((item) => (
                  <CartItem key={item._id} _id={item._id} item={item} />
                ))}
              </div>

              {/* Cart Actions */}
              <div className="px-8 py-6 bg-gray-50/50 flex flex-col sm:flex-row justify-end items-center gap-4">
                <button 
                  onClick={clearCart}
                  className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                  CLEAR CART
                </button>
              </div>
            </div>

            {/* Delivery Promise Placeholder */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 border border-dashed border-gray-300 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-[#0d6efd] rounded-full flex items-center justify-center shrink-0">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Free In-Store Pickup</h4>
                  <p className="text-xs text-gray-500 mt-1">Ready within 2 hours at your nearest Nexus store.</p>
                </div>
              </div>
              <div className="p-6 border border-dashed border-gray-300 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <ArrowLeft size={24} className="rotate-180" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Hassle-Free Returns</h4>
                  <p className="text-xs text-gray-500 mt-1">Not happy? Return items within 30 days for free.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 h-full">
            <CartSummary subtotal={subtotal || 0} cartItems={cart} />
          </div>
        </div>
      </div>
    </div>
  );
};