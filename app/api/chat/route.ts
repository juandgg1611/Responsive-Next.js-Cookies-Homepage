import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { text: "🍪 No entendí tu mensaje, intenta de nuevo." },
        { status: 400 }
      );
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`n8n respondió con status ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ text: data.text });

  } catch (error) {
    console.error("[Chat API] Error:", error);
    return NextResponse.json(
      { text: "🍪 ¡Ups! Se me quemaron las galletas. Intenta de nuevo." },
      { status: 500 }
    );
  }
}