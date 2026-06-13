import React, { useEffect, useState } from 'react';
import { useFilters } from '../contexts/FilterContext';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { productService } from '../services/productService'; // Adjust path
import { Product } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter context for client-side filtering of the API data
  const { searchQuery, selectedCategory, priceRange } = useFilters();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const Products = await productService.getAllProducts();
        setProducts(Products);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);


  const filteredItems = products.filter(product => {
    // 1. Check if productName exists (API might use 'name' instead of 'productName')
    const name = product.productName || (product as any).name || "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category Match
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;

    // 3. Price Match (Ensuring numbers)
    const matchesPrice = product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#0d6efd] mb-4" size={48} />
        <p className="text-gray-500 font-medium tracking-wide">Loading our latest collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-[#0d6efd] font-bold underline"
        >
          Try Refreshing
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-8 border-b pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : 'Our Collection'}
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                Found {filteredItems.length} items
              </p>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((product) => (
                <ProductCard
                  key={product._id || product.id || Math.random()}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <h3 className="text-xl font-bold text-gray-400">No products match your current filters.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};