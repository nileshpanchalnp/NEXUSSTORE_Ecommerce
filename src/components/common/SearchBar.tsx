import React from 'react';
import { Search } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';
import { useNavigate } from 'react-router-dom';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery, setSelectedCategory } = useFilters();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to products page to show results
    navigate('/products');
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl">
      <div className="relative flex w-full border-2 border-gray-100 rounded-lg focus-within:border-[#0d6efd] bg-white transition-all">
        <select 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-50 px-4 text-sm font-bold border-r outline-none rounded-l-md cursor-pointer"
        >
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Accessories</option>
          <option>Fashion</option>
        </select>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full px-4 py-2.5 text-sm outline-none"
        />

        <button type="submit" className="bg-[#0d6efd] text-white px-6 rounded-r-[4px] hover:bg-blue-700 transition-colors">
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};