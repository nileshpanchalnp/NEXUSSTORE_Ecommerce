import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories' },
        { name: 'Products', path: '/products' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="bg-white border-b hidden md:block">
            <div className="container mx-auto px-4 flex items-center">
                {/* All Departments Toggle */}
                <div className="relative group mr-8">
                    <button className="flex items-center gap-3 bg-[#0d6efd] text-white px-6 py-3 font-bold text-sm uppercase tracking-wide">
                        <Menu size={18} />
                        Browse Categories
                        <ChevronDown size={16} />
                    </button>

                    {/* Dropdown menu (hidden by default) */}
                    <div className="absolute top-full left-0 w-60 bg-white border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {['Laptops', 'Smartphones', 'Cameras', 'Audio', 'Wearables'].map((item) => (
                            <NavLink
                                key={item}
                                to="/products"
                                className="block px-6 py-3 text-sm hover:bg-gray-50 hover:text-[#0d6efd] border-b border-gray-50 last:border-0"
                            >
                                {item}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Main Navigation */}
                <ul className="flex gap-8">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#0d6efd] ${isActive ? 'text-[#0d6efd]' : 'text-gray-700'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Flash Deals / Offer Link */}
                <div className="ml-auto">
                    <NavLink to="/offers" className="flex items-center gap-2 text-sm font-bold text-orange-500 hover:text-orange-600 uppercase tracking-wider">
                        <span className="animate-pulse">🔥</span> Flash Deals
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};