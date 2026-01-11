
import React from 'react';
import { X, Trash2, Plus, Minus, CreditCard, GraduationCap, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string | undefined, delta: number) => void;
  onRemove: (id: string, size: string | undefined) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F5F0CD] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b flex justify-between items-center bg-[#3674B5] text-white">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">ตะกร้าสินค้าของคุณ</h2>
                {totalItems > 0 && (
                  <span className="text-[10px] font-black text-[#FADA7A] uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#FADA7A] rounded-full animate-pulse"></span>
                    รวม {totalItems} ชิ้น
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="p-6 bg-[#578FCA]/10 rounded-full">
                  <ShoppingBag className="w-12 h-12 text-[#3674B5]" />
                </div>
                <p className="font-bold">ไม่มีสินค้าในตะกร้า</p>
                <button 
                  onClick={onClose}
                  className="text-[#3674B5] font-black hover:underline underline-offset-4"
                >
                  เริ่มช้อปปิ้งเลย
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize}-${index}`} className="flex gap-4 items-start border-b border-[#578FCA]/20 pb-4">
                  <div className="w-20 h-24 flex-shrink-0 bg-white rounded-md p-2 flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#3674B5] leading-tight mb-1 truncate">{item.name}</h4>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.selectedSize && (
                        <span className="inline-block px-2 py-0.5 bg-[#3674B5] text-white text-[9px] font-black rounded-lg shadow-sm">
                          ไซส์: {item.selectedSize}
                        </span>
                      )}
                      {item.level && (
                        <span className="inline-block px-2 py-0.5 bg-[#FADA7A] text-[#3674B5] text-[9px] font-black rounded-lg border border-[#3674B5]/10 flex items-center gap-1 shadow-sm">
                          <GraduationCap className="w-2.5 h-2.5" />
                          {item.level}
                        </span>
                      )}
                    </div>

                    <p className="text-[#3674B5] font-bold mt-1">฿{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-[#578FCA]/30 rounded-lg bg-white shadow-sm overflow-hidden">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, item.selectedSize, -1); }}
                          className="p-1 hover:bg-[#578FCA]/10 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#3674B5]" />
                        </button>
                        <span className="px-3 text-sm font-bold text-[#3674B5]">{item.quantity}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, item.selectedSize, 1); }}
                          className="p-1 hover:bg-[#578FCA]/10 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#3674B5]" />
                        </button>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(item.id, item.selectedSize); }}
                        className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-all active:scale-90"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 border-t border-[#578FCA]/20 bg-white space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>จำนวนสินค้าทั้งหมด</span>
                <span>{totalItems} ชิ้น</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-[#3674B5]">ยอดรวมสุทธิ</span>
                <span className="text-[#3674B5] text-2xl font-black">฿{total.toLocaleString()}</span>
              </div>
            </div>
            <button 
              disabled={items.length === 0}
              onClick={onCheckout}
              className="w-full bg-[#FADA7A] hover:bg-[#f8cf55] text-[#3674B5] font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transform active:scale-95"
            >
              <CreditCard className="w-5 h-5" />
              ชำระเงินตอนนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
