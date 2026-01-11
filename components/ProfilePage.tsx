
import React, { useEffect, useState } from 'react';
import { User, Package, Calendar, Tag, ChevronRight, ShoppingBag, Clock, Truck, ExternalLink } from 'lucide-react';
import { UserProfile, Order } from '../types';
import { dbService } from '../services/dbService';

interface ProfilePageProps {
  user: UserProfile;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
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

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'รอดำเนินการ';
      case 'confirmed': return 'ยืนยันออเดอร์แล้ว';
      case 'shipped': return 'จัดส่งแล้ว';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

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
                            order.status === 'shipped' ? 'bg-green-100 text-green-600' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {getStatusLabel(order.status)}
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

                    {/* Tracking Info if Shipped */}
                    {order.status === 'shipped' && order.trackingNumber && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Truck className="w-5 h-5 text-[#3674B5]" />
                            <div>
                               <p className="text-[10px] font-black text-blue-400 uppercase">จัดส่งโดย {order.shippingCompany}</p>
                               <p className="text-sm font-bold text-[#3674B5]">{order.trackingNumber}</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => alert(`คัดลอกเลขพัสดุแล้ว: ${order.trackingNumber}`)}
                            className="text-[10px] font-black text-[#3674B5] bg-white px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm flex items-center gap-1"
                         >
                            <ExternalLink className="w-3 h-3" /> คัดลอก
                         </button>
                      </div>
                    )}
                    
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 w-12 h-12 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center p-1">
                          <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                      ))}
                      <div className="flex items-center ml-2 text-[10px] text-gray-400 font-bold uppercase">
                         + {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                      </div>
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
