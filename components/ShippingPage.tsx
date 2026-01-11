import React from 'react';
import { Truck, MapPin, Clock, ShieldCheck, Box } from 'lucide-react';

const ShippingPage: React.FC = () => {
  const deliveryMethods = [
    {
      icon: <Truck className="w-10 h-10" />,
      title: "บริษัทขนส่งเอกชน",
      description: "Flash Express / Kerry Express",
      time: "1-3 วันทำการ",
      price: "เริ่มต้น 40-60 บาท"
    },
    {
      icon: <Box className="w-10 h-10" />,
      title: "ไปรษณีย์ไทย (EMS)",
      description: "จัดส่งถึงหน้าบ้านทั่วประเทศ",
      time: "2-4 วันทำการ",
      price: "ตามน้ำหนักสินค้า"
    },
    {
      icon: <MapPin className="w-10 h-10" />,
      title: "รับด้วยตัวเอง",
      description: "หน้าร้านค้าสหกรณ์ วิทยาลัยการอาชีพบ้านผือ",
      time: "รับได้ทันทีในเวลาทำการ",
      price: "ฟรีไม่มีค่าใช้จ่าย"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="bg-[#3674B5] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">การจัดส่งสินค้า</h1>
          <div className="w-24 h-1 bg-[#FADA7A] mx-auto mb-6"></div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            เราใส่ใจในทุกขั้นตอนการแพ็คและจัดส่ง เพื่อให้สินค้าถึงมือคุณอย่างรวดเร็วและปลอดภัยที่สุด
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {deliveryMethods.map((method, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-xl border border-[#3674B5]/10 flex flex-col items-center text-center group hover:border-[#3674B5] transition-all duration-300">
              <div className="text-[#3674B5] mb-6 transform group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold text-[#3674B5] mb-2">{method.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{method.description}</p>
              <div className="mt-auto space-y-2 w-full pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ระยะเวลา:</span>
                  <span className="font-bold text-[#3674B5]">{method.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ค่าบริการ:</span>
                  <span className="font-bold text-green-600">{method.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-[#3674B5]/5">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#3674B5]">เงื่อนไขการจัดส่ง</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#FADA7A] shrink-0 mt-1" />
                <p className="text-gray-700">ตัดรอบการจัดส่งทุกวันเวลา 14.00 น. (ยกเว้นวันหยุดนักขัตฤกษ์)</p>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FADA7A] shrink-0 mt-1" />
                <p className="text-gray-700">สินค้าทุกชิ้นมีการรับประกันความเสียหายจากการขนส่ง (ต้องมีวิดีโอตอนเปิดกล่อง)</p>
              </li>
              <li className="flex items-start gap-3">
                <Box className="w-5 h-5 text-[#FADA7A] shrink-0 mt-1" />
                <p className="text-gray-700">เมื่อจัดส่งแล้ว ระบบจะแจ้งหมายเลข Tracking ผ่านทางแชทหรืออีเมลที่ระบุไว้</p>
              </li>
            </ul>
            <div className="pt-4">
              <div className="p-4 bg-[#3674B5]/5 rounded-xl border-l-4 border-[#3674B5]">
                <p className="text-sm text-[#3674B5] font-medium italic">
                  * กรณีสั่งซื้อเป็นจำนวนมาก (Group Order) สามารถติดต่อเจ้าหน้าที่เพื่อขอส่วนลดค่าจัดส่งได้เป็นพิเศษ
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=800" 
              alt="Shipping Process" 
              className="rounded-2xl shadow-lg w-full h-64 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#FADA7A] p-6 rounded-2xl shadow-xl hidden md:block">
              <p className="text-[#3674B5] font-black text-2xl">Fast & Safe</p>
              <p className="text-[#3674B5]/70 text-xs font-bold uppercase tracking-widest">Delivery Service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;