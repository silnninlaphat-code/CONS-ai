import Anthropic from "@anthropic-ai/sdk";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, system, image } = await req.json();
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return Response.json({ error: "ยังไม่ได้ตั้งค่า ANTHROPIC_API_KEY บนเซิร์ฟเวอร์" });
    const anthropic = new Anthropic({ apiKey: key });
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
    return Response.json({ text });
  } catch (e: any) {
    return Response.json({ error: e?.message || "AI error" });
  }
}
