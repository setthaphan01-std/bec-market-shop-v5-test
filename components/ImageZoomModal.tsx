
import React from 'react';
import { X, ZoomIn, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ImageZoomModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ product, onClose, onAddToCart }) => {
  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-[210]"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>

      <div 
        className="relative max-w-4xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="md:w-3/5 bg-[#F9F9F9] p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-w-full max-h-[70vh] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-zoom-in"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2";
            }}
          />
        </div>

        {/* Content Section */}
        <div className="md:w-2/5 p-10 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-[#3674B5] font-black text-xs uppercase tracking-[0.2em]">{product.category}</span>
            <h2 className="text-3xl font-black text-[#3674B5] leading-tight">{product.name}</h2>
            {product.level && (
              <span className="inline-block px-3 py-1 bg-[#FADA7A] text-[#3674B5] rounded-lg text-xs font-black uppercase tracking-tighter shadow-sm">
                สำหรับ {product.level}
              </span>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed font-medium">
            {product.description}
          </p>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ราคาจำหน่าย</span>
                <span className="text-4xl font-black text-[#3674B5]">฿{product.price.toLocaleString()}</span>
              </div>
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">มีสินค้าพร้อมส่ง</div>
            </div>

            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              className="w-full bg-[#3674B5] hover:bg-[#2a5a8a] text-white font-black py-5 rounded-[2rem] shadow-xl shadow-[#3674B5]/20 flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <ShoppingCart className="w-6 h-6" />
              สั่งซื้อสินค้านี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;
