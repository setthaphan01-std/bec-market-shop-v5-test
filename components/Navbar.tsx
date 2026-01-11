
import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, ChevronDown, Package, LayoutDashboard, Grid } from 'lucide-react';
import { Category, NavTarget, UserProfile } from '../types';

interface NavbarProps {
  cartCount: number;
  user: UserProfile | null;
  onCartClick: () => void;
  onNavigate: (target: NavTarget) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, user, onCartClick, onNavigate, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const logoUrl = "https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2"; 

  return (
    <nav className="sticky top-0 z-50 bg-[#3674B5] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="flex-shrink-0">
              <img 
                src={logoUrl} 
                alt="BEC Market Logo" 
                className="h-16 w-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/100x100/FADA7A/3674B5?text=BEC";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-none group-hover:text-[#FADA7A] transition-colors">BEC MARKET SHOP</span>
              <span className="text-[10px] text-[#FADA7A] font-medium tracking-widest uppercase">Official Store</span>
            </div>
          </div>
          
          <div className="hidden lg:flex space-x-6 text-sm font-medium">
            <button onClick={() => onNavigate('home')} className="hover:text-[#FADA7A] transition-colors">หน้าแรก</button>
            <button onClick={() => onNavigate('all-products')} className="hover:text-[#FADA7A] transition-colors">สินค้าทั้งหมด</button>
            <button onClick={() => onNavigate(Category.UNIFORM)} className="hover:text-[#FADA7A] transition-colors">ชุดนักศึกษา</button>
            <button onClick={() => onNavigate(Category.ACCESSORIES)} className="hover:text-[#FADA7A] transition-colors">อุปกรณ์เสริม</button>
            <button onClick={() => onNavigate('about')} className="hover:text-[#FADA7A] transition-colors">ผู้จัดทำ</button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FADA7A] text-[#3674B5] text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#3674B5]">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : onNavigate('login')}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-white/10 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner ${user?.role === 'admin' ? 'bg-white text-[#3674B5]' : 'bg-[#FADA7A] text-[#3674B5]'}`}>
                  <User className="h-5 w-5" />
                </div>
                {user ? (
                  <>
                    <span className="hidden sm:block text-xs font-bold max-w-[80px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </>
                ) : (
                  <span className="hidden sm:block text-xs font-bold">เข้าสู่ระบบ</span>
                )}
              </button>

              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">เข้าใช้งานโดย</p>
                    <p className="text-sm font-bold text-[#3674B5] truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#3674B5]/10 text-[#3674B5] text-[9px] font-black uppercase rounded">{user.role}</span>
                  </div>
                  
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => { onNavigate('admin'); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#3674B5] hover:bg-[#3674B5]/5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      ระบบหลังบ้าน Admin
                    </button>
                  )}

                  <button 
                    onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-[#3674B5]" />
                    รายการสั่งซื้อของฉัน
                  </button>

                  <button 
                    onClick={() => { onLogout(); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
