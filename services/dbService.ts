
import { UserAccount, UserProfile, Order, CartItem, Product } from '../types';
import { supabase } from './supabaseClient';

export const dbService = {
  // --- การจัดการผู้ใช้งาน (User Management) ---
  register: async (account: UserAccount): Promise<{ success: boolean; message: string }> => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          email: account.email,
          password: account.password,
          name: account.name,
          role: account.role || 'user',
          studentId: account.studentId
        }]);
      
      if (error) {
        if (error.code === '23505') return { success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' };
        return { success: false, message: error.message };
      }
      return { success: true, message: 'ลงทะเบียนสำเร็จ' };
    } catch (err) {
      return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    }
  },

  login: async (email: string, pass: string): Promise<{ success: boolean; user?: UserProfile; message: string }> => {
    try {
      // ตรวจสอบ Admin Fallback (Hardcoded)
      if (email === 'admin@bec.ac.th' && (pass === 'admin1234' || pass === '123456')) {
        return { success: true, user: { name: 'Admin BEC', email, role: 'admin' }, message: 'เข้าสู่ระบบ Admin สำเร็จ' };
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .single();

      if (error || !data) {
        return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      }

      const { password, ...profile } = data;
      return { success: true, user: profile as UserProfile, message: 'เข้าสู่ระบบสำเร็จ' };
    } catch (err) {
      return { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  },

  logout: async () => {
    await Promise.resolve();
  },

  getUsers: async (): Promise<UserProfile[]> => {
    const { data } = await supabase.from('users').select('email, name, role, studentId');
    return (data as UserProfile[]) || [];
  },

  // --- การจัดการคำสั่งซื้อ (Order Management) ---
  saveOrder: async (user: UserProfile, items: CartItem[], total: number): Promise<Order> => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userEmail: user.email,
      userName: user.name,
      date: new Date().toISOString(),
      items,
      total,
      status: 'pending'
    };

    const { error } = await supabase.from('orders').insert([newOrder]);
    if (error) throw error;
    
    return newOrder;
  },

  getOrdersByUser: async (email: string): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('userEmail', email)
      .order('date', { ascending: false });
    
    if (error) return [];
    return (data as Order[]) || [];
  },

  getAllOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) return [];
    return (data as Order[]) || [];
  },

  updateOrderStatus: async (orderId: string, status: Order['status'], extraData: Partial<Order> = {}) => {
    const { error } = await supabase
      .from('orders')
      .update({ status, ...extraData })
      .eq('id', orderId);
    
    if (error) throw error;
  },

  // --- การจัดการสินค้า (Product Management) ---
  getCustomProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('custom_products').select('*');
    if (error) return [];
    return (data as Product[]) || [];
  },

  addCustomProduct: async (product: Product) => {
    const { error } = await supabase.from('custom_products').insert([product]);
    if (error) throw error;
  },

  deleteCustomProduct: async (id: string) => {
    const { error } = await supabase.from('custom_products').delete().eq('id', id);
    if (error) throw error;
  },

  updateCustomProduct: async (product: Product) => {
    const { error } = await supabase.from('custom_products').update(product).eq('id', product.id);
    if (error) throw error;
  }
};
