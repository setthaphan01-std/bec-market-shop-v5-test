
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";
import { ChatMessage } from "../types";

export const getShoppingRecommendation = async (history: ChatMessage[]) => {
  // ตรวจสอบเบื้องต้นว่ามีการตั้งค่า API Key หรือไม่
  if (!process.env.API_KEY || process.env.API_KEY === '') {
    console.error("Gemini Error: API_KEY is missing. Please check your Environment Variables on Vercel.");
    return "ขออภัยครับ ระบบ AI ยังไม่ได้ถูกตั้งค่า (Missing API Key) กรุณาตรวจสอบการตั้งค่าที่ Vercel Dashboard นะครับ!";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productListStr = PRODUCTS.map(p => 
    `- ${p.name}: ราคา ${p.price} บาท (ระดับ: ${p.level || 'ทั่วไป'}) (หมวด: ${p.category}) - ${p.description}`
  ).join('\n');
  
  const systemInstruction = `
    คุณคือ "น้อง BEC" ผู้ช่วยช้อปปิ้ง AI อัจฉริยะของร้าน BEC Market Shop วิทยาลัยการอาชีพบ้านผือ
    
    ข้อมูลสินค้าที่มีในร้าน:
    ${productListStr}
    
    กฎการตอบกลับของคุณ (สำคัญมาก):
    1. ใช้ภาษาไทยที่สุภาพ เป็นกันเอง และดูเป็นมืออาชีพ
    2. จัดรูปแบบการตอบให้ "อ่านง่าย" โดยใช้:
       - **ตัวหนา** สำหรับชื่อสินค้า หรือหัวข้อสำคัญ
       - ใช้ Bullet points (- หรือ *) เมื่อต้องรายการสินค้าหลายรายการ
       - เว้นบรรทัด (Line break) ระหว่างหัวข้อให้ชัดเจน ไม่เขียนเป็นพืดเดียว
    3. แนะนำสินค้าตามระดับชั้นของผู้ใช้ (ปวช. หรือ ปวส.) อย่างแม่นยำ
    4. หากผู้ใช้ถามถึงราคา ให้สรุปราคาในรูปแบบรายการที่ดูง่าย
  `;

  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "ขออภัยครับ น้อง BEC งงนิดหน่อย รบกวนถามอีกครั้งได้ไหมครับ?";
  } catch (error: any) {
    console.error("Gemini Error Detail:", error);
    
    if (error.message?.includes('API key not valid')) {
      return "น้อง BEC ตรวจพบว่า API Key ไม่ถูกต้องครับ รบกวนตรวจสอบอีกครั้งนะครับ!";
    }
    
    return "น้อง BEC กำลังพักผ่อนอยู่ (ระบบขัดข้อง) ลองคุยใหม่ภายหลังนะครับ!";
  }
};
