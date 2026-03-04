import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Actúa como un asistente experto de la tienda 'Vian Cookies'. Eres amable y divertido. Conoces todo sobre galletas artesanales, chips de chocolate, red velvet y opciones sin azúcar. Responde de forma breve y usa emojis de galletas." }],
        },
        {
          role: "model",
          parts: [{ text: "¡Hola! Soy Cookie, el asistente virtual de Vian Cookies. 🍪 ¿En qué puedo endulzar tu día hoy?" }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Importante: devolvemos { text } para que el Provider lo encuentre
    return NextResponse.json({ text }); 
  } catch (error) {
    console.error("Error en la ruta de Gemini:", error);
    return NextResponse.json({ error: "Error al conectar con Gemini" }, { status: 500 });
  }
}