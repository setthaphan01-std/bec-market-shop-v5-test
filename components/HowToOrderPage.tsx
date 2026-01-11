import React from 'react';
import { ShoppingBag, ShoppingCart, CreditCard, PackageCheck, ArrowRight } from 'lucide-react';

const HowToOrderPage: React.FC = () => {
  const steps = [
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "1. เลือกสินค้าที่ต้องการ",
      description: "เลือกดูสินค้าจากหมวดหมู่ต่างๆ หรือใช้ช่องค้นหาเพื่อหาสินค้าที่ต้องการ"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "2. เพิ่มลงในตะกร้า",
      description: "กดปุ่ม 'ใส่ตะกร้า' และตรวจสอบรายการสินค้า รวมถึงจำนวนที่ต้องการในหน้าตะกร้าสินค้า"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "3. ชำระเงิน",
      description: "กดปุ่ม 'ชำระเงินตอนนี้' และเลือกช่องทางการชำระเงินที่สะดวก (PromptPay หรือโอนผ่านธนาคาร)"
    },
    {
      icon: <PackageCheck className="w-8 h-8" />,
      title: "4. รอรับสินค้า",
      description: "เมื่อระบบยืนยันการชำระเงินแล้ว เจ้าหน้าที่จะดำเนินการจัดเตรียมและส่งสินค้าให้คุณทันที"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="bg-[#3674B5] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">วิธีสั่งซื้อสินค้า</h1>
          <div className="w-24 h-1 bg-[#FADA7A] mx-auto mb-6"></div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            ขั้นตอนง่ายๆ ในการเป็นเจ้าของเครื่องแบบและอุปกรณ์การเรียนจาก BEC Market Shop
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#3674B5]/10 h-full flex flex-col items-center text-center hover:border-[#FADA7A] transition-colors duration-300">
                <div className="w-16 h-16 bg-[#3674B5] text-[#FADA7A] rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-[#3674B5] mb-4">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-[#3674B5]/20" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#3674B5]/5 border-2 border-dashed border-[#3674B5]/20 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold text-[#3674B5]">มีข้อสงสัยเพิ่มเติม?</h2>
            <p className="text-gray-600 italic">
              "หากคุณพบปัญหาในการสั่งซื้อ หรือต้องการสอบถามเรื่องขนาดไซส์ชุดนักศึกษา สามารถปรึกษาผู้ช่วย AI ของเราได้ที่มุมขวาล่างของหน้าจอ"
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#3674B5]">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                AI พร้อมให้บริการ 24 ชม.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToOrderPage;