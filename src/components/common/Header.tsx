import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  ShoppingCart, 
  User,  
  Phone, 
  MapPin, 
  Menu, 
  X, 
  LogOut, 
  UserPlus 
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
// import { useWishlist } from '../../contexts/WishlistContext';
import { SearchBar } from './SearchBar';
import { Navbar } from './Navbar';

export const Header: React.FC = () => {
  const { cart } = useCart();
  // const { wishlist } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  // const wishlistCount = wishlist.length;

  return (
    <header className="w-full bg-white shadow-sm relative z-[100]">
      {/* 1. TOP INFO BAR - High Trust signals */}
      <div className="bg-gray-900 text-white py-2 text-[11px] font-medium uppercase tracking-wider">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5"><Phone size={12} className="text-[#0d6efd]"/> +1 234 567 890</span>
            <span className="hidden sm:flex items-center gap-1.5"><MapPin size={12} className="text-[#0d6efd]"/> Store Locator</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link to="/blog" className="hover:text-[#0d6efd] transition-colors">Journal</Link>
            <Link to="/contact" className="hover:text-[#0d6efd] transition-colors">Support</Link>
            <div className="h-3 w-[1px] bg-gray-700 hidden sm:block"></div>
            <Link to="/login" className="hidden sm:block hover:text-[#0d6efd] transition-colors">Sign In</Link>
            <Link to="/register" className="hidden sm:block hover:text-[#0d6efd] transition-colors">Join</Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (LOGO, SEARCH, ACTIONS) */}
      <div className="container mx-auto px-4 py-5 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900 shrink-0">
          Nilesh<span className="text-[#0d6efd]">STORE</span>
        </Link>

        {/* Search Bar - Hidden on mobile, flexible on Desktop */}
        <div className="hidden lg:block flex-1 max-w-2xl mx-10">
          <SearchBar />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Account - Desktop Dropdown Style Link */}
          <div className="hidden md:block relative group">
            <Link to="/account" className="flex flex-col items-center group">
              <User size={24} className="text-gray-700 group-hover:text-[#0d6efd] transition-colors" />
              <span className="text-[10px] font-bold mt-1 text-gray-500 uppercase">Account</span>
            </Link>
            {/* Hover Menu */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link to="/login" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"><LogOut size={16}/> Sign In</Link>
              <Link to="/register" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"><UserPlus size={16}/> Register</Link>
              <Link to="/account" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50"><UserPlus size={16}/> account</Link>
            </div>
          </div>

          {/* Wishlist */}
          {/* <Link to="/wishlist" className="flex flex-col items-center relative group">
            <div className="relative">
              <Heart size={24} className="text-gray-700 group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-[10px] font-bold mt-1 text-gray-500 group-hover:text-red-500 uppercase">Wishlist</span>
          </Link> */}

          {/* Cart */}
          <Link to="/cart" className="flex flex-col items-center relative group">
            <div className="relative">
              <ShoppingCart size={24} className="text-gray-700 group-hover:text-[#0d6efd] transition-colors" />
              <span className="absolute -top-2 -right-2 bg-[#ffc107] text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:block text-[10px] font-bold mt-1 text-gray-500 group-hover:text-[#0d6efd] uppercase">Cart</span>
          </Link>
        </div>
      </div>

      {/* 3. CATEGORY NAVBAR - Desktop only */}
      <Navbar />

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t shadow-2xl overflow-y-auto max-h-[80vh]">
          <div className="p-4 space-y-6">
            <SearchBar />
            <nav className="flex flex-col gap-4">
              <NavLink to="/" className="text-lg font-bold border-b pb-2">Home</NavLink>
              <NavLink to="/products" className="text-lg font-bold border-b pb-2">Shop All</NavLink>
              <NavLink to="/blog" className="text-lg font-bold border-b pb-2">Our Blog</NavLink>
              <NavLink to="/contact" className="text-lg font-bold border-b pb-2">Contact Us</NavLink>
              <div className="flex gap-4 pt-4">
                <Link to="/login" className="flex-1 text-center py-3 bg-gray-100 rounded-lg font-bold text-sm">Sign In</Link>
                <Link to="/register" className="flex-1 text-center py-3 bg-[#0d6efd] text-white rounded-lg font-bold text-sm">Register</Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};