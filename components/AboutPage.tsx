import React from 'react';
import { Users, GraduationCap, Heart, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section for About Page */}
      <section className="bg-[#3674B5] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">ผู้จัดทำ</h1>
          <div className="w-24 h-1 bg-[#FADA7A] mx-auto mb-6"></div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            โปรเจกต์พัฒนาระบบพาณิชย์อิเล็กทรอนิกส์เพื่ออำนวยความสะดวกในการซื้อเครื่องแบบและอุปกรณ์การเรียน
            สำหรับวิทยาลัยการอาชีพบ้านผือ
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3674B5]/10 text-[#3674B5] rounded-full text-sm font-bold">
            <Users className="w-4 h-4" />
            ทีมพัฒนา
          </div>
          <h2 className="text-3xl font-bold text-[#3674B5]">วิสัยทัศน์และจุดประสงค์</h2>
          <p className="text-gray-700 leading-relaxed">
            เว็บไซต์ <strong>BEC Market Shop</strong> ถูกพัฒนาขึ้นเพื่อเป็นต้นแบบระบบร้านค้าสหกรณ์ยุคใหม่ 
            ที่นำเทคโนโลยี AI เข้ามาช่วยให้คำแนะนำแก่ผู้ใช้งาน โดยมุ่งเน้นความสะดวก รวดเร็ว 
            และเป็นระเบียบตามระเบียบปฏิบัติของสถานศึกษา
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#3674B5]/10">
              <GraduationCap className="w-8 h-8 text-[#3674B5] mb-2" />
              <h4 className="font-bold">เพื่อการศึกษา</h4>
              <p className="text-sm text-gray-500">มุ่งเน้นให้นักศึกษาสามารถเข้าถึงอุปกรณ์การเรียนได้ง่ายที่สุด</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#3674B5]/10">
              <Globe className="w-8 h-8 text-[#3674B5] mb-2" />
              <h4 className="font-bold">นวัตกรรมดิจิทัล</h4>
              <p className="text-sm text-gray-500">ยกระดับร้านค้าวิทยาลัยสู่ระบบออนไลน์เต็มรูปแบบ</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-4 bg-[#FADA7A]/20 rounded-2xl blur-xl group-hover:bg-[#FADA7A]/30 transition-all duration-500"></div>
          <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-[#3674B5]/10">
            <h3 className="text-xl font-bold text-[#3674B5] mb-6 border-b pb-4">คณะผู้จัดทำ</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3674B5] rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">นายเสฏฐพันธ์ ปัญญากุล</p>
                  <p className="text-sm text-gray-500">หัวหน้าโครงการและผู้ออกแบบระบบ</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3674B5] rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">นางสาวจุฑาทิพย์ เสียงใส</p>
                  <p className="text-sm text-gray-500">ผู้ช่วยออกแบบ</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3674B5] rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">นางสาวพุธธิดา แถววงษ์</p>
                  <p className="text-sm text-gray-500">ผู้ช่วยออกแบบ</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#3674B5]">
                <Heart className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">Made with Passion</span>
              </div>
              <span className="text-xs text-gray-400">Version 1.0.0 (2025)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;