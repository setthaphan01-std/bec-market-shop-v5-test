
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || 'PLACEHOLDER_API_KEY'),
      VITE_SUPABASE_URL: JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://psvjxaqzqumweqdvsqpz.supabase.co'),
      VITE_SUPABASE_ANON_KEY: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdmp4YXF6cXVtd2VxZHZzcXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODkxMTgsImV4cCI6MjA4MzY2NTExOH0._6MsYCtlGuThLeYPd-aRS29Cbtmvh0Lhu7wacV-po6Y')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
  }
});
