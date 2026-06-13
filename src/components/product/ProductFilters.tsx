import React from 'react';
import { useFilters } from '../../contexts/FilterContext';

export const ProductFilters: React.FC = () => {
  const { selectedCategory, setSelectedCategory, priceRange, setPriceRange } = useFilters();

  const categories = ['All Categories', 'Electronics', 'Accessories', 'Fashion'];

  return (
    <div className="space-y-10">
      {/* Category List */}
      <section>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Categories</h3>
        <ul className="space-y-3">
          {categories.map(cat => (
            <li key={cat}>
              <button 
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm transition-colors ${selectedCategory === cat ? 'text-[#0d6efd] font-bold' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Price Slider */}
      <section>
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4">Price Range: ${priceRange[1]}</h3>
        <input 
          type="range" 
          min="0" 
          max="100000" 
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0d6efd]"
        />
        <div className="flex justify-between text-xs mt-2 text-gray-400 font-bold">
          <span>$0</span>
          <span>$100000</span>
        </div>
      </section>
    </div>
  );
};