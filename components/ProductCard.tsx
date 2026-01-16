
import React from 'react';
import { Plus, Star, GraduationCap, ZoomIn } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onImageClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onImageClick }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(54,116,181,0.05)] border border-[#3674B5]/5 overflow-hidden hover:shadow-[0_20px_50px_rgba(54,116,181,0.15)] hover:-translate-y-2 transition-all duration-500 group relative flex flex-col h-full">
      <div 
        className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9] flex items-center justify-center p-6 cursor-pointer"
        onClick={() => onImageClick?.(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2";
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#3674B5]/0 group-hover:bg-[#3674B5]/5 transition-colors duration-500 flex items-center justify-center">
           <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl border border-[#3674B5]/10">
              <ZoomIn className="w-6 h-6 text-[#3674B5]" />
           </div>
        </div>
        
        {/* Badge */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-[#3674B5] shadow-sm flex items-center gap-1 border border-white">
          <Star className="w-3 h-3 text-[#FADA7A] fill-[#FADA7A]" />
          แนะนำ
        </div>

        {/* Category Label */}
        <div className="absolute bottom-4 right-4 bg-[#FADA7A] px-3 py-1 rounded-full text-[9px] font-black text-[#3674B5] uppercase tracking-widest shadow-lg">
          {product.category}
        </div>
      </div>

      <div className="p-6 bg-white space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-[#3674B5] font-black text-lg leading-tight group-hover:text-[#3674B5]/80 transition-colors">
            {product.name}
          </h3>
          {/* Level Info Tag */}
          {product.level && (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg mt-1 text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
              product.level === 'ปวช.' 
                ? 'bg-blue-50 text-blue-600 border-blue-100' 
                : product.level === 'ปวส.' 
                ? 'bg-purple-50 text-purple-600 border-purple-100'
                : product.level === 'ปวช./ปวส.'
                ? 'bg-pink-50 text-pink-600 border-pink-100'
                : 'bg-gray-50 text-gray-500 border-gray-100'
            }`}>
              < GraduationCap className="w-3 h-3" />
              สำหรับ {product.level}
            </div>
          )}
          <p className="text-gray-400 text-xs line-clamp-2 mt-2 font-medium leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="flex flex-col leading-none">
            <span className="text-[10px] text-gray-400 font-bold uppercase">ราคา</span>
            <span className="text-2xl font-black text-[#3674B5]">฿{product.price.toLocaleString()}</span>
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-[#3674B5] hover:bg-[#2a5a8a] text-white font-bold p-3 rounded-2xl transition-all shadow-lg shadow-[#3674B5]/20 flex items-center justify-center group/btn"
          >
            <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
