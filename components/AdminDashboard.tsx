
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
  GraduationCap,
  Star,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Order, UserProfile, Product, Category } from '../types';
import { dbService } from '../services/dbService';
import { PRODUCTS as STATIC_PRODUCTS } from '../constants';
import { supabase } from '../services/supabaseClient';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'users'>('stats');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('offline');
  
  // Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
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
       // ตรวจสอบสถานะการเชื่อมต่อจริง
      const isConfigured = process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_URL.includes('supabase.co');
      setDbStatus(isConfigured ? 'online' : 'offline');

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

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    await dbService.updateOrderStatus(id, status);
    refreshData();
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
      name: '',
      price: 0,
      category: Category.UNIFORM,
      description: '',
      image: 'https://lh3.googleusercontent.com/d/1jYWjkxe6el_VkyJxbmjIQGbYkdOOakx2',
      stock: 10,
      level: 'ทั่วไป',
      isRecommended: false
    });
    refreshData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      await dbService.deleteCustomProduct(id);
      refreshData();
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

          {/* Connection Status Badge */}
          <div className={`p-4 rounded-2xl border mb-6 flex items-center gap-3 transition-colors ${
            dbStatus === 'online' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
          }`}>
            {dbStatus === 'online' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase">Database Status</span>
              <span className="text-xs font-bold">{dbStatus === 'online' ? 'Connected (Supabase)' : 'Disconnected (Local)'}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            ภาพรวมระบบ
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            คำสั่งซื้อ ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'products' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <Package className="w-5 h-5" />
            จัดการสินค้า
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'users' ? 'bg-[#3674B5] text-white shadow-lg shadow-[#3674B5]/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <Users className="w-5 h-5" />
            รายชื่อสมาชิก
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
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-bold uppercase">คำสั่งซื้อทั้งหมด</p>
                <h3 className="text-3xl font-black text-[#3674B5]">{orders.length} รายการ</h3>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-bold uppercase">รอดำเนินการ</p>
                <h3 className="text-3xl font-black text-[#3674B5]">{pendingOrders} รายการ</h3>
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
                      <th className="pb-4">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="text-sm">
                        <td className="py-4 font-bold text-[#3674B5] text-[10px]">{order.id}</td>
                        <td className="py-4">
                          <p className="font-bold">{order.userName}</p>
                          <p className="text-[10px] text-gray-400">{order.userEmail}</p>
                        </td>
                        <td className="py-4 font-black">฿{order.total.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {order.status === 'pending' ? 'รอดำเนินการ' : 'จัดส่งแล้ว'}
                          </span>
                        </td>
                        <td className="py-4">
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateStatus(order.id, 'shipped')}
                              className="text-xs font-bold text-[#3674B5] hover:underline flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> ยืนยันการส่ง
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-[#3674B5]">รายการสินค้าทั้งหมด</h3>
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-[#3674B5] text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-[#2a5a8a] transition-all"
                  >
                    <Plus className="w-4 h-4" /> เพิ่มสินค้าใหม่
                  </button>
                </div>

                {showAddForm && (
                  <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-3xl mb-8 space-y-4 border-2 border-dashed border-[#3674B5]/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">ชื่อสินค้า</label>
                        <input 
                          required
                          type="text" 
                          className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3674B5]/20 shadow-sm"
                          value={newProduct.name}
                          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">หมวดหมู่</label>
                        <select 
                          className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3674B5]/20 shadow-sm"
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                        >
                          {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">ระดับชั้น</label>
                        <select 
                          className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3674B5]/20 shadow-sm"
                          value={newProduct.level}
                          onChange={e => setNewProduct({...newProduct, level: e.target.value as any})}
                        >
                          <option value="ปวช.">ปวช.</option>
                          <option value="ปวส.">ปวส.</option>
                          <option value="ทั่วไป">ทั่วไป / ทั้งหมด</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">ราคา (บาท)</label>
                        <input 
                          required
                          type="number" 
                          className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3674B5]/20 shadow-sm"
                          value={newProduct.price}
                          onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">รูปภาพ (URL)</label>
                        <input 
                          required
                          type="text" 
                          className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3674B5]/20 shadow-sm"
                          value={newProduct.image}
                          onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6 pl-2">
                        <input 
                          type="checkbox"
                          id="isRecommended"
                          className="w-5 h-5 accent-[#3674B5]"
                          checked={newProduct.isRecommended}
                          onChange={e => setNewProduct({...newProduct, isRecommended: e.target.checked})}
                        />
                        <label htmlFor="isRecommended" className="text-sm font-bold text-[#3674B5] cursor-pointer flex items-center gap-1.5">
                          <Star className={`w-4 h-4 ${newProduct.isRecommended ? 'fill-[#FADA7A] text-[#FADA7A]' : 'text-gray-300'}`} />
                          เป็นสินค้าแนะนำ (Show on Homepage)
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">รายละเอียด</label>
                      <textarea 
                        className="w-full px-4 py-3 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3674B5]/20 shadow-sm"
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 text-sm font-bold text-gray-400">ยกเลิก</button>
                      <button type="submit" className="bg-green-500 text-white px-8 py-2 rounded-2xl text-sm font-bold shadow-lg">บันทึกสินค้า</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {/* Dynamic Products */}
                  {customProducts.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">สินค้าที่เพิ่มใหม่ (สามารถลบได้)</p>
                      {customProducts.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-3xl hover:border-[#3674B5]/20 mb-2">
                          <div className="flex items-center gap-4">
                            <img src={product.image} className="w-12 h-12 object-contain bg-gray-50 rounded-xl" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm">{product.name}</p>
                                {product.isRecommended && <Star className="w-3 h-3 fill-[#FADA7A] text-[#FADA7A]" />}
                              </div>
                              <div className="flex gap-2">
                                <p className="text-[10px] text-gray-400">฿{product.price.toLocaleString()} | {product.category}</p>
                                {product.level && <span className="text-[9px] font-black text-[#3674B5] px-1.5 bg-blue-50 rounded">{product.level}</span>}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-600 p-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Static Products */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">สินค้าหลัก (Static Data - แก้ไขที่โค้ด)</p>
                    {STATIC_PRODUCTS.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50/50 border border-transparent rounded-3xl opacity-60 mb-2">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-12 h-12 object-contain bg-white rounded-xl" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm">{product.name}</p>
                              {product.isRecommended && <Star className="w-3 h-3 fill-[#FADA7A] text-[#FADA7A]" />}
                            </div>
                            <div className="flex gap-2">
                              <p className="text-[10px] text-gray-400">฿{product.price.toLocaleString()} | {product.category}</p>
                              {product.level && <span className="text-[9px] font-black text-gray-400 px-1.5 bg-gray-200 rounded">{product.level}</span>}
                            </div>
                          </div>
                        </div>
                        <AlertCircle className="w-4 h-4 text-gray-300 mr-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 overflow-hidden">
              <h3 className="text-2xl font-black text-[#3674B5]">รายชื่อสมาชิกนักศึกษา</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.map(user => (
                  <div key={user.email} className="p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-[#3674B5]/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FADA7A] rounded-2xl flex items-center justify-center text-[#3674B5]">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#3674B5]">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <p className="text-[10px] font-black text-[#3674B5]/60 mt-1 uppercase">Role: {user.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
