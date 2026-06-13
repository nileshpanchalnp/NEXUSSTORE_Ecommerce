import React, { useState } from 'react';

interface GalleryProps {
  images: string[];
}

export const ProductGallery: React.FC<GalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-white group">
        <img 
          src={activeImage} 
          alt="Product Display" 
          className="w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase">
          Zoom View
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all overflow-hidden
              ${activeImage === img ? 'border-[#0d6efd]' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
          >
            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};