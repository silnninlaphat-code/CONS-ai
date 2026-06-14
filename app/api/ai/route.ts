import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY ในโฮสต์ (ใส่ใน Environment Variables แล้ว Redeploy)" }, { status: 200 });
  }
  try {
    const anthropic = new Anthropic({ apiKey });
    const { prompt, system, image } = await req.json();
    const content: any = image
      ? [{ type: "image", source: { type: "base64", media_type: image.media, data: image.data } }, { type: "text", text: prompt }]
      : prompt;
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content }],
    });
    const text = msg.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "AI error" }, { status: 200 });
  }
}
