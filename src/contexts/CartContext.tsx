import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  subtotal: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 1. Load cart from DB when user logs in
  const fetchCart = async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await cartService.getUserCart();
        setCart(response.data.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // 2. Add to Cart with API Sync
  const addToCart = async (product: any, quantity = 1) => {
    // Ensure ID is a string to prevent Type Overlap errors
    const rawId = product.selectedVariant?._id || product._id || product.id;
    const variantId = String(rawId); 

    setCart(prev => {
      const existing = prev.find(item => String(item.id) === variantId);
      if (existing) {
        return prev.map(item =>
          String(item.id) === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, id: variantId, quantity }];
    });

    // Database Sync
    if (user?.id) {
      try {
        await cartService.addToCart(user.id, {
          productId: product._id,
          variantId: product.selectedVariant?._id,
          size: product.selectedSize,
          quantity,
          price: product.selectedVariant?.discountPrice || product.discountPrice
        });
        await fetchCart(); // Refresh to ensure local state matches DB
      } catch (err) {
        console.error("Sync failed:", err);
      }
    }
  };

  // 3. Remove Item with API Sync
  const removeFromCart = async (id: string) => {
    const stringId = String(id);
    setCart(prev => prev.filter(item => String(item.id) !== stringId));

    if (user?.id) {
      try {
        await cartService.removeFromCart(stringId);
        await fetchCart();
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
    }
  };

  // 4. Update Quantity with API Sync
  const updateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return;
    const stringId = String(id);

    setCart(prev => 
      prev.map(item => String(item._id) === stringId ? { ...item, quantity: qty } : item)
    );

    if (user?.id) {
      try {
        await cartService.updateCartItem(user.id, stringId, qty);
        // We don't necessarily need fetchCart here to save bandwidth 
        // unless the DB calculates totals differently
      } catch (err) {
        console.error("Failed to update quantity:", err);
      }
    }
  };

  // 5. Clear Cart
  const clearCart = async () => {
    setCart([]);
    if (user?.id) {
      try {
        await cartService.clearFullCart();
      } catch (err) {
        console.error("Failed to clear cart:", err);
      }
    }
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.price || 0;
    return acc + (Number(price) * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart,updateQuantity, clearCart, subtotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};