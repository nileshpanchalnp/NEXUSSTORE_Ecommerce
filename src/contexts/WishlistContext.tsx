import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: number) => void;
    toggleWishlist: (product: Product) => void;
    isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage to persist after refresh
    const [wishlist, setWishlist] = useState<Product[]>(() => {
        const saved = localStorage.getItem('nexus_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('nexus_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.find((item) => item.id === product.id)) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id: number) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleWishlist = (product: Product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within WishlistProvider");
    return context;
};