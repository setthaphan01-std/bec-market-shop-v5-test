
import React, { useState } from 'react';
import { X, MapPin, CreditCard, ChevronRight, Phone, User, Home, QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  items: CartItem[];
  onClose: () => void;
  onComplete: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ items, onClose, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    province: '',
    zipCode: ''
  });

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white">
        
        {/* Header with Progress */}
        <div className="bg-[#3674B5] p-8 text-white relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-black">ชำระเงิน (Checkout)</h3>
              <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-1">Complete your order</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-tighter transition-all ${step === 1 ? 'bg-[#FADA7A] text-[#3674B5]' : 'bg-white/10 text-white opacity-50'}`}>
              <MapPin className="w-4 h-4" /> 1. ที่อยู่จัดส่ง
            </div>
            <div className="flex-1 h-0.5 bg-white/20 rounded-full"></div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-tighter transition-all ${step === 2 ? 'bg-[#FADA7A] text-[#3674B5]' : 'bg-white/10 text-white opacity-50'}`}>
              <CreditCard className="w-4 h-4" /> 2. ชำระเงิน
            </div>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2 tracking-widest">ชื่อผู้รับ</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      required
                      type="text" 
                      placeholder="ชื่อ-นามสกุล"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3674B5]/20 outline-none transition-all text-sm font-bold"
                      value={shippingInfo.name}
                      onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2 tracking-widest">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      required
                      type="tel" 
                      placeholder="0xx-xxx-xxxx"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3674B5]/20 outline-none transition-all text-sm font-bold"
                      value={shippingInfo.phone}
                      onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2 tracking-widest">ที่อยู่สำหรับการจัดส่ง</label>
                <div className="relative">
                  <Home className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
                  <textarea 
                    required
                    placeholder="เลขที่บ้าน, ถนน, ซอย..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3674B5]/20 outline-none transition-all text-sm font-bold min-h-[100px]"
                    value={shippingInfo.address}
                    onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">ตำบล/เขต</label>
                  <input required className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={shippingInfo.district} onChange={e => setShippingInfo({...shippingInfo, district: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">จังหวัด</label>
                  <input required className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={shippingInfo.province} onChange={e => setShippingInfo({...shippingInfo, province: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-black text-[#3674B5] uppercase ml-2">รหัสไปรษณีย์</label>
                  <input required className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold" value={shippingInfo.zipCode} onChange={e => setShippingInfo({...shippingInfo, zipCode: e.target.value})} />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#3674B5] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#3674B5]/20 flex items-center justify-center gap-3 hover:bg-[#2a5a8a] transition-all transform active:scale-95"
              >
                ไปที่การชำระเงิน
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="space-y-8 flex flex-col items-center">
              <div className="w-full bg-[#FADA7A]/10 border border-[#FADA7A]/30 p-6 rounded-3xl text-center">
                <p className="text-sm font-black text-[#3674B5] uppercase tracking-widest mb-1">ยอดรวมที่ต้องชำระ</p>
                <p className="text-4xl font-black text-[#3674B5]">฿{total.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-4 border-[#3674B5]/10 flex flex-col items-center gap-4 max-w-[280px]">
                <div className="bg-[#3674B5] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-2">
                  Thai QR Payment
                </div>
                {/* Simulated QR Code for Thai QR */}
                <div className="relative bg-white p-2 border-2 border-gray-100 rounded-xl overflow-hidden shadow-inner">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PROMPTPAY|0820000000|${total}`} 
                    alt="QR Payment" 
                    className="w-48 h-48"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                     <QrCode className="w-24 h-24 text-[#3674B5]" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 text-center uppercase leading-tight">
                  สแกนด้วยแอปธนาคารของคุณ <br/> เพื่อชำระเงินทันที
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">
                    ระบบชำระเงินปลอดภัย 100% ผ่าน PromptPay วิทยาลัย
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                  >
                    กลับไปแก้ไขที่อยู่
                  </button>
                  <button 
                    onClick={onComplete}
                    className="flex-[2] bg-[#3674B5] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#3674B5]/20 flex items-center justify-center gap-3 hover:bg-[#2a5a8a] transition-all transform active:scale-95"
                  >
                    แจ้งชำระเงินเรียบร้อย
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 text-center text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
          BEC Market Shop - Secure Checkout Protocol V1.0
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
