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
  Loader2,
  Edit3,
  Image as ImageIcon
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
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isShippingStep, setIsShippingStep] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({ company: '', code: '' });

  const [productFormData, setProductFormData] = useState<Partial<Product>>({
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
      if (!isSupabaseConfigured) throw new Error("Missing Supabase configuration");
      await dbService.updateOrderStatus(id, status, extraData);
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status, ...extraData } : null);
      }
      setIsShippingStep(false);
      await refreshData();
      alert("อัปเดตสถานะสำเร็จ");
    } catch (err: any) {
      alert(`Error: ${err?.message || "Cannot update status"}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fixed: Added missing handleShipOrder function
  const handleShipOrder = async () => {
    if (!selectedOrder) return;
    if (!trackingInfo.company || !trackingInfo.code) {
      alert("กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน");
      return;
    }
    await handleUpdateStatus(selectedOrder.id, 'shipped', {
      shippingCompany: trackingInfo.company,
      trackingNumber: trackingInfo.code
    });
    setTrackingInfo({ company: '', code: '' });
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      if (editingProduct) {
        // Update existing
        await dbService.updateCustomProduct({
          ...editingProduct,
          ...productFormData as Product
        });
        alert("แก้ไขข้อมูลสินค้าสำเร็จ");
      } else {
        // Add new
        const product: Product = {
          ...productFormData as Product,
          id: `custom-${Date.now()}`
        };
        await dbService.addCustomProduct(product);
        alert("เพิ่มสินค้าใหม่สำเร็จ");
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductFormData({
        name: '', price: 0, category: Category.UNIFORM, description: '', 
        image: 'https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2', 
        stock: 10, level: 'ทั่วไป', isRecommended: false
      });
      refreshData();
    } catch (err: any) {
      alert(`Error: ${err?.message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setProductFormData(product);
    setShowProductForm(true);
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
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-4 text-center">
            <h2 className="text-[#3674B5] font-black text-xl mb-1 uppercase tracking-tighter">Admin Panel</h2>
            <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              dbStatus === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'online' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              Database {dbStatus}
            </div>
          </div>
          
          <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-[#3674B5] text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard className="w-5 h-5" /> ภาพรวมระบบ
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#3674B5] text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <ShoppingBag className="w-5 h-5" /> คำสั่งซื้อ ({orders.length})
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'products' ? 'bg-[#3674B5] text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <Package className="w-5 h-5" /> จัดการสินค้า
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-[#3674B5] text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
            <Users className="w-5 h-5" /> รายชื่อสมาชิก
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">ยอดขายรวม</p>
                <h3 className="text-3xl font-black text-[#3674B5]">฿{totalSales.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <Clock className="w-10 h-10 text-orange-500 mb-4" />
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">รอการตรวจสอบ</p>
                <h3 className="text-3xl font-black text-[#3674B5]">{pendingOrdersCount} ออเดอร์</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <Box className="w-10 h-10 text-blue-500 mb-4" />
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">ยืนยันแล้วรอส่ง</p>
                <h3 className="text-3xl font-black text-[#3674B5]">{confirmedOrdersCount} ออเดอร์</h3>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 overflow-hidden">
              <h3 className="text-2xl font-black text-[#3674B5] mb-6">รายการสั่งซื้อ</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="pb-4">ID</th>
                      <th className="pb-4">ลูกค้า</th>
                      <th className="pb-4">ยอดรวม</th>
                      <th className="pb-4">สถานะ</th>
                      <th className="pb-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-bold text-[#3674B5] text-[10px]">{order.id}</td>
                        <td className="py-4">
                          <p className="font-bold">{order.userName}</p>
                          <p className="text-[10px] text-gray-400">{order.userEmail}</p>
                        </td>
                        <td className="py-4 font-black">฿{order.total.toLocaleString()}</td>
                        <td className="py-4">{getStatusBadge(order.status)}</td>
                        <td className="py-4">
                          <button onClick={() => setSelectedOrder(order)} className="p-2 bg-gray-100 hover:bg-[#3674B5] hover:text-white rounded-xl transition-all">
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
                  <h3 className="text-2xl font-black text-[#3674B5]">จัดการคลังสินค้า</h3>
                  <button onClick={() => { setEditingProduct(null); setShowProductForm(true); }} className="bg-[#3674B5] text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> เพิ่มสินค้า
                  </button>
                </div>

                {showProductForm && (
                  <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                      <div className="bg-[#3674B5] p-6 text-white flex justify-between items-center">
                        <h3 className="text-xl font-black">{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
                        <button onClick={() => setShowProductForm(false)}><X className="w-6 h-6" /></button>
                      </div>
                      <form onSubmit={handleProductSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ชื่อสินค้า</label>
                            <input required type="text" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none font-bold" value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ราคา (บาท)</label>
                            <input required type="number" className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none font-bold" value={productFormData.price} onChange={e => setProductFormData({...productFormData, price: Number(e.target.value)})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">หมวดหมู่</label>
                            <select className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none font-bold" value={productFormData.category} onChange={e => setProductFormData({...productFormData, category: e.target.value as Category})}>
                              {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ระดับชั้น (สำหรับเครื่องแบบ)</label>
                            <select className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none font-bold" value={productFormData.level} onChange={e => setProductFormData({...productFormData, level: e.target.value as any})}>
                              <option value="ทั่วไป">ทั่วไป</option>
                              <option value="ปวช.">ปวช.</option>
                              <option value="ปวส.">ปวส.</option>
                              <option value="ปวช./ปวส.">ปวช./ปวส.</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between items-center">
                            <span>ลิงก์รูปภาพสินค้า (แนะนำ Direct Link)</span>
                            {productFormData.image && <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> มีลิงก์แล้ว</span>}
                          </label>
                          <div className="flex gap-4 items-center">
                            <div className="flex-1 relative">
                              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                              <input required type="text" className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border-none outline-none font-bold text-xs" placeholder="URL รูปภาพ .jpg หรือ .png" value={productFormData.image} onChange={e => setProductFormData({...productFormData, image: e.target.value})} />
                            </div>
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                              {productFormData.image ? (
                                <img src={productFormData.image} className="w-full h-full object-contain" onError={(e) => (e.target as any).src = "https://placehold.co/100x100?text=Error"} />
                              ) : (
                                <ImageIcon className="text-gray-200 w-6 h-6" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">รายละเอียดสินค้า</label>
                           <textarea className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm min-h-[100px]" value={productFormData.description} onChange={e => setProductFormData({...productFormData, description: e.target.value})} />
                        </div>

                        <div className="flex gap-4 pt-4">
                           <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 py-4 text-gray-400 font-bold">ยกเลิก</button>
                           <button type="submit" disabled={isActionLoading} className="flex-[2] bg-[#3674B5] text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2">
                             {isActionLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                             บันทึกข้อมูลสินค้า
                           </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {customProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-3xl group hover:border-[#3674B5]/30 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden p-2">
                            <img src={product.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-800">{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">฿{product.price.toLocaleString()} • {product.category}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => handleEditClick(product)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                         <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                  ))}
                </div>
            </div>
          )}

          {activeTab === 'users' && (
             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-black text-[#3674B5] mb-6">ทะเบียนสมาชิก</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {users.map(user => (
                     <div key={user.email} className="p-6 bg-gray-50 rounded-3xl flex items-center gap-5 border border-transparent hover:border-[#3674B5]/10 transition-all">
                        <div className="w-12 h-12 bg-[#FADA7A] rounded-2xl flex items-center justify-center text-[#3674B5] shadow-sm"><Users className="w-6 h-6" /></div>
                        <div>
                          <p className="font-black text-gray-800 leading-none mb-1">{user.name}</p>
                          <p className="text-[10px] text-[#3674B5] font-bold uppercase tracking-widest">{user.role}</p>
                          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Order Details Modal (Same as before but improved UI) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#3674B5] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black">รายละเอียดออเดอร์</h3>
                <p className="text-[10px] opacity-70 font-bold uppercase">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Order Logic Display - Similar to previous implementation */}
              <div className="space-y-6">
                 {/* Customer & Shipping Status */}
                 <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ชื่อลูกค้า</p>
                      <p className="font-bold text-[#3674B5]">{selectedOrder.userName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">สถานะปัจจุบัน</p>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                 </div>

                 {/* Order Items */}
                 <div className="space-y-3">
                   {selectedOrder.items.map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                       <div className="flex items-center gap-4">
                         <img src={item.image} className="w-10 h-10 object-contain" />
                         <div>
                            <p className="font-bold text-sm leading-none mb-1">{item.name}</p>
                            <p className="text-[10px] text-gray-400">จำนวน: {item.quantity} | ไซส์: {item.selectedSize || '-'}</p>
                         </div>
                       </div>
                       <p className="font-black text-[#3674B5]">฿{(item.price * item.quantity).toLocaleString()}</p>
                     </div>
                   ))}
                 </div>

                 <div className="flex justify-between items-center p-6 bg-[#3674B5] text-white rounded-3xl">
                   <span className="font-bold opacity-70">ยอดรวมทั้งสิ้น</span>
                   <span className="text-3xl font-black">฿{selectedOrder.total.toLocaleString()}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="pt-4 grid grid-cols-2 gap-4">
                    {selectedOrder.status === 'pending' && (
                      <button onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black shadow-lg">ยืนยันรับออเดอร์</button>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <div className="col-span-2 space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                           <input placeholder="บริษัทขนส่ง" className="w-full px-4 py-3 rounded-xl bg-gray-50 border" value={trackingInfo.company} onChange={e => setTrackingInfo({...trackingInfo, company: e.target.value})} />
                           <input placeholder="เลขพัสดุ" className="w-full px-4 py-3 rounded-xl bg-gray-50 border" value={trackingInfo.code} onChange={e => setTrackingInfo({...trackingInfo, code: e.target.value})} />
                         </div>
                         <button onClick={handleShipOrder} className="w-full bg-green-500 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                            <Truck className="w-5 h-5" /> ยืนยันการจัดส่ง
                         </button>
                      </div>
                    )}
                    {selectedOrder.status !== 'shipped' && selectedOrder.status !== 'cancelled' && (
                      <button onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')} className="w-full bg-red-100 text-red-500 py-4 rounded-2xl font-black">ยกเลิกออเดอร์</button>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;