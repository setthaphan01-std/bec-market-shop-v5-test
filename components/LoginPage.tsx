
import React, { useState } from 'react';
import { Mail, Lock, User, GraduationCap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile, UserAccount } from '../types';
import { dbService } from '../services/dbService';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    studentId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await dbService.login(formData.email, formData.password);
        if (result.success && result.user) {
          localStorage.setItem('bec_user', JSON.stringify(result.user));
          onLoginSuccess(result.user);
        } else {
          setError(result.message);
        }
      } else {
        // Fix: Added missing 'role' property required by UserAccount interface
        const newAccount: UserAccount = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          studentId: formData.studentId,
          role: 'user'
        };
        const result = await dbService.register(newAccount);
        if (result.success) {
          const loginRes = await dbService.login(formData.email, formData.password);
          if (loginRes.user) {
            localStorage.setItem('bec_user', JSON.stringify(loginRes.user));
            onLoginSuccess(loginRes.user);
          }
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-[#3674B5] p-8 text-white text-center relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <GraduationCap className="w-32 h-32 -ml-8 -mt-8 rotate-12" />
          </div>
          <h2 className="text-3xl font-black mb-2">{isLogin ? 'ยินดีต้อนรับ' : 'สร้างบัญชีใหม่'}</h2>
          <p className="text-white/70 text-sm font-medium">เข้าสู่ระบบ BEC Market Shop ของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-black text-[#3674B5] uppercase ml-1">ชื่อ-นามสกุล</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  required
                  type="text"
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#3674B5] focus:bg-white outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-black text-[#3674B5] uppercase ml-1">อีเมล</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="email"
                placeholder="example@gmail.com"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#3674B5] focus:bg-white outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-[#3674B5] uppercase ml-1">รหัสผ่าน</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#3674B5] focus:bg-white outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-black text-[#3674B5] uppercase ml-1">รหัสนักศึกษา</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="67xxxxxxx"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:border-[#3674B5] focus:bg-white outline-none transition-all"
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3674B5] hover:bg-[#2a5a8a] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#3674B5]/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'เข้าสู่ระบบ' : 'เริ่มเป็นสมาชิก'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm font-bold text-[#3674B5] hover:underline"
            >
              {isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิกที่นี่' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
