
export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  stock: number;
  level?: 'ปวช.' | 'ปวส.' | 'ทั่วไป'| 'ปวช./ปวส.';
  isRecommended?: boolean;
}

export enum Category {
  UNIFORM = 'เครื่องแบบนักศึกษา',
  ACCESSORIES = 'เครื่องหมายและอุปกรณ์',
  STATIONERY = 'อุปกรณ์การเรียน',
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
}

export interface UserAccount extends UserProfile {
  password: string;
}

export interface Order {
  id: string;
  userEmail: string;
  userName: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
}

export type NavTarget = 'home' | 'all-products' | 'about' | 'how-to-order' | 'shipping' | 'footer' | 'login' | 'profile' | 'admin' | Category;
