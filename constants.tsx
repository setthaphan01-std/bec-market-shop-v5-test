
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'เสื้อเชิ้ตนักศึกษาชาย แขนสั้น',
    price: 230,
    category: Category.UNIFORM,
    description: 'เสื้อเชิ้ตสีขาวผ้าคอตตอน ใส่สบาย ระบายอากาศได้ดี',
    image: '/image/1.png',
    stock: 100,
    level: 'ปวช.',
    isRecommended: true
  },
  {
    id: '2',
    name: 'กางเกงสแล็คชาย',
    price: 220,
    category: Category.UNIFORM,
    description: 'กางเกงสแล็คสีดำ ผ้าโซล่อน ทรงสวย ใส่เรียนหรือใส่ทำงานก็ได้',
    image: '/image/2.png',
    stock: 30,
    level: 'ปวช.'
  },
  {
    id: '3',
    name: 'เสื้อเชิ้ตนักศึกษาชาย แขนยาว',
    price: 350,
    category: Category.UNIFORM,
    description: 'เสื้อเชิ้ตสีขาวผ้าคอตตอน ใส่สบาย ระบายอากาศได้',
    image: '/image/3.png',
    stock: 100,
    level: 'ปวส.',
    isRecommended: true
  },
  {
    id: '4',
    name: 'กางเกงสแล็คชาย',
    price: 380,
    category: Category.UNIFORM,
    description: 'กางเกงสแล็คสีดำ ผ้านาโน ทรงสวย ใส่เรียนหรือใส่ทำงานก็ได้',
    image: '/image/4.png',
    stock: 100,
    level: 'ปวส.'
  },
  {
    id: '5',
    name: 'เสื้อเชิ้ตนักศึกษาหญิง แขนสั้น',
    price: 220,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย รีดง่าย',
    image: '/image/5.png',
    stock: 100,
    level: 'ปวช.',
    isRecommended: true
  },
  {
    id: '7',
    name: 'เสื้อเชิ้ตนักศึกษาหญิง แขนยาว',
    price: 270,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย รีดง่าย',
    image: '/image/7.png',
    stock: 100,
    level: 'ปวส.'
  },
  {
    id: '6',
    name: 'กระโปรงทรงเอ ผ่าหลัง (ผ่าซ้อนทับ)',
    price: 120,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย รีดง่าย ความยาว 20“ 22” 24” 26” 28',
    image: '/image/6.png',
    stock: 100,
    level: 'ปวช./ปวส.',
    isRecommended: true
  },
  {
    id: '8',
    name: 'เสื้อพละศึกษา',
    price: 370,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย',
    image: '/image/8.png',
    stock: 100,
    /* Fixed: Added missing comma after level property */
    level: 'ปวช./ปวส.',
    isRecommended: true
  },
  {
    id: '9',
    name: 'เสื้อช็อปนักศึกษา(สายช่าง/อุตสาหกรรม)',
    price: 300,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย รีดง่าย',
    image: '/image/9.png',
    stock: 100,
    level: 'ปวช.'
  },
  {
    id: '10',
    name: 'เสื้อช็อปนักศึกษา(สายช่าง/อุตสาหกรรม)',
    price: 300,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย รีดง่าย',
    image: '/image/10.png',
    stock: 100,
    level: 'ปวส.'
  },
  {
    id: '11',
    name: 'เสื้อช็อปนักศึกษา(สายพาณิชย์/บริหารธุรกิจ)',
    price: 300,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย รีดง่าย',
    image: '/image/11.png',
    stock: 100,
    level: 'ปวช.'
  },
  {
    id: '12',
    name: 'เสื้อช็อปนักศึกษา(สายพาณิชย์/บริหารธุรกิจ)',
    price: 300,
    category: Category.UNIFORM,
    description: 'เนื้อผ้าหนาใส่สบาย ระบายอากาศได้ดี ซักง่าย รีดง่าย',
    image: '/image/12.png',
    stock: 100,
    level: 'ปวส.'
  },
  {
    id: '20',
    name: 'เข็มกลัดติดหน้าอก',
    price: 70,
    category: Category.ACCESSORIES,
    description: 'เข็มกลัดตราวิทยาลัย ชุบทองเหลือง',
    image: '/image/20.png',
    stock: 60,
    level: 'ทั่วไป'
  },
  {
    id: '21',
    name: 'กระดุม,ตุ้งติ้ง',
    price: 100,
    category: Category.ACCESSORIES,
    description: 'กระดุมและตุ้งติ้ง จากโลหะชุบเงินอย่างดี สำหรับนักเรียนและนักศึกษาผู้หญิง',
    image: '/image/21.png',
    stock: 60,
    level: 'ทั่วไป'
  },
  {
    id: '22',
    name: 'เนคไทวิทยาลัย',
    price: 120,
    category: Category.ACCESSORIES,
    description: 'เนคไทสีน้ำเงินเข้ม ปักตราสัญลักษณ์วิทยาลัย',
    image: '/image/22.png',
    stock: 80,
    level: 'ทั่วไป'
  },
  {
    id: '23',
    name: 'เข็มขัดวิทยาลัย',
    price: 200,
    category: Category.ACCESSORIES,
    description: 'เข็มขัดหนังสีดำพร้อมหัวเข็มขัดตรามหาวิทยาลัย',
    image: '/image/23.png',
    stock: 100,
    level: 'ทั่วไป',
  },
  {
    id: '46',
    name: 'ถุงเท้าข้อสั้นสีดำ (แพ็ค 6 คู่)',
    price: 100,
    category: Category.ACCESSORIES,
    description: 'ถุงเท้าสีดำล้วน นุ่มสบาย ทนทาน',
    image: '/image/46.png',
    stock: 60,
    level: 'ทั่วไป'
  },
  {
    id: '48',
    name: 'สมุดจดบันทึก',
    price: 5,
    category: Category.STATIONERY,
    description: 'สมุดจดบันทึกปกแข็ง ลายวิทยาลัย',
    image: '/image/48.png',
    stock: 100,
    level: 'ทั่วไป',
    isRecommended: true
  },
];
