
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // บังคับฉีดค่าเข้า process.env เพื่อความชัวร์ (ใช้ในกรณี fallback)
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || 'AIzaSyAzyPqYX4zGqZ_EGS4jxwyyIlly2j8-OsI'),
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://riuvrddhumzxfjsvpftd.supabase.co'),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdXZyZGRodW16eGZqc3ZwZnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMjU4NDksImV4cCI6MjA4MzcwMTg0OX0.8pTatJ7u3hcDnqvuHdbqTSZSVijSkvkpqnHtBVOKuEI'),
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
  }
});
