import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const posts = [
  { id: 1, title: "Top 10 Tech Trends for 2026", date: "Jan 12, 2026", category: "Technology", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600" },
  { id: 2, title: "How to Build a Minimalist Home Office", date: "Jan 08, 2026", category: "Lifestyle", img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600" },
  { id: 3, title: "The Ultimate Gift Guide for Gamers", date: "Jan 02, 2026", category: "Gaming", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600" }
];

export const Blog: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Nexus Journal</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Latest insights, reviews, and lifestyle tips from our dedicated team of tech enthusiasts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map(post => (
          <article key={post.id} className="group cursor-pointer">
            <div className="relative h-64 overflow-hidden rounded-2xl mb-6">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-4 left-4 bg-[#0d6efd] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                {post.category}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
              <span className="flex items-center gap-1"><User size={12}/> Admin</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0d6efd] transition-colors mb-4 leading-tight">
              {post.title}
            </h3>
            <button className="flex items-center gap-2 text-[#0d6efd] font-bold text-sm">
              Read More <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};