
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2,
  AlertCircle,
  Star,
  Wifi,
  WifiOff,
  Eye,
  XCircle,
  Truck,
  Box,
  ChevronRight,
  X,
  MapPin,
  Send,
  Loader2
} from 'lucide-react';
import { Order, UserProfile, Product, Category } from '../types';
import { dbService } from '../services/dbService';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';
import { isSupabaseConfigured } from '../services/supabaseClient';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'users'>('stats');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('offline');
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isShippingStep, setIsShippingStep] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({ company: '', code: '' });

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: Category.UNIFORM,
    description: '',
    image: 'https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2',
    stock: 10,
    level: 'ทั่วไป',
    isRecommended: false
  });

  const refreshData = async () => {
    setLoading(true);
    try {
      setDbStatus(isSupabaseConfigured ? 'online' : 'offline');
      const [allOrders, allUsers, allCustomProducts] = await Promise.all([
        dbService.getAllOrders(),
        dbService.getUsers(),
        dbService.getCustomProducts()
      ]);
      setOrders(allOrders);
      setUsers(allUsers);
      setCustomProducts(allCustomProducts);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      setDbStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const totalSales = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const confirmedOrdersCount = orders.filter(o => o.status === 'confirmed').length;

  const handleUpdateStatus = async (id: string, status: Order['status'], extraData: Partial<Order> = {}) => {
    setIsActionLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error("ระบบฐานข้อมูลยังไม่ได้ตั้งค่า (Missing Supabase API Keys)");
      }
      
      await dbService.updateOrderStatus(id, status, extraData);
      
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status, ...extraData } : null);
      }
      
      setIsShippingStep(false);
      await refreshData();
      alert("อัปเดตสถานะสำเร็จ");
    } catch (err: any) {
      console.error("Update Status Error:", err);
      const errorMsg = err?.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
      alert(`ไม่สามารถอัปเดตสถานะได้: ${errorMsg}\n\n*คำแนะนำ: ตรวจสอบว่าตาราง orders ใน Supabase มีคอลัมน์ trackingNumber และ shippingCompany หรือยัง?`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleShipOrder = () => {
    if (!trackingInfo.company.trim() || !trackingInfo.code.trim()) {
      alert("กรุณากรอกข้อมูลบริษัทขนส่งและเลขพัสดุให้ครบถ้วน");
      return;
    }
    if (selectedOrder) {
      handleUpdateStatus(selectedOrder.id, 'shipped', {
        shippingCompany: trackingInfo.company.trim(),
        trackingNumber: trackingInfo.code.trim()
      });
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProduct as Product,
      id: `custom-${Date.now()}`
    };
    await dbService.addCustomProduct(product);
    setShowAddForm(false);
    setNewProduct({
      name: '', price: 0, category: Category.UNIFORM, description: '', 
      image: 'https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2', 
      stock: 10, level: 'ทั่วไป', isRecommended: false
    });
    refreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      await dbService.deleteCustomProduct(id);
      refreshData();
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">รอตรวจสอบ</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">ยืนยันแล้ว</span>;
      case 'shipped': return <span className="px-2 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">ส่งแล้ว</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">ยกเลิก</span>;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3674B5]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-4">
            <h2 className="text-[#3674B5] font-black text-xl mb-1 uppercase tracking-tighter">Admin Menu</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Management Panel</p>
          </div>

          <div className={`p-4 rounded-2xl border mb-6 flex items-center gap-3 transition-colors ${
            dbStatus === 'online' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
          }`}>
            {dbStatus === 'online' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase">Database Status</span>
              <span className="text-xs font-bold">{dbStatus === 'online' ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          
          <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-5 h-5" /> ภาพรวมระบบ
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <ShoppingBag className="w-5 h-5" /> คำสั่งซื้อ ({orders.length})
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'products' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <Package className="w-5 h-5" /> จัดการสินค้า
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <Users className="w-5 h-5" /> รายชื่อสมาชิก
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-bold uppercase">ยอดขายรวม</p>
                <h3 className="text-3xl font-black text-[#3674B5]">฿{totalSales.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-bold uppercase">รอตรวจสอบสต็อก</p>
                <h3 className="text-3xl font-black text-[#3674B5]">{pendingOrdersCount} รายการ</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                  <Box className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-bold uppercase">ยืนยันแล้วรอส่ง</p>
                <h3 className="text-3xl font-black text-[#3674B5]">{confirmedOrdersCount} รายการ</h3>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-[#3674B5]">จัดการคำสั่งซื้อ</h3>
                <button onClick={refreshData} className="text-xs font-bold text-[#3674B5] hover:underline">รีเฟรชข้อมูล</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="pb-4">Order ID</th>
                      <th className="pb-4">ลูกค้า</th>
                      <th className="pb-4">ยอดรวม</th>
                      <th className="pb-4">สถานะ</th>
                      <th className="pb-4">รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="text-sm hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-bold text-[#3674B5] text-[10px]">{order.id}</td>
                        <td className="py-4">
                          <p className="font-bold">{order.userName}</p>
                          <p className="text-[10px] text-gray-400">{order.userEmail}</p>
                        </td>
                        <td className="py-4 font-black">฿{order.total.toLocaleString()}</td>
                        <td className="py-4">{getStatusBadge(order.status)}</td>
                        <td className="py-4">
                          <button 
                            onClick={() => { setSelectedOrder(order); setIsShippingStep(false); }}
                            className="p-2 bg-gray-100 hover:bg-[#3674B5] hover:text-white rounded-xl transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-[#3674B5]">รายการสินค้า</h3>
                  <button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#3674B5] text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
                  </button>
                </div>
                {showAddForm && (
                  <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-3xl mb-8 space-y-4 border-2 border-dashed border-[#3674B5]/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input required type="text" placeholder="ชื่อสินค้า" className="w-full px-4 py-3 rounded-2xl" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                       <input required type="number" placeholder="ราคา" className="w-full px-4 py-3 rounded-2xl" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                       <select className="w-full px-4 py-3 rounded-2xl" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                       </select>
                       <input required type="text" placeholder="URL รูปภาพ" className="w-full px-4 py-3 rounded-2xl" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-3">
                       <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 text-sm font-bold text-gray-400">ยกเลิก</button>
                       <button type="submit" className="bg-green-500 text-white px-8 py-2 rounded-2xl text-sm font-bold shadow-lg">บันทึก</button>
                    </div>
                  </form>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                  {customProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-3xl">
                       <div className="flex items-center gap-4">
                          <img src={product.image} className="w-10 h-10 object-contain" />
                          <div>
                            <p className="font-bold text-sm">{product.name}</p>
                            <p className="text-[10px] text-gray-400">฿{product.price.toLocaleString()}</p>
                          </div>
                       </div>
                       <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
            </div>
          )}

          {activeTab === 'users' && (
             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-black text-[#3674B5] mb-6">สมาชิกทั้งหมด</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {users.map(user => (
                     <div key={user.email} className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#FADA7A] rounded-full flex items-center justify-center text-[#3674B5]"><Users className="w-5 h-5" /></div>
                        <div>
                          <p className="font-bold text-sm">{user.name}</p>
                          <p className="text-[10px] text-gray-400">{user.email}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white">
            <div className="bg-[#3674B5] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tight">รายละเอียดคำสั่งซื้อ</h3>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              {/* Shipping Info Display (If shipped) */}
              {selectedOrder.status === 'shipped' && (
                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center gap-4 animate-in slide-in-from-top-4">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center"><Truck className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-black text-green-700 uppercase tracking-widest">ข้อมูลการจัดส่ง</p>
                    <p className="font-bold text-[#3674B5]">{selectedOrder.shippingCompany} : {selectedOrder.trackingNumber}</p>
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ข้อมูลลูกค้า</p>
                  <p className="font-bold text-[#3674B5]">{selectedOrder.userName}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.userEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">วันที่สั่งซื้อ</p>
                  <p className="font-bold text-[#3674B5]">{new Date(selectedOrder.date).toLocaleString('th-TH')}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">รายการสินค้าในออเดอร์</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <img src={item.image} className="w-12 h-12 object-contain bg-white rounded-xl p-1" />
                        <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <div className="flex gap-2 items-center">
                            {item.selectedSize && <span className="text-[10px] bg-[#3674B5] text-white px-2 py-0.5 rounded-lg font-black">{item.selectedSize}</span>}
                            <span className="text-[10px] text-gray-400 font-bold">จำนวน: {item.quantity} ชิ้น</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-black text-[#3674B5]">฿{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Form Step */}
              {isShippingStep ? (
                <div className="p-8 bg-blue-50 rounded-[2rem] border-2 border-dashed border-blue-200 space-y-4 animate-in zoom-in">
                  <h4 className="font-black text-[#3674B5] text-center">กรอกรายละเอียดการจัดส่ง</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-blue-400 uppercase ml-2">บริษัทขนส่ง</label>
                      <input 
                        type="text" 
                        disabled={isActionLoading}
                        placeholder="เช่น Flash, Kerry, ไปรษณีย์ไทย"
                        className="w-full px-4 py-3 rounded-2xl border-none outline-none shadow-sm disabled:opacity-50"
                        value={trackingInfo.company}
                        onChange={e => setTrackingInfo({...trackingInfo, company: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-blue-400 uppercase ml-2">เลขพัสดุ (Tracking Number)</label>
                      <input 
                        type="text" 
                        disabled={isActionLoading}
                        placeholder="กรอกเลขพัสดุ"
                        className="w-full px-4 py-3 rounded-2xl border-none outline-none shadow-sm disabled:opacity-50"
                        value={trackingInfo.code}
                        onChange={e => setTrackingInfo({...trackingInfo, code: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => setIsShippingStep(false)} 
                      className="flex-1 py-3 text-gray-400 font-bold disabled:opacity-30"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      type="button"
                      disabled={isActionLoading}
                      onClick={handleShipOrder} 
                      className="flex-[2] bg-green-500 text-white font-black py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      ยืนยันและแจ้งลูกค้า
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center p-6 bg-[#3674B5]/5 rounded-3xl">
                    <span className="font-bold text-gray-500">ยอดรวมสุทธิ</span>
                    <span className="text-3xl font-black text-[#3674B5]">฿{selectedOrder.total.toLocaleString()}</span>
                  </div>

                  <div className="pt-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">จัดการคำสั่งซื้อนี้</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button 
                          disabled={selectedOrder.status !== 'pending' || isActionLoading}
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2 ${selectedOrder.status === 'confirmed' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'} disabled:opacity-50`}
                        >
                          {isActionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                          <span className="text-[10px] font-black uppercase">ยืนยันสต็อก</span>
                        </button>
                        
                        <button 
                          disabled={selectedOrder.status !== 'confirmed' || isActionLoading}
                          onClick={() => { setIsShippingStep(true); setTrackingInfo({ company: '', code: '' }); }}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2 ${selectedOrder.status === 'shipped' ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-100 text-gray-400 hover:border-green-200'} disabled:opacity-50`}
                        >
                          <Truck className="w-6 h-6" />
                          <span className="text-[10px] font-black uppercase">จัดส่งสินค้า</span>
                        </button>

                        <button 
                          disabled={selectedOrder.status === 'shipped' || selectedOrder.status === 'cancelled' || isActionLoading}
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                          className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2 ${selectedOrder.status === 'cancelled' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200'} disabled:opacity-50`}
                        >
                          <XCircle className="w-6 h-6" />
                          <span className="text-[10px] font-black uppercase">ยกเลิกออเดอร์</span>
                        </button>

                        <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                          <span className="text-[9px] font-black text-gray-300 uppercase">สถานะปัจจุบัน</span>
                          <span className="text-xs font-bold text-[#3674B5] uppercase">{selectedOrder.status}</span>
                        </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
