
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.4';

// ดึงค่าจาก process.env ที่กำหนดใน vite.config.ts
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://riuvrddhumzxfjsvpftd.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdXZyZGRodW16eGZqc3ZwZnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjU4NDksImV4cCI6MjA4MzcwMTg0OX0.8pTatJ7u3hcDnqvuHdbqTSZSVijSkvkpqnHtBVOKuEI';

// สร้าง Dummy Client เพื่อป้องกันแอปพัง (Crash) หากยังไม่มีการตั้งค่า Supabase
const createDummyClient = () => {
  console.warn("แจ้งเตือน: ไม่พบการตั้งค่า Supabase กรุณาเพิ่ม VITE_SUPABASE_URL ใน Environment Variables");
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

// ตรวจสอบว่ามี URL และ Key หรือไม่ก่อนสร้าง Client จริง
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient();
