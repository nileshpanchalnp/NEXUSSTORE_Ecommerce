import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useFilters } from '../../contexts/FilterContext';
import { Category } from '../../types';

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const navigate = useNavigate();
  const { setSelectedCategory, setSearchQuery } = useFilters();
 
  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery('');
    setSelectedCategory(categoryName);
    navigate('/products'); // Navigate to products to see the filtered results
    window.scrollTo(0, 0);
  };

  return (
    <section className="container mx-auto px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
          <div className="h-1.5 w-12 bg-[#0d6efd] mt-2 rounded-full"></div>
        </div>
        <button
          onClick={() => navigate('/categories')}
          className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#0d6efd] transition-colors"
        >
          EXPLORE ALL <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.id}
            onClick={() => handleCategoryClick(cat.name)}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="relative w-full aspect-square mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[#0d6efd] group-hover:scale-110 transition-all duration-500 z-10"></div>
              <div className="w-full h-full rounded-full overflow-hidden shadow-card group-hover:shadow-xl transition-shadow duration-500 bg-gray-100">
                <img
                  src={cat.image.url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 ease-in-out"
                />
              </div>
              {cat.productCount !== undefined && (
                <div className="absolute -bottom-1 right-2 bg-white px-2 py-1 rounded-full shadow-md border border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <p className="text-[10px] font-black text-[#0d6efd]">{cat.productCount}</p>
                </div>
              )}
            </div>

            <h3 className="font-bold text-gray-800 text-center group-hover:text-[#0d6efd] transition-colors duration-300">
              {cat.name}
            </h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Browse
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};