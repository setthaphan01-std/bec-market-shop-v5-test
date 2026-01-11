
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Facebook, 
  MessageCircle,
  Smartphone,
  GraduationCap,
  BookOpen,
  Award,
  Ruler,
  ArrowRight,
  Filter
} from 'lucide-react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AIAssistant from './components/AIAssistant';
import CartDrawer from './components/CartDrawer';
import AboutPage from './components/AboutPage';
import HowToOrderPage from './components/HowToOrderPage';
import ShippingPage from './components/ShippingPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import SizeSelectionModal from './components/SizeSelectionModal';
import CheckoutModal from './components/CheckoutModal';
import { Product, CartItem, Category, NavTarget, UserProfile } from './types';
import { PRODUCTS as STATIC_PRODUCTS } from './constants';
import { dbService } from './services/dbService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'all-products' | 'about' | 'how-to-order' | 'shipping' | 'login' | 'profile' | 'admin'>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  
  // Size selection state
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('bec_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const loadProducts = async () => {
      try {
        const products = await dbService.getCustomProducts();
        setCustomProducts(products);
      } catch (err) {
        console.error("Failed to load products from cloud", err);
      }
    };
    loadProducts();
  }, [view]);

  const allProducts = useMemo(() => {
    return [...STATIC_PRODUCTS, ...customProducts];
  }, [customProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allProducts]);

  const recommendedProducts = useMemo(() => {
    return allProducts.filter(p => p.isRecommended).slice(0, 4);
  }, [allProducts]);

  const addToCart = (product: Product) => {
    if (product.category === Category.UNIFORM) {
      setPendingProduct(product);
      setIsSizeModalOpen(true);
    } else {
      performAddToCart(product);
    }
  };

  const performAddToCart = (product: Product, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
    setIsSizeModalOpen(false);
    setPendingProduct(null);
  };

  const updateQuantity = (id: string, size: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string, size: string | undefined) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const handleCheckout = () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนชำระเงินครับ");
      setView('login');
      setIsCartOpen(false);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleOrderComplete = async () => {
    if (!user) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await dbService.saveOrder(user, cart, total);

    setIsCheckoutModalOpen(false);
    setIsOrderPlaced(true);
    setTimeout(() => {
      setIsOrderPlaced(false);
      setCart([]);
      setView('profile');
    }, 2000);
  };

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    setView(userProfile.role === 'admin' ? 'admin' : 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await dbService.logout();
    localStorage.removeItem('bec_user');
    setUser(null);
    setView('home');
  };

  const handleNavigation = (target: NavTarget) => {
    if (target === 'home') {
      setView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'all-products') {
      setView('all-products');
      setSearchQuery('');
      setSelectedCategory('All');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'about') {
      setView('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'how-to-order') {
      setView('how-to-order');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'shipping') {
      setView('shipping');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'login') {
      setView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'profile') {
      setView('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'admin') {
      setView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If it's a category
      setView('all-products');
      setSelectedCategory(target as Category);
      setTimeout(() => {
        document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
        user={user}
        onCartClick={() => setIsCartOpen(true)} 
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <div className="flex-1">
        {view === 'home' && (
          <>
            <section className="relative bg-[#3674B5] text-white py-24 px-4 overflow-hidden shadow-2xl">
              <div className="absolute top-10 left-[10%] text-[#FADA7A]/10 animate-float pointer-events-none">
                <GraduationCap className="w-32 h-32" />
              </div>
              <div className="absolute top-40 right-[15%] text-[#FADA7A]/10 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
                <BookOpen className="w-24 h-24" />
              </div>
              
              <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full text-sm font-bold border border-white/20 mb-4 animate-in fade-in slide-in-from-top-4 duration-1000 shadow-xl">
                  <Star className="w-4 h-4 text-[#FADA7A] fill-[#FADA7A]" />
                  ยินดีต้อนรับสู่ BEC Market Shop Official
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter animate-pop-in drop-shadow-2xl">
                  BEC Market <span className="text-[#FADA7A] drop-shadow-[0_0_20px_rgba(250,218,122,0.6)]">Shop</span>
                </h1>
                
                <p className="text-white/80 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed animate-in fade-in duration-1000 delay-300">
                  เครื่องแบบนักศึกษาและอุปกรณ์การเรียนคุณภาพ <br className="hidden md:block"/> สั่งซื้อง่าย รับสินค้าไว ออกแบบมาเพื่อชาว BEC
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                  <button 
                    onClick={() => handleNavigation('all-products')}
                    className="bg-[#FADA7A] text-[#3674B5] px-10 py-5 rounded-[2rem] text-xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    เริ่มช้อปปิ้งเลย <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 fill-[#F8F9FA]">
                  <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
                </svg>
              </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 py-20 w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FADA7A]/20 text-[#3674B5] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#FADA7A]/30">
                    Must Have Items
                  </div>
                  <h2 className="text-4xl font-black text-[#3674B5] tracking-tight flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-[#FADA7A]" />
                    สินค้าแนะนำขายดี
                  </h2>
                </div>
                <button 
                  onClick={() => handleNavigation('all-products')}
                  className="text-[#3674B5] font-black flex items-center gap-2 hover:translate-x-2 transition-transform underline underline-offset-8 decoration-4 decoration-[#FADA7A]"
                >
                  ดูสินค้าทั้งหมด <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {recommendedProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>

              {/* Promotional Banner */}
              <div className="mt-20 bg-gradient-to-r from-[#3674B5] to-[#578FCA] rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-xl text-center md:text-left">
                    <h3 className="text-4xl font-black">เตรียมพร้อมเปิดเทอมใหม่!</h3>
                    <p className="text-white/80 text-lg">พบกับชุดนักศึกษาและอุปกรณ์ต่างๆแบบครบเซ็ต ราคาพิเศษสำหรับนักศึกษาปวช.และปวส.ชั้นปีที่ 1 และรับสิทธิพิเศษมากมายเมื่อซื้อผ่านระบบออนไลน์</p>
                    <button 
                      onClick={() => handleNavigation('all-products')}
                      className="bg-white text-[#3674B5] px-8 py-3 rounded-full font-black mt-4 hover:shadow-xl transition-all active:scale-95"
                    >
                      เลือกซื้อชุดนักศึกษา
                    </button>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <p className="text-3xl font-black text-[#FADA7A]">100%</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Official</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-[#FADA7A]">Fast</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {view === 'all-products' && (
          <div className="animate-in fade-in duration-700">
            {/* Minimal Header for Catalog */}
            <section className="bg-white border-b border-gray-100 py-12 px-4">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-black text-[#3674B5] tracking-tight">สินค้าทั้งหมด</h1>
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">Catalog & Inventory</p>
                </div>
                
                <div className="relative w-full max-w-md group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3674B5] w-5 h-5 group-focus-within:scale-110 transition-transform" />
                  <input 
                    type="text" 
                    placeholder="ค้นหาสินค้าที่ต้องการ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-[#3674B5]/10 transition-all font-medium text-gray-800"
                  />
                </div>
              </div>
            </section>

            {/* Sticky Category Tabs */}
            <section className="sticky top-20 z-40 py-6 bg-[#F8F9FA]/80 backdrop-blur-md border-b border-gray-100">
               <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
                  <div className="flex items-center gap-3 min-w-max pb-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                      <Filter className="w-5 h-5 text-[#3674B5]" />
                    </div>
                    {(['All', ...Object.values(Category)] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-8 py-3 rounded-xl text-sm font-black transition-all border-2 ${
                          selectedCategory === cat 
                          ? 'bg-[#3674B5] text-white border-[#3674B5] shadow-lg shadow-[#3674B5]/20' 
                          : 'bg-white text-[#3674B5] border-transparent hover:border-[#3674B5]/20'
                        }`}
                      >
                        {cat === 'All' ? 'ทั้งหมด' : cat}
                      </button>
                    ))}
                  </div>
               </div>
            </section>

            <main id="product-grid-section" className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-8">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Found {filteredProducts.length} Results
                </p>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-black text-[#3674B5]">ไม่พบสินค้าที่ต้องการ</h3>
                  <p className="text-gray-400 mt-2 font-medium">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ใหม่ครับ</p>
                </div>
              )}
            </main>
          </div>
        )}

        {view === 'about' && <AboutPage />}
        {view === 'how-to-order' && <HowToOrderPage />}
        {view === 'shipping' && <ShippingPage />}
        {view === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
        {view === 'profile' && user && <ProfilePage user={user} />}
        {view === 'admin' && user?.role === 'admin' && <AdminDashboard />}
      </div>

      {isOrderPlaced && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#3674B5]/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 text-center animate-in zoom-in duration-500 border-4 border-[#FADA7A]">
            <div className="bg-green-500 p-6 rounded-full shadow-2xl shadow-green-200">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-[#3674B5] mb-2">สั่งซื้อสำเร็จ!</h2>
              <p className="text-gray-500 font-bold text-lg">ขอบคุณที่ไว้วางใจใช้บริการ BEC Market Shop <br/>น้อง BEC กำลังเตรียมประวัติการสั่งซื้อให้ครับ...</p>
            </div>
          </div>
        </div>
      )}

      {/* Size Selection Modal */}
      {isSizeModalOpen && pendingProduct && (
        <SizeSelectionModal 
          product={pendingProduct} 
          onClose={() => { setIsSizeModalOpen(false); setPendingProduct(null); }} 
          onConfirm={(size) => performAddToCart(pendingProduct, size)}
        />
      )}

      {/* Checkout Flow Modal */}
      {isCheckoutModalOpen && (
        <CheckoutModal 
          items={cart}
          onClose={() => setIsCheckoutModalOpen(false)}
          onComplete={handleOrderComplete}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
      
      <AIAssistant />

      <footer className="bg-[#3674B5] text-white py-20 px-4 mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FADA7A]/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20 relative z-10">
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-[#FADA7A] tracking-tighter">BEC MARKET SHOP</span>
              <span className="text-xs font-black tracking-[0.4em] text-white/40 uppercase">Educational Store</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 font-medium">
              เราคือศูนย์รวมเครื่องแบบและอุปกรณ์การศึกษาอย่างเป็นทางการ ภายใต้การดูแลของวิทยาลัยการอาชีพบ้านผือ มั่นใจในคุณภาพและราคาที่เป็นมิตรต่อนักศึกษา
            </p>
            <div className="flex items-center gap-4 pt-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#FADA7A] hover:text-[#3674B5] transition-all hover:-translate-y-1 shadow-lg border border-white/10"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#FADA7A] hover:text-[#3674B5] transition-all hover:-translate-y-1 shadow-lg border border-white/10"><MessageCircle className="w-6 h-6" /></a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#FADA7A] hover:text-[#3674B5] transition-all hover:-translate-y-1 shadow-lg border border-white/10"><Smartphone className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-10">
            <h4 className="text-[#FADA7A] font-black text-2xl flex items-center gap-3">
              <div className="w-2 h-8 bg-[#FADA7A] rounded-full"></div>
              ข้อมูลการบริการ
            </h4>
            <ul className="grid grid-cols-1 gap-5 font-bold text-white/80">
              <li><button onClick={() => handleNavigation('home')} className="group flex items-center gap-4 hover:text-[#FADA7A] transition-all"><div className="w-2 h-2 rounded-full bg-[#FADA7A] group-hover:scale-150 transition-transform"></div>หน้าแรก</button></li>
              <li><button onClick={() => handleNavigation('all-products')} className="group flex items-center gap-4 hover:text-[#FADA7A] transition-all"><div className="w-2 h-2 rounded-full bg-[#FADA7A] group-hover:scale-150 transition-transform"></div>สินค้าทั้งหมด</button></li>
              <li><button onClick={() => handleNavigation('how-to-order')} className="group flex items-center gap-4 hover:text-[#FADA7A] transition-all"><div className="w-2 h-2 rounded-full bg-[#FADA7A] group-hover:scale-150 transition-transform"></div>วิธีสั่งซื้อสินค้า</button></li>
              <li><button onClick={() => handleNavigation('shipping')} className="group flex items-center gap-4 hover:text-[#FADA7A] transition-all"><div className="w-2 h-2 rounded-full bg-[#FADA7A] group-hover:scale-150 transition-transform"></div>การจัดส่ง & ติดตาม</button></li>
              <li><button onClick={() => handleNavigation('about')} className="group flex items-center gap-4 hover:text-[#FADA7A] transition-all"><div className="w-2 h-2 rounded-full bg-[#FADA7A] group-hover:scale-150 transition-transform"></div>คณะผู้จัดทำโครงการ</button></li>
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-[#FADA7A] font-black text-2xl flex items-center gap-3">
              <div className="w-2 h-8 bg-[#FADA7A] rounded-full"></div>
              ความปลอดภัย 100%
            </h4>
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-black text-white/30 uppercase tracking-[0.3em]">Payment Partners</p>
                <div className="flex flex-wrap gap-3">
                   <div className="bg-white rounded-xl p-3 flex items-center justify-center h-12 w-20 shadow-xl overflow-hidden group hover:scale-105 transition-transform"><img src="https://www.bot.or.th/content/dam/bot/icons/icon-thaiqr.png" className="h-full w-full object-contain scale-150" alt="QR Payment" /></div>
                   <div className="bg-white rounded-xl p-3 flex items-center justify-center h-12 w-16 shadow-xl group hover:scale-105 transition-transform"><CreditCard className="text-blue-600 w-8 h-8" /></div>
                   <div className="bg-white rounded-xl p-3 flex items-center justify-center h-12 w-16 shadow-xl group hover:scale-105 transition-transform"><Smartphone className="text-green-600 w-8 h-8" /></div>
                </div>
              </div>
              <div className="space-y-5 pt-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                   <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30 shadow-lg"><ShieldCheck className="w-6 h-6" /></div>
                   <div>
                     <p className="text-sm font-black">SSL Secure Transaction</p>
                     <p className="text-[10px] text-white/30 font-bold uppercase">ข้อมูลของคุณถูกเข้ารหัสอย่างปลอดภัย</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                   <div className="w-12 h-12 rounded-xl bg-[#FADA7A]/20 flex items-center justify-center text-[#FADA7A] border border-[#FADA7A]/30 shadow-lg"><Lock className="w-6 h-6" /></div>
                   <div>
                     <p className="text-sm font-black">Privacy Policy Verified</p>
                     <p className="text-[10px] text-white/30 font-bold uppercase">คุ้มครองข้อมูลส่วนบุคคลตามกฎหมาย</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em] relative z-10">
          <div className="text-center md:text-left">© 2025 BAN PHUE INDUSTRIAL COLLEGE - BEC MARKET SHOP PROJECT</div>
          <div className="flex items-center gap-8">

          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
