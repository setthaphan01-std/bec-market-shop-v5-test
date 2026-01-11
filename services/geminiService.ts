import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";
import { ChatMessage } from "../types";

export const getShoppingRecommendation = async (history: ChatMessage[]) => {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productListStr = PRODUCTS.map(p => 
    `- ${p.name}: ราคา ${p.price} บาท (ระดับ: ${p.level || 'ทั่วไป'}) (หมวด: ${p.category}) - ${p.description}`
  ).join('\n');
  
  const systemInstruction = `
    คุณคือ "น้อง BEC" ผู้ช่วยช้อปปิ้ง AI อัจฉริยะของร้าน BEC Market Shop วิทยาลัยการอาชีพบ้านผือ
    
    ข้อมูลสินค้าที่มีในร้าน:
    ${productListStr}
    
    กฎการทำงานของคุณ:
    1. แนะนำสินค้าตามระดับชั้นของผู้ใช้ (ปวช. หรือ ปวส.) อย่างแม่นยำ
    2. หากผู้ใช้ถามถึงราคา ให้ตอบราคาที่ถูกต้องจากรายการสินค้า
    3. ตอบเป็นภาษาไทยที่สุภาพ เป็นกันเอง
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

    // Fixed: response.text is a getter property, not a method.
    return response.text || "ขออภัยครับ น้อง BEC งงนิดหน่อย รบกวนถามอีกครั้งได้ไหมครับ?";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "น้อง BEC กำลังพักผ่อนอยู่ (ระบบขัดข้อง) ลองคุยใหม่ภายหลังนะครับ!";
  }
};