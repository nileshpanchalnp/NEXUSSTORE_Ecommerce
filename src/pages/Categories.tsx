import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../contexts/FilterContext';
import { CategoriesService } from '../services/categories';
import { Category } from '../types';
import { ChevronRight, Loader2 } from 'lucide-react';

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCategory, setSearchQuery } = useFilters();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await CategoriesService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery('');
    setSelectedCategory(categoryName);
    navigate('/products');
  };

  if (loading) {
    return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#0d6efd]" size={40} />
        </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-8">All Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat._id || cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img 
                  src={cat.image.url} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                    <p className="text-sm font-medium opacity-80">{cat.productCount || 0} Products Available</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full group-hover:bg-[#0d6efd] transition-colors">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};