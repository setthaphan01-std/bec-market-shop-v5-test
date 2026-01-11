
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.4';

// ฟังก์ชันช่วยดึงค่า Environment Variables อย่างปลอดภัย
const getEnv = (key: string): string => {
  try {
    // 1. ลองดึงจาก import.meta.env (มาตรฐานของ Vite)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env[key];
      if (val) return val;
    }
    
    // 2. ลองดึงจาก process.env (มาตรฐาน Node/Vercel หรือจาก define ใน config)
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      const val = process.env[key];
      if (val) return val;
    }
  } catch (e) {
    console.warn(`Error accessing environment variable ${key}:`, e);
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// ระบบตรวจสอบสถานะการตั้งค่า
const validateConfig = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // แสดงคำเตือนใน Console หากยังไม่ได้ตั้งค่า
    console.warn("Supabase Config: Missing URL or Anon Key. Database features will be disabled.");
    return false;
  }
  
  if (!supabaseUrl.startsWith('http')) {
    console.error(`Supabase Config: Invalid URL format "${supabaseUrl}"`);
    return false;
  }
  
  return true;
};

// สร้าง Client จำลองกรณีเชื่อมต่อไม่ได้ เพื่อไม่ให้แอปพัง (Graceful Degradation)
const createDummyClient = () => {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      update: () => ({
        eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
      }),
    })
  } as any;
};

const isReady = validateConfig();

export const supabase = isReady 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createDummyClient();

export const isSupabaseConfigured = isReady;
