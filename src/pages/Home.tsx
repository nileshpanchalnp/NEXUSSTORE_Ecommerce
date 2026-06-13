import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight, Truck, ShieldCheck, Headphones, Loader2 } from 'lucide-react';
import { FlashDeals } from '../components/product/FlashDeals';
import { CategorySection } from '../components/home/CategorySection';
import { productService } from '../services/productService';
import { CategoriesService } from '../services/categories';
import { Category, Product } from '../types';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router


export const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadHomeData = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                const catData = await CategoriesService.getAllCategories();
                setCategories(catData);
                setProducts(data);
            } catch (err) {
                console.error("Error loading home data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadHomeData();
    }, []);

    // Extract unique categories dynamically from products
    // const dynamicCategories = Array.from(new Set(products.map(p => p.category)));

    // Get only top 4 or 8 products for the "Featured" section
    const featuredProducts = products.slice(0, 8);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-[#0d6efd] mb-4" size={48} />
                <p className="text-gray-500 font-medium">Loading your shopping experience...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <section className="relative bg-[#f0f4f8] h-[500px] flex items-center overflow-hidden">
                <div className="container mx-auto px-4 z-10">
                    <div className="max-w-xl">
                        <span className="text-[#0d6efd] font-bold tracking-widest uppercase mb-4 block">Limited Edition Collection</span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
                            SUMMER SALE <br /><span className="text-[#0d6efd]">70% OFF</span>
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">Discover the latest trends in high-performance electronics and premium accessories.</p>
                        <Button className="px-10 py-4 text-lg" onClick={() => navigate('/products')}>
                            Shop Now
                        </Button>
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 h-full w-1/2 hidden md:block">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800" className="object-cover h-full w-full" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f0f4f8] to-transparent"></div>
                </div>
            </section>

            {/* Flash Deals with Dynamic Products */}
            <FlashDeals
                products={products.filter(p =>
                    p.originalPrice && p.price && p.originalPrice > p.price
                )}
            />

            {/* Dynamic Category Section */}
            <CategorySection categories={categories} />

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                        <div className="h-1 w-20 bg-[#0d6efd] mt-2"></div>
                    </div>
                    <button
                        onClick={() => navigate('/products')}
                        className="flex items-center gap-2 text-[#0d6efd] font-bold hover:underline"
                    >
                        View All <ArrowRight size={18} />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                        <ProductCard key={product._id || product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Feature Icons */}
            <section className="container mx-auto pt-4 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <Truck />, title: "Free Shipping", desc: "On all orders over $99" },
                    { icon: <ShieldCheck />, title: "Secure Payment", desc: "100% secure payment processing" },
                    { icon: <Headphones />, title: "24/7 Support", desc: "Contact us anytime you need" },
                ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[#0d6efd]">{feat.icon}</div>
                        <div>
                            <h4 className="font-bold">{feat.title}</h4>
                            <p className="text-sm text-gray-500">{feat.desc}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};