import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-6">Our Story</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Founded in 2026, NexusStore began with a simple mission: to bridge the gap between high-end 
          technology and everyday consumers. We believe that innovation should be accessible, 
          reliable, and beautifully designed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-blue-50 rounded-2xl">
            <h3 className="font-bold text-[#0d6efd] text-xl mb-2">Our Vision</h3>
            <p className="text-sm text-gray-600">To become the world's most customer-centric destination for lifestyle electronics.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-bold text-gray-900 text-xl mb-2">Our Quality</h3>
            <p className="text-sm text-gray-600">Every product in our catalog undergoes rigorous 5-point quality inspections.</p>
          </div>
        </div>
      </div>
    </div>
  );
};