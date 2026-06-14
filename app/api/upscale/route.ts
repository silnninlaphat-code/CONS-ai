export const runtime = "nodejs";
export const maxDuration = 60;

// Real-ESRGAN on Replicate (เติมรายละเอียดจริง). ต้องตั้งค่า REPLICATE_API_TOKEN.
export async function POST(req: Request) {
  try {
    const { image, scale } = await req.json();
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) return Response.json({ error: "ยังไม่ได้ตั้งค่า REPLICATE_API_TOKEN (AI upscale ปิดอยู่)" });
    if (!image) return Response.json({ error: "ไม่มีรูป" });

    const create = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: { Authorization: "Token " + token, "Content-Type": "application/json" },
      body: JSON.stringify({
        version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
        input: { image, scale: Math.min(4, Number(scale) || 4), face_enhance: false },
      }),
    });
    let pred: any = await create.json();
    if (pred?.error) return Response.json({ error: String(pred.error) });
    const pollUrl = pred?.urls?.get;
    for (let i = 0; i < 40 && pred.status !== "succeeded" && pred.status !== "failed" && pred.status !== "canceled"; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      const p = await fetch(pollUrl, { headers: { Authorization: "Token " + token } });
      pred = await p.json();
    }
    if (pred.status === "succeeded") {
      const out = Array.isArray(pred.output) ? pred.output[0] : pred.output;
      return Response.json({ url: out });
    }
    return Response.json({ error: "upscale ไม่สำเร็จ (" + pred.status + ")" });
  } catch (e: any) {
    return Response.json({ error: e?.message || "upscale error" });
  }
}
