export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const key = process.env.PEXELS_API_KEY;
    if (!key || !q) return Response.json({ url: null });
    const r = await fetch(
      "https://api.pexels.com/v1/search?per_page=1&orientation=square&query=" + encodeURIComponent(q),
      { headers: { Authorization: key } }
    );
    const d: any = await r.json();
    const url = d?.photos?.[0]?.src?.medium || d?.photos?.[0]?.src?.large || null;
    return Response.json({ url });
  } catch {
    return Response.json({ url: null });
  }
}
