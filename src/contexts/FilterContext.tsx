import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product } from '../types';

interface FilterContextType {
  // Data State
  allProducts: Product[];
  setAllProducts: (products: Product[]) => void;
  // Filter States
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  // Result
  filteredProducts: Product[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. New state to hold products fetched from your API/Database
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // 2. Logic now runs against the state 'allProducts' instead of the deleted file
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: Product) => {
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allProducts, searchQuery, selectedCategory, priceRange]);

  return (
    <FilterContext.Provider value={{
      allProducts, setAllProducts, // Added these to the provider
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      priceRange, setPriceRange,
      filteredProducts
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilters must be used within FilterProvider");
  return context;
};