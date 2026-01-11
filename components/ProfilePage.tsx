
import React, { useEffect, useState } from 'react';
import { User, Package, Calendar, Tag, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import { UserProfile, Order } from '../types';
import { dbService } from '../services/dbService';

interface ProfilePageProps {
  user: UserProfile;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fix: dbService.getOrdersByUser is asynchronous and returns a Promise. 
    // We must await its result inside an async function within useEffect before updating the state.
    const fetchOrders = async () => {
      try {
        const userOrders = await dbService.getOrdersByUser(user.email);
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, [user.email]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-[#3674B5]/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#FADA7A] rounded-full flex items-center justify-center mb-4 shadow-inner">
                <User className="w-12 h-12 text-[#3674B5]" />
              </div>
              <h2 className="text-2xl font-black text-[#3674B5]">{user.name}</h2>
              <p className="text-gray-400 text-sm font-medium">{user.email}</p>
              {user.studentId && (
                <span className="mt-3 px-4 py-1 bg-[#3674B5]/10 text-[#3674B5] rounded-full text-xs font-bold">
                  ID: {user.studentId}
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#3674B5] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
            <h3 className="text-lg font-black mb-1">สรุปการสั่งซื้อ</h3>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6">Shopping Summary</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">คำสั่งซื้อทั้งหมด</span>
                <span className="text-xl font-black">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">ยอดใช้จ่ายรวม</span>
                <span className="text-xl font-black text-[#FADA7A]">฿{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-[#3674B5]/5 min-h-[500px]">
            <h3 className="text-2xl font-black text-[#3674B5] mb-8 flex items-center gap-3">
              <Package className="w-8 h-8 text-[#FADA7A]" />
              ประวัติการสั่งซื้อของคุณ
            </h3>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
                <div className="p-6 bg-gray-50 rounded-full">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                </div>
                <p className="font-bold">คุณยังไม่มีรายการสั่งซื้อในขณะนี้</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="group bg-gray-50 rounded-3xl p-6 border border-transparent hover:border-[#3674B5]/20 hover:bg-white transition-all">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black text-[#3674B5]">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {order.status === 'pending' ? 'รอดำเนินการ' : 'จัดส่งแล้ว'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.date).toLocaleDateString('th-TH', { 
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-bold uppercase">ยอดรวม</p>
                        <p className="text-xl font-black text-[#3674B5]">฿{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain opacity-50" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
