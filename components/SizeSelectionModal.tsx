
import React, { useState } from 'react';
import { X, Check, Ruler } from 'lucide-react';
import { Product } from '../types';

interface SizeSelectionModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (size: string) => void;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const SizeSelectionModal: React.FC<SizeSelectionModalProps> = ({ product, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState<string>('M');

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border-4 border-[#FADA7A]">
        <div className="bg-[#3674B5] p-6 text-white flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <div className="bg-[#FADA7A] p-2 rounded-xl text-[#3674B5]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-none">กรุณาเลือกไซส์</h3>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">Select your fit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-3xl border border-gray-100">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-contain" />
            <div>
              <h4 className="font-bold text-[#3674B5] text-sm">{product.name}</h4>
              <p className="text-xl font-black text-[#3674B5]">฿{product.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-12 rounded-xl text-sm font-black transition-all flex items-center justify-center border-2 ${
                  selectedSize === size
                    ? 'bg-[#3674B5] text-white border-[#3674B5] shadow-lg shadow-[#3674B5]/20 scale-105'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-[#3674B5]/20'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <p className="mt-6 text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
            * หากไม่แน่ใจไซส์ สามารถปรึกษาน้อง BEC AI ได้ครับ
          </p>

          <button
            onClick={() => onConfirm(selectedSize)}
            className="w-full mt-8 bg-[#3674B5] hover:bg-[#2a5a8a] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#3674B5]/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            เพิ่มลงตะกร้าไซส์ {selectedSize}
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectionModal;
