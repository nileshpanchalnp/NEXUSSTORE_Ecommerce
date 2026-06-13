import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white">NEXUS<span className="text-[#0d6efd]">STORE</span></h3>
                    <p className="text-sm leading-relaxed">Your one-stop destination for premium electronics and lifestyle accessories. Quality guaranteed.</p>
                    <div className="flex gap-4">
                        <Facebook size={20} className="hover:text-[#0d6efd] cursor-pointer" />
                        <Instagram size={20} className="hover:text-[#0d6efd] cursor-pointer" />
                        <Twitter size={20} className="hover:text-[#0d6efd] cursor-pointer" />
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-sm">Quick Links</h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-sm">Customer Service</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-white font-bold mb-2 uppercase text-sm">Newsletter</h4>
                    <p className="text-sm">Get the latest updates on new products and upcoming sales.</p>
                    <div className="flex">
                        <input type="email" placeholder="Email Address" className="bg-gray-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 ring-[#0d6efd]" />
                        <button className="bg-[#0d6efd] text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">Join</button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 pt-8 border-t border-gray-800 text-center text-xs">
                © 2026 NexusStore. All Rights Reserved. Built with React & Tailwind.
            </div>
        </footer>
    );
};