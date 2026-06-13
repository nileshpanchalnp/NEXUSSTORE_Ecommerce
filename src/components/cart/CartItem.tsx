import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
  _id: string | number;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // Standardized ID for function calls
  const itemId = String(item.id || item._id);

  return (
    <div className="flex flex-row items-start sm:items-center gap-3 sm:gap-6 py-4 sm:py-6 border-b border-gray-100 last:border-0 w-full">
      
      {/* 1. Product Image - Adjusted size for mobile */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
        <img 
          src={item.image || (item.variants?.[0]?.images?.[0]?.url) || 'https://via.placeholder.com/150'} 
          alt={item.productName || ''} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* 2. Main Content Wrapper - Flex-1 ensures it takes remaining space */}
      <div className="flex flex-col sm:flex-row flex-1 sm:items-center gap-2 sm:gap-4 min-w-0">
        
        {/* Product Info - Left Aligned on mobile, truncated for safety */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm sm:text-base hover:text-[#0d6efd] transition-colors cursor-pointer truncate">
            {item.productName || ''}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-medium tracking-wide">
              {item.category || ''}
            </p>
            
            {item.selectedSize || item.size ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-blue-50 text-[#0d6efd] border border-blue-100 uppercase">
                Size: {item.selectedSize || item.size}
              </span>
            ) : null}

            {(item.selectedColor || item.color) && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 uppercase">
                Color: {item.selectedColor || item.color}
              </span>
            )}
          </div>

          {/* Mobile Only Price */}
          <div className="mt-1 sm:hidden font-black text-[#0d6efd] text-sm">
            ₹{(item.discountPrice || item.price || 0).toLocaleString()}
          </div>
        </div>

        {/* 3. Controls Group (Quantity + Subtotal for Desktop) */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 mt-2 sm:mt-0">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-1 sm:gap-3 bg-gray-50 rounded-xl p-1 border border-gray-200">
            <button 
              onClick={() => updateQuantity(itemId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus size={12} />
            </button>
            <span className="w-5 sm:w-6 text-center font-bold text-xs sm:text-sm">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(itemId, item.quantity + 1)}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all shadow-sm"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Desktop Only Subtotal */}
          <div className="hidden sm:block w-24 sm:w-28 text-right shrink-0">
            <span className="font-black text-gray-900">
              ₹{((item.discountPrice || item.price || 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Remove Button - Positioned top-right on mobile or aligned in row on desktop */}
      <button 
        onClick={() => removeFromCart(itemId)}
        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 self-start sm:self-center"
        title="Remove item"
      >
        <X size={18} className="sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};