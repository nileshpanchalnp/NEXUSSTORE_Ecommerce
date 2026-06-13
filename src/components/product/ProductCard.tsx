import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Check, Loader2, ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // <--- Add this

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth(); // <--- Add this line
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. CHECK LOGIN STATUS FIRST
  if (!isAuthenticated) {
    alert("Please login first to add items to your cart.");

    return;
  }

    if (!product || isAdding) return;

    try {
      // FIX: Provide a fallback structure so the Context doesn't break
      // We pass the first variant as the "default" if the user hasn't picked one
      const defaultVariant = product.variants?.[0];
      const defaultSize = defaultVariant?.size?.[0]?.size || "";

      await addToCart({
        ...product,
        selectedVariant: defaultVariant,
        selectedSize: defaultSize,
      });

      // Show success state
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1000);
      // Optional: Add a "Success" toast or alert here
    } catch (error) {
      console.error("Cart Error:", error);
    }
  };

  // FIX 1: Correct path to the first image in the first variant
  const imageUrl = product.variants?.[0]?.images?.[0]?.url || 'https://via.placeholder.com/150';

  // FIX 2: Define prices based on your API structure
  const originalPrice = product.price;
  const currentPrice = product.discountPrice;
  const hasDiscount = currentPrice && currentPrice < originalPrice;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <Link to={`/product/${product._id || product.id}`} className="block relative overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={product.productName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* SHOW DISCOUNT BADGE */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
          </span>
        )}
      </Link>

      <div className="mt-4">
        <p className="text-xs text-gray-500 uppercase">{product.category}</p>
        <Link to={`/product/${product._id || product.id}`} className="font-semibold text-gray-800 hover:text-[#0d6efd] line-clamp-1">
          {product.productName}
        </Link>

        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-400 ml-2">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            {/* SHOW DISCOUNTED PRICE */}
            <span className="text-lg font-bold text-gray-900">
              ₹{currentPrice || originalPrice}
            </span>

            {/* SHOW ORIGINAL CROSSED-OUT PRICE */}
            {hasDiscount && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm
              ${showSuccess
                ? 'bg-green-500 text-white scale-110'
                : isAdding
                  ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  : 'bg-blue-50 text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white'
              }`}
          >
            {isAdding ? (
              <Loader2 size={18} className="animate-spin" />
            ) : showSuccess ? (
              <Check size={18} strokeWidth={3} />
            ) : (
              <ShoppingCart size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};