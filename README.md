# CONS — BOQ Studio (Next.js · ไม่ต้องล็อกอิน)

แอปทำ BOQ · ใบเสนอราคา · แผนงานก่อสร้าง · ร่างสัญญา · คู่มือกฎหมาย
- เปิดเว็บปุ๊บใช้ได้เลย **ไม่มีหน้าล็อกอิน**
- ข้อมูลบันทึกในเบราว์เซอร์ (localStorage) **ขึ้นโฮสต์แล้วไม่หาย**
- โลโก้ CONS ในแอป + เป็น favicon
- **AI ใช้งานได้** ผ่าน server (ใส่คีย์ตัวเดียว)

## Deploy ขึ้น Vercel (แนะนำ)
1. อัปโฟลเดอร์นี้ขึ้น GitHub (ลากไฟล์ทั้งหมดเข้า repo ให้ `package.json` อยู่ชั้นบนสุด)
2. vercel.com → Add New → Project → เลือก repo
3. (ถ้าจะใช้ AI) ใส่ Environment Variable 1 ตัว:
   - Key: `ANTHROPIC_API_KEY`  Value: คีย์จาก console.anthropic.com (`sk-ant-...`)
4. กด **Deploy** → ได้ลิงก์เว็บจริง
5. ถ้าเพิ่งใส่คีย์ทีหลัง ต้อง **Redeploy** (Deployments → จุด 3 จุด → Redeploy)

> ไม่ใส่ ANTHROPIC_API_KEY ก็ใช้ได้ทุกอย่าง ยกเว้นเมนู "ผู้ช่วย AI"
> ไม่ต้องตั้ง Supabase/Stripe ใดๆ ทั้งสิ้น

## รันในเครื่อง (ถ้าต้องการ)
```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-xxx" > .env.local   # ใส่ถ้าจะใช้ AI
npm run dev    # http://localhost:3000
```

## โครงสร้าง
```
app/page.tsx        เปิดแอปเลย (โหลดฝั่งเบราว์เซอร์)
app/api/ai/route.ts เรียก Claude ฝั่ง server (คีย์ปลอดภัย)
components/BoqApp.jsx  ตัวแอปทั้งหมด
public/logo.png     โลโก้/favicon
```

## หมายเหตุ
- ข้อมูลเก็บแยกตามเบราว์เซอร์/เครื่อง (ยังไม่ sync ข้ามอุปกรณ์)
- ราคาที่ AI เสนอเป็นการประเมินเบื้องต้น ควรตรวจกับ supplier ก่อนเสนอจริง
