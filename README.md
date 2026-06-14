# CONS — Interior Design & Construction OS (Next.js)

แอปบริหารงานออกแบบ + ก่อสร้างครบวงจร · AI + รูปจริงอัตโนมัติ + ล็อกอิน Gmail
โค้ดรันบนเซิร์ฟเวอร์ (คีย์ปลอดภัย ผู้ใช้ไม่ต้องกรอก) — ดูคู่มือจับมือทำในไฟล์ที่แนบ

## รันในเครื่อง (ถ้าต้องการ)
1. `npm install`
2. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่คีย์
3. `npm run dev` → เปิด http://localhost:3000

## ขึ้นออนไลน์ (Vercel)
1. อัปโหลดโค้ดขึ้น GitHub
2. vercel.com → New Project → เลือก repo
3. ใส่ Environment Variables (ดู .env.example)
4. Deploy

## Environment Variables
- `ANTHROPIC_API_KEY` (จำเป็น) — AI
- `PEXELS_API_KEY` (จำเป็น) — รูปจริงอัตโนมัติ
- `REPLICATE_API_TOKEN` (ไม่บังคับ) — AI upscale 4K จริง
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (ไม่บังคับ) — ล็อกอิน Gmail
