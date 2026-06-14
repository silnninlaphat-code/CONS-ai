"use client";
import React, { useState, useMemo, useEffect, useRef, createContext, useContext } from "react";
import {
  LayoutDashboard, FolderKanban, Table2, Library, Sparkles, Settings as SettingsIcon,
  Plus, Trash2, Copy, Search, FileDown, Upload, Image as ImageIcon, ChevronDown, ChevronRight,
  Building2, User, PenLine, Wand2, AlertTriangle, CheckCircle2, Shield, Eye, EyeOff,
  X, Palette, Type as TypeIcon, Menu, TrendingUp, Layers, Calculator, ScanLine, Save
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* =========================================================================
   ESTIMA — BOQ Studio
   เครื่องมือทำ BOQ / ใบเสนอราคา สำหรับงานออกแบบตกแต่งภายในไทย
   MVP สมบูรณ์ ใช้งานได้จริง (Single-file React)
   ========================================================================= */

const CONS_LOGO = "data:image/jpeg;base64,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";

/* ----------------------------- THEME TOKENS ----------------------------- */
const THEMES = {
  cons: { name: "CONS ขาว-เขียว", bg: "#fafbfa", surface: "#ffffff", surface2: "#f1f4f1", text: "#1a1a1a", muted: "#6b746e", border: "#e6eae7", accent: "#1f6e44", accent2: "#16241b", head: "#ffffff", headText: "#1a1a1a", danger: "#b3261e" },
  minimal_white: { name: "Minimal White", bg: "#f7f6f3", surface: "#ffffff", surface2: "#f1efea", text: "#1c1b19", muted: "#7c7872", border: "#e6e2da", accent: "#2f6f4f", accent2: "#c8a45c", head: "#1c1b19", headText: "#ffffff", danger: "#b3261e" },
  architect_black: { name: "Architect Black", bg: "#101113", surface: "#17191c", surface2: "#1f2227", text: "#eceef0", muted: "#9aa0a6", border: "#2a2e34", accent: "#d7b56d", accent2: "#5b8def", head: "#000000", headText: "#f3d9a0", danger: "#ef5350" },
  warm_beige: { name: "Warm Beige Studio", bg: "#efe7da", surface: "#faf5ec", surface2: "#e8ddca", text: "#3a3228", muted: "#8a7d68", border: "#ddcfb8", accent: "#a3683f", accent2: "#7a8b5a", head: "#5b4a35", headText: "#f7efe2", danger: "#a8412c" },
  concrete_grey: { name: "Concrete Grey", bg: "#e9eaec", surface: "#f7f8f9", surface2: "#dee0e3", text: "#26282b", muted: "#737880", border: "#cfd2d6", accent: "#4b5563", accent2: "#d97706", head: "#2f3337", headText: "#f5f6f7", danger: "#b3261e" },
  luxury_gold: { name: "Luxury Gold", bg: "#14110c", surface: "#1d1810", surface2: "#272015", text: "#f3ead5", muted: "#b6a884", border: "#3a3020", accent: "#d4af37", accent2: "#caa15a", head: "#0c0a06", headText: "#e8c873", danger: "#e07a5f" },
  japanese: { name: "Japanese Minimal", bg: "#f4f2ee", surface: "#ffffff", surface2: "#ebe8e2", text: "#2b2b2b", muted: "#8c8880", border: "#e2ded6", accent: "#8c2f2f", accent2: "#3f4a3c", head: "#2b2b2b", headText: "#f4f2ee", danger: "#8c2f2f" },
};

const FONTS = {
  modern: { name: "Modern Professional", body: "'Noto Sans Thai', sans-serif", head: "'Noto Sans Thai', sans-serif" },
  handwriting: { name: "Architect Handwriting", body: "'Sarabun', sans-serif", head: "'Mali', cursive" },
  luxury: { name: "Minimal Luxury", body: "'IBM Plex Sans Thai', sans-serif", head: "'IBM Plex Sans Thai', sans-serif" },
  corporate: { name: "Corporate Clean", body: "'Sarabun', sans-serif", head: "'Sarabun', sans-serif" },
  creative: { name: "Creative Studio", body: "'Sarabun', sans-serif", head: "'Sriracha', cursive" },
};

/* ----------------------------- PRESETS ----------------------------- */
const CATEGORIES = [
  "งานรื้อถอน", "งานเตรียมพื้นที่", "งานผนังเบา", "งานฝ้าเพดาน", "งานพื้น",
  "งานผนังตกแต่ง", "งานสี", "งานไม้บิวท์อิน", "งานเฟอร์นิเจอร์ลอยตัว", "งานเคาน์เตอร์",
  "งานหิน", "งานกระจก", "งานเหล็ก/สแตนเลส", "งานประตู-หน้าต่าง", "งานไฟฟ้า",
  "งานแสงสว่าง", "งานสุขาภิบาล", "งานแอร์/ระบายอากาศ", "งาน Smart Home", "งานผ้าม่าน",
  "งานวอลเปเปอร์", "งานครัว", "งานห้องน้ำ", "งานขนส่ง/ติดตั้ง", "งานทำความสะอาด",
  "งานบริหารโครงการ", "งานออกแบบ", "งานสำรอง (Contingency)",
];

const UNITS = ["ตร.ม.", "เมตร", "ชุด", "จุด", "งาน", "แผ่น", "ตร.ฟุต", "ตัว", "บาน", "เหมา"];
const PROJECT_TYPES = ["บ้าน", "คอนโด", "คาเฟ่", "ร้านอาหาร", "คลินิก", "โรงแรม", "ออฟฟิศ", "บาร์", "โชว์รูม", "ร้านค้าปลีก"];
const PROJECT_STYLES = ["Minimal", "Modern", "Luxury", "Wabi-Sabi", "Japandi", "Modern Classic", "Industrial", "Tropical", "Old Money", "Contemporary"];
const TIERS = ["ประหยัด", "มาตรฐาน", "พรีเมียม", "ลักชัวรี", "Ultra Luxury"];
const STATUSES = ["ร่าง", "ส่งแล้ว", "อนุมัติแล้ว", "แก้ไข", "ปิดงาน"];
const CONFIDENCE = ["สูง", "กลาง", "ต่ำ"];

/* ----------------------------- SAMPLE MATERIALS ----------------------------- */
const SAMPLE_MATERIALS = [
  { id: "m1", name: "ไม้ MDF กันชื้น 18 มม.", cat: "งานไม้บิวท์อิน", brand: "Vanachai", unit: "ตร.ม.", low: 950, mid: 1200, high: 1500, labor: 650, supplier: "ร้านวัสดุ HomePro", tag: "ตู้, บิวท์อิน" },
  { id: "m2", name: "Laminate ลายไม้ผิวด้าน", cat: "งานไม้บิวท์อิน", brand: "Lamitak", unit: "ตร.ม.", low: 380, mid: 520, high: 750, labor: 250, supplier: "Lamitak Showroom", tag: "ผิวตู้" },
  { id: "m3", name: "กระเบื้องแกรนิตโต้ 60x120", cat: "งานพื้น", brand: "COTTO", unit: "ตร.ม.", low: 650, mid: 950, high: 1600, labor: 350, supplier: "COTTO", tag: "พื้น, ผนัง" },
  { id: "m4", name: "Microcement ผิวเรียบ", cat: "งานผนังตกแต่ง", brand: "Pandomo", unit: "ตร.ม.", low: 1800, mid: 2400, high: 3200, labor: 0, supplier: "ผู้รับเหมาเฉพาะทาง", tag: "ผนัง, พื้น" },
  { id: "m5", name: "SPC Click ลายไม้ 5 มม.", cat: "งานพื้น", brand: "Floorich", unit: "ตร.ม.", low: 420, mid: 620, high: 900, labor: 180, supplier: "ร้านพื้นไวนิล", tag: "พื้น" },
  { id: "m6", name: "ฝ้ายิปซัมฉาบเรียบ 9 มม.", cat: "งานฝ้าเพดาน", brand: "ตราช้าง", unit: "ตร.ม.", low: 280, mid: 380, high: 520, labor: 180, supplier: "SCG", tag: "ฝ้า" },
  { id: "m7", name: "ดาวน์ไลท์ LED 7W", cat: "งานแสงสว่าง", brand: "Philips", unit: "จุด", low: 180, mid: 280, high: 450, labor: 120, supplier: "ไฟฟ้ารวมมิตร", tag: "ไฟ" },
  { id: "m8", name: "หินอ่อน Calacatta (เทียม)", cat: "งานหิน", brand: "Neolith", unit: "ตร.ม.", low: 3500, mid: 5200, high: 8500, labor: 1200, supplier: "Stone Gallery", tag: "เคาน์เตอร์, ผนัง" },
  { id: "m9", name: "สีน้ำอะคริลิกภายใน", cat: "งานสี", brand: "TOA", unit: "ตร.ม.", low: 65, mid: 95, high: 160, labor: 55, supplier: "TOA Dealer", tag: "ผนัง, ฝ้า" },
  { id: "m10", name: "วอลเปเปอร์เกรดพรีเมียม", cat: "งานวอลเปเปอร์", brand: "Goodrich", unit: "ตร.ม.", low: 350, mid: 550, high: 950, labor: 150, supplier: "Wallpaper House", tag: "ผนัง" },
  { id: "m11", name: "กระจกเงาตัดเหลี่ยม 6 มม.", cat: "งานกระจก", brand: "Guardian", unit: "ตร.ม.", low: 1100, mid: 1500, high: 2200, labor: 400, supplier: "ร้านกระจก", tag: "ผนัง" },
  { id: "m12", name: "บานเลื่อนอลูมิเนียมกระจก", cat: "งานประตู-หน้าต่าง", brand: "TOSTEM", unit: "ตร.ม.", low: 2800, mid: 3800, high: 5500, labor: 600, supplier: "TOSTEM Dealer", tag: "ประตู" },
];

/* ----------------------------- SAMPLE PROJECT ----------------------------- */
const uid = () => Math.random().toString(36).slice(2, 9);

const sampleRow = (o) => ({
  id: uid(), image: "", category: "งานพื้น", name: "", spec: "", qty: 1, unit: "ตร.ม.",
  matUnitPrice: 0, laborUnitPrice: 0, toolCost: 0, transportCost: 0,
  wastePct: 5, commissionPct: 0, overheadPct: 0, profitPct: 0, discount: 0,
  note: "", status: "ร่าง", priceDate: new Date().toISOString().slice(0, 10),
  source: "", confidence: "กลาง", locked: false, ...o,
});

const SAMPLE_PROJECTS = [
  {
    id: "siin-main", code: "SIIN-2026-001", name: "ศิลป์เศรษวรา สิปวรา", locked: true,
    type: "ตกแต่งภายใน", style: "", area: 0, budget: 1000000, tier: "พรีเมียม",
    province: "กรุงเทพมหานคร", location: "", status: "เซ็นสัญญาแล้ว",
    startDate: "2026-01-01", updatedAt: "2026-01-01",
    client: { name: "ศิลป์เศรษวรา สิปวรา", company: "SIIN CONCEPT", address: "", phone: "", email: "", taxId: "", contact: "ศิลป์เศรษวรา สิปวรา", position: "เจ้าของกิจการ", note: "ราคาจ้างงาน 1,000,000 บาท" },
    settings: { vatEnabled: true, vatPct: 7, whtPct: 3, defWaste: 5, defCommission: 3, defOverhead: 8, defProfit: 15, rounding: 0, vatMode: "exclusive" },
    sections: [{ id: "s1", title: "งานทั่วไป", color: "#2f6f4f", rows: [] }],
  },
];

const COMPANY = {
  name: "SIIN CONCEPT Global Studio",
  taxId: "0000000000000", regId: "0105500000000",
  address: "Bangkok, Thailand",
  phone: "—", email: "—", website: "—", line: "—",
  proposer: "ผู้เสนอราคา", proposerPos: "Senior Designer",
  logo: CONS_LOGO, signature: "",
};

/* ----------------------------- CALC ENGINE ----------------------------- */
const num = (v) => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));

function calcRow(r) {
  const materialTotal = num(r.matUnitPrice) * num(r.qty);
  const laborTotal = num(r.laborUnitPrice) * num(r.qty);
  const wasteCost = materialTotal * (num(r.wastePct) / 100);
  const cost = materialTotal + laborTotal + wasteCost + num(r.toolCost) + num(r.transportCost);
  const commission = cost * (num(r.commissionPct) / 100);
  const overhead = cost * (num(r.overheadPct) / 100);
  const profit = cost * (num(r.profitPct) / 100);
  const lineSell = cost + commission + overhead + profit - num(r.discount);
  return { materialTotal, laborTotal, wasteCost, cost, commission, overhead, profit, lineSell };
}

function calcProject(project) {
  const set = project.settings;
  let sumMaterial = 0, sumLabor = 0, sumWaste = 0, sumCost = 0,
    sumCommission = 0, sumOverhead = 0, sumProfit = 0, subtotal = 0;
  const byCategory = {};
  project.sections.forEach((sec) => {
    sec.rows.forEach((r) => {
      const c = calcRow(r);
      sumMaterial += c.materialTotal; sumLabor += c.laborTotal; sumWaste += c.wasteCost;
      sumCost += c.cost; sumCommission += c.commission; sumOverhead += c.overhead;
      sumProfit += c.profit; subtotal += c.lineSell;
      byCategory[r.category] = (byCategory[r.category] || 0) + c.lineSell;
    });
  });
  const preVat = subtotal; // project-level discount already applied per-row; keep simple
  const vat = set.vatEnabled ? preVat * (num(set.vatPct) / 100) : 0;
  const wht = preVat * (num(set.whtPct) / 100);
  let net = preVat + vat - wht;
  if (set.rounding > 0) net = Math.round(net / set.rounding) * set.rounding;
  return { sumMaterial, sumLabor, sumWaste, sumCost, sumCommission, sumOverhead, sumProfit, subtotal, preVat, vat, wht, net, byCategory };
}

const baht = (n) => num(n).toLocaleString("th-TH", { maximumFractionDigits: 0 });
const baht2 = (n) => num(n).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ----------------------------- CONTEXT ----------------------------- */
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ----------------------------- STYLES ----------------------------- */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&family=Mali:wght@400;500;600&family=Sriracha&family=Caveat:wght@500;600&display=swap');
* { box-sizing: border-box; }
.estima { font-family: var(--font-body); color: var(--text); background: var(--bg); min-height: 100vh; -webkit-font-smoothing: antialiased; }
.estima h1,.estima h2,.estima h3,.estima .head { font-family: var(--font-head); }
.es-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 6px 18px rgba(0,0,0,.05); }
.es-sidebar { background: #ffffff !important; color: #1a1a1a !important; border-right: 1px solid #e6eae7; }
.es-sidebar .es-divider { background: #e6eae7 !important; }
.es-sidebar .head { color: #16241b; }
.es-soft { background: var(--surface2); }
.es-btn { display:inline-flex; align-items:center; gap:8px; border-radius:11px; padding:9px 14px; font-weight:700; font-size:14px; border:1px solid var(--border); background: var(--surface); color: var(--text); cursor:pointer; transition: all .15s; }
.es-btn:hover { transform: translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.1); }
.es-btn-primary { background: var(--accent); color:#fff; border-color: var(--accent); }
.es-btn-ghost { background: transparent; box-shadow:none; }
.es-btn-danger { color: var(--danger); border-color: var(--border); }
.es-input, .es-select { width:100%; background: var(--surface); border:1px solid var(--border); border-radius:10px; padding:8px 11px; color: var(--text); font-size:14px; font-family: var(--font-body); outline:none; }
.es-input:focus, .es-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
.es-label { font-size:12px; color: var(--muted); font-weight:600; margin-bottom:5px; display:block; }
.es-pill { font-size:11px; font-weight:700; padding:3px 9px; border-radius:999px; display:inline-flex; align-items:center; gap:4px; }
.es-nav { display:flex; align-items:center; gap:11px; padding:11px 14px; border-radius:11px; cursor:pointer; color:#3a443e !important; font-weight:600; font-size:14px; transition:all .15s; }
.es-nav:hover { background: rgba(31,110,68,.09); color:#1f6e44 !important; }
.es-nav.active { color:#fff !important; }
.es-nav.active * { color:#fff !important; }
.es-nav.active { background: var(--accent); color:#fff; box-shadow:0 4px 12px color-mix(in srgb, var(--accent) 40%, transparent); }
.es-table { width:100%; border-collapse:separate; border-spacing:0; font-size:13px; }
.es-table th { background: #fff; color: var(--text); font-weight:700; padding:9px 8px; text-align:right; white-space:nowrap; font-size:12px; position:sticky; top:0; z-index:2; border-bottom:2px solid var(--accent); }
.es-table th:first-child, .es-table td:first-child { text-align:center; }
.es-table th.l, .es-table td.l { text-align:left; }
.es-table td { padding:6px 8px; border-bottom:1px solid var(--border); vertical-align:middle; }
.es-table tr:hover td { background: var(--surface2); }
.es-cellinput { width:100%; background:transparent; border:1px solid transparent; border-radius:7px; padding:5px 6px; color:var(--text); font-size:13px; text-align:right; font-family:var(--font-body); }
.es-cellinput:hover { border-color: var(--border); }
.es-cellinput:focus { border-color: var(--accent); background: var(--surface); outline:none; }
.es-cellinput.l { text-align:left; }
.es-scroll { overflow:auto; }
.es-scroll::-webkit-scrollbar { height:9px; width:9px; }
.es-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius:8px; }
.es-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:50; display:flex; align-items:center; justify-content:center; padding:16px; }
.es-modal { background:var(--surface); border:1px solid var(--border); border-radius:18px; max-width:560px; width:100%; max-height:88vh; overflow:auto; }
.grad-accent { background: linear-gradient(135deg, var(--accent), var(--accent2)); }
.es-chip { font-size:12px; padding:4px 10px; border-radius:999px; border:1px solid var(--border); cursor:pointer; background:var(--surface); color:var(--muted); font-weight:600; }
.es-chip.on { background: var(--accent); color:#fff; border-color:var(--accent); }
.es-navhead { font-size:10px; font-weight:800; letter-spacing:.6px; text-transform:uppercase; color: #97a09a !important; padding:8px 10px 3px; }
.es-navrow:hover { background: color-mix(in srgb, var(--accent) 8%, transparent) !important; }
.es-greenpanel { background: #1f5a37 !important; color: #ffffff !important; border-color: transparent !important; }
.es-greenpanel * { color: #ffffff !important; }
.es-greenpanel .es-netred { color: #ff5a5a !important; }
.es-greenpanel .es-divider { background: color-mix(in srgb, var(--headText) 28%, transparent) !important; }
.es-spin { animation: es-spin 1s linear infinite; }
@keyframes es-spin { to { transform: rotate(360deg); } }

/* ===== Animation system (ทำให้แอปมีชีวิต) ===== */
@keyframes fadeInUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform:none; } }
@keyframes popIn { 0% { opacity:0; transform: scale(.92); } 100% { opacity:1; transform: scale(1); } }
@keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 45%, transparent); } 50% { box-shadow: 0 0 0 10px transparent; } }
@keyframes gradientMove { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
@keyframes shimmerMove { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
@keyframes shineSweep { to { left:150%; } }
@keyframes spinSlow { to { transform: rotate(360deg); } }

.es-card { animation: fadeInUp .45s cubic-bezier(.2,.8,.2,1) both; transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease; }
.es-card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,.10); border-color: color-mix(in srgb, var(--accent) 35%, var(--border)); }
.es-btn { transition: transform .15s ease, box-shadow .2s ease, filter .2s ease; position:relative; overflow:hidden; }
.es-btn:hover { transform: translateY(-1px); filter: brightness(1.04); }
.es-btn:active { transform: scale(.96); }
.es-btn-primary::after { content:""; position:absolute; top:0; left:-60%; width:45%; height:100%; background:linear-gradient(120deg, transparent, rgba(255,255,255,.45), transparent); transform: skewX(-20deg); pointer-events:none; }
.es-btn-primary:hover::after { animation: shineSweep .75s ease; }
.es-chip { transition: transform .15s ease, background .2s, color .2s, border-color .2s; }
.es-chip:hover { transform: translateY(-2px); border-color: var(--accent); color: var(--accent); }
.grad-accent { background-size: 200% 200%; animation: gradientMove 7s ease infinite; }
.es-shimmer { background: linear-gradient(90deg, var(--surface2) 25%, color-mix(in srgb, var(--surface2) 55%, #fff) 37%, var(--surface2) 63%); background-size: 200% 100%; animation: shimmerMove 1.3s infinite linear; }
.float { animation: floaty 4s ease-in-out infinite; }
.pulse-glow { animation: pulseGlow 2.2s ease-out infinite; }
.pop { animation: popIn .3s ease both; }
.es-input, .es-select, .es-cellinput { transition: border-color .2s, box-shadow .2s; }
.es-input:focus, .es-select:focus, .es-cellinput:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); outline: none; }
.es-table tbody tr { transition: background .18s; }
.es-table tbody tr:hover { background: color-mix(in srgb, var(--accent) 6%, transparent); }
.lift-img { transition: transform .5s ease; }
.lift-img:hover { transform: scale(1.06); }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
.kpi { font-size:26px; font-weight:700; font-family:var(--font-head); }
.es-divider { height:1px; background:var(--border); }
.row-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:12px; margin-bottom:10px; }
[data-mobile-only] { display:none; }
@media (max-width: 819px) {
  [data-mobile-hide] { display:none !important; }
  [data-mobile-only] { display:inline-flex !important; }
  [data-hide-sm] { display:none; }
}
@media print {
  body * { visibility:hidden; }
  #print-area, #print-area * { visibility:visible; }
  #print-area { position:absolute; left:0; top:0; width:100%; }
  .no-print { display:none !important; }
}
`;

/* ----------------------------- PERSISTENT STORAGE ----------------------------- */
// ใช้ที่เก็บข้อมูลถาวรของ artifact (ต่อผู้ใช้ ล็อกอินกลับมาข้อมูลยังอยู่ — ไม่ต้องตั้งค่าใดๆ)
const store = {
  ok: () => typeof window !== "undefined" && !!window.localStorage,
  async get(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } },
  async set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const clone = (x) => JSON.parse(JSON.stringify(x));

const DEFAULT_TEMPLATE = {
  id: "tpl-default", name: "CONS ค่าเริ่มต้น", accent: "#1f5a37", accent2: "#16241b", headerText: "#ffffff",
  font: "'Noto Sans Thai',sans-serif", docTitle: "ใบเสนอราคา", docTitleEn: "QUOTATION",
  showCover: false, showImages: true, showCostBreakdown: true, showLogo: true, accentBar: true,
  terms: "• ยืนราคา 30 วัน\n• ชำระมัดจำ 50% ก่อนเริ่มงาน งวดที่เหลือแบ่งตามความคืบหน้า\n• รับประกันงาน 1 ปี นับจากวันส่งมอบ\n• ราคานี้เป็นการประเมินเบื้องต้น อาจปรับตามหน้างานจริง",
  footerText: "ขอบคุณที่ไว้วางใจให้เราดูแลงานออกแบบของคุณ",
};

/* ============================== APP ROOT ============================== */
function TrialPopup() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const pop = () => setShow(true);
    const t0 = setTimeout(pop, 3000);
    const iv = setInterval(pop, 13000);
    return () => { clearTimeout(t0); clearInterval(iv); };
  }, []);
  useEffect(() => { if (!show) return; const t = setTimeout(() => setShow(false), 9000); return () => clearTimeout(t); }, [show]);
  if (!show) return null;
  return (
    <div className="no-print pop" style={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999, width: 290, maxWidth: "86vw", background: "#fff", border: "1px solid var(--border)", borderLeft: "4px solid var(--accent)", borderRadius: 14, boxShadow: "0 12px 32px rgba(0,0,0,.18)", padding: "14px 14px 12px" }}>
      <button onClick={() => setShow(false)} style={{ position: "absolute", top: 8, right: 8, background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)", padding: 2 }}><X size={15} /></button>
      <div style={{ fontWeight: 700, fontSize: 13, color: "var(--accent)", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}><Sparkles size={14} /> รุ่นทดลอง</div>
      <div style={{ fontSize: 12.5, color: "var(--text)", lineHeight: 1.55, marginBottom: 8 }}>
        เปิดใช้งานถึง <b>30 มิ.ย. 69</b> · สมัครแบบ <b>PRO</b> ใช้ได้ทุกฟังก์ชัน เพียง <b>159 บาท/เดือน</b>
      </div>
      <div style={{ fontSize: 13, marginBottom: 10, color: "var(--text)" }}>👉 สนใจ <b>แอดไลน์ : siin.nin</b></div>
      <div style={{ display: "flex", gap: 8 }}>
        <a href="https://line.me/ti/p/~siin.nin" target="_blank" rel="noopener noreferrer" className="es-btn es-btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 12.5, textDecoration: "none" }}>แอดไลน์ siin.nin</a>
        <a href="tel:0924666665" className="es-btn" style={{ justifyContent: "center", fontSize: 12.5, textDecoration: "none" }}>โทร</a>
      </div>
    </div>
  );
}

export default function App() {
  const [themeKey, setThemeKey] = useState("cons");
  const [customTheme, setCustomTheme] = useState(clone(THEMES.cons));
  const [fontKey, setFontKey] = useState("modern");
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [materials, setMaterials] = useState(SAMPLE_MATERIALS);
  const [company, setCompany] = useState(COMPANY);
  const [templates, setTemplates] = useState([DEFAULT_TEMPLATE]);
  const [activeTemplateId, setActiveTemplateId] = useState("tpl-default");
  const [contracts, setContracts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [team, setTeam] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [biz, setBiz] = useState({});
  const [activeProjectId, setActiveProjectId] = useState("siin-main");
  const [tab, setTab] = useState("ai");
  const [mobileNav, setMobileNav] = useState(false);
  const [clientMode, setClientMode] = useState(false);

  // ----- ระบบสมาชิก -----
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([{ email: "demo@cons.app", pass: "1234", plan: "Member", active: true }]);
  const [hydrated, setHydrated] = useState(false);

  // โหลดข้อมูลผู้ใช้จากที่เก็บถาวร
  const loadUserData = async (email) => {
    const d = await store.get("cons:appdata:" + email);
    if (d) {
      let projs = d.projects?.length ? d.projects : clone(SAMPLE_PROJECTS);
      projs = projs.filter((p) => !(!p.locked && p.name === "คาเฟ่ The Slow Bar ทองหล่อ" && (p.client?.company === "Slow Living Co., Ltd." || p.code === "BKK-2026-001")));
      if (!projs.some((p) => p.locked)) projs = [clone(SAMPLE_PROJECTS)[0], ...projs];
      setProjects(projs);
      setMaterials(d.materials || clone(SAMPLE_MATERIALS));
      setCompany(d.company || clone(COMPANY));
      setThemeKey(d.themeKey || "cons");
      if (d.customTheme) setCustomTheme(d.customTheme);
      setFontKey(d.fontKey || "modern");
      setTemplates(d.templates?.length ? d.templates : [DEFAULT_TEMPLATE]);
      setActiveTemplateId(d.activeTemplateId || "tpl-default");
      setContracts(d.contracts || []);
      setSuppliers(d.suppliers || []); setTeam(d.team || []); setPortfolio(d.portfolio || []); setBiz(d.biz || {});
      setActiveProjectId(projs[0]?.id || null);
    } else {
      // ผู้ใช้ใหม่ — เริ่มด้วยตัวอย่างชุดสะอาด
      setProjects(clone(SAMPLE_PROJECTS)); setMaterials(clone(SAMPLE_MATERIALS)); setCompany(clone(COMPANY));
      setTemplates([DEFAULT_TEMPLATE]); setContracts([]); setSuppliers([]); setTeam([]); setPortfolio([]); setBiz({}); setActiveProjectId("siin-main");
    }
  };

  const handleLogin = async (acc) => { setUser(acc); await loadUserData(acc.email); };
  const logout = () => { try { localStorage.removeItem("cons:guser"); if (window.google && window.google.accounts && window.google.accounts.id) window.google.accounts.id.disableAutoSelect(); } catch {} setUser(null); };

  // เริ่มต้น: โหลดบัญชี + session แล้วล็อกอินอัตโนมัติถ้าเคยล็อกอินไว้
  useEffect(() => {
    (async () => {
      try { const g = JSON.parse(localStorage.getItem("cons:guser") || "null"); if (g && g.email) { setUser(g); await loadUserData(g.email); } } catch {}
      setHydrated(true);
    })();
  }, []);

  // บันทึกบัญชี / session
  useEffect(() => { if (hydrated) store.set("cons:accounts", accounts); }, [accounts, hydrated]);
  useEffect(() => { if (hydrated && user) store.set("cons:session", user.email); }, [user, hydrated]);

  // Auto-save ข้อมูลผู้ใช้ (debounce)
  useEffect(() => {
    if (!hydrated || !user) return;
    const t = setTimeout(() => {
      store.set("cons:appdata:" + user.email, { projects, materials, company, themeKey, customTheme, fontKey, templates, activeTemplateId, contracts, suppliers, team, portfolio, biz });
    }, 500);
    return () => clearTimeout(t);
  }, [projects, materials, company, themeKey, customTheme, fontKey, templates, activeTemplateId, contracts, user, hydrated]);

  const theme = themeKey === "custom" ? customTheme : THEMES[themeKey];
  const font = FONTS[fontKey];
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const activeTemplate = templates.find((t) => t.id === activeTemplateId) || templates[0] || DEFAULT_TEMPLATE;

  const updateProject = (id, updater) =>
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...updater(p), updatedAt: new Date().toISOString().slice(0, 10) } : p)));

  const ctx = {
    theme, themeKey, setThemeKey, customTheme, setCustomTheme, font, fontKey, setFontKey,
    projects, setProjects, materials, setMaterials, company, setCompany,
    templates, setTemplates, activeTemplate, activeTemplateId, setActiveTemplateId,
    contracts, setContracts, suppliers, setSuppliers, team, setTeam, portfolio, setPortfolio, biz, setBiz,
    activeProject, activeProjectId, setActiveProjectId, updateProject,
    tab, setTab, clientMode, setClientMode,
    user, logout, DEFAULT_TEMPLATE,
  };

  const cssVars = {
    "--bg": theme.bg, "--surface": theme.surface, "--surface2": theme.surface2,
    "--text": theme.text, "--muted": theme.muted, "--border": theme.border,
    "--accent": theme.accent, "--accent2": theme.accent2, "--head": theme.head,
    "--headText": theme.headText, "--danger": theme.danger,
    "--font-body": font.body, "--font-head": font.head,
  };

  const NAV_GROUPS = [
    { g: "ภาพรวม", items: [
      { k: "dashboard", icon: LayoutDashboard, label: "แดชบอร์ด" },
      { k: "ai", icon: Sparkles, label: "ผู้ช่วย AI" },
    ] },
    { g: "ลูกค้า & งานขาย", items: [
      { k: "clients", icon: User, label: "รายชื่อลูกค้า" },
      { k: "leads", icon: Building2, label: "ลูกค้า (Leads)" },
      { k: "brief", icon: PenLine, label: "บรีฟลูกค้า" },
      { k: "projects", icon: FolderKanban, label: "โปรเจกต์" },
      { k: "quotation", icon: FileDown, label: "ใบเสนอราคา" },
      { k: "contract", icon: PenLine, label: "สัญญา" },
    ] },
    { g: "ออกแบบ", items: [
      { k: "survey", icon: ScanLine, label: "สำรวจหน้างาน" },
      { k: "library", icon: Library, label: "คลังวัสดุ" },
      { k: "drawings", icon: Layers, label: "ชุดแบบ (Drawings)" },
      { k: "imagestudio", icon: ImageIcon, label: "สตูดิโอภาพ AI" },
      { k: "humandim", icon: Calculator, label: "ขนาดมาตรฐานมนุษย์" },
      { k: "templates", icon: Layers, label: "เทมเพลต PDF" },
    ] },
    { g: "ประเมินราคา", items: [
      { k: "boq", icon: Table2, label: "BOQ / ประเมินราคา" },
    ] },
    { g: "ก่อสร้าง", items: [
      { k: "schedule", icon: TrendingUp, label: "แผนงาน (Timeline)" },
      { k: "procurement", icon: Copy, label: "จัดซื้อ (Procurement)" },
      { k: "daily", icon: Calculator, label: "รายงานหน้างาน" },
      { k: "vo", icon: Wand2, label: "งานเพิ่ม-ลด (VO)" },
      { k: "qc", icon: CheckCircle2, label: "QC / Punch List" },
    ] },
    { g: "การเงิน", items: [
      { k: "payment", icon: Calculator, label: "เบิกงวด / Payment" },
    ] },
    { g: "ปิดงาน", items: [
      { k: "handover", icon: CheckCircle2, label: "ส่งมอบงาน" },
      { k: "warranty", icon: Shield, label: "รับประกัน / Service" },
    ] },
    { g: "ทีม & เอกสาร", items: [
      { k: "team", icon: User, label: "ทีม & ซัพพลายเออร์" },
      { k: "meeting", icon: User, label: "บันทึกประชุม" },
      { k: "docs", icon: Library, label: "คลังเอกสาร" },
      { k: "legal", icon: Shield, label: "คู่มือกฎหมาย" },
    ] },
    { g: "ตั้งค่า", items: [
      { k: "settings", icon: SettingsIcon, label: "ตั้งค่า/ธีม" },
    ] },
  ];

  if (!user) {
    return (
      <>
        <style>{STYLE}</style>
        <div className="estima" style={cssVars}>
          <GoogleLogin onLogin={(p) => { try { localStorage.setItem("cons:guser", JSON.stringify(p)); } catch {} handleLogin(p); }} />
        </div>
      </>
    );
  }

  return (
    <AppCtx.Provider value={ctx}>
      <style>{STYLE}</style>
      <TrialPopup />
      <div className="estima" style={cssVars}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Sidebar (desktop) */}
          <aside className="no-print es-sidebar" style={{ width: 248, padding: 18, position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", gap: 6 }}
            data-mobile-hide>
            <Brand />
            <div style={{ marginTop: 8, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
              {NAV_GROUPS.map((grp) => (
                <div key={grp.g} style={{ marginBottom: 4 }}>
                  <div className="es-navhead">{grp.g}</div>
                  {grp.items.map((n) => (
                    <div key={n.k} className={`es-nav ${tab === n.k ? "active" : ""}`} onClick={() => setTab(n.k)}>
                      <n.icon size={17} /> {n.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "auto", fontSize: 11, lineHeight: 1.6 }}>
              <div className="es-divider" style={{ marginBottom: 10 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, background: "rgba(31,110,68,.12)", color: "#1f6e44" }}>{(user?.email || "U")[0].toUpperCase()}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#1a1a1a", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email}</div>
                  <div className="es-pill" style={{ background: "var(--accent)", color: "#fff", fontSize: 10 }}>สมาชิก {user?.plan || "Member"}</div>
                </div>
              </div>
              <button className="es-btn" style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "8px", background: "#f1f4f1", color: "#1a1a1a", border: "1px solid #e6eae7" }} onClick={logout}>ออกจากระบบ</button>
            </div>
          </aside>

          {/* Mobile drawer */}
          {mobileNav && (
            <div className="es-modal-bg no-print" onClick={() => setMobileNav(false)}>
              <aside className="es-sidebar" style={{ width: 240, height: "100vh", position: "absolute", left: 0, top: 0, padding: 18 }} onClick={(e) => e.stopPropagation()}>
                <Brand />
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 2, height: "calc(100vh - 90px)", overflowY: "auto" }}>
                  {NAV_GROUPS.map((grp) => (
                    <div key={grp.g} style={{ marginBottom: 4 }}>
                      <div className="es-navhead">{grp.g}</div>
                      {grp.items.map((n) => (
                        <div key={n.k} className={`es-nav ${tab === n.k ? "active" : ""}`} onClick={() => { setTab(n.k); setMobileNav(false); }}>
                          <n.icon size={17} /> {n.label}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}

          {/* Main */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <TopBar onMenu={() => setMobileNav(true)} />
            <div style={{ padding: "20px 22px 60px" }}>
              {tab === "dashboard" && <Dashboard />}
              {tab === "projects" && <Projects />}
              {tab === "boq" && (activeProject ? <BOQEditor /> : <EmptyProject />)}
              {tab === "library" && <MaterialLibrary />}
              {tab === "templates" && <TemplateDesigner />}
              {tab === "contract" && <ContractStudio />}
              {tab === "schedule" && (activeProject ? <ScheduleStudio /> : <EmptyProject />)}
              {tab === "legal" && <LegalLibrary />}
              {tab === "team" && <TeamStudio />}
              {tab === "leads" && <RecordModule id="leads" />}
              {tab === "brief" && <RecordModule id="brief" />}
              {tab === "survey" && <RecordModule id="survey" />}
              {tab === "drawings" && <RecordModule id="drawings" />}
              {tab === "procurement" && <RecordModule id="procurement" />}
              {tab === "daily" && <RecordModule id="daily" />}
              {tab === "vo" && <RecordModule id="vo" />}
              {tab === "qc" && <RecordModule id="qc" />}
              {tab === "payment" && <RecordModule id="payment" />}
              {tab === "handover" && <RecordModule id="handover" />}
              {tab === "warranty" && <RecordModule id="warranty" />}
              {tab === "meeting" && <RecordModule id="meeting" />}
              {tab === "docs" && <RecordModule id="docs" />}
              {tab === "clients" && <ClientsPage />}
              {tab === "quotation" && <QuotationPage />}
              {tab === "imagestudio" && <ImageStudio />}
              {tab === "humandim" && <HumanDim />}
              {tab === "ai" && <AIStudio />}
              {tab === "settings" && <SettingsPage />}
            </div>
          </main>
        </div>
      </div>
    </AppCtx.Provider>
  );
}

const CONS_LOGIN_LOGO = "/logo.png";
function GoogleLogin({ onLogin }) {
  const ENVID = (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) || "";
  const [clientId, setClientId] = useState(() => (typeof window !== "undefined" && localStorage.getItem("cons:gclient")) || ENVID || "");
  const [cidInput, setCidInput] = useState("");
  const [ready, setReady] = useState(false);
  const btnRef = useRef(null);
  const decode = (t) => { try { return JSON.parse(decodeURIComponent(escape(atob((t.split(".")[1] || "").replace(/-/g, "+").replace(/_/g, "/"))))); } catch { return {}; } };
  useEffect(() => {
    if (!clientId) return;
    let n = 0;
    const iv = setInterval(() => {
      n++;
      if (window.google && window.google.accounts && window.google.accounts.id) {
        clearInterval(iv);
        try {
          window.google.accounts.id.initialize({ client_id: clientId, callback: (resp) => { const p = decode(resp.credential); if (p && p.email) onLogin({ email: p.email, name: p.name || p.email, picture: p.picture || "", plan: "Member" }); } });
          if (btnRef.current) window.google.accounts.id.renderButton(btnRef.current, { theme: "outline", size: "large", width: 280, text: "signin_with", shape: "pill" });
          setReady(true);
        } catch (e) {}
      }
      if (n > 30) clearInterval(iv);
    }, 200);
    return () => clearInterval(iv);
  }, [clientId]);
  const saveCid = () => { const v = cidInput.trim(); if (!v) return; try { localStorage.setItem("cons:gclient", v); } catch {} setClientId(v); };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "var(--bg)" }}>
      <div className="es-card" style={{ padding: 32, maxWidth: 410, width: "100%", textAlign: "center" }}>
        <img className="float" src={CONS_LOGIN_LOGO} alt="CONS" style={{ width: 104, height: 104, borderRadius: 20, marginBottom: 16, boxShadow: "0 10px 28px rgba(22,36,27,.28)" }} />
        <h2 style={{ margin: "0 0 4px", letterSpacing: 1 }}>CONS</h2>
        <p style={{ color: "var(--muted)", marginTop: 0, fontSize: 13 }}>ระบบบริหารงานออกแบบ & ก่อสร้างครบวงจร</p>
        {clientId ? (
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div ref={btnRef} />
            {!ready && <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>กำลังโหลดปุ่ม Google...</div>}
            <button className="es-btn es-btn-ghost" style={{ fontSize: 11 }} onClick={() => onLogin({ email: "guest@local", name: "ผู้ใช้ทดลอง", plan: "Member" })}>เข้าใช้แบบทดลอง</button>
          </div>
        ) : (
          <div style={{ marginTop: 18, textAlign: "left" }}>
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7, marginBottom: 10 }}>ตั้ง <b>NEXT_PUBLIC_GOOGLE_CLIENT_ID</b> บน Vercel เพื่อเปิดล็อกอิน Gmail · หรือวางชั่วคราวด้านล่าง</div>
            <input className="es-input" placeholder="xxxxx.apps.googleusercontent.com" value={cidInput} onChange={(e) => setCidInput(e.target.value)} style={{ marginBottom: 8 }} />
            <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }} onClick={saveCid}>บันทึก & เปิดล็อกอิน</button>
            <button className="es-btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => onLogin({ email: "guest@local", name: "ผู้ใช้ทดลอง", plan: "Member" })}>เข้าใช้แบบทดลอง</button>
          </div>
        )}
        <p style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 16, lineHeight: 1.5 }}>ข้อมูลของแต่ละ Gmail แยกกัน บันทึกอัตโนมัติ</p>
      </div>
    </div>
  );
}

function AuthFlow({ accounts, setAccounts, onLogin }) {
  const [view, setView] = useState("login"); // login | signup | plan | pay
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(null); // บัญชีที่เพิ่งสมัคร รอเลือกแพ็กเกจ
  const [paying, setPaying] = useState(false);

  const doLogin = () => {
    const acc = accounts.find((a) => a.email === email.trim().toLowerCase() && a.pass === pass);
    if (!acc) { setErr("อีเมลหรือรหัสผ่านไม่ถูกต้อง"); return; }
    if (!acc.active) { setPending(acc); setView("plan"); return; }
    onLogin(acc);
  };
  const doSignup = () => {
    setErr("");
    const e = email.trim().toLowerCase();
    if (!e || !e.includes("@")) { setErr("กรุณากรอกอีเมลให้ถูกต้อง"); return; }
    if (pass.length < 4) { setErr("รหัสผ่านอย่างน้อย 4 ตัวอักษร"); return; }
    if (pass !== pass2) { setErr("รหัสผ่านไม่ตรงกัน"); return; }
    if (accounts.find((a) => a.email === e)) { setErr("อีเมลนี้ถูกใช้แล้ว"); return; }
    const acc = { email: e, pass, plan: "Member", active: false };
    setAccounts((a) => [...a, acc]); setPending(acc); setView("plan");
  };
  const doPay = () => {
    setPaying(true);
    setTimeout(() => {
      setAccounts((a) => a.map((x) => x.email === pending.email ? { ...x, active: true } : x));
      onLogin({ ...pending, active: true });
    }, 1400);
  };

  const wrap = (children) => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: view === "plan" ? 460 : 400 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ width: 92, height: 92, borderRadius: 20, overflow: "hidden", display: "inline-block", boxShadow: "0 10px 30px rgba(0,0,0,.18)" }}>
          <img src={CONS_LOGO} alt="CONS" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
          <div className="head" style={{ fontWeight: 800, fontSize: 26, marginTop: 10, letterSpacing: 2 }}>CONS</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>เครื่องมือทำ BOQ &amp; ใบเสนอราคา สำหรับนักออกแบบไทย</div>
        </div>
        {children}
      </div>
    </div>
  );

  if (view === "login") return wrap(
    <div className="es-card" style={{ padding: 26 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>เข้าสู่ระบบ</h2>
      <Field label="อีเมล"><input className="es-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
      <Field label="รหัสผ่าน"><input className="es-input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doLogin()} placeholder="••••••" /></Field>
      {err && <div style={{ color: "var(--danger)", fontSize: 13, marginBottom: 10 }}>{err}</div>}
      <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={doLogin}>เข้าสู่ระบบ</button>
      <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--muted)" }}>
        ยังไม่มีบัญชี? <span style={{ color: "var(--accent)", fontWeight: 700, cursor: "pointer" }} onClick={() => { setView("signup"); setErr(""); }}>สมัครสมาชิก</span>
      </div>
      <div className="es-soft" style={{ borderRadius: 10, padding: 10, marginTop: 16, fontSize: 12, color: "var(--muted)", textAlign: "center" }}>
        ลองเดโม่: <strong>demo@cons.app</strong> / <strong>1234</strong>
      </div>
    </div>
  );

  if (view === "signup") return wrap(
    <div className="es-card" style={{ padding: 26 }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>สมัครสมาชิก</h2>
      <Field label="อีเมล"><input className="es-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></Field>
      <Field label="ตั้งรหัสผ่าน"><input className="es-input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} /></Field>
      <Field label="ยืนยันรหัสผ่าน"><input className="es-input" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} onKeyDown={(e) => e.key === "Enter" && doSignup()} /></Field>
      {err && <div style={{ color: "var(--danger)", fontSize: 13, marginBottom: 10 }}>{err}</div>}
      <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={doSignup}>ถัดไป — เลือกแพ็กเกจ</button>
      <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "var(--muted)" }}>
        มีบัญชีแล้ว? <span style={{ color: "var(--accent)", fontWeight: 700, cursor: "pointer" }} onClick={() => { setView("login"); setErr(""); }}>เข้าสู่ระบบ</span>
      </div>
    </div>
  );

  if (view === "plan") return wrap(
    <div className="es-card" style={{ padding: 26, position: "relative", overflow: "hidden" }}>
      <div className="grad-accent" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5 }} />
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <span className="es-pill grad-accent" style={{ color: "#fff" }}>แพ็กเกจสมาชิก</span>
      </div>
      <h2 style={{ margin: "10px 0 2px", fontSize: 20, textAlign: "center" }}>CONS Member</h2>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span className="head" style={{ fontSize: 40, fontWeight: 800, color: "var(--accent)" }}>159</span>
        <span style={{ color: "var(--muted)", fontWeight: 600 }}> บาท / เดือน</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {["สร้างโปรเจกต์และ BOQ ไม่จำกัด", "AI ค้นหาราคา · สร้าง BOQ · วิเคราะห์รูป", "Export PDF ไม่มีลายน้ำ เห็นค่าของ+ค่าแรง", "คลังวัสดุส่วนตัว + อัปโหลดโลโก้/ลายเซ็น", "เปลี่ยนธีม/ฟอนต์/สีตารางได้เต็มที่"].map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}><CheckCircle2 size={17} style={{ color: "var(--accent)", flexShrink: 0 }} /> {f}</div>
        ))}
      </div>
      <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "12px" }} onClick={() => setView("pay")}>สมัครสมาชิก 159 บาท/เดือน</button>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--muted)", cursor: "pointer" }} onClick={() => setView("login")}>กลับไปหน้าเข้าสู่ระบบ</div>
    </div>
  );

  // view === "pay"
  return wrap(
    <div className="es-card" style={{ padding: 26 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 18 }}>ชำระเงิน</h2>
      <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>ESTIMA Member · 159 บาท/เดือน · {pending?.email}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div className="es-chip on" style={{ flex: 1, textAlign: "center", padding: "10px" }}>บัตรเครดิต/เดบิต</div>
        <div className="es-chip" style={{ flex: 1, textAlign: "center", padding: "10px" }}>PromptPay</div>
      </div>
      <Field label="หมายเลขบัตร"><input className="es-input" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="วันหมดอายุ"><input className="es-input" placeholder="MM/YY" defaultValue="12/28" /></Field>
        <Field label="CVC"><input className="es-input" placeholder="123" defaultValue="123" /></Field>
      </div>
      <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 4 }} disabled={paying} onClick={doPay}>
        {paying ? "กำลังดำเนินการ..." : "ยืนยันชำระ 159 บาท"}
      </button>
      <div className="es-soft" style={{ borderRadius: 10, padding: 10, marginTop: 14, fontSize: 11.5, color: "var(--muted)", display: "flex", gap: 6 }}>
        <Shield size={15} style={{ flexShrink: 0 }} /> หน้านี้เป็นการจำลองการชำระเงินในตัวเดโม่ — เวอร์ชันออนไลน์จริงเชื่อมต่อ Stripe/Omise (รองรับ PromptPay) ตัดเงินจริงและต่ออายุอัตโนมัติ
      </div>
    </div>
  );
}

function Brand() {
  const { company } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(0,0,0,.08)" }}>
        <img src={company.logo || CONS_LOGIN_LOGO} alt="CONS" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div>
        <div className="head" style={{ fontWeight: 800, fontSize: 18, lineHeight: 1, letterSpacing: 2 }}>CONS</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>BOQ · ใบเสนอราคา · สัญญา</div>
      </div>
    </div>
  );
}

function makeProject({ name, client = "", type = "บ้าน", budget = 0 }, count = 0) {
  return {
    id: uid(), code: "BKK-" + new Date().getFullYear() + "-" + String(count + 1).padStart(3, "0"),
    name, type, style: "", area: 0, budget: +budget || 0, tier: "กลาง", province: "", location: "",
    status: "ร่าง", startDate: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10),
    client: { name: client || "", company: "", address: "", phone: "", email: "", taxId: "", contact: client || "", position: "", note: "" },
    settings: { vatEnabled: true, vatPct: 7, whtPct: 3, defWaste: 5, defCommission: 3, defOverhead: 8, defProfit: 15, rounding: 0, vatMode: "exclusive" },
    sections: [{ id: uid(), title: "งานทั่วไป", color: "#2f6f4f", rows: [] }],
  };
}

function ClientsPage() {
  const { projects, setProjects, activeProjectId, setActiveProjectId, setTab } = useApp();
  const [showNew, setShowNew] = useState(false);
  const [q, setQ] = useState("");
  const list = q ? projects.filter((p) => ((p.client?.name || "") + " " + p.name + " " + (p.client?.company || "")).toLowerCase().includes(q.toLowerCase())) : projects;
  const updName = (id, v) => setProjects((ps) => ps.map((p) => p.id === id ? { ...p, name: v, client: { ...p.client, name: v, contact: v } } : p));
  const updCompany = (id, v) => setProjects((ps) => ps.map((p) => p.id === id ? { ...p, client: { ...p.client, company: v } } : p));
  const updPhone = (id, v) => setProjects((ps) => ps.map((p) => p.id === id ? { ...p, client: { ...p.client, phone: v } } : p));
  const updBudget = (id, v) => setProjects((ps) => ps.map((p) => p.id === id ? { ...p, budget: v === "" ? "" : +v } : p));
  const del = (id) => { const p = projects.find((x) => x.id === id); if (p?.locked) { alert("ลูกค้าหลักนี้ลบไม่ได้"); return; } if (confirm("ลบลูกค้านี้และข้อมูลโปรเจกต์ทั้งหมด? (กู้คืนไม่ได้)")) setProjects((ps) => ps.filter((x) => x.id !== id)); };
  const create = ({ name, client, type }) => { setProjects((ps) => [makeProject({ name, client, type }, ps.length), ...ps]); setShowNew(false); };
  return (
    <div>
      <SectionHead title="รายชื่อลูกค้า" sub={`${projects.length} ราย · เพิ่ม/ลบได้ตลอด · เลือกแล้วทุกหมวดผูกตาม`}
        action={<button className="es-btn es-btn-primary" onClick={() => setShowNew(true)}><Plus size={16} /> เพิ่มลูกค้า</button>} />
      <div style={{ position: "relative", marginBottom: 16, maxWidth: 340 }}>
        <Search size={16} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted)" }} />
        <input className="es-input" style={{ paddingLeft: 34 }} placeholder="ค้นหาลูกค้า / บริษัท" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
        {list.map((p) => (
          <div key={p.id} className="es-card" style={{ padding: 16, position: "relative", border: activeProjectId === p.id ? "2px solid var(--accent)" : undefined }}>
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              {p.locked
                ? <span title="ลูกค้าหลัก ลบไม่ได้" style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}><Shield size={13} /> หลัก</span>
                : <button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 5, border: "none" }} onClick={() => del(p.id)}><Trash2 size={14} /></button>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: "color-mix(in srgb,var(--accent) 14%,transparent)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>{((p.client?.name || p.name || "?").trim()[0] || "?")}</div>
              <input className="es-cellinput l" value={p.name} onChange={(e) => updName(p.id, e.target.value)} style={{ fontWeight: 700, fontSize: 15, flex: 1, minWidth: 0 }} />
            </div>
            <label className="es-label" style={{ marginBottom: 2 }}>บริษัท / แบรนด์</label>
            <input className="es-input" value={p.client?.company || ""} onChange={(e) => updCompany(p.id, e.target.value)} placeholder="—" style={{ marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label className="es-label" style={{ marginBottom: 2 }}>โทร / Line</label>
                <input className="es-input" value={p.client?.phone || ""} onChange={(e) => updPhone(p.id, e.target.value)} placeholder="—" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="es-label" style={{ marginBottom: 2 }}>ราคาจ้างงาน (บาท)</label>
                <input className="es-input" type="number" value={p.budget ?? ""} onChange={(e) => updBudget(p.id, e.target.value)} />
              </div>
            </div>
            <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => { setActiveProjectId(p.id); setTab("boq"); }}>เลือกลูกค้านี้ & เปิดงาน</button>
          </div>
        ))}
      </div>
      {showNew && <QuickNewProject onClose={() => setShowNew(false)} onCreate={create} />}
    </div>
  );
}

function QuickNewProject({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [type, setType] = useState("บ้าน");
  const TYPES = ["บ้าน", "คอนโด", "คาเฟ่", "คลินิก", "ร้านอาหาร", "ออฟฟิศ", "โรงแรม", "บูธ", "อื่นๆ"];
  const submit = () => { if (!name.trim()) { alert("กรุณาใส่ชื่อโปรเจกต์/งาน"); return; } onCreate({ name: name.trim(), client: client.trim(), type }); };
  return (
    <div className="es-modal-bg" onClick={onClose}>
      <div className="es-card pop" style={{ padding: 24, maxWidth: 420, width: "100%" }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>สร้างลูกค้า / โปรเจกต์ใหม่</h3>
        <label className="es-label">ชื่อโปรเจกต์ / งาน</label>
        <input className="es-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น บ้านคุณสมชาย / ร้านอาหาร ABC" style={{ marginBottom: 10 }} autoFocus />
        <label className="es-label">ชื่อลูกค้า</label>
        <input className="es-input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="เช่น คุณนภัสสร วงศ์ไพศาล" style={{ marginBottom: 10 }} />
        <label className="es-label">ประเภทงาน</label>
        <select className="es-select" value={type} onChange={(e) => setType(e.target.value)} style={{ marginBottom: 18 }}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="es-btn" onClick={onClose}>ยกเลิก</button>
          <button className="es-btn es-btn-primary" onClick={submit}><Plus size={16} /> สร้างและเลือก</button>
        </div>
        <p style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>สร้างแล้วทุกหมวด (BOQ, ใบเสนอราคา, สัญญา, รายงาน ฯลฯ) จะผูกกับลูกค้านี้อัตโนมัติ · รายละเอียดเพิ่มเติมแก้ได้ในเมนูโปรเจกต์</p>
      </div>
    </div>
  );
}

function ProjectPicker() {
  const { projects, activeProject, setActiveProjectId, setProjects } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [showNew, setShowNew] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const list = q ? projects.filter((p) => (p.name + " " + (p.client?.name || "")).toLowerCase().includes(q.toLowerCase())) : projects;
  const create = ({ name, client, type }) => {
    const p = makeProject({ name, client, type }, projects.length);
    setProjects((ps) => [p, ...ps]);
    setActiveProjectId(p.id);
    setShowNew(false); setOpen(false);
  };
  return (
    <div ref={ref} style={{ position: "relative", minWidth: 0 }}>
      <div style={{ fontSize: 11, color: "var(--muted)" }}>โปรเจกต์/ลูกค้าปัจจุบัน (เชื่อมทุกหมวด)</div>
      <button onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", padding: "1px 2px", cursor: "pointer", maxWidth: 320 }}>
        <span className="head" style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {activeProject ? activeProject.name + (activeProject.client?.name ? " · " + activeProject.client.name : "") : "ยังไม่มีโปรเจกต์ — สร้างใหม่"}
        </span>
        <ChevronDown size={16} style={{ flexShrink: 0, color: "var(--muted)" }} />
      </button>
      {open && (
        <div className="es-card" style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, width: 330, maxWidth: "86vw", zIndex: 50, padding: 8, boxShadow: "0 12px 32px rgba(0,0,0,.16)", maxHeight: 440, overflow: "auto" }}>
          <div style={{ position: "relative", marginBottom: 6 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--muted)" }} />
            <input className="es-input" style={{ paddingLeft: 32, fontSize: 13 }} placeholder="ค้นหาลูกค้า / งาน" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          </div>
          {list.map((p) => (
            <div key={p.id} className="es-navrow" onClick={() => { setActiveProjectId(p.id); setOpen(false); }}
              style={{ padding: "9px 10px", borderRadius: 9, cursor: "pointer", display: "flex", flexDirection: "column", gap: 1, background: activeProject?.id === p.id ? "color-mix(in srgb,var(--accent) 12%,transparent)" : "transparent" }}>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</span>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{p.client?.name || "ไม่ระบุลูกค้า"} · {p.type}</span>
            </div>
          ))}
          {list.length === 0 && <div style={{ padding: 12, color: "var(--muted)", fontSize: 13, textAlign: "center" }}>ไม่พบ — สร้างใหม่ด้านล่าง</div>}
          <div className="es-divider" style={{ margin: "8px 4px" }} />
          <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setShowNew(true)}><Plus size={16} /> สร้างลูกค้า/โปรเจกต์ใหม่</button>
        </div>
      )}
      {showNew && <QuickNewProject onClose={() => setShowNew(false)} onCreate={create} />}
    </div>
  );
}

function TopBar({ onMenu }) {
  const { activeProject, activeProjectId, setActiveProjectId, projects, clientMode, setClientMode, setTab } = useApp();
  return (
    <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 10, background: "color-mix(in srgb, var(--bg) 85%, transparent)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)", padding: "12px 22px", display: "flex", alignItems: "center", gap: 12 }}>
      <button className="es-btn es-btn-ghost" onClick={onMenu} style={{ padding: 8 }} data-mobile-only><Menu size={18} /></button>
      <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
        <FolderKanban size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <ProjectPicker />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <button className={`es-btn ${clientMode ? "es-btn-primary" : "es-btn-ghost"}`} onClick={() => setClientMode((v) => !v)} title="ซ่อนต้นทุนจริง แสดงเฉพาะราคาขาย">
          {clientMode ? <EyeOff size={16} /> : <Eye size={16} />}<span data-hide-sm>{clientMode ? "โหมดลูกค้า" : "โหมดทำงาน"}</span>
        </button>
        <button className="es-btn es-btn-primary" onClick={() => setTab("ai")}><Sparkles size={16} /><span data-hide-sm>AI Copilot</span></button>
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */
function Dashboard() {
  const { projects, setTab, setActiveProjectId } = useApp();
  const totals = useMemo(() => {
    let value = 0, profit = 0, mat = 0, labor = 0, vat = 0, wht = 0;
    const statusCount = {};
    projects.forEach((p) => {
      const c = calcProject(p);
      value += c.net; profit += c.sumProfit; mat += c.sumMaterial; labor += c.sumLabor; vat += c.vat; wht += c.wht;
      statusCount[p.status] = (statusCount[p.status] || 0) + 1;
    });
    return { value, profit, mat, labor, vat, wht, statusCount };
  }, [projects]);

  const catData = useMemo(() => {
    const agg = {};
    projects.forEach((p) => {
      const c = calcProject(p);
      Object.entries(c.byCategory).forEach(([k, v]) => (agg[k] = (agg[k] || 0) + v));
    });
    return Object.entries(agg).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [projects]);

  const COLORS = ["#2f6f4f", "#c8a45c", "#a3683f", "#5b8def", "#8c2f2f", "#7a8b5a"];

  const KPIS = [
    { label: "โปรเจกต์ทั้งหมด", val: projects.length, suffix: "" },
    { label: "มูลค่างานรวม", val: baht(totals.value), suffix: " บาท" },
    { label: "กำไรรวมโดยประมาณ", val: baht(totals.profit), suffix: " บาท" },
    { label: "ค่าวัสดุรวม", val: baht(totals.mat), suffix: " บาท" },
    { label: "ค่าแรงรวม", val: baht(totals.labor), suffix: " บาท" },
    { label: "VAT รวม", val: baht(totals.vat), suffix: " บาท" },
  ];

  return (
    <div>
      <SectionHead title="แดชบอร์ด" sub="ภาพรวมงานทั้งหมดของสตูดิโอ" />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
        <button className="es-btn es-btn-primary" onClick={() => setTab("projects")}><Plus size={16} /> สร้าง BOQ ใหม่</button>
        <button className="es-btn" onClick={() => setTab("ai")}><ScanLine size={16} /> วิเคราะห์จากรูป</button>
        <button className="es-btn" onClick={() => setTab("ai")}><Search size={16} /> ค้นหาราคาวัสดุ</button>
        <button className="es-btn" onClick={() => setTab("library")}><Library size={16} /> เปิดคลังวัสดุ</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginBottom: 18 }}>
        {KPIS.map((k) => (
          <div key={k.label} className="es-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{k.label}</div>
            <div className="kpi">{k.val}<span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>{k.suffix}</span></div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
        <div className="es-card" style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>ค่าใช้จ่ายแยกตามหมวด</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => e.name.replace("งาน", "")}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => baht(v) + " บาท"} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="es-card" style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15 }}>โปรเจกต์ล่าสุด</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {projects.map((p) => {
              const c = calcProject(p);
              return (
                <div key={p.id} className="es-soft" style={{ borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                  onClick={() => { setActiveProjectId(p.id); setTab("boq"); }}>
                  <div className="grad-accent" style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, flexShrink: 0 }}>{p.type[0]}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.type} · {p.area} ตร.ม. · {baht(c.net)} บาท</div>
                  </div>
                  <StatusPill status={p.status} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== PROJECTS ============================== */
function Projects() {
  const { projects, setProjects, setActiveProjectId, setTab } = useApp();
  const [q, setQ] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [showNew, setShowNew] = useState(false);

  const filtered = projects.filter((p) =>
    (p.name.includes(q) || p.code.includes(q) || p.type.includes(q)) &&
    (fStatus ? p.status === fStatus : true)
  );

  const createProject = (data) => {
    const p = {
      id: uid(), code: "BKK-" + new Date().getFullYear() + "-" + String(projects.length + 1).padStart(3, "0"),
      ...data, status: "ร่าง", startDate: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10),
      client: { name: "", company: "", address: "", phone: "", email: "", taxId: "", contact: "", position: "", note: "" },
      settings: { vatEnabled: true, vatPct: 7, whtPct: 3, defWaste: 5, defCommission: 3, defOverhead: 8, defProfit: 15, rounding: 0, vatMode: "exclusive" },
      sections: [{ id: uid(), title: "งานทั่วไป", color: "#2f6f4f", rows: [] }],
    };
    setProjects((ps) => [p, ...ps]);
    setActiveProjectId(p.id); setTab("boq"); setShowNew(false);
  };
  const duplicate = (p) => setProjects((ps) => [{ ...JSON.parse(JSON.stringify(p)), id: uid(), name: p.name + " (สำเนา)", code: p.code + "-C", status: "ร่าง" }, ...ps]);
  const remove = (id) => { const t = projects.find((x) => x.id === id); if (t?.locked) { alert("ลูกค้าหลักนี้ลบไม่ได้"); return; } if (confirm("ยืนยันลบโปรเจกต์นี้?")) setProjects((ps) => ps.filter((p) => p.id !== id)); };

  return (
    <div>
      <SectionHead title="โปรเจกต์ทั้งหมด" sub={`${projects.length} โปรเจกต์ในระบบ`}
        action={<button className="es-btn es-btn-primary" onClick={() => setShowNew(true)}><Plus size={16} /> สร้างโปรเจกต์ใหม่</button>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted)" }} />
          <input className="es-input" style={{ paddingLeft: 34 }} placeholder="ค้นหาชื่อ/รหัส/ประเภทงาน" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="es-select" style={{ width: 160 }} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">ทุกสถานะ</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {filtered.map((p) => {
          const c = calcProject(p);
          return (
            <div key={p.id} className="es-card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <StatusPill status={p.status} />
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="es-btn es-btn-ghost" style={{ padding: 6 }} title="ทำสำเนา" onClick={() => duplicate(p)}><Copy size={15} /></button>
                  <button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 6 }} title="ลบ" onClick={() => remove(p.id)}><Trash2 size={15} /></button>
                </div>
              </div>
              <h3 style={{ margin: "12px 0 3px", fontSize: 16 }}>{p.name}</h3>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{p.code} · {p.type} · {p.style}</div>
              <div className="es-soft" style={{ borderRadius: 10, padding: 10, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>มูลค่าสุทธิ</span>
                <strong>{baht(c.net)} บาท</strong>
              </div>
              <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
                onClick={() => { setActiveProjectId(p.id); setTab("boq"); }}>เปิด BOQ</button>
            </div>
          );
        })}
      </div>

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} onCreate={createProject} />}
    </div>
  );
}

function NewProjectModal({ onClose, onCreate }) {
  const [f, setF] = useState({ name: "", type: "คาเฟ่", style: "Modern", area: 100, budget: 1000000, tier: "มาตรฐาน", province: "กรุงเทพมหานคร", location: "" });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  return (
    <div className="es-modal-bg" onClick={onClose}>
      <div className="es-modal" style={{ padding: 22 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>สร้างโปรเจกต์ใหม่</h2>
          <X size={20} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <Field label="ชื่อโปรเจกต์"><input className="es-input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="เช่น คอนโด Ashton 45 ตร.ม." /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="ประเภทงาน"><select className="es-select" value={f.type} onChange={(e) => set("type", e.target.value)}>{PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="สไตล์"><select className="es-select" value={f.style} onChange={(e) => set("style", e.target.value)}>{PROJECT_STYLES.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="พื้นที่ (ตร.ม.)"><input className="es-input" type="number" value={f.area} onChange={(e) => set("area", +e.target.value)} /></Field>
          <Field label="งบลูกค้า (บาท)"><input className="es-input" type="number" value={f.budget} onChange={(e) => set("budget", +e.target.value)} /></Field>
          <Field label="ระดับงาน"><select className="es-select" value={f.tier} onChange={(e) => set("tier", e.target.value)}>{TIERS.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="จังหวัด"><input className="es-input" value={f.province} onChange={(e) => set("province", e.target.value)} /></Field>
        </div>
        <Field label="สถานที่"><input className="es-input" value={f.location} onChange={(e) => set("location", e.target.value)} /></Field>
        <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} disabled={!f.name} onClick={() => onCreate(f)}>สร้างและเริ่มทำ BOQ</button>
      </div>
    </div>
  );
}

function EmptyProject() {
  const { setTab } = useApp();
  return (
    <div className="es-card" style={{ padding: 50, textAlign: "center" }}>
      <FolderKanban size={40} style={{ color: "var(--muted)", margin: "0 auto 14px" }} />
      <h3>ยังไม่ได้เลือกโปรเจกต์</h3>
      <p style={{ color: "var(--muted)" }}>เลือกหรือสร้างโปรเจกต์เพื่อเริ่มทำ BOQ</p>
      <button className="es-btn es-btn-primary" style={{ marginTop: 8 }} onClick={() => setTab("projects")}>ไปที่หน้าโปรเจกต์</button>
    </div>
  );
}

/* ============================== BOQ EDITOR ============================== */
function BOQEditor() {
  const { activeProject, updateProject, materials, clientMode, setTab } = useApp();
  const p = activeProject;
  const [subTab, setSubTab] = useState("table"); // table | info | summary
  const [filterCat, setFilterCat] = useState("");
  const [search, setSearch] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 820);

  useEffect(() => {
    const onR = () => setIsMobile(window.innerWidth < 820);
    window.addEventListener("resize", onR); return () => window.removeEventListener("resize", onR);
  }, []);

  const totals = useMemo(() => calcProject(p), [p]);

  const mut = (fn) => updateProject(p.id, fn);
  const updateRow = (sid, rid, patch) => mut((proj) => ({ ...proj, sections: proj.sections.map((s) => s.id !== sid ? s : { ...s, rows: s.rows.map((r) => r.id !== rid ? r : { ...r, ...patch }) }) }));
  const addRow = (sid) => mut((proj) => ({ ...proj, sections: proj.sections.map((s) => s.id !== sid ? s : { ...s, rows: [...s.rows, sampleRow({ category: s.title, profitPct: proj.settings.defProfit, overheadPct: proj.settings.defOverhead, commissionPct: proj.settings.defCommission, wastePct: proj.settings.defWaste })] }) }));
  const delRow = (sid, rid) => mut((proj) => ({ ...proj, sections: proj.sections.map((s) => s.id !== sid ? s : { ...s, rows: s.rows.filter((r) => r.id !== rid) }) }));
  const dupRow = (sid, rid) => mut((proj) => ({ ...proj, sections: proj.sections.map((s) => { if (s.id !== sid) return s; const i = s.rows.findIndex((r) => r.id === rid); const copy = { ...s.rows[i], id: uid() }; const rows = [...s.rows]; rows.splice(i + 1, 0, copy); return { ...s, rows }; }) }));
  const addSection = () => mut((proj) => ({ ...proj, sections: [...proj.sections, { id: uid(), title: "หมวดงานใหม่", color: "#5b8def", rows: [] }] }));
  const delSection = (sid) => { if (confirm("ลบหมวดงานนี้และรายการทั้งหมด?")) mut((proj) => ({ ...proj, sections: proj.sections.filter((s) => s.id !== sid) })); };
  const updSection = (sid, patch) => mut((proj) => ({ ...proj, sections: proj.sections.map((s) => s.id === sid ? { ...s, ...patch } : s) }));

  return (
    <div>
      <SectionHead title="BOQ Editor" sub={`${p.name} · ${p.area} ตร.ม. · ${p.tier}`}
        action={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="es-btn" onClick={() => setShowPrint(true)}><FileDown size={16} /> ออก PDF</button>
            <button className="es-btn es-btn-danger" onClick={() => { if (confirm("ลบรายการ BOQ ทั้งหมดในโปรเจกต์นี้? (กลับคืนไม่ได้)")) mut((proj) => ({ ...proj, sections: [] })); }}><Trash2 size={16} /> ล้างทั้งหมด</button>
            <button className="es-btn es-btn-primary" onClick={addSection}><Plus size={16} /> เพิ่มหมวด</button>
          </div>
        } />

      <div style={{ display: "flex", gap: 6, marginBottom: 14, borderBottom: "1px solid var(--border)" }}>
        {[["table", "ตาราง BOQ"], ["info", "ข้อมูลลูกค้า/ผู้รับจ้าง"], ["summary", "สรุปราคา"]].map(([k, l]) => (
          <button key={k} onClick={() => setSubTab(k)} style={{ border: "none", background: "none", padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 14, color: subTab === k ? "var(--accent)" : "var(--muted)", borderBottom: subTab === k ? "2px solid var(--accent)" : "2px solid transparent", fontFamily: "var(--font-body)" }}>{l}</button>
        ))}
      </div>

      {subTab === "info" && <ProjectInfo project={p} mut={mut} />}
      {subTab === "summary" && <SummaryView totals={totals} project={p} mut={mut} />}

      {subTab === "table" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 16, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
                <Search size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--muted)" }} />
                <input className="es-input" style={{ paddingLeft: 32 }} placeholder="ค้นหาในตาราง" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="es-select" style={{ width: 170 }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                <option value="">ทุกหมวด</option>
                {p.sections.map((s) => <option key={s.id}>{s.title}</option>)}
              </select>
            </div>

            {p.sections.filter((s) => !filterCat || s.title === filterCat).map((sec) => (
              <SectionBlock key={sec.id} sec={sec} search={search} isMobile={isMobile} clientMode={clientMode}
                updateRow={updateRow} addRow={addRow} delRow={delRow} dupRow={dupRow} delSection={delSection} updSection={updSection} materials={materials} />
            ))}
            {p.sections.length === 0 && (
              <div className="es-card" style={{ padding: 40, textAlign: "center" }}>
                <Table2 size={36} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
                <h3 style={{ margin: "0 0 4px" }}>ยังไม่มีรายการ BOQ</h3>
                <p style={{ color: "var(--muted)", marginTop: 0 }}>เริ่มสร้างรายการเอง หรือใช้ผู้ช่วย AI สร้างให้</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="es-btn es-btn-primary" onClick={addSection}><Plus size={16} /> เพิ่มหมวดงานแรก</button>
                  <button className="es-btn" onClick={() => setTab("ai")}><Sparkles size={16} /> ให้ AI สร้าง</button>
                </div>
              </div>
            )}
          </div>

          {!isMobile && <SummaryPanel totals={totals} project={p} clientMode={clientMode} />}
        </div>
      )}

      {isMobile && subTab === "table" && <StickyTotal totals={totals} clientMode={clientMode} />}
      {showPrint && <PrintModal project={p} totals={totals} onClose={() => setShowPrint(false)} />}
    </div>
  );
}

function SectionBlock({ sec, search, isMobile, clientMode, updateRow, addRow, delRow, dupRow, delSection, updSection, materials }) {
  const [open, setOpen] = useState(true);
  const rows = sec.rows.filter((r) => !search || (r.name + r.spec + r.category).includes(search));
  const secTotal = sec.rows.reduce((a, r) => a + calcRow(r).lineSell, 0);

  return (
    <div className="es-card" style={{ marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, borderLeft: `5px solid ${sec.color}`, background: `color-mix(in srgb, ${sec.color} 12%, var(--surface))` }}>
        <button className="es-btn es-btn-ghost" style={{ padding: 4, border: "none", background: "transparent" }} onClick={() => setOpen((v) => !v)}>{open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</button>
        <input className="es-cellinput l" style={{ fontWeight: 700, fontSize: 15, maxWidth: 220, background: "transparent" }} value={sec.title} onChange={(e) => updSection(sec.id, { title: e.target.value })} />
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {["#2f6f4f", "#c8a45c", "#a3683f", "#5b8def", "#8c2f2f", "#7a8b5a"].map((col) => (
            <button key={col} onClick={() => updSection(sec.id, { color: col })} title="เปลี่ยนสีหมวด"
              style={{ width: 16, height: 16, borderRadius: 5, background: col, border: sec.color === col ? "2px solid var(--text)" : "1px solid rgba(0,0,0,.15)", cursor: "pointer", padding: 0 }} />
          ))}
          <input type="color" value={sec.color} onChange={(e) => updSection(sec.id, { color: e.target.value })} style={{ width: 22, height: 22, border: "none", background: "none", cursor: "pointer" }} title="สีกำหนดเอง" />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <strong style={{ fontSize: 14 }}>{baht(secTotal)} ฿</strong>
          <button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 6, border: "none", background: "transparent" }} onClick={() => delSection(sec.id)} title="ลบหมวด"><Trash2 size={15} /></button>
        </div>
      </div>

      {open && (
        <>
          {isMobile ? (
            <div style={{ padding: 12 }}>
              {rows.map((r, i) => <RowCard key={r.id} r={r} idx={i + 1} sec={sec} updateRow={updateRow} delRow={delRow} dupRow={dupRow} materials={materials} clientMode={clientMode} />)}
            </div>
          ) : (
            <div className="es-scroll" style={{ maxHeight: 520 }}>
              <table className="es-table" style={{ "--head": sec.color }}>
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>#</th>
                    <th style={{ width: 50 }}>รูป</th>
                    <th className="l" style={{ minWidth: 200 }}>รายการงาน</th>
                    <th className="l" style={{ minWidth: 140 }}>สเปก/ยี่ห้อ</th>
                    <th>จำนวน</th><th>หน่วย</th>
                    {!clientMode && <th>ราคาวัสดุ/หน่วย</th>}
                    {!clientMode && <th>ค่าแรง/หน่วย</th>}
                    {!clientMode && <th>Waste%</th>}
                    <th>กำไร%</th><th>Overhead%</th><th>Com%</th>
                    {!clientMode && <th>ต้นทุนรวม</th>}
                    <th>ราคาขาย</th>
                    <th>มั่นใจ</th>
                    <th style={{ width: 70 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const c = calcRow(r);
                    return (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td><RowImage value={r.image} onChange={(v) => updateRow(sec.id, r.id, { image: v })} size={80} /></td>
                        <td className="l"><input className="es-cellinput l" value={r.name} placeholder="ชื่อรายการ" onChange={(e) => updateRow(sec.id, r.id, { name: e.target.value })} /></td>
                        <td className="l"><input className="es-cellinput l" value={r.spec} placeholder="ยี่ห้อ/รุ่น" onChange={(e) => updateRow(sec.id, r.id, { spec: e.target.value })} /></td>
                        <td><input className="es-cellinput" type="number" value={r.qty} onChange={(e) => updateRow(sec.id, r.id, { qty: +e.target.value })} /></td>
                        <td>
                          <select className="es-cellinput" style={{ textAlign: "center" }} value={r.unit} onChange={(e) => updateRow(sec.id, r.id, { unit: e.target.value })}>
                            {UNITS.map((u) => <option key={u}>{u}</option>)}
                          </select>
                        </td>
                        {!clientMode && <td><input className="es-cellinput" type="number" value={r.matUnitPrice} onChange={(e) => updateRow(sec.id, r.id, { matUnitPrice: +e.target.value })} /></td>}
                        {!clientMode && <td><input className="es-cellinput" type="number" value={r.laborUnitPrice} onChange={(e) => updateRow(sec.id, r.id, { laborUnitPrice: +e.target.value })} /></td>}
                        {!clientMode && <td><input className="es-cellinput" type="number" value={r.wastePct} onChange={(e) => updateRow(sec.id, r.id, { wastePct: +e.target.value })} /></td>}
                        <td><input className="es-cellinput" type="number" value={r.profitPct} onChange={(e) => updateRow(sec.id, r.id, { profitPct: +e.target.value })} /></td>
                        <td><input className="es-cellinput" type="number" value={r.overheadPct} onChange={(e) => updateRow(sec.id, r.id, { overheadPct: +e.target.value })} /></td>
                        <td><input className="es-cellinput" type="number" value={r.commissionPct} onChange={(e) => updateRow(sec.id, r.id, { commissionPct: +e.target.value })} /></td>
                        {!clientMode && <td style={{ color: "var(--muted)" }}>{baht(c.cost)}</td>}
                        <td><strong>{baht(c.lineSell)}</strong></td>
                        <td><ConfPill c={r.confidence} /></td>
                        <td>
                          <div style={{ display: "flex", gap: 2 }}>
                            <button className="es-btn es-btn-ghost" style={{ padding: 4, border: "none" }} onClick={() => dupRow(sec.id, r.id)} title="ทำซ้ำ"><Copy size={13} /></button>
                            <button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 4, border: "none" }} onClick={() => delRow(sec.id, r.id)} title="ลบ"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && <tr><td colSpan={20} style={{ textAlign: "center", color: "var(--muted)", padding: 20 }}>ยังไม่มีรายการ</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ padding: 12 }}>
            <button className="es-btn es-btn-ghost" onClick={() => addRow(sec.id)} style={{ borderStyle: "dashed", width: "100%", justifyContent: "center" }}><Plus size={15} /> เพิ่มรายการในหมวดนี้</button>
          </div>
        </>
      )}
    </div>
  );
}

// สร้างภาพ tile ในเครื่อง (ไล่สีจากชื่อ + ป้ายชื่อ) — ขึ้นทันทีเสมอ ไม่ต้องพึ่งเน็ต
function hashHue(s) { let h = 0; for (let i = 0; i < (s || "").length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return Math.abs(h) % 360; }
function escXml(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function localThumb(name) {
  const h = hashHue(name || "x");
  const label = escXml((name || "วัสดุ").slice(0, 20));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},48%,56%)'/><stop offset='1' stop-color='hsl(${(h + 45) % 360},52%,36%)'/></linearGradient></defs><rect width='400' height='400' fill='url(#g)'/><circle cx='200' cy='150' r='52' fill='rgba(255,255,255,.18)'/><text x='200' y='162' font-size='44' text-anchor='middle' fill='rgba(255,255,255,.9)'>🎨</text><text x='200' y='250' font-size='24' font-family='sans-serif' font-weight='bold' fill='#fff' text-anchor='middle'>${label}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// ค้นรูปถ่ายจริงจาก Pexels (ฟรี ถูกกฎหมาย) ถ้าผู้ใช้ใส่คีย์ไว้
const _imgCache = {};
async function pexelsLookup(q) {
  if (!q) return null;
  if (q in _imgCache) return _imgCache[q];
  try {
    const r = await fetch("/api/img?q=" + encodeURIComponent(q));
    const d = await r.json();
    const url = d.url || null;
    _imgCache[q] = url; return url;
  } catch { _imgCache[q] = null; return null; }
}

// รูปอัจฉริยะ: โชว์ tile ทันที → ลองรูปจริง Pexels → ถ้าไม่มีคีย์ลองรูป AI → คงไว้ที่ tile ถ้าโหลดไม่ได้
function SmartImg({ src, desc, q, style, className }) {
  const [cur, setCur] = useState(() => localThumb(desc));
  useEffect(() => {
    let alive = true;
    (async () => {
      let target = await pexelsLookup(q || desc);
      if (!target) target = src;
      if (target) { const im = new Image(); im.onload = () => { if (alive) setCur(target); }; im.src = target; }
    })();
    return () => { alive = false; };
  }, [src, desc, q]);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--surface2)", ...style }}>
      <img src={cur} alt={desc || ""} className={"lift-img " + (className || "")} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

function RowImage({ value, onChange, size = 40 }) {
  const inputRef = useRef(null);
  const [show, setShow] = useState(false);
  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // ครอปเป็นจัตุรัส 1:1 แล้วย่อเหลือ 320px เพื่อประหยัดที่เก็บ
        const s = Math.min(img.width, img.height); const out = 320;
        const cv = document.createElement("canvas"); cv.width = out; cv.height = out;
        const ctx = cv.getContext("2d");
        ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, out, out);
        onChange(cv.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  };
  return (
    <>
      {value ? (
        <img src={value} onClick={() => setShow(true)} title="คลิกเพื่อดู/เปลี่ยน"
          style={{ width: size, height: size, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: "1px solid var(--border)" }} />
      ) : (
        <button className="es-btn es-btn-ghost" style={{ padding: 0, width: size, height: size, justifyContent: "center", borderStyle: "dashed" }}
          onClick={() => inputRef.current.click()} title="เพิ่มรูป 1:1"><ImageIcon size={16} style={{ color: "var(--muted)" }} /></button>
      )}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
      {show && (
        <div className="es-modal-bg" onClick={() => setShow(false)}>
          <div className="es-card" style={{ padding: 14, maxWidth: 340 }} onClick={(e) => e.stopPropagation()}>
            <img src={value} style={{ width: "100%", borderRadius: 12, aspectRatio: "1/1", objectFit: "cover" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="es-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => { inputRef.current.click(); setShow(false); }}><Upload size={14} /> เปลี่ยนรูป</button>
              <button className="es-btn es-btn-danger" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onChange(""); setShow(false); }}><Trash2 size={14} /> ลบรูป</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RowCard({ r, idx, sec, updateRow, delRow, dupRow, clientMode }) {
  const c = calcRow(r);
  const u = (patch) => updateRow(sec.id, r.id, patch);
  return (
    <div className="row-card">
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <span className="es-pill" style={{ background: "var(--surface2)", color: "var(--muted)" }}>#{idx}</span>
        <RowImage value={r.image} onChange={(v) => u({ image: v })} size={68} />
        <input className="es-cellinput l" style={{ fontWeight: 600, flex: 1 }} value={r.name} placeholder="ชื่อรายการ" onChange={(e) => u({ name: e.target.value })} />
      </div>
      <input className="es-cellinput l" style={{ marginBottom: 8, color: "var(--muted)", fontSize: 12 }} value={r.spec} placeholder="สเปก/ยี่ห้อ" onChange={(e) => u({ spec: e.target.value })} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        <MiniField label="จำนวน"><input className="es-input" type="number" value={r.qty} onChange={(e) => u({ qty: +e.target.value })} /></MiniField>
        <MiniField label="หน่วย"><select className="es-select" value={r.unit} onChange={(e) => u({ unit: e.target.value })}>{UNITS.map((x) => <option key={x}>{x}</option>)}</select></MiniField>
        <MiniField label="กำไร%"><input className="es-input" type="number" value={r.profitPct} onChange={(e) => u({ profitPct: +e.target.value })} /></MiniField>
        {!clientMode && <MiniField label="วัสดุ/หน่วย"><input className="es-input" type="number" value={r.matUnitPrice} onChange={(e) => u({ matUnitPrice: +e.target.value })} /></MiniField>}
        {!clientMode && <MiniField label="ค่าแรง/หน่วย"><input className="es-input" type="number" value={r.laborUnitPrice} onChange={(e) => u({ laborUnitPrice: +e.target.value })} /></MiniField>}
        {!clientMode && <MiniField label="Waste%"><input className="es-input" type="number" value={r.wastePct} onChange={(e) => u({ wastePct: +e.target.value })} /></MiniField>}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <div style={{ fontSize: 13 }}>{!clientMode && <span style={{ color: "var(--muted)" }}>ทุน {baht(c.cost)} · </span>}<strong>ขาย {baht(c.lineSell)} ฿</strong></div>
        <div style={{ display: "flex", gap: 4 }}>
          <button className="es-btn es-btn-ghost" style={{ padding: 6 }} onClick={() => dupRow(sec.id, r.id)}><Copy size={14} /></button>
          <button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 6 }} onClick={() => delRow(sec.id, r.id)}><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- SUMMARY PANEL ----------------------------- */
function SummaryPanel({ totals, project, clientMode }) {
  const t = totals, s = project.settings;
  const margin = t.subtotal > 0 ? (t.sumProfit / t.subtotal) * 100 : 0;
  const health = boqHealth(project);
  return (
    <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="es-card es-greenpanel" style={{ padding: 16 }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}><Calculator size={16} /> สรุปราคา</h3>
        {!clientMode && <Line k="ค่าวัสดุรวม" v={t.sumMaterial} />}
        {!clientMode && <Line k="ค่าแรงรวม" v={t.sumLabor} />}
        {!clientMode && <Line k="ค่า Waste" v={t.sumWaste} />}
        {!clientMode && <Line k="ต้นทุนรวม" v={t.sumCost} bold />}
        {!clientMode && <Line k="ค่าคอมมิชชัน" v={t.sumCommission} />}
        {!clientMode && <Line k="Overhead" v={t.sumOverhead} />}
        {!clientMode && <Line k="กำไร" v={t.sumProfit} />}
        <div className="es-divider" style={{ margin: "8px 0" }} />
        <Line k="รวมก่อน VAT" v={t.preVat} bold />
        {s.vatEnabled && <Line k={`VAT ${s.vatPct}%`} v={t.vat} />}
        <Line k={`หัก ณ ที่จ่าย ${s.whtPct}%`} v={-t.wht} />
        <div className="es-divider" style={{ margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700 }}>ยอดสุทธิ</span>
          <span className="head es-netred" style={{ fontWeight: 800, fontSize: 20 }}>{baht(t.net)} ฿</span>
        </div>
      </div>

      {!clientMode && (
        <div className="es-card" style={{ padding: 16 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}><Shield size={15} /> BOQ Health Score</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", width: 60, height: 60 }}>
              <svg viewBox="0 0 36 36" style={{ width: 60, height: 60, transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" strokeWidth="3" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--accent)" strokeWidth="3" strokeDasharray={`${health.score} 100`} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{health.score}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", flex: 1 }}>
              <div style={{ marginBottom: 4 }}>กำไรเฉลี่ย <strong style={{ color: margin < 10 ? "var(--danger)" : "var(--accent)" }}>{margin.toFixed(1)}%</strong></div>
              {health.issues.slice(0, 3).map((x, i) => <div key={i} style={{ display: "flex", gap: 4, alignItems: "start" }}><AlertTriangle size={12} style={{ color: "var(--danger)", marginTop: 2, flexShrink: 0 }} /> {x}</div>)}
              {health.issues.length === 0 && <div style={{ display: "flex", gap: 4, color: "var(--accent)" }}><CheckCircle2 size={13} /> ครบถ้วนดี</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StickyTotal({ totals, clientMode }) {
  return (
    <div className="no-print" style={{ position: "sticky", bottom: 0, marginTop: 14, padding: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 -6px 20px rgba(0,0,0,.08)" }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>ยอดสุทธิ</div>
        <div className="head" style={{ fontWeight: 800, fontSize: 20, color: "var(--accent)" }}>{baht(totals.net)} ฿</div>
      </div>
      {!clientMode && <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>ต้นทุน {baht(totals.sumCost)}<br />กำไร {baht(totals.sumProfit)}</div>}
    </div>
  );
}

function SummaryView({ totals, project, mut }) {
  const s = project.settings;
  const setS = (patch) => mut((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
  const t = totals;
  const catData = Object.entries(t.byCategory).map(([name, value]) => ({ name: name.replace("งาน", ""), value }));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
      <div className="es-card" style={{ padding: 18 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>ตั้งค่าการคำนวณ</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span className="es-label" style={{ margin: 0 }}>คิด VAT</span>
          <label style={{ cursor: "pointer" }}><input type="checkbox" checked={s.vatEnabled} onChange={(e) => setS({ vatEnabled: e.target.checked })} /> เปิด VAT {s.vatPct}%</label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="VAT %"><input className="es-input" type="number" value={s.vatPct} onChange={(e) => setS({ vatPct: +e.target.value })} /></Field>
          <Field label="หัก ณ ที่จ่าย %"><select className="es-select" value={s.whtPct} onChange={(e) => setS({ whtPct: +e.target.value })}><option value={0}>ไม่หัก</option><option value={1}>1%</option><option value={3}>3%</option><option value={5}>5%</option></select></Field>
          <Field label="กำไร default %"><input className="es-input" type="number" value={s.defProfit} onChange={(e) => setS({ defProfit: +e.target.value })} /></Field>
          <Field label="Overhead default %"><input className="es-input" type="number" value={s.defOverhead} onChange={(e) => setS({ defOverhead: +e.target.value })} /></Field>
          <Field label="คอมมิชชัน default %"><input className="es-input" type="number" value={s.defCommission} onChange={(e) => setS({ defCommission: +e.target.value })} /></Field>
          <Field label="ปัดเศษ (บาท)"><select className="es-select" value={s.rounding} onChange={(e) => setS({ rounding: +e.target.value })}><option value={0}>ไม่ปัด</option><option value={10}>หลักสิบ</option><option value={100}>หลักร้อย</option><option value={1000}>หลักพัน</option></select></Field>
        </div>
      </div>
      <div className="es-card" style={{ padding: 18 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>สัดส่วนต้นทุนตามหมวด</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide /><YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: "var(--muted)" }} />
            <Tooltip formatter={(v) => baht(v) + " ฿"} /><Bar dataKey="value" fill="var(--accent)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ----------------------------- PROJECT INFO ----------------------------- */
function ProjectInfo({ project, mut }) {
  const { company, setCompany } = useApp();
  const c = project.client;
  const setC = (patch) => mut((p) => ({ ...p, client: { ...p.client, ...patch } }));
  const setComp = (patch) => setCompany((x) => ({ ...x, ...patch }));
  const sigRef = useRef(null);

  const uploadLogo = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setComp({ logo: r.result }); r.readAsDataURL(f); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 14 }}>
      <div className="es-card" style={{ padding: 18 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, display: "flex", gap: 6, alignItems: "center" }}><User size={16} /> ข้อมูลลูกค้า</h3>
        <Field label="ชื่อลูกค้า"><input className="es-input" value={c.name} onChange={(e) => setC({ name: e.target.value })} /></Field>
        <Field label="บริษัทลูกค้า"><input className="es-input" value={c.company} onChange={(e) => setC({ company: e.target.value })} /></Field>
        <Field label="ที่อยู่"><textarea className="es-input" rows={2} value={c.address} onChange={(e) => setC({ address: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="เบอร์โทร"><input className="es-input" value={c.phone} onChange={(e) => setC({ phone: e.target.value })} /></Field>
          <Field label="อีเมล"><input className="es-input" value={c.email} onChange={(e) => setC({ email: e.target.value })} /></Field>
          <Field label="เลขผู้เสียภาษี"><input className="es-input" value={c.taxId} onChange={(e) => setC({ taxId: e.target.value })} /></Field>
          <Field label="ผู้ติดต่อ"><input className="es-input" value={c.contact} onChange={(e) => setC({ contact: e.target.value })} /></Field>
        </div>
      </div>

      <div className="es-card" style={{ padding: 18 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, display: "flex", gap: 6, alignItems: "center" }}><Building2 size={16} /> ข้อมูลผู้รับจ้าง (บริษัทคุณ)</h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div className="es-soft" style={{ width: 60, height: 60, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {company.logo ? <img src={company.logo} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={22} style={{ color: "var(--muted)" }} />}
          </div>
          <label className="es-btn" style={{ cursor: "pointer" }}><Upload size={15} /> อัปโหลดโลโก้<input type="file" accept="image/*" hidden onChange={uploadLogo} /></label>
        </div>
        <Field label="ชื่อบริษัท"><input className="es-input" value={company.name} onChange={(e) => setComp({ name: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="เลขผู้เสียภาษี"><input className="es-input" value={company.taxId} onChange={(e) => setComp({ taxId: e.target.value })} /></Field>
          <Field label="เบอร์โทร"><input className="es-input" value={company.phone} onChange={(e) => setComp({ phone: e.target.value })} /></Field>
          <Field label="ผู้เสนอราคา"><input className="es-input" value={company.proposer} onChange={(e) => setComp({ proposer: e.target.value })} /></Field>
          <Field label="ตำแหน่ง"><input className="es-input" value={company.proposerPos} onChange={(e) => setComp({ proposerPos: e.target.value })} /></Field>
        </div>
        <Field label="ลายเซ็นผู้เสนอราคา"><SignaturePad ref={sigRef} value={company.signature} onChange={(v) => setComp({ signature: v })} /></Field>
      </div>
    </div>
  );
}

/* ----------------------------- SIGNATURE PAD ----------------------------- */
const SignaturePad = React.forwardRef(({ value, onChange }, ref) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  useEffect(() => {
    const cv = canvasRef.current; const ctx = cv.getContext("2d");
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.strokeStyle = "#111";
    if (value) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, cv.width, cv.height); img.src = value; }
  }, []);
  const pos = (e) => { const r = canvasRef.current.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
  const start = (e) => { drawing.current = true; const ctx = canvasRef.current.getContext("2d"); const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = (e) => { if (!drawing.current) return; e.preventDefault(); const ctx = canvasRef.current.getContext("2d"); const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const end = () => { if (!drawing.current) return; drawing.current = false; onChange(canvasRef.current.toDataURL()); };
  const clear = () => { const cv = canvasRef.current; cv.getContext("2d").clearRect(0, 0, cv.width, cv.height); onChange(""); };
  return (
    <div>
      <canvas ref={canvasRef} width={280} height={90} style={{ width: "100%", border: "1px dashed var(--border)", borderRadius: 10, background: "#fff", touchAction: "none", cursor: "crosshair" }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
      <button className="es-btn es-btn-ghost" style={{ marginTop: 6, fontSize: 12, padding: "5px 10px" }} onClick={clear}><X size={13} /> ล้างลายเซ็น</button>
    </div>
  );
});

/* ============================== MATERIAL LIBRARY ============================== */
function MaterialLibrary() {
  const { materials, setMaterials } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showGen, setShowGen] = useState(false);

  const filtered = materials.filter((m) => (m.name.includes(q) || (m.brand || "").includes(q) || (m.tag || "").includes(q)) && (cat ? m.cat === cat : true));
  const cats = [...new Set(materials.map((m) => m.cat))];
  const remove = (id) => setMaterials((ms) => ms.filter((m) => m.id !== id));

  return (
    <div>
      <SectionHead title="คลังวัสดุ" sub={`${materials.length} รายการ · ราคาต่ำ/กลาง/สูง + ค่าแรงติดตั้งโดยประมาณ`}
        action={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="es-btn es-btn-primary" onClick={() => setShowGen(true)}><Sparkles size={16} /> สร้างด้วย AI</button>
            <button className="es-btn" onClick={() => setShowAdd(true)}><Plus size={16} /> เพิ่มเอง</button>
          </div>
        } />
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={16} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted)" }} />
          <input className="es-input" style={{ paddingLeft: 34 }} placeholder="ค้นหาวัสดุ / ยี่ห้อ / tag" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="es-select" style={{ width: 180 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">ทุกหมวด</option>{cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
        {filtered.map((m) => (
          <div key={m.id} className="es-card" style={{ padding: 14 }}>
            <SmartImg src={m.image} desc={m.name + " " + (m.cat || "")} q={m.imgq || m.cat} style={{ width: "100%", aspectRatio: "16/9", borderRadius: 9, marginBottom: 10 }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="es-pill" style={{ background: "var(--surface2)", color: "var(--muted)" }}>{m.cat.replace("งาน", "")}</span>
              <button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 4, border: "none" }} onClick={() => remove(m.id)}><Trash2 size={14} /></button>
            </div>
            <h4 style={{ margin: "10px 0 2px", fontSize: 14 }}>{m.name}</h4>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>{m.brand} · {m.supplier}</div>
            <div className="es-soft" style={{ borderRadius: 10, padding: 10, fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>ราคา ({m.unit})</span><span><span style={{ color: "var(--muted)" }}>{baht(m.low)}</span> / <strong>{baht(m.mid)}</strong> / <span style={{ color: "var(--muted)" }}>{baht(m.high)}</span></span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>ค่าแรงติดตั้ง</span><span>{baht(m.labor)} ฿</span></div>
            </div>
          </div>
        ))}
      </div>
      {showAdd && <AddMaterialModal onClose={() => setShowAdd(false)} onAdd={(m) => { setMaterials((ms) => [{ ...m, id: uid() }, ...ms]); setShowAdd(false); }} />}
      {showGen && <GenMaterialsModal onClose={() => setShowGen(false)} onAdd={(list) => setMaterials((ms) => [...list, ...ms])} />}
    </div>
  );
}

const MAT_GEN_CATEGORIES = [
  "ลามิเนต (ทุกยี่ห้อ)", "เมลามีน", "วีเนียร์ไม้", "อะคริลิกผิวเงา", "ไม้ MDF/HMR", "ไม้อัด/ปาร์ติเกิล",
  "ไม้จริง (สัก/แดง/ยาง)", "คิ้วบัว/บัวเชิงผนัง", "คิ้วโลหะ (สแตนเลส/ทองเหลือง)", "มือจับตู้ (Handle)",
  "บานพับ (Hinge)", "รางลิ้นชัก", "ลูกล้อ/ขาปรับระดับ", "กลอน/กุญแจ", "กาว/ซิลิโคน",
  "ตะปู/สกรู/พุก", "กระเบื้องพื้น/ผนัง", "หินอ่อน/หินแกรนิต/quartz", "Solid Surface", "SPC/ไวนิล/ลามิเนตพื้น",
  "Engineered Wood/พื้นไม้", "Microcement/ปูนขัดมัน", "สีทาภายใน/สี texture", "วอลเปเปอร์", "กระจก/กระจกเงา",
  "ดาวน์ไลท์/LED", "ไฟเส้น/Linear", "โคมแขวน/Decorative", "สวิตช์/ปลั๊ก/สายไฟ", "สุขภัณฑ์/ก๊อกน้ำ",
  "ผ้าม่าน/มู่ลี่", "เฟอร์นิเจอร์ลอยตัว", "ฮาร์ดแวร์ครัว", "อุปกรณ์ Smart Home",
];

function GenMaterialsModal({ onClose, onAdd }) {
  const [cat, setCat] = useState(MAT_GEN_CATEGORIES[0]);
  const [count, setCount] = useState(15);
  const [tier, setTier] = useState("มาตรฐาน");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [err, setErr] = useState("");

  const matImg = (d) => "https://image.pollinations.ai/prompt/" + encodeURIComponent((d || cat) + ", product swatch, studio photo, square") + "?width=300&height=300&nologo=true";

  const gen = async () => {
    setLoading(true); setErr(""); setPreview([]);
    try {
      const r = await callClaude(
        `สร้างรายการวัสดุตกแต่งภายในหมวด "${cat}" จำนวน ${count} รายการ ระดับ ${tier} ตามตลาดไทยปัจจุบัน
ให้หลากหลายยี่ห้อ/รุ่น/สี ระบุขนาดจริง และราคาต่ำ/กลาง/สูง (บาท) ต่อหน่วย
ตอบ JSON: {"items":[{"name":"ชื่อ+สี/รุ่น","brand":"ยี่ห้อ","size":"ขนาด","unit":"แผ่น/ตร.ม./เมตร/ตัว/ชุด","low":0,"mid":0,"high":0,"labor":0,"imageDesc":"english keywords"}]}`,
        AI_SYS
      );
      setPreview((r.items || []).map((it) => ({ ...it, image: matImg(it.imageDesc || it.name) })));
    } catch (e) { setErr(e?.message || "เรียก AI ไม่สำเร็จ — ตรวจ API Key ในเมนูตั้งค่า"); }
    setLoading(false);
  };

  const addAll = () => {
    const list = preview.map((it) => ({ id: uid(), name: it.name + (it.size ? " (" + it.size + ")" : ""), cat, brand: it.brand || "", unit: it.unit || "แผ่น", low: it.low, mid: it.mid, high: it.high, labor: it.labor || 0, supplier: "AI", tag: cat, image: it.image, imgq: it.imageDesc }));
    onAdd(list); onClose();
  };

  return (
    <div className="es-modal-bg" onClick={onClose}>
      <div className="es-modal" style={{ padding: 22, maxWidth: 680 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 18, display: "flex", gap: 8, alignItems: "center" }}><Sparkles size={18} /> สร้างวัสดุเข้าคลังด้วย AI</h2>
          <X size={20} style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Field label="หมวดวัสดุ">
            <input className="es-input" list="matcats" value={cat} onChange={(e) => setCat(e.target.value)} />
            <datalist id="matcats">{MAT_GEN_CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="จำนวน"><select className="es-select" value={count} onChange={(e) => setCount(+e.target.value)}>{[10, 15, 20, 30].map((n) => <option key={n}>{n}</option>)}</select></Field>
          <Field label="ระดับ"><select className="es-select" value={tier} onChange={(e) => setTier(e.target.value)}>{["ประหยัด", "มาตรฐาน", "พรีเมียม"].map((t) => <option key={t}>{t}</option>)}</select></Field>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {MAT_GEN_CATEGORIES.slice(0, 12).map((c) => (
            <span key={c} className="es-chip" style={{ fontSize: 11 }} onClick={() => setCat(c)}>{c}</span>
          ))}
        </div>
        <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={gen} disabled={loading}><Sparkles size={16} /> {loading ? "กำลังสร้าง..." : `สร้าง ${count} รายการ`}</button>
        {err && <div style={{ color: "var(--danger)", marginTop: 10, fontSize: 13 }}>{err}</div>}
        {loading && <div style={{ marginTop: 12 }}><Skeleton /></div>}
        {preview.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <strong>พบ {preview.length} รายการ</strong>
              <button className="es-btn es-btn-primary" onClick={addAll}><Plus size={15} /> เพิ่มทั้งหมดเข้าคลัง</button>
            </div>
            <div style={{ maxHeight: 280, overflow: "auto" }}>
              {preview.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                  <SmartImg src={it.image} desc={it.name} q={it.imageDesc} style={{ width: 36, height: 36, borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div><div style={{ color: "var(--muted)", fontSize: 11 }}>{it.brand} · {it.size}</div></div>
                  <div style={{ textAlign: "right", whiteSpace: "nowrap" }}><strong>{baht(it.mid)}</strong> ฿/{it.unit}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>* ราคาเป็นการประเมินจาก AI ควรตรวจกับ supplier ก่อนใช้จริง · สร้างซ้ำเพื่อเพิ่มหมวดอื่นได้</div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddMaterialModal({ onClose, onAdd }) {
  const [m, setM] = useState({ name: "", cat: CATEGORIES[4], brand: "", unit: "ตร.ม.", low: 0, mid: 0, high: 0, labor: 0, supplier: "", tag: "" });
  const set = (k, v) => setM((s) => ({ ...s, [k]: v }));
  return (
    <div className="es-modal-bg" onClick={onClose}>
      <div className="es-modal" style={{ padding: 22 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><h2 style={{ margin: 0, fontSize: 18 }}>เพิ่มวัสดุเข้าคลัง</h2><X size={20} style={{ cursor: "pointer" }} onClick={onClose} /></div>
        <Field label="ชื่อวัสดุ"><input className="es-input" value={m.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="หมวด"><select className="es-select" value={m.cat} onChange={(e) => set("cat", e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label="ยี่ห้อ"><input className="es-input" value={m.brand} onChange={(e) => set("brand", e.target.value)} /></Field>
          <Field label="หน่วย"><select className="es-select" value={m.unit} onChange={(e) => set("unit", e.target.value)}>{UNITS.map((u) => <option key={u}>{u}</option>)}</select></Field>
          <Field label="Supplier"><input className="es-input" value={m.supplier} onChange={(e) => set("supplier", e.target.value)} /></Field>
          <Field label="ราคาต่ำ"><input className="es-input" type="number" value={m.low} onChange={(e) => set("low", +e.target.value)} /></Field>
          <Field label="ราคากลาง"><input className="es-input" type="number" value={m.mid} onChange={(e) => set("mid", +e.target.value)} /></Field>
          <Field label="ราคาสูง"><input className="es-input" type="number" value={m.high} onChange={(e) => set("high", +e.target.value)} /></Field>
          <Field label="ค่าแรงติดตั้ง"><input className="es-input" type="number" value={m.labor} onChange={(e) => set("labor", +e.target.value)} /></Field>
        </div>
        <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} disabled={!m.name} onClick={() => onAdd(m)}>บันทึกเข้าคลัง</button>
      </div>
    </div>
  );
}

/* ============================== AI STUDIO (real API) ============================== */
function AIStudio() {
  const [mode, setMode] = useState("chat");
  return (
    <div style={{ height: "calc(100vh - 130px)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", flexShrink: 0 }}>
        {[["chat", "ประเมินราคา (แชต)", Sparkles], ["generate", "สร้าง BOQ จากคำสั่ง", Wand2], ["image", "วิเคราะห์จากรูป", ScanLine]].map(([k, l, Ic]) => (
          <button key={k} className={`es-chip ${mode === k ? "on" : ""}`} style={{ fontSize: 13, padding: "8px 14px", display: "inline-flex", gap: 6, alignItems: "center" }} onClick={() => setMode(k)}><Ic size={15} /> {l}</button>
        ))}
      </div>
      {mode === "chat" && <AIChat />}
      {mode !== "chat" && (
        <div style={{ overflow: "auto" }}>
          {mode === "generate" && <AIGenerate />}
          {mode === "image" && <AIImage />}
        </div>
      )}
    </div>
  );
}

const AI_STARTERS = [
  "โซฟา 3 ที่นั่งหนังแท้ ราคาเท่าไหร่",
  "กระเบื้องลายหินอ่อน 60x120 ราคา/ตร.ม.",
  "เคาน์เตอร์ครัวหินควอตซ์ ราคาต่อเมตร",
  "ไม้วีเนียร์วอลนัททำตู้ ราคา/ตร.ม.",
  "ผนัง microcement สีเทา ราคา/ตร.ม.",
  "ดาวน์ไลท์ LED ราคาต่อจุด",
  "ตู้เสื้อผ้าบิวท์อิน 4 บาน ราคา",
  "พื้น SPC ลายไม้ ราคา/ตร.ม.",
];
const AI_FOLLOWUPS = ["ขอเกรดพรีเมียมกว่านี้", "ขอตัวเลือกประหยัด", "เทียบ 3 ยี่ห้อ", "รวมค่าติดตั้งด้วย", "ขนาดมาตรฐานมีอะไรบ้าง"];

function aiImg(desc) {
  const p = encodeURIComponent((desc || "interior furniture") + ", realistic product photo, clean studio background, sharp focus, detailed");
  return "https://image.pollinations.ai/prompt/" + p + "?width=512&height=512&model=turbo&nologo=true";
}

function AIChat() {
  const { activeProject, updateProject, setMaterials, setTab } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, loading]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const r = await callClaude(
        `วิเคราะห์และประเมินราคาของวัสดุ/เฟอร์นิเจอร์ตกแต่งภายในตามคำขอนี้: "${q}"
ประเมินตามตลาดไทยปัจจุบัน ถ้าเป็นเฟอร์ให้หน่วยเป็น "ตัว"/"ชุด"
ตอบ JSON: {"reply":"สรุปสั้นๆ 1-2 ประโยค","items":[{"name":"","spec":"ยี่ห้อ/รุ่น/ขนาด","cat":"หมวด","unit":"ตร.ม.","matLow":0,"matMid":0,"matHigh":0,"labor":0,"confidence":"กลาง","reason":"เหตุผลของราคาสั้นๆ","imageDesc":"english keywords for product image"}]}`,
        AI_SYS
      );
      const items = (r.items || []).map((it) => ({ ...it, image: aiImg(it.imageDesc || it.name) }));
      setMessages((m) => [...m, { role: "ai", text: r.reply || "นี่คือราคาประเมินครับ", items }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "ai", text: e?.message || "เรียก AI ไม่สำเร็จ — ตรวจ API Key ในเมนูตั้งค่า", items: [] }]);
    }
    setLoading(false);
  };

  const addBOQ = (it, key) => {
    if (!activeProject) { alert("กรุณาเลือก/สร้างโปรเจกต์ก่อน"); return; }
    updateProject(activeProject.id, (p) => {
      const sections = p.sections.length ? [...p.sections] : [{ id: uid(), title: it.cat || "งาน AI", color: "#1f5a37", rows: [] }];
      sections[0] = { ...sections[0], rows: [...sections[0].rows, sampleRow({ category: sections[0].title, name: it.name, spec: it.spec, unit: it.unit, image: it.image, matUnitPrice: it.matMid, laborUnitPrice: it.labor, wastePct: 5, profitPct: p.settings.defProfit, overheadPct: p.settings.defOverhead, commissionPct: p.settings.defCommission, confidence: it.confidence, source: "AI", note: it.reason })] };
      return { ...p, sections };
    });
    setAdded((a) => ({ ...a, [key]: (a[key] || "") + "b" }));
  };
  const addLib = (it, key) => {
    setMaterials((ms) => [{ id: uid(), name: it.name, cat: it.cat || "งานตกแต่งเฉพาะทาง", brand: it.spec || "", unit: it.unit, low: it.matLow, mid: it.matMid, high: it.matHigh, labor: it.labor, supplier: "AI", tag: "chat", image: it.image, imgq: it.imageDesc }, ...ms]);
    setAdded((a) => ({ ...a, [key]: (a[key] || "") + "l" }));
  };

  const autocomplete = input ? AI_STARTERS.filter((s) => s.includes(input) && s !== input).slice(0, 4) : [];

  return (
    <>
      {/* แชต */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: "4px 2px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 12px", color: "var(--muted)" }}>
            <div className="grad-accent float pulse-glow" style={{ width: 56, height: 56, borderRadius: 16, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Sparkles size={26} /></div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>ถามราคาวัสดุหรือเฟอร์นิเจอร์</div>
            <div style={{ fontSize: 13, marginBottom: 18 }}>พิมพ์สิ่งที่อยากรู้ราคา เดี๋ยว AI ประเมินให้พร้อมรูปและบันทึกเข้าคลังได้</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 560, margin: "0 auto" }}>
              {AI_STARTERS.map((s) => <button key={s} className="es-chip" style={{ fontSize: 12.5 }} onClick={() => send(s)}>{s}</button>)}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            {m.role === "user" ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="grad-accent" style={{ color: "#fff", padding: "9px 14px", borderRadius: "16px 16px 4px 16px", maxWidth: "80%", fontSize: 14 }}>{m.text}</div>
              </div>
            ) : (
              <div style={{ maxWidth: "92%" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <div className="grad-accent" style={{ width: 28, height: 28, borderRadius: 8, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={15} /></div>
                  <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "9px 14px", borderRadius: "16px 16px 16px 4px", fontSize: 14 }}>{m.text}</div>
                </div>
                {m.items && m.items.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10, paddingLeft: 36 }}>
                    {m.items.map((it, j) => {
                      const key = i + "-" + j;
                      return (
                        <div key={j} className="es-card pop" style={{ overflow: "hidden" }}>
                          <SmartImg src={it.image} desc={it.name} q={it.imageDesc} style={{ aspectRatio: "1/1" }} />
                          <div style={{ padding: 11 }}>
                            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{it.name} <ConfPill c={it.confidence} /></div>
                            <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 6 }}>{it.spec}</div>
                            {it.reason && <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5, marginBottom: 8 }}>💡 {it.reason}</div>}
                            <div className="es-soft" style={{ borderRadius: 8, padding: 7, fontSize: 12, marginBottom: 9, display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "var(--muted)" }}>/{it.unit}</span><strong>{baht(it.matMid)} ฿</strong>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="es-btn es-btn-primary" style={{ flex: 1, justifyContent: "center", padding: 7 }} onClick={() => addBOQ(it, key)}>{(added[key] || "").includes("b") ? <CheckCircle2 size={14} /> : <Plus size={14} />} BOQ</button>
                              <button className="es-btn" style={{ flex: 1, justifyContent: "center", padding: 7 }} onClick={() => addLib(it, key)}>{(added[key] || "").includes("l") ? <CheckCircle2 size={14} /> : <Library size={14} />} คลัง</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--muted)", paddingLeft: 36, fontSize: 13 }}><Sparkles size={15} className="es-spin" /> กำลังประเมินราคา...</div>}
        {/* คำแนะนำให้พิมพ์ต่อ หลังคำตอบ */}
        {!loading && messages.length > 0 && messages[messages.length - 1].role === "ai" && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, paddingLeft: 36, marginTop: 4 }}>
            {AI_FOLLOWUPS.map((f) => <button key={f} className="es-chip" style={{ fontSize: 12 }} onClick={() => send(f + " (จากรายการก่อนหน้า)")}>{f}</button>)}
          </div>
        )}
      </div>

      {/* แถบพิมพ์ยาวด้านล่าง (เหมือน Claude) */}
      <div style={{ flexShrink: 0, paddingTop: 10 }}>
        {autocomplete.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {autocomplete.map((s) => <button key={s} className="es-chip" style={{ fontSize: 12 }} onClick={() => setInput(s)}>{s}</button>)}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, padding: "8px 8px 8px 16px", boxShadow: "0 4px 16px rgba(0,0,0,.06)" }}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="พิมพ์วัสดุหรือเฟอร์ที่อยากรู้ราคา..." rows={1} style={{ flex: 1, border: "none", outline: "none", resize: "none", background: "transparent", fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text)", maxHeight: 100, padding: "6px 0" }} />
          <button className="es-btn es-btn-primary" style={{ borderRadius: 16, padding: "10px 16px", flexShrink: 0 }} onClick={() => send()} disabled={loading}><Sparkles size={16} /></button>
        </div>
        <div style={{ textAlign: "center", fontSize: 10.5, color: "var(--muted)", marginTop: 6 }}>ราคาเป็นการประเมินจาก AI ควรตรวจกับ supplier ก่อนใช้จริง · ต้องตั้ง API Key ในเมนูตั้งค่า</div>
      </div>
    </>
  );
}

async function callClaude(prompt, system, image) {
  const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, system, image: image || null }) });
  if (!res.ok) throw new Error("AI error " + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  const text = (data.text || "").replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

const AI_SYS = `คุณคือผู้เชี่ยวชาญประเมินราคางานตกแต่งภายในในประเทศไทย ตอบเป็น JSON เท่านั้น ไม่มีคำอธิบายนอก JSON
ทุกรายการต้องมีราคาช่วง (ต่ำ/กลาง/สูง) ตามราคาตลาดกลางไทยปัจจุบัน หน่วยที่เหมาะสม ค่าแรงติดตั้งโดยประมาณ และระดับความมั่นใจ (สูง/กลาง/ต่ำ)
อย่าฟันธงราคาเกินจริง หากไม่แน่ใจให้ตั้ง confidence เป็น "ต่ำ"`;

function AISearch() {
  const { activeProject, updateProject, setTab, materials, setMaterials } = useApp();
  const [q, setQ] = useState("ไม้ HMR 18 มม. ทำตู้เสื้อผ้า");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState({});

  // รูปวัสดุ (สร้างจากคำอธิบายอังกฤษ ไม่ต้องใช้คีย์รูป) — ผู้ใช้เปลี่ยนรูปจริงทีหลังได้
  const matImg = (desc) => "https://image.pollinations.ai/prompt/" + encodeURIComponent((desc || "interior finishing material") + ", product swatch, studio photo, top view, square") + "?width=400&height=400&nologo=true";

  const run = async () => {
    setLoading(true); setErr(""); setItems([]); setAdded({});
    try {
      const r = await callClaude(
        `วิเคราะห์และประเมินราคาของวัสดุหรือเฟอร์นิเจอร์ตกแต่งภายในต่อไปนี้: "${q}"
ให้ประเมินตามข้อมูลตลาดไทยปัจจุบัน ถ้าเป็นเฟอร์นิเจอร์ให้หน่วยเป็น "ตัว" หรือ "ชุด"
ตอบ JSON: {"items":[{"name":"ชื่อวัสดุ/เฟอร์","spec":"ยี่ห้อ/รุ่น/สเปก","cat":"หมวด","unit":"ตร.ม.","matLow":0,"matMid":0,"matHigh":0,"labor":0,"wastePct":5,"confidence":"กลาง","reason":"เหตุผล/ปัจจัยที่ทำให้ได้ราคานี้ สั้นๆ","imageDesc":"english keywords for image"}]}`,
        AI_SYS
      );
      const list = (r.items || []).map((it) => ({ ...it, image: matImg(it.imageDesc || it.name) }));
      setItems(list);
    } catch (e) { setErr(e?.message || "เรียก AI ไม่สำเร็จ — ตรวจ API Key ในเมนูตั้งค่า"); }
    setLoading(false);
  };

  const addToBOQ = (it, i) => {
    if (!activeProject) { alert("กรุณาเลือกหรือสร้างโปรเจกต์ก่อน"); return; }
    updateProject(activeProject.id, (p) => {
      const sections = p.sections.length ? [...p.sections] : [{ id: uid(), title: it.cat || "งาน AI", color: "#1f5a37", rows: [] }];
      const target = { ...sections[0], rows: [...sections[0].rows, sampleRow({ category: sections[0].title, name: it.name, spec: it.spec, unit: it.unit, image: it.image, matUnitPrice: it.matMid, laborUnitPrice: it.labor, wastePct: it.wastePct || 5, profitPct: p.settings.defProfit, overheadPct: p.settings.defOverhead, commissionPct: p.settings.defCommission, confidence: it.confidence, source: "AI " + new Date().toISOString().slice(0, 10), note: it.note })] };
      sections[0] = target;
      return { ...p, sections };
    });
    setAdded((a) => ({ ...a, [i]: (a[i] || "") + "boq" }));
  };

  const addToLib = (it, i) => {
    setMaterials((ms) => [{ id: uid(), name: it.name, cat: it.cat || "งานตกแต่งเฉพาะทาง", brand: it.spec || "", unit: it.unit, low: it.matLow, mid: it.matMid, high: it.matHigh, labor: it.labor, supplier: "AI", tag: q, image: it.image }, ...ms]);
    setAdded((a) => ({ ...a, [i]: (a[i] || "") + "lib" }));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input className="es-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder='พิมพ์วัสดุ/เฟอร์ เช่น "โซฟา 3 ที่นั่งหนังแท้" หรือ "กระเบื้องลายหินอ่อน 60x120"' onKeyDown={(e) => e.key === "Enter" && run()} />
        <button className="es-btn es-btn-primary" onClick={run} disabled={loading}><Sparkles size={16} /> {loading ? "กำลังค้นหา..." : "ค้นหา"}</button>
      </div>
      {err && <div style={{ color: "var(--danger)", marginBottom: 12 }}>{err}</div>}
      {loading && <Skeleton />}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
        {items.map((it, i) => (
          <div key={i} className="es-card" style={{ overflow: "hidden" }}>
            <div style={{ position: "relative", aspectRatio: "1/1", background: "var(--surface2)" }}>
              <img src={it.image} alt={it.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.opacity = 0.2; }} />
              <span className="es-pill" style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.6)", color: "#fff" }}><ConfPill c={it.confidence} /></span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{it.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, minHeight: 16 }}>{it.spec}</div>
              {it.reason && <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 8, lineHeight: 1.5, background: "color-mix(in srgb,var(--accent) 7%,transparent)", borderRadius: 8, padding: 8 }}>💡 {it.reason}</div>}
              <div className="es-soft" style={{ borderRadius: 9, padding: 8, fontSize: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--muted)" }}>ราคา/{it.unit}</span><strong>{baht(it.matMid)} ฿</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)" }}><span>ช่วง {baht(it.matLow)}–{baht(it.matHigh)}</span><span>แรง {baht(it.labor)}</span></div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="es-btn es-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "8px" }} onClick={() => addToBOQ(it, i)}>
                  {(added[i] || "").includes("boq") ? <CheckCircle2 size={15} /> : <Plus size={15} />} BOQ
                </button>
                <button className="es-btn" style={{ flex: 1, justifyContent: "center", padding: "8px" }} onClick={() => addToLib(it, i)}>
                  {(added[i] || "").includes("lib") ? <CheckCircle2 size={15} /> : <Library size={15} />} คลัง
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button className="es-btn" onClick={() => setTab("boq")}>ไปดูใน BOQ →</button>
          <button className="es-btn" onClick={() => setTab("library")}>ไปดูคลังวัสดุ →</button>
        </div>
      )}
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>* รูปเป็นภาพประกอบที่ AI สร้างจากคำอธิบายวัสดุ เปลี่ยนเป็นรูปจริงได้ที่ช่องรูปในตาราง BOQ</div>
    </div>
  );
}

function AIGenerate() {
  const { setProjects, setActiveProjectId, setTab } = useApp();
  const [q, setQ] = useState("ทำ BOQ คาเฟ่ 120 ตร.ม. สไตล์ญี่ปุ่น งบ 3 ล้านบาท");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const run = async () => {
    setLoading(true); setErr(""); setResult(null);
    try {
      const r = await callClaude(
        `สร้าง BOQ ร่างจากคำสั่ง: "${q}"
ตอบ JSON: {"projectName":"","sections":[{"title":"หมวดงาน","rows":[{"name":"","spec":"","qty":0,"unit":"ตร.ม.","matMid":0,"labor":0,"wastePct":5,"confidence":"กลาง"}]}],"warnings":["ข้อควรระวัง"],"notes":"สรุป"}
ใส่หมวดงานให้ครบตามประเภทงาน ราคาตามตลาดไทย`,
        AI_SYS
      );
      setResult(r);
    } catch (e) { setErr("เรียก AI ไม่สำเร็จ ลองใหม่อีกครั้ง"); }
    setLoading(false);
  };

  const createFromResult = () => {
    const sections = result.sections.map((s) => ({
      id: uid(), title: s.title, color: "#2f6f4f",
      rows: s.rows.map((r) => sampleRow({ category: s.title, name: r.name, spec: r.spec, qty: r.qty, unit: r.unit, matUnitPrice: r.matMid, laborUnitPrice: r.labor, wastePct: r.wastePct || 5, profitPct: 15, overheadPct: 8, commissionPct: 3, confidence: r.confidence, source: "AI Generated" })),
    }));
    const p = {
      id: uid(), code: "AI-" + new Date().getFullYear() + "-" + uid().slice(0, 3).toUpperCase(),
      name: result.projectName || "โปรเจกต์จาก AI", type: "คาเฟ่", style: "Japandi", area: 120, budget: 3000000, tier: "พรีเมียม",
      province: "กรุงเทพมหานคร", location: "", status: "ร่าง", startDate: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10),
      client: { name: "", company: "", address: "", phone: "", email: "", taxId: "", contact: "", position: "", note: "" },
      settings: { vatEnabled: true, vatPct: 7, whtPct: 3, defWaste: 5, defCommission: 3, defOverhead: 8, defProfit: 15, rounding: 0, vatMode: "exclusive" },
      sections,
    };
    setProjects((ps) => [p, ...ps]); setActiveProjectId(p.id); setTab("boq");
  };

  return (
    <div>
      <textarea className="es-input" rows={2} value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 10 }} />
      <button className="es-btn es-btn-primary" onClick={run} disabled={loading}><Wand2 size={16} /> {loading ? "กำลังสร้าง..." : "สร้าง BOQ ร่าง"}</button>
      {err && <div style={{ color: "var(--danger)", marginTop: 12 }}>{err}</div>}
      {loading && <div style={{ marginTop: 16 }}><Skeleton /></div>}
      {result && (
        <div className="es-card" style={{ padding: 18, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>{result.projectName}</h3>
          {result.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong>{s.title}</strong> <span style={{ color: "var(--muted)", fontSize: 12 }}>({s.rows.length} รายการ)</span>
              <ul style={{ margin: "4px 0", paddingLeft: 18, fontSize: 13, color: "var(--muted)" }}>
                {s.rows.slice(0, 4).map((r, j) => <li key={j}>{r.name} — {baht(r.matMid)} ฿/{r.unit}</li>)}
              </ul>
            </div>
          ))}
          {result.warnings?.length > 0 && (
            <div style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", borderRadius: 10, padding: 12, fontSize: 13, marginBottom: 12 }}>
              <strong>⚠️ ข้อควรระวัง</strong>
              <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>{result.warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          )}
          <button className="es-btn es-btn-primary" onClick={createFromResult}><Plus size={15} /> สร้างโปรเจกต์จากร่างนี้</button>
        </div>
      )}
    </div>
  );
}

function AIImage() {
  const { activeProject, updateProject, setTab } = useApp();
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [area, setArea] = useState(20);
  const [tier, setTier] = useState("มาตรฐาน");
  const [err, setErr] = useState("");

  const onFile = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setImg({ url: r.result, data: r.result.split(",")[1], media: f.type }); r.readAsDataURL(f); };

  const run = async () => {
    if (!img) return; setLoading(true); setErr(""); setResult(null);
    try {
      const r = await callClaude(
        `วิเคราะห์ห้องในรูปนี้ พื้นที่ประมาณ ${area} ตร.ม. ระดับงาน ${tier}
ตอบ JSON: {"roomType":"","detected":["งานที่เห็น"],"items":[{"name":"","spec":"","qty":0,"unit":"","matMid":0,"labor":0,"confidence":""}],"estLow":0,"estMid":0,"estHigh":0,"missing":["รายการที่อาจขาด"]}`,
        AI_SYS, img
      );
      setResult(r);
    } catch (e) { setErr("เรียก AI ไม่สำเร็จ ลองใหม่อีกครั้ง"); }
    setLoading(false);
  };

  const addAll = () => {
    if (!activeProject) { alert("เลือกโปรเจกต์ก่อน"); return; }
    updateProject(activeProject.id, (p) => {
      const sections = [...p.sections];
      const target = sections[0];
      target.rows = [...target.rows, ...result.items.map((it) => sampleRow({ category: target.title, name: it.name, spec: it.spec, qty: it.qty, unit: it.unit, matUnitPrice: it.matMid, laborUnitPrice: it.labor, profitPct: p.settings.defProfit, overheadPct: p.settings.defOverhead, confidence: it.confidence, source: "AI Image" }))];
      sections[0] = target; return { ...p, sections };
    });
    setTab("boq");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
      <div className="es-card" style={{ padding: 16 }}>
        {img ? <img src={img.url} style={{ width: "100%", borderRadius: 12, marginBottom: 12 }} /> :
          <label style={{ display: "block", border: "2px dashed var(--border)", borderRadius: 12, padding: 40, textAlign: "center", cursor: "pointer", marginBottom: 12 }}>
            <ScanLine size={32} style={{ color: "var(--muted)", margin: "0 auto 10px" }} />
            <div>อัปโหลด/ถ่ายรูปห้อง · 3D render · moodboard</div>
            <input type="file" accept="image/*" hidden onChange={onFile} />
          </label>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="พื้นที่ ตร.ม."><input className="es-input" type="number" value={area} onChange={(e) => setArea(+e.target.value)} /></Field>
          <Field label="ระดับงาน"><select className="es-select" value={tier} onChange={(e) => setTier(e.target.value)}>{TIERS.map((t) => <option key={t}>{t}</option>)}</select></Field>
        </div>
        <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} disabled={!img || loading} onClick={run}><Sparkles size={16} /> {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ BOQ จากรูป"}</button>
      </div>
      <div>
        {err && <div style={{ color: "var(--danger)" }}>{err}</div>}
        {loading && <Skeleton />}
        {result && (
          <div className="es-card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div><div style={{ fontSize: 12, color: "var(--muted)" }}>{result.roomType}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>ราคาประเมิน</div></div>
              <div className="head" style={{ fontWeight: 800, fontSize: 18, color: "var(--accent)" }}>{baht(result.estMid)} ฿</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>ช่วง {baht(result.estLow)} – {baht(result.estHigh)} บาท</div>
            {result.items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
                <span>{it.name} <ConfPill c={it.confidence} /></span><span>{baht(it.matMid)} ฿</span>
              </div>
            ))}
            {result.missing?.length > 0 && <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 10 }}>⚠️ อาจขาด: {result.missing.join(", ")}</div>}
            <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={addAll}><Plus size={15} /> เพิ่มทั้งหมดเข้า BOQ</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== SETTINGS / THEME ============================== */
function SettingsPage() {
  const { themeKey, setThemeKey, fontKey, setFontKey, customTheme, setCustomTheme } = useApp();
  const setC = (k, v) => setCustomTheme((t) => ({ ...t, [k]: v }));
  const CUSTOM_FIELDS = [["accent", "สีหลัก"], ["accent2", "สีรอง"], ["bg", "พื้นหลัง"], ["surface", "พื้นการ์ด"], ["text", "ตัวอักษร"], ["head", "หัวตาราง"], ["headText", "อักษรหัวตาราง"], ["border", "เส้นขอบ"]];
  return (
    <div>
      <SectionHead title="ตั้งค่า / ธีม" sub="ปรับแต่งหน้าตาแอปให้เป็นของคุณเอง — ข้อมูลทั้งหมดบันทึกอัตโนมัติ" />
      <div className="es-card" style={{ padding: 18, marginBottom: 14 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, display: "flex", gap: 6, alignItems: "center" }}><Palette size={16} /> ธีมสี</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>
          {Object.entries(THEMES).map(([k, t]) => (
            <div key={k} onClick={() => setThemeKey(k)} style={{ border: themeKey === k ? `2px solid ${t.accent}` : "1px solid var(--border)", borderRadius: 12, padding: 12, cursor: "pointer", background: t.surface }}>
              <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                {[t.bg, t.accent, t.accent2, t.head].map((c, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 6, background: c, border: "1px solid rgba(0,0,0,.1)" }} />)}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{t.name}</div>
            </div>
          ))}
          <div onClick={() => setThemeKey("custom")} style={{ border: themeKey === "custom" ? `2px solid ${customTheme.accent}` : "1px solid var(--border)", borderRadius: 12, padding: 12, cursor: "pointer", background: customTheme.surface }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              {[customTheme.bg, customTheme.accent, customTheme.accent2, customTheme.head].map((c, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 6, background: c, border: "1px solid rgba(0,0,0,.1)" }} />)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: customTheme.text }}>🎨 ธีมของฉัน</div>
          </div>
        </div>
      </div>

      {themeKey === "custom" && (
        <div className="es-card" style={{ padding: 18, marginBottom: 14 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15 }}>ปรับแต่งสีเอง</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12 }}>
            {CUSTOM_FIELDS.map(([k, label]) => (
              <div key={k}>
                <label className="es-label">{label}</label>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="color" value={customTheme[k]} onChange={(e) => setC(k, e.target.value)} style={{ width: 40, height: 34, border: "none", background: "none", cursor: "pointer" }} />
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{customTheme[k]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="es-card" style={{ padding: 18 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 15, display: "flex", gap: 6, alignItems: "center" }}><TypeIcon size={16} /> ฟอนต์</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10 }}>
          {Object.entries(FONTS).map(([k, f]) => (
            <div key={k} onClick={() => setFontKey(k)} style={{ border: fontKey === k ? "2px solid var(--accent)" : "1px solid var(--border)", borderRadius: 12, padding: 14, cursor: "pointer" }}>
              <div style={{ fontFamily: f.head, fontSize: 18, fontWeight: 700, marginBottom: 2 }}>ตัวอย่าง Aa</div>
              <div style={{ fontFamily: f.body, fontSize: 13, color: "var(--muted)" }}>{f.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== PDF / PRINT ============================== */
/* ============================== TEMPLATE DESIGNER (Canva-like) ============================== */
const TPL_FONTS = [
  ["'Noto Sans Thai',sans-serif", "Noto Sans Thai"],
  ["'IBM Plex Sans Thai',sans-serif", "IBM Plex Sans Thai"],
  ["'Sarabun',sans-serif", "Sarabun"],
  ["'Mali',cursive", "Mali (ลายมือ)"],
];
const PALETTES = [
  ["#ff1f8e", "#ffd400"], ["#2f6f4f", "#c8a45c"], ["#1a1a1a", "#d4af37"],
  ["#5b8def", "#22c1c3"], ["#a3683f", "#7a8b5a"], ["#8c2f2f", "#e0a458"], ["#6d28d9", "#ec4899"],
];

function TemplateDesigner() {
  const { templates, setTemplates, activeTemplateId, setActiveTemplateId, company, DEFAULT_TEMPLATE } = useApp();
  const [editId, setEditId] = useState(activeTemplateId);
  const tpl = templates.find((t) => t.id === editId) || templates[0];
  const upd = (patch) => setTemplates((ts) => ts.map((t) => (t.id === tpl.id ? { ...t, ...patch } : t)));
  const addTpl = () => { const id = "tpl-" + uid(); setTemplates((ts) => [...ts, { ...clone(DEFAULT_TEMPLATE), id, name: "เทมเพลตใหม่" }]); setEditId(id); };
  const del = (id) => { if (templates.length <= 1) { alert("ต้องมีอย่างน้อย 1 เทมเพลต"); return; } if (confirm("ลบเทมเพลตนี้?")) { setTemplates((ts) => ts.filter((t) => t.id !== id)); setEditId(templates[0].id); } };

  const Toggle = ({ k, label }) => (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", fontSize: 14, cursor: "pointer" }}>
      {label}
      <input type="checkbox" checked={tpl[k]} onChange={(e) => upd({ [k]: e.target.checked })} />
    </label>
  );

  return (
    <div>
      <SectionHead title="ออกแบบเทมเพลต PDF" sub="ปรับแต่งหน้าตาใบเสนอราคาได้อิสระเหมือน Canva — บันทึกไว้ใช้ซ้ำได้ไม่จำกัด"
        action={<button className="es-btn es-btn-primary" onClick={addTpl}><Plus size={16} /> สร้างเทมเพลตใหม่</button>} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {templates.map((t) => (
          <div key={t.id} onClick={() => setEditId(t.id)} className="es-chip" style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "8px 12px", background: editId === t.id ? "var(--accent)" : "var(--surface)", color: editId === t.id ? "#fff" : "var(--text)", border: editId === t.id ? "1px solid var(--accent)" : "1px solid var(--border)" }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: t.accent }} />
            {t.name}
            {activeTemplateId === t.id && <CheckCircle2 size={14} />}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, alignItems: "start" }}>
        {/* Controls */}
        <div className="es-card" style={{ padding: 18 }}>
          <Field label="ชื่อเทมเพลต"><input className="es-input" value={tpl.name} onChange={(e) => upd({ name: e.target.value })} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="ชื่อเอกสาร (ไทย)"><input className="es-input" value={tpl.docTitle} onChange={(e) => upd({ docTitle: e.target.value })} /></Field>
            <Field label="ชื่อเอกสาร (อังกฤษ)"><input className="es-input" value={tpl.docTitleEn} onChange={(e) => upd({ docTitleEn: e.target.value })} /></Field>
          </div>
          <label className="es-label">ชุดสีสำเร็จรูป</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {PALETTES.map(([a, b], i) => (
              <button key={i} onClick={() => upd({ accent: a, accent2: b })} title="ใช้ชุดสีนี้"
                style={{ width: 38, height: 26, borderRadius: 7, border: tpl.accent === a ? "2px solid var(--text)" : "1px solid var(--border)", background: `linear-gradient(90deg,${a},${b})`, cursor: "pointer" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="สีหลัก"><input type="color" value={tpl.accent} onChange={(e) => upd({ accent: e.target.value })} style={{ width: "100%", height: 36, border: "none", background: "none" }} /></Field>
            <Field label="สีรอง"><input type="color" value={tpl.accent2} onChange={(e) => upd({ accent2: e.target.value })} style={{ width: "100%", height: 36, border: "none", background: "none" }} /></Field>
            <Field label="สีตัวอักษรหัวตาราง"><input type="color" value={tpl.headerText} onChange={(e) => upd({ headerText: e.target.value })} style={{ width: "100%", height: 36, border: "none", background: "none" }} /></Field>
          </div>
          <Field label="ฟอนต์เอกสาร"><select className="es-select" value={tpl.font} onChange={(e) => upd({ font: e.target.value })}>{TPL_FONTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
          <div className="es-divider" style={{ margin: "8px 0 4px" }} />
          <Toggle k="showCover" label="มีหน้าปก" />
          <Toggle k="showLogo" label="แสดงโลโก้บริษัท" />
          <Toggle k="accentBar" label="แถบสีหัวกระดาษ" />
          <Toggle k="showImages" label="แสดงรูปประกอบรายการ" />
          <Toggle k="showCostBreakdown" label="แยกค่าวัสดุ / ค่าแรง (โหมดผู้รับเหมา)" />
          <Field label="เงื่อนไข (ขึ้นบรรทัดใหม่ได้)"><textarea className="es-input" rows={4} value={tpl.terms} onChange={(e) => upd({ terms: e.target.value })} /></Field>
          <Field label="ข้อความท้ายกระดาษ"><input className="es-input" value={tpl.footerText} onChange={(e) => upd({ footerText: e.target.value })} /></Field>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button className="es-btn es-btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setActiveTemplateId(tpl.id)}><CheckCircle2 size={16} /> ใช้เทมเพลตนี้</button>
            <button className="es-btn es-btn-danger" onClick={() => del(tpl.id)}><Trash2 size={16} /></button>
          </div>
        </div>

        {/* Live preview */}
        <div className="es-card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>ตัวอย่างสด</div>
          <div style={{ background: "#fff", color: "#1a1a1a", borderRadius: 10, padding: 18, fontFamily: tpl.font, boxShadow: "0 4px 18px rgba(0,0,0,.08)" }}>
            {tpl.accentBar && <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg,${tpl.accent},${tpl.accent2})`, marginBottom: 14 }} />}
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${tpl.accent}`, paddingBottom: 10, marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {tpl.showLogo && <div style={{ width: 34, height: 34, borderRadius: 7, background: `linear-gradient(135deg,${tpl.accent},${tpl.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>C</div>}
                <div style={{ fontWeight: 800, fontSize: 13 }}>{company.name}</div>
              </div>
              <div style={{ fontWeight: 800, color: tpl.accent }}>{tpl.docTitle}</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead><tr style={{ background: tpl.accent, color: tpl.headerText }}>
                {tpl.showImages && <th style={{ padding: 4 }}>รูป</th>}
                <th style={{ padding: 4, textAlign: "left" }}>รายการ</th>
                {tpl.showCostBreakdown && <th style={{ padding: 4 }}>วัสดุ</th>}
                {tpl.showCostBreakdown && <th style={{ padding: 4 }}>ค่าแรง</th>}
                <th style={{ padding: 4 }}>รวม</th>
              </tr></thead>
              <tbody>
                <tr style={{ background: tpl.accent2, color: "#1a1a1a" }}><td colSpan={6} style={{ padding: 3, fontWeight: 700 }}>งานพื้น</td></tr>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  {tpl.showImages && <td style={{ padding: 3, textAlign: "center" }}><div style={{ width: 22, height: 22, borderRadius: 4, background: "#eee", margin: "0 auto" }} /></td>}
                  <td style={{ padding: 3 }}>กระเบื้องแกรนิตโต้</td>
                  {tpl.showCostBreakdown && <td style={{ padding: 3, textAlign: "right" }}>76,000</td>}
                  {tpl.showCostBreakdown && <td style={{ padding: 3, textAlign: "right" }}>28,000</td>}
                  <td style={{ padding: 3, textAlign: "right", fontWeight: 600 }}>124,000</td>
                </tr>
              </tbody>
            </table>
            <div style={{ textAlign: "right", marginTop: 8, fontWeight: 800, color: tpl.accent }}>ยอดสุทธิ 124,000 ฿</div>
            <div style={{ fontSize: 9, color: "#777", marginTop: 8, whiteSpace: "pre-line" }}>{tpl.terms}</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>ไปที่หน้า BOQ → ปุ่ม “ออก PDF” เพื่อใช้เทมเพลตที่เลือกกับโปรเจกต์จริง</div>
        </div>
      </div>
    </div>
  );
}

/* ============================== CONTRACT STUDIO ============================== */
const LEGAL_NOTES = [
  { t: "ประเภทของสัญญา — “จ้างทำของ”", d: "งานออกแบบและตกแต่งภายในส่วนใหญ่จัดเป็นสัญญาจ้างทำของตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 587 เป็นต้นไป ผู้รับจ้างมุ่งผลสำเร็จของงานเป็นสำคัญ และมีหน้าที่ส่งมอบงานให้ถูกต้องตามแบบที่ตกลง" },
  { t: "ลิขสิทธิ์ในแบบและงานออกแบบ", d: "แบบ ภาพ render และงานออกแบบได้รับความคุ้มครองเป็นงานศิลปกรรม/สถาปัตยกรรมตาม พ.ร.บ.ลิขสิทธิ์ พ.ศ. 2537 ควรระบุชัดว่าลิขสิทธิ์ในแบบยังเป็นของผู้ออกแบบจนกว่าจะชำระค่าจ้างครบ และห้ามนำแบบไปใช้กับผู้รับเหมารายอื่นโดยไม่ได้รับอนุญาต" },
  { t: "การควบคุมอาคาร / การดัดแปลง", d: "หากงานตกแต่งกระทบโครงสร้าง เปลี่ยนการใช้พื้นที่ หรือดัดแปลงอาคาร อาจต้องขออนุญาตตาม พ.ร.บ.ควบคุมอาคาร พ.ศ. 2522 ควรระบุผู้รับผิดชอบการขออนุญาตในสัญญา" },
  { t: "วิชาชีพควบคุม (สถาปนิก/วิศวกร/มัณฑนากร)", d: "งานบางประเภท เช่น โครงสร้าง อาคารสาธารณะ หรืออาคารขนาดใหญ่ ต้องมีผู้ได้รับใบอนุญาตประกอบวิชาชีพตาม พ.ร.บ.สถาปนิก พ.ศ. 2543 และ พ.ร.บ.วิศวกร พ.ศ. 2542 ลงนามรับรอง สถาปัตยกรรมภายใน (มัณฑนากร) เป็นสาขาภายใต้สภาสถาปนิก" },
  { t: "ภาษีและการหัก ณ ที่จ่าย", d: "ค่าจ้างทำของ/บริการโดยทั่วไปถูกหักภาษี ณ ที่จ่าย 3% (กรณีผู้ว่าจ้างเป็นนิติบุคคล) และมี VAT 7% หากผู้รับจ้างจด VAT ควรระบุให้ชัดว่าราคารวมหรือไม่รวมภาษี" },
  { t: "การรับประกันและความรับผิด", d: "ควรระบุระยะเวลารับประกันงาน (ที่นิยมคือ 1 ปีนับจากส่งมอบ) ขอบเขตการรับประกัน และข้อยกเว้น เช่น ความเสียหายจากการใช้งานผิดวิธีหรือภัยธรรมชาติ" },
  { t: "การเปลี่ยนแปลงงาน (Variation) และเหตุสุดวิสัย", d: "ระบุวิธีคิดราคางานเพิ่ม/ลด การอนุมัติเป็นลายลักษณ์อักษร และข้อยกเว้นความรับผิดกรณีเหตุสุดวิสัยตามมาตรา 8 และ 219 แห่ง ป.พ.พ." },
  { t: "การคุ้มครองผู้บริโภค", d: "หากผู้ว่าจ้างเป็นผู้บริโภค ข้อสัญญาต้องเป็นธรรมตาม พ.ร.บ.คุ้มครองผู้บริโภค และ พ.ร.บ.ว่าด้วยข้อสัญญาที่ไม่เป็นธรรม พ.ศ. 2540 ข้อกำหนดที่เอาเปรียบเกินสมควรอาจใช้บังคับไม่ได้" },
];

function buildContract(f) {
  return `สัญญาว่าจ้างออกแบบและตกแต่งภายใน

ทำที่ ${f.place || "____________"}
วันที่ ${f.date || "____________"}

สัญญานี้ทำขึ้นระหว่าง
${f.ownerName || "____________"} ${f.ownerAddr ? "ที่อยู่ " + f.ownerAddr : ""} ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้ว่าจ้าง” ฝ่ายหนึ่ง
กับ ${f.contractorName || "____________"} ${f.contractorAddr ? "ที่อยู่ " + f.contractorAddr : ""} ซึ่งต่อไปในสัญญานี้เรียกว่า “ผู้รับจ้าง” อีกฝ่ายหนึ่ง

ทั้งสองฝ่ายตกลงทำสัญญากันมีข้อความดังต่อไปนี้

ข้อ 1. ขอบเขตของงาน
ผู้รับจ้างตกลงรับออกแบบและ/หรือตกแต่งภายใน โครงการ “${f.projectName || "____________"}”
สถานที่ ${f.site || "____________"} พื้นที่ประมาณ ${f.area || "____"} ตารางเมตร
โดยมีขอบเขตงานตามแบบ ใบเสนอราคา และ BOQ แนบท้ายสัญญา ซึ่งถือเป็นส่วนหนึ่งของสัญญานี้
${f.scope ? "รายละเอียดเพิ่มเติม: " + f.scope : ""}

ข้อ 2. ค่าจ้างและการชำระเงิน
ค่าจ้างรวมทั้งสิ้น ${f.fee ? Number(f.fee).toLocaleString("th-TH") : "____________"} บาท (${f.feeText || "____________"})
${f.vatNote || "ราคาดังกล่าว (รวม/ไม่รวม) ภาษีมูลค่าเพิ่ม 7% และผู้ว่าจ้างมีสิทธิหักภาษี ณ ที่จ่ายตามกฎหมาย"}
แบ่งชำระเป็นงวดดังนี้
${f.payment || "งวดที่ 1 มัดจำ 50% เมื่อลงนามสัญญา\nงวดที่ 2 จำนวน 30% เมื่องานคืบหน้า 50%\nงวดที่ 3 จำนวน 20% เมื่อส่งมอบงานเรียบร้อย"}

ข้อ 3. ระยะเวลาดำเนินงาน
เริ่มงานวันที่ ${f.startDate || "________"} และส่งมอบงานภายในวันที่ ${f.endDate || "________"}
รวมระยะเวลา ${f.duration || "____"} วัน โดยไม่นับรวมวันหยุดตามประเพณีและกรณีเหตุสุดวิสัย

ข้อ 4. การเปลี่ยนแปลงงาน
การเพิ่ม ลด หรือเปลี่ยนแปลงงานนอกเหนือจากแบบ ต้องได้รับความเห็นชอบเป็นลายลักษณ์อักษรจากทั้งสองฝ่าย
และคิดราคาตามอัตราที่ตกลงกันก่อนดำเนินการ

ข้อ 5. วัสดุและมาตรฐานงาน
ผู้รับจ้างจะใช้วัสดุตามสเปกที่ระบุใน BOQ หากวัสดุที่ระบุขาดตลาด ผู้รับจ้างจะเสนอวัสดุทดแทนคุณภาพเทียบเท่า
และต้องได้รับอนุมัติจากผู้ว่าจ้างก่อน

ข้อ 6. การรับประกันผลงาน
ผู้รับจ้างรับประกันความชำรุดบกพร่องอันเกิดจากฝีมือแรงงานเป็นเวลา ${f.warranty || "1 ปี"} นับจากวันส่งมอบ
โดยไม่รวมความเสียหายจากการใช้งานผิดวิธี การดัดแปลงโดยบุคคลอื่น หรือภัยธรรมชาติ

ข้อ 7. ลิขสิทธิ์ในแบบ
แบบ ภาพทัศนียภาพ และเอกสารออกแบบทั้งหมดเป็นลิขสิทธิ์ของผู้รับจ้างตามกฎหมายลิขสิทธิ์
ผู้ว่าจ้างจะได้สิทธิใช้แบบเพื่อโครงการนี้เมื่อชำระค่าจ้างครบถ้วน และจะไม่นำแบบไปใช้กับผู้รับเหมารายอื่นโดยไม่ได้รับอนุญาต

ข้อ 8. ค่าปรับและการบอกเลิกสัญญา
หากผู้รับจ้างส่งมอบงานล่าช้ากว่ากำหนดโดยไม่มีเหตุอันควร ผู้ว่าจ้างมีสิทธิเรียกค่าปรับวันละ ${f.penalty || "0.1%"} ของค่าจ้าง
หากฝ่ายใดผิดสัญญาในสาระสำคัญและไม่แก้ไขภายใน 15 วันหลังได้รับแจ้งเป็นหนังสือ อีกฝ่ายมีสิทธิบอกเลิกสัญญา

ข้อ 9. เหตุสุดวิสัย
หากการปฏิบัติตามสัญญาเป็นพ้นวิสัยเพราะเหตุสุดวิสัย คู่สัญญาไม่ต้องรับผิดในความล่าช้าหรือเสียหายที่เกิดจากเหตุนั้น

ข้อ 10. การระงับข้อพิพาท
หากมีข้อพิพาท คู่สัญญาจะเจรจาโดยสุจริตก่อน หากตกลงกันไม่ได้ ให้นำข้อพิพาทขึ้นสู่ศาลที่มีเขตอำนาจตามกฎหมายไทย

สัญญานี้ทำขึ้นสองฉบับมีข้อความตรงกัน คู่สัญญาได้อ่านและเข้าใจโดยตลอดแล้ว จึงลงลายมือชื่อไว้เป็นสำคัญ


ลงชื่อ ____________________ ผู้ว่าจ้าง        ลงชื่อ ____________________ ผู้รับจ้าง
   (${f.ownerName || "____________"})                 (${f.contractorName || "____________"})


ลงชื่อ ____________________ พยาน              ลงชื่อ ____________________ พยาน`;
}

function ContractStudio() {
  const { activeProject, company, contracts, setContracts } = useApp();
  const [tab, setTab] = useState("draft"); // draft | legal
  const [f, setF] = useState(() => ({
    place: company.address || "กรุงเทพมหานคร", date: new Date().toLocaleDateString("th-TH"),
    ownerName: activeProject?.client?.name || "", ownerAddr: activeProject?.client?.address || "",
    contractorName: company.name, contractorAddr: company.address,
    projectName: activeProject?.name || "", site: activeProject?.location || "", area: activeProject?.area || "",
    fee: "", feeText: "", scope: "", payment: "", vatNote: "", startDate: "", endDate: "", duration: "",
    warranty: "1 ปี", penalty: "0.1%",
  }));
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const [body, setBody] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const generate = () => setBody(buildContract(f));

  const aiImprove = async () => {
    setAiLoading(true);
    try {
      const r = await callClaude(
        `ปรับปรุงร่างสัญญาว่าจ้างออกแบบตกแต่งภายในนี้ให้รัดกุมขึ้นตามกฎหมายไทย (จ้างทำของ/ลิขสิทธิ์/ควบคุมอาคาร) เพิ่มข้อที่ควรมีแต่ยังขาด คงภาษาทางการ ตอบ JSON {"contract":"ข้อความสัญญาฉบับเต็ม"}\n\nร่างเดิม:\n${body || buildContract(f)}`,
        "คุณคือนักกฎหมายไทยที่เชี่ยวชาญสัญญาก่อสร้างและตกแต่งภายใน ตอบ JSON เท่านั้น"
      );
      if (r.contract) setBody(r.contract);
    } catch (e) { alert("เรียก AI ไม่สำเร็จ ลองใหม่"); }
    setAiLoading(false);
  };

  return (
    <div>
      <SectionHead title="ร่างสัญญาออกแบบตกแต่งภายใน" sub="สร้างสัญญาฉบับเต็ม + ปรับด้วย AI + ข้อมูลกฎหมายที่ควรรู้" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
        {[["draft", "ร่างสัญญา"], ["legal", "ข้อกฎหมายควรรู้"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ border: "none", background: "none", padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 14, color: tab === k ? "var(--accent)" : "var(--muted)", borderBottom: tab === k ? "2px solid var(--accent)" : "2px solid transparent", fontFamily: "var(--font-body)" }}>{l}</button>
        ))}
      </div>

      {tab === "legal" && (
        <div>
          <div style={{ background: "color-mix(in srgb, var(--accent2) 14%, transparent)", border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, display: "flex", gap: 8 }}>
            <AlertTriangle size={16} style={{ color: "var(--accent2)", flexShrink: 0, marginTop: 2 }} />
            ข้อมูลนี้เป็นความรู้ทั่วไป ไม่ใช่คำแนะนำทางกฎหมายรายกรณี สำหรับงานมูลค่าสูงหรือมีความเสี่ยง ควรปรึกษาทนายความหรือสภาสถาปนิก
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
            {LEGAL_NOTES.map((n, i) => (
              <div key={i} className="es-card" style={{ padding: 16 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "start", marginBottom: 6 }}>
                  <div className="grad-accent" style={{ width: 24, height: 24, borderRadius: 7, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>{i + 1}</div>
                  <strong style={{ fontSize: 14 }}>{n.t}</strong>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{n.d}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "draft" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16, alignItems: "start" }}>
          <div className="es-card" style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0, fontSize: 15 }}>ข้อมูลสัญญา</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="ชื่อผู้ว่าจ้าง"><input className="es-input" value={f.ownerName} onChange={(e) => set("ownerName", e.target.value)} /></Field>
              <Field label="ชื่อผู้รับจ้าง"><input className="es-input" value={f.contractorName} onChange={(e) => set("contractorName", e.target.value)} /></Field>
              <Field label="ชื่อโครงการ"><input className="es-input" value={f.projectName} onChange={(e) => set("projectName", e.target.value)} /></Field>
              <Field label="พื้นที่ (ตร.ม.)"><input className="es-input" value={f.area} onChange={(e) => set("area", e.target.value)} /></Field>
              <Field label="ค่าจ้างรวม (บาท)"><input className="es-input" type="number" value={f.fee} onChange={(e) => set("fee", e.target.value)} /></Field>
              <Field label="ตัวอักษร (บาทถ้วน)"><input className="es-input" value={f.feeText} onChange={(e) => set("feeText", e.target.value)} placeholder="เช่น หนึ่งล้านบาทถ้วน" /></Field>
              <Field label="วันเริ่มงาน"><input className="es-input" value={f.startDate} onChange={(e) => set("startDate", e.target.value)} /></Field>
              <Field label="วันส่งมอบ"><input className="es-input" value={f.endDate} onChange={(e) => set("endDate", e.target.value)} /></Field>
              <Field label="ระยะเวลา (วัน)"><input className="es-input" value={f.duration} onChange={(e) => set("duration", e.target.value)} /></Field>
              <Field label="รับประกัน"><input className="es-input" value={f.warranty} onChange={(e) => set("warranty", e.target.value)} /></Field>
            </div>
            <Field label="งวดการชำระเงิน (ขึ้นบรรทัดใหม่ได้)"><textarea className="es-input" rows={3} value={f.payment} onChange={(e) => set("payment", e.target.value)} placeholder="เว้นว่างเพื่อใช้ค่าเริ่มต้น 50/30/20" /></Field>
            <Field label="ขอบเขตงานเพิ่มเติม"><textarea className="es-input" rows={2} value={f.scope} onChange={(e) => set("scope", e.target.value)} /></Field>
            <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={generate}><PenLine size={16} /> สร้างร่างสัญญา</button>
          </div>

          <div className="es-card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>ร่างสัญญา</h3>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="es-btn" onClick={aiImprove} disabled={aiLoading || !body}><Sparkles size={15} /> {aiLoading ? "AI..." : "ปรับด้วย AI"}</button>
                <button className="es-btn es-btn-primary" onClick={() => setShowPrint(true)} disabled={!body}><FileDown size={15} /> PDF</button>
              </div>
            </div>
            <textarea className="es-input" rows={20} value={body} onChange={(e) => setBody(e.target.value)} placeholder="กดปุ่ม “สร้างร่างสัญญา” เพื่อสร้างเนื้อหา แล้วแก้ไขได้อิสระ" style={{ fontFamily: "var(--font-body)", lineHeight: 1.7, fontSize: 13 }} />
            {body && <button className="es-btn es-btn-ghost" style={{ marginTop: 8 }} onClick={() => { const id = uid(); setContracts((c) => [{ id, title: f.projectName || "สัญญา", body, date: new Date().toISOString().slice(0, 10) }, ...c]); alert("บันทึกสัญญาแล้ว"); }}><Save size={14} /> บันทึกสัญญา</button>}
          </div>
        </div>
      )}

      {showPrint && (
        <div className="es-modal-bg" onClick={() => setShowPrint(false)}>
          <div style={{ background: "var(--surface)", borderRadius: 14, width: "100%", maxWidth: 760, maxHeight: "92vh", overflow: "auto", padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>ตัวอย่างสัญญา</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="es-btn es-btn-primary" onClick={() => window.print()}><FileDown size={16} /> พิมพ์ / บันทึก PDF</button>
                <button className="es-btn" onClick={() => setShowPrint(false)}><X size={16} /></button>
              </div>
            </div>
            <div id="print-area" style={{ background: "#fff", color: "#1a1a1a", padding: 44, fontFamily: "'Sarabun',sans-serif", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{body}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== CONSTRUCTION SCHEDULE ============================== */
const PHASES = ["เตรียมงาน / รื้อถอน", "งานโครงสร้าง / ผนัง", "งานระบบ (ไฟ-ประปา-แอร์)", "งานฝ้า / พื้น", "งานสี / ผิวสำเร็จ", "งานบิวท์อิน / เฟอร์นิเจอร์", "ติดตั้ง / เก็บงาน", "ทำความสะอาด / ส่งมอบ"];
const PHASE_COLORS = ["#1f5a37", "#2f6f4f", "#5b8def", "#c8a45c", "#a3683f", "#8c5a2f", "#6d28d9", "#16241b"];
const dParse = (s) => (s ? new Date(s + "T00:00:00") : null);
const dayDiff = (a, b) => Math.round((b - a) / 86400000);
const fmtD = (s) => (s ? new Date(s + "T00:00:00").toLocaleDateString("th-TH", { day: "numeric", month: "short" }) : "—");

function ScheduleStudio() {
  const { activeProject, updateProject } = useApp();
  const p = activeProject;
  const tasks = p.schedule || [];
  const mut = (fn) => updateProject(p.id, fn);
  const add = () => mut((pr) => ({ ...pr, schedule: [...(pr.schedule || []), { id: uid(), name: "งานใหม่", phase: PHASES[0], start: "", end: "", responsible: "", progress: 0, note: "", color: PHASE_COLORS[(pr.schedule || []).length % PHASE_COLORS.length] }] }));
  const upd = (id, patch) => mut((pr) => ({ ...pr, schedule: (pr.schedule || []).map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  const del = (id) => mut((pr) => ({ ...pr, schedule: (pr.schedule || []).filter((t) => t.id !== id) }));
  const [showPrint, setShowPrint] = useState(false);

  const valid = tasks.filter((t) => t.start && t.end);
  const allD = valid.flatMap((t) => [dParse(t.start), dParse(t.end)]);
  const minD = allD.length ? new Date(Math.min(...allD)) : null;
  const maxD = allD.length ? new Date(Math.max(...allD)) : null;
  const span = minD && maxD ? Math.max(1, dayDiff(minD, maxD)) : 1;
  const bar = (t) => {
    const s = dParse(t.start), e = dParse(t.end);
    if (!s || !e || !minD) return null;
    return { left: (dayDiff(minD, s) / span) * 100, width: Math.max(2, (dayDiff(s, e) / span) * 100) };
  };

  return (
    <div>
      <SectionHead title="แผนงานก่อสร้าง (Construction Schedule)" sub={`${p.name} · ${tasks.length} กิจกรรม`}
        action={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="es-btn" onClick={() => setShowPrint(true)} disabled={!tasks.length}><FileDown size={16} /> ออก PDF</button>
            <button className="es-btn es-btn-primary" onClick={add}><Plus size={16} /> เพิ่มกิจกรรม</button>
          </div>
        } />

      {/* Gantt */}
      {valid.length > 0 && (
        <div className="es-card es-scroll" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
            <span>{minD?.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</span>
            <strong>รวม {span} วัน</strong>
            <span>{maxD?.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          <div style={{ minWidth: 520 }}>
            {valid.map((t) => {
              const b = bar(t);
              return (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <div style={{ width: 150, fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{t.name}</div>
                  <div style={{ flex: 1, position: "relative", height: 20, background: "var(--surface2)", borderRadius: 999 }}>
                    <div style={{ position: "absolute", left: b.left + "%", width: b.width + "%", top: 0, bottom: 0, background: t.color, borderRadius: 999, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.25)", transition: "left .4s ease, width .4s ease, background .2s" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (t.progress || 0) + "%", background: "rgba(255,255,255,.4)" }} />
                    </div>
                  </div>
                  <div style={{ width: 36, textAlign: "right", fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>{t.progress || 0}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail editor */}
      <div className="es-card es-scroll" style={{ padding: 0, overflow: "auto" }}>
        <table className="es-table" style={{ "--head": "var(--accent)" }}>
          <thead>
            <tr>
              <th style={{ width: 30 }}>#</th>
              <th className="l" style={{ minWidth: 160 }}>กิจกรรม</th>
              <th className="l">เฟส / หมวด</th>
              <th>เริ่ม</th><th>สิ้นสุด</th><th>วัน</th>
              <th className="l">ผู้รับผิดชอบ</th>
              <th>คืบหน้า%</th>
              <th className="l">หมายเหตุ</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => {
              const dur = t.start && t.end ? dayDiff(dParse(t.start), dParse(t.end)) : "";
              return (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td className="l"><input className="es-cellinput l" value={t.name} onChange={(e) => upd(t.id, { name: e.target.value })} /></td>
                  <td className="l">
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input type="color" value={t.color || "#1f5a37"} onChange={(e) => upd(t.id, { color: e.target.value })} title="เลือกสีแถบ" style={{ width: 26, height: 26, border: "1px solid var(--border)", borderRadius: 6, padding: 0, cursor: "pointer", flexShrink: 0, background: "none" }} />
                      <select className="es-cellinput l" value={t.phase} onChange={(e) => { const idx = PHASES.indexOf(e.target.value); upd(t.id, { phase: e.target.value, color: PHASE_COLORS[idx] || t.color }); }}>
                        {PHASES.map((ph) => <option key={ph}>{ph}</option>)}
                      </select>
                    </div>
                  </td>
                  <td><input className="es-cellinput" type="date" value={t.start} onChange={(e) => upd(t.id, { start: e.target.value })} style={{ textAlign: "center" }} /></td>
                  <td><input className="es-cellinput" type="date" value={t.end} onChange={(e) => upd(t.id, { end: e.target.value })} style={{ textAlign: "center" }} /></td>
                  <td style={{ color: "var(--muted)" }}>{dur}</td>
                  <td className="l"><input className="es-cellinput l" value={t.responsible} placeholder="ทีม/ผู้รับเหมา" onChange={(e) => upd(t.id, { responsible: e.target.value })} /></td>
                  <td><input className="es-cellinput" type="number" value={t.progress} onChange={(e) => upd(t.id, { progress: Math.max(0, Math.min(100, +e.target.value)) })} /></td>
                  <td className="l"><input className="es-cellinput l" value={t.note} onChange={(e) => upd(t.id, { note: e.target.value })} /></td>
                  <td><button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 4, border: "none" }} onClick={() => del(t.id)}><Trash2 size={14} /></button></td>
                </tr>
              );
            })}
            {tasks.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>ยังไม่มีกิจกรรม — กด “เพิ่มกิจกรรม” เพื่อเริ่มวางแผนงาน</td></tr>}
          </tbody>
        </table>
      </div>

      {showPrint && <SchedulePrint project={p} tasks={tasks} gantt={{ minD, maxD, span, bar }} onClose={() => setShowPrint(false)} />}
    </div>
  );
}

function SchedulePrint({ project, tasks, gantt, onClose }) {
  const { company } = useApp();
  const [pageSize, setPageSize] = useState("A4");
  const [orient, setOrient] = useState("landscape");
  const today = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  const valid = tasks.filter((t) => t.start && t.end);
  return (
    <div className="es-modal-bg" onClick={onClose}>
      <style>{`@page { size: ${pageSize} ${orient}; margin: 12mm; }`}</style>
      <div style={{ background: "var(--surface)", borderRadius: 14, width: "100%", maxWidth: orient === "landscape" ? 980 : 800, maxHeight: "92vh", overflow: "auto", padding: 16 }} onClick={(e) => e.stopPropagation()}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>ตัวอย่างแผนงาน</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <select className="es-select" style={{ width: 90 }} value={pageSize} onChange={(e) => setPageSize(e.target.value)}><option>A4</option><option>A3</option></select>
            <select className="es-select" style={{ width: 130 }} value={orient} onChange={(e) => setOrient(e.target.value)}><option value="landscape">แนวนอน</option><option value="portrait">แนวตั้ง</option></select>
            <button className="es-btn es-btn-primary" onClick={() => window.print()}><FileDown size={16} /> พิมพ์ / PDF</button>
            <button className="es-btn" onClick={onClose}><X size={16} /></button>
          </div>
        </div>
        <div id="print-area" style={{ background: "#fff", color: "#1a1a1a", padding: 30, fontFamily: "'Sarabun',sans-serif", fontSize: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #1f5a37", paddingBottom: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10 }}>
              {company.logo && <img src={company.logo} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />}
              <div><div style={{ fontWeight: 800, fontSize: 16 }}>{company.name}</div><div style={{ fontSize: 11, color: "#666" }}>แผนงานก่อสร้าง · Construction Schedule</div></div>
            </div>
            <div style={{ textAlign: "right", fontSize: 11 }}><div style={{ fontWeight: 700, fontSize: 14, color: "#1f5a37" }}>{project.name}</div>{project.type} · {project.area} ตร.ม.<br />วันที่ {today}</div>
          </div>
          {/* Gantt for print */}
          {valid.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#666", marginBottom: 6 }}>
                <span>{gantt.minD?.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</span>
                <strong>รวม {gantt.span} วัน</strong>
                <span>{gantt.maxD?.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</span>
              </div>
              {valid.map((t) => {
                const b = gantt.bar(t);
                return (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 140, fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                    <div style={{ flex: 1, position: "relative", height: 16, background: "#eee", borderRadius: 4 }}>
                      <div style={{ position: "absolute", left: b.left + "%", width: b.width + "%", top: 0, bottom: 0, background: t.color, borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Detail table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
            <thead><tr style={{ background: "#1f5a37", color: "#fff" }}>
              <th style={{ padding: 6, width: 24 }}>#</th>
              <th style={{ padding: 6, textAlign: "left" }}>กิจกรรม</th>
              <th style={{ padding: 6, textAlign: "left" }}>เฟส</th>
              <th style={{ padding: 6 }}>เริ่ม</th><th style={{ padding: 6 }}>สิ้นสุด</th><th style={{ padding: 6 }}>วัน</th>
              <th style={{ padding: 6, textAlign: "left" }}>ผู้รับผิดชอบ</th><th style={{ padding: 6 }}>คืบหน้า</th><th style={{ padding: 6, textAlign: "left" }}>หมายเหตุ</th>
            </tr></thead>
            <tbody>
              {tasks.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 5, textAlign: "center" }}>{i + 1}</td>
                  <td style={{ padding: 5 }}>{t.name}</td>
                  <td style={{ padding: 5 }}>{t.phase}</td>
                  <td style={{ padding: 5, textAlign: "center" }}>{fmtD(t.start)}</td>
                  <td style={{ padding: 5, textAlign: "center" }}>{fmtD(t.end)}</td>
                  <td style={{ padding: 5, textAlign: "center" }}>{t.start && t.end ? dayDiff(dParse(t.start), dParse(t.end)) : "—"}</td>
                  <td style={{ padding: 5 }}>{t.responsible}</td>
                  <td style={{ padding: 5, textAlign: "center" }}>{t.progress || 0}%</td>
                  <td style={{ padding: 5 }}>{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================== LEGAL LIBRARY ============================== */
const LEGAL_LIBRARY = [
  {
    cat: "1. สัญญาและการรับเหมา (กฎหมายแพ่ง)",
    items: [
      { t: "สัญญาจ้างทำของ — ป.พ.พ. มาตรา 587–607", d: "งานออกแบบและตกแต่งภายในส่วนใหญ่จัดเป็น “สัญญาจ้างทำของ” ผู้รับจ้างมุ่งผลสำเร็จของงานเป็นสำคัญ และมีหน้าที่ส่งมอบงานให้ถูกต้องตามแบบและสเปกที่ตกลง หากวัสดุเป็นของผู้รับจ้าง ผู้รับจ้างต้องจัดหาวัสดุที่มีคุณภาพดี" },
      { t: "ความรับผิดในความชำรุดบกพร่อง", d: "ตาม ป.พ.พ. มาตรา 600 หากเป็นสิ่งปลูกสร้างกับพื้นดิน ผู้รับจ้างอาจต้องรับผิดในความชำรุดบกพร่องที่ปรากฏภายใน 5 ปีนับแต่ส่งมอบ (งานทั่วไป 1 ปี) และตามมาตรา 601 ผู้ว่าจ้างต้องฟ้องภายใน 1 ปีนับแต่ความชำรุดปรากฏ จึงควรระบุระยะรับประกันให้ชัดในสัญญา" },
      { t: "เบี้ยปรับ ค่าเสียหาย และการบอกเลิกสัญญา", d: "คู่สัญญากำหนดเบี้ยปรับกรณีส่งงานล่าช้าได้ (ม.379–385) แต่ศาลมีอำนาจลดเบี้ยปรับที่สูงเกินส่วนได้ การบอกเลิกสัญญาต้องมีเหตุผิดสัญญาในสาระสำคัญและบอกกล่าวให้แก้ไขก่อนตามสมควร" },
      { t: "เหตุสุดวิสัย", d: "ตาม ป.พ.พ. มาตรา 8 และ 219 หากการชำระหนี้กลายเป็นพ้นวิสัยเพราะเหตุสุดวิสัยที่ไม่อาจป้องกันได้ ลูกหนี้ไม่ต้องรับผิดในความเสียหายที่เกิดจากเหตุนั้น ควรระบุนิยามเหตุสุดวิสัยในสัญญา" },
    ],
  },
  {
    cat: "2. การควบคุมอาคารและการขออนุญาต",
    items: [
      { t: "พ.ร.บ.ควบคุมอาคาร พ.ศ. 2522", d: "การก่อสร้าง ดัดแปลง รื้อถอน หรือเปลี่ยนการใช้อาคาร ต้องขออนุญาตหรือแจ้งต่อเจ้าพนักงานท้องถิ่น งานตกแต่งภายในที่ไม่กระทบโครงสร้างหลัก น้ำหนัก หรือพื้นที่อาคาร โดยทั่วไปไม่ต้องขออนุญาต แต่หากทุบผนังรับน้ำหนัก ต่อเติมพื้นที่ เพิ่ม/ลดชั้น หรือเปลี่ยนประเภทการใช้อาคาร (เช่น บ้านเป็นร้านอาหาร) ต้องขออนุญาต การฝ่าฝืนมีโทษปรับและอาจถูกสั่งรื้อถอน" },
      { t: "ข้อกำหนดด้านความปลอดภัยอาคารสาธารณะ", d: "ร้านอาหาร คาเฟ่ คลินิก โรงแรม ต้องเป็นไปตามกฎกระทรวงเรื่องทางหนีไฟ ความกว้างทางเดิน ระบบป้องกันอัคคีภัย แสงสว่างฉุกเฉิน และระยะร่น ควรตรวจสอบก่อนออกแบบเพื่อไม่ให้เปิดใช้งานไม่ได้" },
      { t: "การตกแต่งในอาคารชุด/คอนโด — พ.ร.บ.อาคารชุด พ.ศ. 2522", d: "การตกแต่งในห้องชุดต้องขออนุญาตและปฏิบัติตามข้อบังคับของนิติบุคคลอาคารชุด เช่น เวลาทำงาน การใช้ลิฟต์ขนของ การจัดการเสียง/ฝุ่น/เศษวัสดุ และห้ามแตะต้องโครงสร้างหรือพื้นที่ส่วนกลาง ควรขออนุมัติแบบกับนิติบุคคลก่อนเริ่มงาน" },
    ],
  },
  {
    cat: "3. วิชาชีพควบคุม (สถาปนิก / วิศวกร / มัณฑนากร)",
    items: [
      { t: "พ.ร.บ.สถาปนิก พ.ศ. 2543", d: "งานสถาปัตยกรรมควบคุมมี 4 สาขา ได้แก่ สถาปัตยกรรมหลัก สถาปัตยกรรมผังเมือง ภูมิสถาปัตยกรรม และสถาปัตยกรรมภายในและมัณฑนศิลป์ งานออกแบบภายในบางประเภท/ขนาดเป็นงานควบคุมที่ต้องมีผู้ได้รับใบอนุญาตจากสภาสถาปนิกลงนามรับรองแบบ" },
      { t: "พ.ร.บ.วิศวกร พ.ศ. 2542", d: "งานวิศวกรรมควบคุม เช่น งานโครงสร้าง งานไฟฟ้ากำลัง ระบบปรับอากาศขนาดใหญ่ ต้องมีวิศวกรผู้ได้รับใบอนุญาตออกแบบ/ควบคุมงาน หากงานตกแต่งเกี่ยวข้องกับการแก้ไขโครงสร้างหรือระบบไฟฟ้าหลักต้องให้วิศวกรรับรอง" },
      { t: "โทษการประกอบวิชาชีพโดยไม่มีใบอนุญาต", d: "การออกแบบหรือควบคุมงานในขอบเขตวิชาชีพควบคุมโดยไม่มีใบอนุญาตมีความผิดตามกฎหมาย ผู้ออกแบบจึงควรร่วมงานกับสถาปนิก/วิศวกรที่มีใบอนุญาตเมื่องานเข้าข่ายควบคุม" },
    ],
  },
  {
    cat: "4. ลิขสิทธิ์และทรัพย์สินทางปัญญา",
    items: [
      { t: "พ.ร.บ.ลิขสิทธิ์ พ.ศ. 2537 — งานออกแบบ", d: "แบบ แปลน ภาพทัศนียภาพ (render) และโมเดล ได้รับความคุ้มครองเป็นงานศิลปกรรม/สถาปัตยกรรมโดยอัตโนมัติ ไม่ต้องจดทะเบียน" },
      { t: "ใครเป็นเจ้าของลิขสิทธิ์ในงานจ้าง (สำคัญมาก)", d: "ตามมาตรา 10 กรณี “จ้างทำของ” ลิขสิทธิ์ตกเป็นของ “ผู้ว่าจ้าง” เว้นแต่ตกลงกันเป็นอย่างอื่น ดังนั้นหากนักออกแบบต้องการคงสิทธิ์ในแบบของตน ต้องระบุในสัญญาให้ชัดว่า “ลิขสิทธิ์ในแบบยังเป็นของผู้ออกแบบ และผู้ว่าจ้างได้สิทธิใช้เฉพาะโครงการนี้เมื่อชำระครบ”" },
      { t: "การนำแบบไปใช้ต่อ", d: "ผู้ว่าจ้างไม่ควรนำแบบไปก่อสร้างซ้ำหรือส่งให้ผู้รับเหมารายอื่นโดยไม่ได้รับอนุญาต หากสัญญาสงวนสิทธิ์ไว้ การละเมิดอาจถูกเรียกค่าเสียหายและดำเนินคดีได้" },
    ],
  },
  {
    cat: "5. ภาษีและการเงิน",
    items: [
      { t: "ภาษีมูลค่าเพิ่ม (VAT 7%)", d: "ผู้ประกอบการที่มีรายได้เกิน 1.8 ล้านบาท/ปี ต้องจดทะเบียน VAT และออกใบกำกับภาษี ควรระบุในใบเสนอราคาว่าราคารวมหรือไม่รวม VAT เพื่อความชัดเจน" },
      { t: "ภาษีหัก ณ ที่จ่าย", d: "เมื่อผู้ว่าจ้างเป็นนิติบุคคล ค่าจ้างทำของ/รับเหมาก่อสร้างถูกหักภาษี ณ ที่จ่าย 3% ค่าบริการ/วิชาชีพ 3% และค่าเช่า 5% ผู้รับจ้างจะได้หนังสือรับรองการหักภาษีไปใช้เครดิตได้ ส่วนผู้ว่าจ้างที่เป็นบุคคลธรรมดาทั่วไปไม่มีหน้าที่หัก" },
      { t: "เอกสารการเงิน", d: "ควรจัดทำใบเสนอราคา ใบวางบิล ใบแจ้งหนี้ ใบเสร็จ/ใบกำกับภาษีให้ครบถ้วน เก็บหลักฐานการรับ-จ่ายตามงวด เพื่อใช้ทางบัญชีและป้องกันข้อพิพาท" },
    ],
  },
  {
    cat: "6. ความปลอดภัย แรงงาน และสิ่งแวดล้อม",
    items: [
      { t: "พ.ร.บ.ความปลอดภัย อาชีวอนามัยฯ พ.ศ. 2554", d: "นายจ้าง/ผู้รับเหมาต้องจัดสภาพแวดล้อมการทำงานให้ปลอดภัย จัดอุปกรณ์ป้องกันส่วนบุคคล และปฏิบัติตามกฎเฉพาะของงานเสี่ยง เช่น งานบนที่สูง งานไฟฟ้า งานเชื่อม และที่อับอากาศ" },
      { t: "กฎหมายแรงงานและประกันสังคม", d: "ต้องจ่ายค่าจ้างไม่ต่ำกว่าค่าจ้างขั้นต่ำ ขึ้นทะเบียนประกันสังคมให้ลูกจ้าง และดูแลความรับผิดกรณีจ้างผู้รับเหมาช่วง (ผู้ว่าจ้างอาจร่วมรับผิดในค่าจ้างของลูกจ้างผู้รับเหมาช่วง)" },
      { t: "การจัดการเศษวัสดุและมลภาวะ", d: "ต้องจัดการเศษวัสดุก่อสร้าง ฝุ่น และเสียงให้ไม่รบกวนเกินควร ในเขตชุมชน/อาคารชุดมักมีข้อกำหนดเวลาทำงานและการขนเศษวัสดุ ควรปฏิบัติตามเทศบัญญัติและข้อบังคับนิติบุคคล" },
    ],
  },
  {
    cat: "7. คุ้มครองผู้บริโภคและการระงับข้อพิพาท",
    items: [
      { t: "ข้อสัญญาที่ไม่เป็นธรรม พ.ร.บ. พ.ศ. 2540", d: "ข้อสัญญาที่ทำให้ฝ่ายหนึ่งได้เปรียบเกินสมควร เช่น ยกเว้นความรับผิดทั้งหมด หรือริบเงินมัดจำสูงเกินไป อาจถูกศาลปรับให้มีผลบังคับเพียงเท่าที่เป็นธรรม" },
      { t: "พ.ร.บ.คุ้มครองผู้บริโภค พ.ศ. 2522", d: "หากผู้ว่าจ้างเป็นผู้บริโภค การโฆษณา การให้ข้อมูล และเงื่อนไขสัญญาต้องไม่เกินจริงและเป็นธรรม ผู้บริโภคสามารถร้องเรียน สคบ. ได้" },
      { t: "ช่องทางระงับข้อพิพาท", d: "เริ่มจากการเจรจาไกล่เกลี่ยโดยสุจริต หากไม่สำเร็จอาจใช้อนุญาโตตุลาการ (ถ้าระบุในสัญญา) หรือฟ้องต่อศาลที่มีเขตอำนาจ การมีสัญญา แบบ และเอกสารครบถ้วนช่วยให้พิสูจน์สิทธิได้ง่ายขึ้น" },
    ],
  },
];

function LegalLibrary() {
  const [open, setOpen] = useState({ 0: true });
  const [q, setQ] = useState("");
  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }));
  return (
    <div>
      <SectionHead title="คู่มือกฎหมายงานก่อสร้างและออกแบบ" sub="แยกหมวดหมู่ อ่านละเอียดก่อนรับงานและทำสัญญา" />
      <div style={{ background: "color-mix(in srgb, var(--accent2) 14%, transparent)", border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, display: "flex", gap: 8 }}>
        <AlertTriangle size={16} style={{ color: "var(--accent2)", flexShrink: 0, marginTop: 2 }} />
        ข้อมูลนี้เป็นความรู้ทั่วไปเพื่อการตัดสินใจเบื้องต้น ไม่ใช่คำแนะนำทางกฎหมายรายกรณี สำหรับงานมูลค่าสูงหรือมีความเสี่ยง ควรปรึกษาทนายความ สภาสถาปนิก หรือสภาวิศวกร
      </div>
      <div style={{ position: "relative", marginBottom: 16, maxWidth: 360 }}>
        <Search size={16} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted)" }} />
        <input className="es-input" style={{ paddingLeft: 34 }} placeholder="ค้นหาหัวข้อกฎหมาย" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {LEGAL_LIBRARY.map((sec, i) => {
          const items = sec.items.filter((it) => !q || (it.t + it.d).includes(q));
          if (q && items.length === 0) return null;
          const isOpen = q ? true : open[i];
          return (
            <div key={i} className="es-card" style={{ overflow: "hidden" }}>
              <div onClick={() => toggle(i)} style={{ padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: `color-mix(in srgb, var(--accent) 8%, var(--surface))` }}>
                <div className="grad-accent" style={{ width: 28, height: 28, borderRadius: 8, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Shield size={15} /></div>
                <strong style={{ flex: 1, fontSize: 15 }}>{sec.cat}</strong>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
              {isOpen && (
                <div style={{ padding: "4px 16px 16px" }}>
                  {items.map((it, j) => (
                    <div key={j} style={{ padding: "12px 0", borderBottom: j < items.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <div style={{ fontWeight: 700, marginBottom: 5, display: "flex", gap: 6, alignItems: "start" }}><CheckCircle2 size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} /> {it.t}</div>
                      <div style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7, paddingLeft: 22 }}>{it.d}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== TEAM & SUPPLIERS ============================== */
function TeamStudio() {
  const { team, setTeam, suppliers, setSuppliers, portfolio, setPortfolio } = useApp();
  const [tab, setTab] = useState("team");

  const addTeam = () => setTeam((t) => [...t, { id: uid(), photo: "", name: "", role: "ช่าง", phone: "", note: "" }]);
  const updTeam = (id, p) => setTeam((t) => t.map((x) => x.id === id ? { ...x, ...p } : x));
  const delTeam = (id) => setTeam((t) => t.filter((x) => x.id !== id));

  const addSup = () => setSuppliers((s) => [...s, { id: uid(), logo: "", name: "", type: "วัสดุทั่วไป", phone: "", line: "", note: "" }]);
  const updSup = (id, p) => setSuppliers((s) => s.map((x) => x.id === id ? { ...x, ...p } : x));
  const delSup = (id) => setSuppliers((s) => s.filter((x) => x.id !== id));

  const addPort = () => setPortfolio((p) => [...p, { id: uid(), photo: "", title: "", note: "" }]);
  const updPort = (id, pa) => setPortfolio((p) => p.map((x) => x.id === id ? { ...x, ...pa } : x));
  const delPort = (id) => setPortfolio((p) => p.filter((x) => x.id !== id));

  const ROLES = ["ช่าง", "หัวหน้าช่าง", "โฟร์แมน", "ดีไซเนอร์", "ผู้จัดการโครงการ", "เจ้าของบริษัท", "ทีมขาย"];
  const SUP_TYPES = ["วัสดุทั่วไป", "ไม้/ลามิเนต", "หิน/กระเบื้อง", "ฮาร์ดแวร์", "ไฟ/อุปกรณ์ไฟฟ้า", "สุขภัณฑ์", "ผ้าม่าน", "รับเหมาช่วง"];

  return (
    <div>
      <SectionHead title="ทีม & ซัพพลายเออร์" sub="บันทึกข้อมูลช่าง/บริษัท ซัพพลายเออร์ และผลงาน" />
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
        {[["team", "ทีมงาน"], ["suppliers", "ซัพพลายเออร์"], ["portfolio", "ผลงาน"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ border: "none", background: "none", padding: "8px 14px", cursor: "pointer", fontWeight: 600, fontSize: 14, color: tab === k ? "var(--accent)" : "var(--muted)", borderBottom: tab === k ? "2px solid var(--accent)" : "2px solid transparent", fontFamily: "var(--font-body)" }}>{l}</button>
        ))}
      </div>

      {tab === "team" && (
        <div>
          <button className="es-btn es-btn-primary" style={{ marginBottom: 14 }} onClick={addTeam}><Plus size={16} /> เพิ่มคนในทีม</button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
            {team.map((m) => (
              <div key={m.id} className="es-card" style={{ padding: 16, textAlign: "center", position: "relative" }}>
                <button className="es-btn es-btn-ghost es-btn-danger" style={{ position: "absolute", top: 8, right: 8, padding: 5, border: "none" }} onClick={() => delTeam(m.id)}><Trash2 size={14} /></button>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><RowImage value={m.photo} onChange={(v) => updTeam(m.id, { photo: v })} size={80} /></div>
                <input className="es-cellinput" style={{ textAlign: "center", fontWeight: 700, fontSize: 15 }} value={m.name} placeholder="ชื่อ-นามสกุล" onChange={(e) => updTeam(m.id, { name: e.target.value })} />
                <select className="es-cellinput" style={{ textAlign: "center", color: "var(--accent)", fontWeight: 600 }} value={m.role} onChange={(e) => updTeam(m.id, { role: e.target.value })}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
                <input className="es-cellinput" style={{ textAlign: "center", fontSize: 13 }} value={m.phone} placeholder="เบอร์โทร" onChange={(e) => updTeam(m.id, { phone: e.target.value })} />
                <input className="es-cellinput" style={{ textAlign: "center", fontSize: 12, color: "var(--muted)" }} value={m.note} placeholder="ความชำนาญ/หมายเหตุ" onChange={(e) => updTeam(m.id, { note: e.target.value })} />
              </div>
            ))}
            {team.length === 0 && <div style={{ color: "var(--muted)", padding: 20 }}>ยังไม่มีข้อมูลทีม</div>}
          </div>
        </div>
      )}

      {tab === "suppliers" && (
        <div>
          <button className="es-btn es-btn-primary" style={{ marginBottom: 14 }} onClick={addSup}><Plus size={16} /> เพิ่มซัพพลายเออร์</button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
            {suppliers.map((s) => (
              <div key={s.id} className="es-card" style={{ padding: 14, position: "relative" }}>
                <button className="es-btn es-btn-ghost es-btn-danger" style={{ position: "absolute", top: 8, right: 8, padding: 5, border: "none" }} onClick={() => delSup(s.id)}><Trash2 size={14} /></button>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <RowImage value={s.logo} onChange={(v) => updSup(s.id, { logo: v })} size={44} />
                  <input className="es-cellinput l" style={{ fontWeight: 700, fontSize: 15 }} value={s.name} placeholder="ชื่อร้าน/บริษัท" onChange={(e) => updSup(s.id, { name: e.target.value })} />
                </div>
                <select className="es-cellinput l" style={{ color: "var(--accent)", fontWeight: 600, marginBottom: 4 }} value={s.type} onChange={(e) => updSup(s.id, { type: e.target.value })}>{SUP_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <input className="es-cellinput l" value={s.phone} placeholder="โทร" onChange={(e) => updSup(s.id, { phone: e.target.value })} />
                  <input className="es-cellinput l" value={s.line} placeholder="LINE" onChange={(e) => updSup(s.id, { line: e.target.value })} />
                </div>
                <input className="es-cellinput l" style={{ fontSize: 12, color: "var(--muted)" }} value={s.note} placeholder="วัสดุที่ขาย/เงื่อนไขราคา" onChange={(e) => updSup(s.id, { note: e.target.value })} />
              </div>
            ))}
            {suppliers.length === 0 && <div style={{ color: "var(--muted)", padding: 20 }}>ยังไม่มีซัพพลายเออร์</div>}
          </div>
        </div>
      )}

      {tab === "portfolio" && (
        <div>
          <button className="es-btn es-btn-primary" style={{ marginBottom: 14 }} onClick={addPort}><Plus size={16} /> เพิ่มผลงาน</button>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
            {portfolio.map((p) => (
              <div key={p.id} className="es-card" style={{ overflow: "hidden", position: "relative" }}>
                <button className="es-btn es-btn-ghost es-btn-danger" style={{ position: "absolute", top: 8, right: 8, padding: 5, border: "none", background: "rgba(255,255,255,.85)", zIndex: 2 }} onClick={() => delPort(p.id)}><Trash2 size={14} /></button>
                <PortImage value={p.photo} onChange={(v) => updPort(p.id, { photo: v })} />
                <div style={{ padding: 10 }}>
                  <input className="es-cellinput l" style={{ fontWeight: 700 }} value={p.title} placeholder="ชื่อผลงาน" onChange={(e) => updPort(p.id, { title: e.target.value })} />
                  <input className="es-cellinput l" style={{ fontSize: 12, color: "var(--muted)" }} value={p.note} placeholder="รายละเอียด" onChange={(e) => updPort(p.id, { note: e.target.value })} />
                </div>
              </div>
            ))}
            {portfolio.length === 0 && <div style={{ color: "var(--muted)", padding: 20 }}>ยังไม่มีผลงาน</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// รูปผลงานแบบ 16:9
function PortImage({ value, onChange }) {
  const ref = useRef(null);
  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { const img = new Image(); img.onload = () => { const W = 480, H = 270; const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d"); const s = Math.min(img.width / W, img.height / H); const sw = W * s, sh = H * s; ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, W, H); onChange(cv.toDataURL("image/jpeg", 0.8)); }; img.src = r.result; };
    r.readAsDataURL(f);
  };
  return (
    <div onClick={() => ref.current.click()} style={{ aspectRatio: "16/9", background: "var(--surface2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {value ? <img src={value} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageIcon size={26} style={{ color: "var(--muted)" }} />}
      <input ref={ref} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  );
}

/* ============================== GENERIC RECORD MODULES ============================== */
const STATUS_PAL = ["#5b8def", "#c8a45c", "#a3683f", "#2f6f4f", "#1f5a37", "#8a3b3b"];
function statusColor(o, opts) { const i = Math.max(0, opts.indexOf(o)); return STATUS_PAL[i % STATUS_PAL.length]; }

function ModField({ f, val, on }) {
  if (f.t === "sel") return <select className="es-cellinput l" value={val ?? f.o[0]} onChange={(e) => on(e.target.value)}>{f.o.map((o) => <option key={o}>{o}</option>)}</select>;
  if (f.t === "status") return <select className="es-cellinput l" value={val ?? f.o[0]} onChange={(e) => on(e.target.value)} style={{ fontWeight: 700, color: "#fff", background: statusColor(val ?? f.o[0], f.o), borderRadius: 8 }}>{f.o.map((o) => <option key={o} style={{ color: "#222", background: "#fff" }}>{o}</option>)}</select>;
  if (f.t === "money" || f.t === "num") return <input className="es-cellinput l" type="number" value={val ?? ""} onChange={(e) => on(e.target.value === "" ? "" : +e.target.value)} />;
  if (f.t === "date") return <input className="es-cellinput l" type="date" value={val || ""} onChange={(e) => on(e.target.value)} />;
  if (f.t === "area") return <textarea className="es-cellinput l" value={val || ""} onChange={(e) => on(e.target.value)} rows={2} style={{ resize: "vertical", lineHeight: 1.5 }} />;
  if (f.t === "photo") return <PortImage value={val} onChange={on} />;
  return <input className="es-cellinput l" value={val || ""} onChange={(e) => on(e.target.value)} placeholder={f.ph || ""} />;
}

function AiSummarizeBtn({ rec, cfg, onWrite }) {
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    try {
      const ctx = cfg.from.map((k) => k + ": " + (rec[k] || "-")).join("\n");
      const r = await callClaude(`${cfg.prompt}\nข้อมูลที่มี:\n${ctx}\nตอบ JSON: {"summary":"ข้อความสรุปแบบมืออาชีพ"}`, AI_SYS);
      onWrite(r.summary || "");
    } catch (e) { alert(e?.message || "AI error — ตรวจ API Key ในตั้งค่า"); }
    setLoading(false);
  };
  return <button className="es-btn es-btn-primary" style={{ gridColumn: "1 / -1", justifyContent: "center" }} onClick={run} disabled={loading}><Sparkles size={14} /> {loading ? "กำลังให้ AI สรุป..." : cfg.label}</button>;
}

function RecordModule({ id }) {
  const cfg = MODULES[id];
  const { biz, setBiz, activeProjectId, projects } = useApp();
  const [q, setQ] = useState("");
  const [onlyThis, setOnlyThis] = useState(true);
  const [printList, setPrintList] = useState(false);
  const [printRec, setPrintRec] = useState(null);
  const list = biz[id] || [];
  const setList = (fn) => setBiz((b) => ({ ...b, [id]: fn(b[id] || []) }));
  const add = () => setList((l) => [{ id: uid(), projectId: activeProjectId || "" }, ...l]);
  const upd = (rid, patch) => setList((l) => l.map((x) => x.id === rid ? { ...x, ...patch } : x));
  const del = (rid) => setList((l) => l.filter((x) => x.id !== rid));
  const pName = (pid) => (projects.find((p) => p.id === pid) || {}).name || "";
  const scoped = (onlyThis && activeProjectId) ? list.filter((r) => !r.projectId || r.projectId === activeProjectId) : list;
  const filtered = q ? scoped.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())) : scoped;

  return (
    <div>
      <SectionHead title={cfg.title} sub={`${cfg.sub} · ${filtered.length} รายการ`}
        action={<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="es-btn" onClick={() => setPrintList(true)} disabled={!filtered.length}><FileDown size={16} /> ออก PDF</button>
          <button className="es-btn es-btn-primary" onClick={add}><Plus size={16} /> เพิ่มรายการ</button>
        </div>} />
      {cfg.note && (
        <div style={{ background: "color-mix(in srgb, var(--accent2) 12%, transparent)", border: "1px solid var(--border)", borderRadius: 10, padding: 11, marginBottom: 14, fontSize: 12.5, display: "flex", gap: 8 }}>
          <AlertTriangle size={15} style={{ color: "var(--accent2)", flexShrink: 0, marginTop: 1 }} />{cfg.note}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180, maxWidth: 340 }}>
          <Search size={16} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted)" }} />
          <input className="es-input" style={{ paddingLeft: 34 }} placeholder="ค้นหา" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {activeProjectId && <button className={`es-chip ${onlyThis ? "on" : ""}`} style={{ padding: "8px 12px" }} onClick={() => setOnlyThis((v) => !v)}>{onlyThis ? "เฉพาะโปรเจกต์นี้" : "ทุกโปรเจกต์"}</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: 12 }}>
        {filtered.map((rec) => (
          <div key={rec.id} className="es-card" style={{ padding: 14, position: "relative" }}>
            <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 2, zIndex: 2 }}>
              <button className="es-btn es-btn-ghost" style={{ padding: 5, border: "none" }} title="ออก PDF ใบนี้" onClick={() => setPrintRec(rec)}><FileDown size={14} /></button>
              <button className="es-btn es-btn-ghost es-btn-danger" style={{ padding: 5, border: "none" }} onClick={() => del(rec.id)}><Trash2 size={14} /></button>
            </div>
            {rec.projectId && pName(rec.projectId) && <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, marginBottom: 6 }}>🔗 {pName(rec.projectId)}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {cfg.fields.map((f) => (
                <div key={f.k} style={{ gridColumn: f.w === 2 ? "1 / -1" : "auto" }}>
                  <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: 3 }}>{f.l}</label>
                  <ModField f={f} val={rec[f.k]} on={(v) => upd(rec.id, { [f.k]: v })} />
                </div>
              ))}
              {cfg.aiSummary && <AiSummarizeBtn rec={rec} cfg={cfg.aiSummary} onWrite={(v) => upd(rec.id, { [cfg.aiSummary.target]: v })} />}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ color: "var(--muted)", padding: 24, gridColumn: "1 / -1", textAlign: "center" }}>ยังไม่มีรายการ — กด “เพิ่มรายการ” เพื่อเริ่ม</div>}
      </div>
      {printList && <DocPrint moduleId={id} records={filtered} onClose={() => setPrintList(false)} />}
      {printRec && <DocPrint moduleId={id} records={[printRec]} single onClose={() => setPrintRec(null)} />}
    </div>
  );
}
const MODULES = {
  leads: { title: "ลูกค้า / Leads", sub: "ตั้งแต่ทักมาจนปิดการขาย", fields: [
    { k: "name", l: "ชื่อลูกค้า", t: "text", w: 2 },
    { k: "phone", l: "ติดต่อ (โทร/Line)", t: "text" },
    { k: "source", l: "มาจาก", t: "sel", o: ["Facebook", "Line", "TikTok", "Website", "คนแนะนำ", "Walk-in"] },
    { k: "ptype", l: "ประเภทงาน", t: "sel", o: ["บ้าน", "คอนโด", "คาเฟ่", "คลินิก", "ร้านอาหาร", "ออฟฟิศ", "โรงแรม", "บูธ"] },
    { k: "budget", l: "งบ (บาท)", t: "money" },
    { k: "grade", l: "ความน่าสนใจ", t: "sel", o: ["A", "B", "C"] },
    { k: "status", l: "สถานะ", t: "status", o: ["ทักมาใหม่", "นัดคุย", "เสนอราคาแล้ว", "รอปิดการขาย", "เซ็นสัญญา", "หลุด"] },
    { k: "followup", l: "นัด Follow-up", t: "date" },
    { k: "note", l: "โน้ต", t: "area", w: 2 },
  ] },
  brief: { title: "บรีฟลูกค้า / Design Brief", sub: "เก็บความต้องการก่อนออกแบบ + ให้ AI สรุป", fields: [
    { k: "name", l: "โปรเจกต์/ลูกค้า", t: "text", w: 2 },
    { k: "area", l: "พื้นที่ (ตร.ม.)", t: "num" },
    { k: "level", l: "ระดับคุณภาพ", t: "sel", o: ["ประหยัด", "กลาง", "พรีเมียม", "ลักชัวรี"] },
    { k: "like", l: "สไตล์ที่ชอบ", t: "text" },
    { k: "dislike", l: "สไตล์ที่ไม่ชอบ", t: "text" },
    { k: "func", l: "ฟังก์ชันที่ต้องการ", t: "area", w: 2 },
    { k: "pain", l: "ปัญหาพื้นที่เดิม", t: "area", w: 2 },
    { k: "budget", l: "งบ (บาท)", t: "money" },
    { k: "deadline", l: "Deadline", t: "date" },
    { k: "brief", l: "Design Brief (AI สรุป)", t: "area", w: 2 },
  ], aiSummary: { from: ["name", "area", "level", "like", "dislike", "func", "pain", "budget"], target: "brief", label: "ให้ AI สรุปเป็น Design Brief", prompt: "สรุปข้อมูลลูกค้าให้เป็น Design Brief งานออกแบบภายในที่อ่านแล้วเริ่มออกแบบได้ทันที ครอบคลุมสไตล์ โทน ฟังก์ชัน งบ และข้อควรระวัง" } },
  survey: { title: "สำรวจหน้างาน / Site Survey", sub: "บันทึกสภาพจริงก่อนออกแบบ/ก่อสร้าง", fields: [
    { k: "name", l: "ชื่อจุด/พื้นที่", t: "text", w: 2 },
    { k: "photo", l: "รูปหน้างาน", t: "photo", w: 2 },
    { k: "w", l: "กว้าง (ม.)", t: "num" },
    { k: "d", l: "ยาว (ม.)", t: "num" },
    { k: "h", l: "สูงฝ้า (ม.)", t: "num" },
    { k: "issue", l: "ประเภทปัญหา", t: "sel", o: ["ผนังร้าว", "พื้นเอียง", "น้ำรั่ว", "ไฟไม่พอ", "ความชื้น", "อื่นๆ"] },
    { k: "status", l: "สถานะ", t: "status", o: ["ยังไม่แก้", "รออนุมัติ", "แก้แล้ว"] },
    { k: "note", l: "รายละเอียด", t: "area", w: 2 },
  ] },
  drawings: { title: "ชุดแบบ / Drawing Package", sub: "คุมชุดแบบและ Revision", fields: [
    { k: "name", l: "ชื่อแบบ (Sheet)", t: "text", w: 2 },
    { k: "code", l: "รหัสแบบ", t: "text" },
    { k: "type", l: "หมวด", t: "sel", o: ["Cover", "Layout", "Floor Plan", "Ceiling", "Lighting", "Electrical", "Furniture", "Elevation", "Section", "Detail", "Material"] },
    { k: "rev", l: "Revision", t: "sel", o: ["Rev.00", "Rev.01", "Rev.02", "Rev.03", "Final"] },
    { k: "status", l: "สถานะ", t: "status", o: ["ร่าง", "ส่งตรวจ", "แก้ไข", "อนุมัติ", "ล็อก Final"] },
    { k: "note", l: "หมายเหตุ", t: "area", w: 2 },
  ] },
  procurement: { title: "จัดซื้อ / Procurement", sub: "สั่งของและคุม Supplier", fields: [
    { k: "name", l: "รายการวัสดุ", t: "text", w: 2 },
    { k: "supplier", l: "Supplier", t: "text" },
    { k: "qty", l: "จำนวน", t: "num" },
    { k: "cost", l: "ราคาทุน (บาท)", t: "money" },
    { k: "deposit", l: "มัดจำ (บาท)", t: "money" },
    { k: "lead", l: "Lead Time", t: "text" },
    { k: "status", l: "สถานะของ", t: "status", o: ["รอสั่ง", "สั่งแล้ว", "กำลังผลิต", "ส่งแล้ว", "ถึงไซต์", "ตรวจรับแล้ว"] },
    { k: "eta", l: "กำหนดเข้า", t: "date" },
  ] },
  daily: { title: "รายงานหน้างาน / Daily Report", sub: "บันทึกงานหน้างานรายวัน", fields: [
    { k: "date", l: "วันที่", t: "date", w: 2 },
    { k: "photo", l: "รูปหน้างาน", t: "photo", w: 2 },
    { k: "workers", l: "จำนวนช่าง", t: "num" },
    { k: "weather", l: "สภาพอากาศ", t: "sel", o: ["แดด", "เมฆ", "ฝน"] },
    { k: "work", l: "งานที่ทำวันนี้", t: "area", w: 2 },
    { k: "issue", l: "ปัญหา/อุปสรรค", t: "area", w: 2 },
    { k: "progress", l: "คืบหน้ารวม %", t: "num" },
  ] },
  vo: { title: "งานเพิ่ม-ลด / Variation Order", sub: "กันงานเพิ่มฟรี — ต้องอนุมัติก่อนทำ", note: "เงื่อนไข “ไม่เซ็น ไม่เริ่มงาน” — ออกเอกสารและให้ลูกค้าอนุมัติก่อนลงมือทุกครั้ง", fields: [
    { k: "name", l: "รายการงานเพิ่ม/ลด", t: "text", w: 2 },
    { k: "kind", l: "ประเภท", t: "sel", o: ["งานเพิ่ม", "งานลด"] },
    { k: "amount", l: "มูลค่า (บาท)", t: "money" },
    { k: "days", l: "กระทบเวลา (วัน)", t: "num" },
    { k: "reason", l: "เหตุผล", t: "area", w: 2 },
    { k: "status", l: "สถานะ", t: "status", o: ["ร่าง", "ส่งลูกค้า", "ลูกค้าอนุมัติ", "เริ่มงาน", "เสร็จ"] },
  ] },
  qc: { title: "QC / Punch List", sub: "ตรวจงานก่อนส่งมอบ เก็บงานเป็นระบบ", fields: [
    { k: "name", l: "จุดที่ตรวจ", t: "text", w: 2 },
    { k: "photo", l: "รูปจุดบกพร่อง", t: "photo", w: 2 },
    { k: "cat", l: "หมวดงาน", t: "sel", o: ["งานโครง", "งานไฟ", "งานฝ้า", "งานพื้น", "งานสี", "งานบิลท์อิน", "งานสุขภัณฑ์"] },
    { k: "severity", l: "ระดับ", t: "sel", o: ["เล็กน้อย", "ปานกลาง", "รุนแรง"] },
    { k: "owner", l: "ผู้แก้ไข", t: "text" },
    { k: "due", l: "กำหนดแก้เสร็จ", t: "date" },
    { k: "status", l: "สถานะ", t: "status", o: ["Failed", "กำลังแก้", "Rework", "Passed"] },
    { k: "note", l: "รายละเอียด", t: "area", w: 2 },
  ] },
  payment: { title: "เบิกงวด / Progress Claim", sub: "คุมเงินเข้าให้ตามงาน", fields: [
    { k: "name", l: "งวดที่/รายละเอียด", t: "text", w: 2 },
    { k: "percent", l: "% งวด", t: "num" },
    { k: "amount", l: "จำนวนเงิน (บาท)", t: "money" },
    { k: "due", l: "ครบกำหนดชำระ", t: "date" },
    { k: "status", l: "สถานะ", t: "status", o: ["รอวางบิล", "วางบิลแล้ว", "จ่ายแล้ว", "ค้างจ่าย"] },
    { k: "note", l: "หมายเหตุ", t: "area", w: 2 },
  ] },
  handover: { title: "ส่งมอบงาน / Handover", sub: "ปิดงานแบบมืออาชีพ", fields: [
    { k: "name", l: "รายการส่งมอบ", t: "text", w: 2 },
    { k: "photo", l: "รูปงานเสร็จ", t: "photo", w: 2 },
    { k: "doc", l: "เอกสารแนบ", t: "sel", o: ["Punch List", "As-built", "คู่มือใช้งาน", "ใบรับประกัน", "ใบส่งมอบ"] },
    { k: "wStart", l: "เริ่มประกัน", t: "date" },
    { k: "wEnd", l: "สิ้นสุดประกัน", t: "date" },
    { k: "status", l: "สถานะ", t: "status", o: ["เตรียม", "ส่งมอบแล้ว", "ลูกค้ารับมอบ"] },
    { k: "note", l: "หมายเหตุ", t: "area", w: 2 },
  ] },
  warranty: { title: "รับประกัน / Service", sub: "ดูแลหลังจบงาน เปิด Ticket ซ่อม", fields: [
    { k: "name", l: "หัวข้อ/ลูกค้า", t: "text", w: 2 },
    { k: "photo", l: "รูปปัญหา", t: "photo", w: 2 },
    { k: "type", l: "ประเภท Defect", t: "sel", o: ["งานไม้", "งานสี", "งานไฟ", "งานน้ำ", "งานกระจก", "อื่นๆ"] },
    { k: "inWarranty", l: "อยู่ในประกัน?", t: "sel", o: ["อยู่ในประกัน", "นอกประกัน"] },
    { k: "visit", l: "นัดเข้าซ่อม", t: "date" },
    { k: "status", l: "สถานะ Ticket", t: "status", o: ["เปิดใหม่", "นัดแล้ว", "กำลังซ่อม", "ปิดงาน"] },
    { k: "note", l: "รายละเอียด/ผลซ่อม", t: "area", w: 2 },
  ] },
  meeting: { title: "บันทึกประชุม / Minutes", sub: "เก็บข้อตกลงทุกครั้ง", fields: [
    { k: "name", l: "หัวข้อประชุม", t: "text", w: 2 },
    { k: "date", l: "วันที่", t: "date" },
    { k: "type", l: "ประเภท", t: "sel", o: ["Client Meeting", "Design Meeting", "Site Meeting"] },
    { k: "attendees", l: "ผู้เข้าร่วม", t: "text", w: 2 },
    { k: "decision", l: "ข้อสรุป (Decision)", t: "area", w: 2 },
    { k: "action", l: "Action Item + ผู้รับผิดชอบ", t: "area", w: 2 },
  ] },
  docs: { title: "คลังเอกสาร / Document Center", sub: "รวมเอกสารทุกอย่างในโปรเจกต์", fields: [
    { k: "name", l: "ชื่อเอกสาร", t: "text", w: 2 },
    { k: "cat", l: "หมวด", t: "sel", o: ["สัญญา", "แบบ", "BOQ", "ใบเสนอราคา", "ใบเสร็จ", "ประชุม", "รูปงาน", "อื่นๆ"] },
    { k: "ver", l: "เวอร์ชัน", t: "text" },
    { k: "photo", l: "ไฟล์รูป/สแกน", t: "photo", w: 2 },
    { k: "note", l: "หมายเหตุ", t: "area", w: 2 },
  ] },
};

function QuotationPage() {
  const { activeProject, setTab } = useApp();
  const [show, setShow] = useState(false);
  if (!activeProject) return <EmptyProject />;
  const totals = calcProject(activeProject);
  return (
    <div>
      <SectionHead title="ใบเสนอราคา / Quotation" sub={activeProject.name}
        action={<button className="es-btn es-btn-primary" onClick={() => setShow(true)}><FileDown size={16} /> พิมพ์ใบเสนอราคา PDF</button>} />
      <div className="es-card" style={{ padding: 18, maxWidth: 460 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span style={{ color: "var(--muted)" }}>ต้นทุน (วัสดุ+แรง+เผื่อเสีย)</span><strong>{baht(totals.sumCost)} ฿</strong></div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span style={{ color: "var(--muted)" }}>กำไร + overhead + commission</span><span>{baht(totals.sumProfit + totals.sumOverhead + totals.sumCommission)} ฿</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span style={{ color: "var(--muted)" }}>รวมก่อนภาษี</span><span>{baht(totals.preVat)} ฿</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span style={{ color: "var(--muted)" }}>VAT</span><span>+{baht(totals.vat)} ฿</span></div>
        {totals.wht > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}><span style={{ color: "var(--muted)" }}>หัก ณ ที่จ่าย</span><span>−{baht(totals.wht)} ฿</span></div>}
        <div className="es-divider" style={{ margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}><strong>ราคาสุทธิ</strong><strong style={{ color: "var(--accent)" }}>{baht(totals.net)} ฿</strong></div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>แก้รายการได้ในเมนู BOQ · ปรับเทมเพลต/โลโก้ในเมนูเทมเพลต PDF</p>
      </div>
      {show && <PrintModal project={activeProject} totals={totals} onClose={() => setShow(false)} />}
    </div>
  );
}

/* ============================== PROFESSIONAL PDF (ทุกหมวด) ============================== */
function DocHeader({ company, title, project, docNo }) {
  const today = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "3px solid #1f5a37", paddingBottom: 14, marginBottom: 18, gap: 16 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {company.logo && <img src={company.logo} style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8 }} />}
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{company.name || "บริษัทของคุณ"}</div>
          <div style={{ fontSize: 11, color: "#555", maxWidth: 320 }}>{company.address}</div>
          <div style={{ fontSize: 11, color: "#555" }}>{[company.phone, company.email].filter(Boolean).join(" · ")}</div>
          {company.taxId && <div style={{ fontSize: 11, color: "#555" }}>เลขผู้เสียภาษี {company.taxId}</div>}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1f5a37" }}>{title}</div>
        {project && <div style={{ fontSize: 12, marginTop: 4 }}><b>โครงการ:</b> {project.name}</div>}
        {project?.client?.name && <div style={{ fontSize: 12 }}><b>ลูกค้า:</b> {project.client.name}</div>}
        <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>เลขที่ {docNo}<br />วันที่ {today}</div>
      </div>
    </div>
  );
}

function DocPrint({ moduleId, records, single, onClose }) {
  const { company, activeProject } = useApp();
  const cfg = MODULES[moduleId];
  const [pageSize, setPageSize] = useState("A4");
  const [orient, setOrient] = useState(single ? "portrait" : "landscape");
  const cols = cfg.fields.filter((f) => f.t !== "area" && f.t !== "photo");
  const areas = cfg.fields.filter((f) => f.t === "area");
  const photoF = cfg.fields.find((f) => f.t === "photo");
  const fmt = (f, v) => (v == null || v === "" ? "-" : f.t === "money" ? baht(v) + " ฿" : String(v));
  const docNo = moduleId.toUpperCase() + "-" + new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return (
    <div className="es-modal-bg" onClick={onClose}>
      <style>{`@page { size: ${pageSize} ${orient}; margin: 12mm; }`}</style>
      <div style={{ background: "var(--surface)", borderRadius: 14, width: "100%", maxWidth: orient === "landscape" ? 1000 : 820, maxHeight: "92vh", overflow: "auto", padding: 16 }} onClick={(e) => e.stopPropagation()}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>เอกสาร — {cfg.title}</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <select className="es-select" style={{ width: 80 }} value={pageSize} onChange={(e) => setPageSize(e.target.value)}><option>A4</option><option>A3</option></select>
            <select className="es-select" style={{ width: 120 }} value={orient} onChange={(e) => setOrient(e.target.value)}><option value="portrait">แนวตั้ง</option><option value="landscape">แนวนอน</option></select>
            <button className="es-btn es-btn-primary" onClick={() => window.print()}><FileDown size={16} /> พิมพ์ / PDF</button>
            <button className="es-btn" onClick={onClose}><X size={16} /></button>
          </div>
        </div>
        <div id="print-area" style={{ background: "#fff", color: "#1a1a1a", padding: 32, fontFamily: "'Sarabun',sans-serif", fontSize: 12 }}>
          <DocHeader company={company} title={cfg.title} project={activeProject} docNo={docNo} />
          {single ? records.map((rec) => (
            <div key={rec.id}>
              {photoF && rec[photoF.k] && <img src={rec[photoF.k]} style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 10, marginBottom: 16 }} />}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}><tbody>
                {cols.map((f) => (
                  <tr key={f.k} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "9px 12px", fontWeight: 700, width: "35%", background: "#f4f7f4" }}>{f.l}</td>
                    <td style={{ padding: "9px 12px" }}>{fmt(f, rec[f.k])}</td>
                  </tr>
                ))}
                {areas.map((f) => (
                  <tr key={f.k} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "9px 12px", fontWeight: 700, background: "#f4f7f4", verticalAlign: "top" }}>{f.l}</td>
                    <td style={{ padding: "9px 12px", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{rec[f.k] || "-"}</td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          )) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
              <thead><tr style={{ background: "#1f5a37", color: "#fff" }}>
                <th style={{ padding: 7, width: 24 }}>#</th>
                {cols.map((f) => <th key={f.k} style={{ padding: 7, textAlign: "left" }}>{f.l}</th>)}
              </tr></thead>
              <tbody>
                {records.map((rec, i) => (
                  <tr key={rec.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 6, textAlign: "center" }}>{i + 1}</td>
                    {cols.map((f) => <td key={f.k} style={{ padding: 6 }}>{fmt(f, rec[f.k])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 50, gap: 30 }}>
            {["ผู้จัดทำ", "ผู้อนุมัติ", "ลูกค้ารับทราบ"].map((r) => (
              <div key={r} style={{ flex: 1, textAlign: "center", fontSize: 11 }}>
                <div style={{ borderTop: "1px solid #999", margin: "0 12px", paddingTop: 6 }}>{r}</div>
                <div style={{ color: "#888", marginTop: 4 }}>วันที่ ____/____/____</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, fontSize: 9, color: "#999", textAlign: "center" }}>เอกสารจัดทำโดยระบบ CONS {company.name ? "· " + company.name : ""}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================== AI IMAGE STUDIO ============================== */
function ImageStudio() {
  const [src, setSrc] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [bri, setBri] = useState(100), [con, setCon] = useState(100), [sat, setSat] = useState(100), [rot, setRot] = useState(0);
  const [scale, setScale] = useState(2);
  const [aiBusy, setAiBusy] = useState(false);
  const aiUpscale = async () => {
    if (!src) return; setAiBusy(true);
    try {
      const r = await fetch("/api/upscale", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: src, scale }) });
      const d = await r.json();
      if (d.url) { setSrc(d.url); alert("ขยายด้วย AI สำเร็จ — กดบันทึกรูปเพื่อดาวน์โหลด"); }
      else alert(d.error || "ยังไม่ได้เปิดบริการ AI upscale บนเซิร์ฟเวอร์");
    } catch (e) { alert("AI upscale ล้มเหลว"); }
    setAiBusy(false);
  };
  const fileRef = useRef(null);
  const filterStr = `brightness(${bri}%) contrast(${con}%) saturate(${sat}%)`;

  const gen = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const u = "https://image.pollinations.ai/prompt/" + encodeURIComponent(prompt + ", high quality, highly detailed, sharp, 4k") + "?width=1024&height=1024&model=flux&nologo=true&seed=" + Math.floor(Math.random() * 99999);
    const im = new Image();
    im.onload = () => { setSrc(u); setLoading(false); };
    im.onerror = () => { setSrc(u); setLoading(false); };
    im.src = u;
  };
  const onFile = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { setSrc(r.result); setBri(100); setCon(100); setSat(100); setRot(0); }; r.readAsDataURL(f); };

  const download = () => {
    if (!src) return;
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => {
      const W = im.width * scale, H = im.height * scale;
      const rotated = rot % 180 !== 0;
      const cv = document.createElement("canvas");
      cv.width = rotated ? H : W; cv.height = rotated ? W : H;
      const ctx = cv.getContext("2d");
      ctx.filter = filterStr;
      ctx.translate(cv.width / 2, cv.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(im, -W / 2, -H / 2, W, H);
      try {
        const a = document.createElement("a");
        a.href = cv.toDataURL("image/jpeg", 0.95);
        a.download = "cons-image-" + scale + "x.jpg"; a.click();
      } catch (err) { alert("รูปจากเน็ตติดสิทธิ์ CORS บันทึกไม่ได้ — ลองดาวน์โหลดรูปมาก่อนแล้วอัปโหลดเข้ามาปรับแต่ง"); }
    };
    im.onerror = () => alert("โหลดรูปไม่สำเร็จ");
    im.src = src;
  };

  const Slider = ({ label, val, set, min, max }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", marginBottom: 4 }}><span>{label}</span><span>{val}{label === "หมุน" ? "°" : "%"}</span></div>
      <input type="range" min={min} max={max} value={val} onChange={(e) => set(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }} />
    </div>
  );

  return (
    <div>
      <SectionHead title="สตูดิโอภาพ AI" sub="สร้างภาพด้วย AI · ปรับแต่ง · ขยายขนาด แล้วบันทึก" />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input className="es-input" style={{ flex: 1, minWidth: 220 }} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='สร้างภาพ เช่น "คาเฟ่ Japandi โทนไม้ แสงธรรมชาติ"' onKeyDown={(e) => e.key === "Enter" && gen()} />
        <button className="es-btn es-btn-primary" onClick={gen} disabled={loading}><Sparkles size={16} /> {loading ? "กำลังสร้าง..." : "สร้างภาพ AI"}</button>
        <button className="es-btn" onClick={() => fileRef.current.click()}><Upload size={16} /> อัปโหลดรูป</button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 240px", gap: 16, alignItems: "start" }} className="es-imgstudio">
        <div className="es-card" style={{ padding: 14, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 360, background: "var(--surface2)" }}>
          {src ? (
            <img src={src} style={{ maxWidth: "100%", maxHeight: 480, borderRadius: 10, filter: filterStr, transform: `rotate(${rot}deg)`, transition: "filter .2s" }} />
          ) : (
            <div style={{ textAlign: "center", color: "var(--muted)" }}><ImageIcon size={40} /><div style={{ marginTop: 8 }}>สร้างภาพ AI หรืออัปโหลดรูปเพื่อเริ่ม</div></div>
          )}
        </div>
        <div className="es-card" style={{ padding: 16 }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 14 }}>ปรับแต่ง</h4>
          <Slider label="ความสว่าง" val={bri} set={setBri} min={20} max={200} />
          <Slider label="คอนทราสต์" val={con} set={setCon} min={20} max={200} />
          <Slider label="ความอิ่มสี" val={sat} set={setSat} min={0} max={250} />
          <Slider label="หมุน" val={rot} set={setRot} min={0} max={270} />
          <button className="es-btn" style={{ width: "100%", justifyContent: "center", marginBottom: 14 }} onClick={() => { setBri(100); setCon(100); setSat(100); setRot(0); }}>รีเซ็ตการปรับแต่ง</button>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, fontWeight: 600 }}>ขยายขนาด (Upscale)</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            {[1, 2, 4].map((s) => <button key={s} className={`es-chip ${scale === s ? "on" : ""}`} style={{ flex: 1, justifyContent: "center" }} onClick={() => setScale(s)}>{s}x</button>)}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>“ขยายด้วย AI” ใช้ Real-ESRGAN บนเซิร์ฟเวอร์ (เติมรายละเอียดจริง — ต้องตั้งค่า REPLICATE_API_TOKEN) · ปุ่มบันทึกด้านล่างเป็นการขยายพิกเซลปกติ</div>
          <button className="es-btn" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }} onClick={aiUpscale} disabled={!src || aiBusy}><Sparkles size={16} /> {aiBusy ? "กำลังขยายด้วย AI..." : "ขยายด้วย AI (4K)"}</button>
          <button className="es-btn es-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={download} disabled={!src}><FileDown size={16} /> บันทึกรูป {scale}x (พิกเซล)</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== HUMAN DIMENSION (ขนาดมาตรฐาน) ============================== */
const HUMAN_DIM = [
  { cat: "ที่นั่ง / โซฟา", icon: "🛋️", items: [
    { t: "ความสูงที่นั่ง (Seat Height)", d: "ระยะจากพื้นถึงเบาะนั่ง ให้เท้าวางพื้นพอดี", dims: [["ที่นั่งทั่วไป", "40–45 ซม."], ["โซฟานั่งสบาย", "38–42 ซม."]] },
    { t: "ความลึก-กว้างที่นั่ง", d: "ความลึกเบาะและความกว้างต่อ 1 ที่นั่ง", dims: [["ลึกเบาะ", "50–60 ซม."], ["กว้าง/ที่นั่ง", "60–75 ซม."]] },
    { t: "พนักพิง", d: "ความสูงพนักพิงจากเบาะ", dims: [["พิงหลังเตี้ย", "35–45 ซม."], ["พิงหลังสูง", "60–70 ซม."]] },
    { t: "ระยะโต๊ะกลาง", d: "ระยะจากขอบโซฟาถึงโต๊ะกลาง", dims: [["ช่องวางขา", "30–45 ซม."]] },
  ] },
  { cat: "โต๊ะอาหาร / รับประทานอาหาร", icon: "🍽️", items: [
    { t: "ความสูงโต๊ะ-เก้าอี้", d: "มาตรฐานโต๊ะอาหารและที่นั่ง", dims: [["สูงโต๊ะ", "73–76 ซม."], ["สูงที่นั่งเก้าอี้", "43–46 ซม."], ["ช่องเข่าใต้โต๊ะ", "60–65 ซม."]] },
    { t: "พื้นที่ต่อ 1 ที่นั่ง", d: "ความกว้าง×ลึกของที่วางจานต่อคน", dims: [["กว้าง/คน", "60 ซม."], ["ลึก/คน", "40 ซม."]] },
    { t: "ระยะดึงเก้าอี้ + ลุก", d: "ระยะจากขอบโต๊ะถึงผนัง/เฟอร์นิเจอร์หลัง เพื่อดึงเก้าอี้และลุกได้", dims: [["ดึงเก้าอี้", "75–90 ซม."], ["มีคนเดินผ่านหลัง", "100–120 ซม."]] },
  ] },
  { cat: "ครัว (Kitchen)", icon: "🔪", items: [
    { t: "เคาน์เตอร์ครัว", d: "ความสูง/ลึกเคาน์เตอร์ และตู้ลอย", dims: [["สูงเคาน์เตอร์", "85–90 ซม."], ["ลึกเคาน์เตอร์", "60 ซม."], ["ตู้ลอยสูงจากเคาน์เตอร์", "50–60 ซม."]] },
    { t: "ทางเดินในครัว", d: "ระยะระหว่างเคาน์เตอร์สองฝั่ง", dims: [["1 คนทำงาน", "100–110 ซม."], ["2 คน/มีคนเดินผ่าน", "120–150 ซม."]] },
    { t: "สามเหลี่ยมงานครัว", d: "เตา–ซิงก์–ตู้เย็น รวมระยะที่เหมาะ", dims: [["ผลรวม 3 ด้าน", "4–8 ม."]] },
  ] },
  { cat: "ห้องน้ำ / สุขภัณฑ์", icon: "🚿", items: [
    { t: "โถสุขภัณฑ์", d: "พื้นที่ใช้งานรอบโถ", dims: [["กว้างพื้นที่โถ", "80–90 ซม."], ["ระยะหน้าโถ", "≥ 60 ซม."]] },
    { t: "อ่างล้างหน้า", d: "ความสูงและระยะด้านหน้า", dims: [["สูงอ่าง", "80–85 ซม."], ["ระยะหน้าอ่าง", "55–70 ซม."]] },
    { t: "ฝักบัว / ที่อาบน้ำ", d: "ขนาดพื้นที่ขั้นต่ำ", dims: [["พื้นที่ขั้นต่ำ", "90×90 ซม."], ["สบาย", "100×100 ซม."]] },
    { t: "ราวจับ (ผู้สูงอายุ)", d: "ความสูงติดตั้งราวจับนิรภัย", dims: [["สูงราวจับ", "70–80 ซม."]] },
  ] },
  { cat: "ห้องนอน / เตียง", icon: "🛏️", items: [
    { t: "ขนาดที่นอนมาตรฐาน", d: "กว้าง×ยาว", dims: [["เดี่ยว 3.5 ฟุต", "107×200 ซม."], ["ควีน 5 ฟุต", "150×200 ซม."], ["คิง 6 ฟุต", "180×200 ซม."]] },
    { t: "ระยะรอบเตียง", d: "ทางเดินข้างและปลายเตียง", dims: [["ข้างเตียง", "60–70 ซม."], ["ปลายเตียง", "≥ 90 ซม."]] },
    { t: "ตู้เสื้อผ้า", d: "ความลึกและราวแขวน", dims: [["ลึกตู้", "60 ซม."], ["สูงราวแขวนเสื้อยาว", "150–170 ซม."]] },
  ] },
  { cat: "ทางเดิน / ระยะสัญจร", icon: "🚶", items: [
    { t: "ความกว้างทางเดิน", d: "ระยะสัญจรในอาคาร", dims: [["คนเดียว", "60–75 ซม."], ["สองคนสวนกัน", "110–120 ซม."], ["ทางเดินหลัก", "≥ 120 ซม."]] },
    { t: "ประตู", d: "ความกว้างช่องประตู", dims: [["ประตูห้องทั่วไป", "80–90 ซม."], ["ประตูหลัก", "90–100 ซม."]] },
    { t: "รองรับวีลแชร์ (Universal)", d: "ระยะสำหรับเก้าอี้ล้อ", dims: [["ทางผ่าน", "≥ 90 ซม."], ["วงเลี้ยวกลับตัว", "150×150 ซม."]] },
  ] },
  { cat: "ที่ทำงาน / ออฟฟิศ", icon: "💻", items: [
    { t: "โต๊ะทำงาน", d: "ความสูงและขนาดหน้าโต๊ะ", dims: [["สูงโต๊ะ", "72–75 ซม."], ["หน้าโต๊ะ", "120×60 ซม."]] },
    { t: "ระยะเก้าอี้ + ลุก", d: "ระยะถอยเก้าอี้ด้านหลัง", dims: [["ถอยเก้าอี้", "90–100 ซม."]] },
    { t: "ระยะมองจอ", d: "ระยะสายตาถึงจอคอม", dims: [["ระยะจอ", "50–70 ซม."], ["ขอบบนจอระดับสายตา", "—"]] },
  ] },
  { cat: "ร้านค้า / เคาน์เตอร์", icon: "🏬", items: [
    { t: "เคาน์เตอร์บริการ/แคชเชียร์", d: "ความสูงฝั่งลูกค้าและพนักงาน", dims: [["ฝั่งลูกค้า", "100–110 ซม."], ["ฝั่งพนักงาน (โต๊ะ)", "72–90 ซม."]] },
    { t: "ทางเดินในร้าน", d: "ระยะระหว่างชั้นวางสินค้า", dims: [["ทางรอง", "90–120 ซม."], ["ทางหลัก", "120–180 ซม."]] },
    { t: "ชั้นวางสินค้า", d: "ระดับหยิบสินค้าได้สบาย", dims: [["ช่วงหยิบสบาย", "60–150 ซม."], ["สูงสุดที่เอื้อม", "180 ซม."]] },
  ] },
  { cat: "บันได / ราวจับ", icon: "🪜", items: [
    { t: "ลูกตั้ง-ลูกนอน", d: "สัดส่วนขั้นบันไดที่ปลอดภัย", dims: [["ลูกตั้ง (สูง)", "15–18 ซม."], ["ลูกนอน (ลึก)", "25–30 ซม."]] },
    { t: "ราวจับ + ความกว้าง", d: "ราวจับและความกว้างบันได", dims: [["สูงราวจับ", "80–90 ซม."], ["กว้างบันได", "≥ 90 ซม."], ["headroom เหนือหัว", "≥ 200 ซม."]] },
  ] },
  { cat: "ระยะเอื้อม / สายตา", icon: "👁️", items: [
    { t: "ระยะเอื้อม (ยืน)", d: "ระดับเอื้อมหยิบของ", dims: [["เอื้อมสูงสุด", "200–210 ซม."], ["เอื้อมสบาย", "140–160 ซม."]] },
    { t: "ระดับสายตา", d: "ใช้จัดป้าย/ของโชว์", dims: [["ยืน", "150–165 ซม."], ["นั่ง", "115–125 ซม."]] },
    { t: "ระดับแขวนภาพ", d: "จุดกึ่งกลางภาพจากพื้น", dims: [["กึ่งกลางภาพ", "145–150 ซม."]] },
  ] },
];

function HumanDim() {
  const [open, setOpen] = useState({ 0: true });
  const [q, setQ] = useState("");
  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }));
  return (
    <div>
      <SectionHead title="ขนาดมาตรฐานมนุษย์ (Human Dimension)" sub="ค่าการยศาสตร์มาตรฐานสำหรับออกแบบพื้นที่ภายใน" />
      <div style={{ background: "color-mix(in srgb, var(--accent2) 12%, transparent)", border: "1px solid var(--border)", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 12.5, display: "flex", gap: 8 }}>
        <AlertTriangle size={15} style={{ color: "var(--accent2)", flexShrink: 0, marginTop: 1 }} />
        เป็นค่ามาตรฐานทั่วไปเพื่อใช้อ้างอิงเบื้องต้น ควรปรับตามกลุ่มผู้ใช้จริง (เด็ก/ผู้สูงอายุ/วีลแชร์) และกฎหมายอาคารของแต่ละพื้นที่
      </div>
      <div style={{ position: "relative", marginBottom: 16, maxWidth: 360 }}>
        <Search size={16} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted)" }} />
        <input className="es-input" style={{ paddingLeft: 34 }} placeholder="ค้นหา เช่น เคาน์เตอร์ / ทางเดิน / เตียง" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {HUMAN_DIM.map((sec, i) => {
          const items = sec.items.filter((it) => !q || (it.t + it.d + JSON.stringify(it.dims)).includes(q));
          if (q && items.length === 0) return null;
          const isOpen = q ? true : open[i];
          return (
            <div key={i} className="es-card" style={{ overflow: "hidden" }}>
              <div onClick={() => toggle(i)} style={{ padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "color-mix(in srgb, var(--accent) 7%, var(--surface))" }}>
                <div style={{ fontSize: 22 }}>{sec.icon}</div>
                <strong style={{ flex: 1, fontSize: 15 }}>{sec.cat}</strong>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
              {isOpen && (
                <div style={{ padding: "6px 14px 14px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
                  {items.map((it, j) => (
                    <div key={j} className="es-soft" style={{ borderRadius: 12, padding: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{it.t}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, lineHeight: 1.5 }}>{it.d}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {it.dims.map(([l, v], k) => (
                          <div key={k} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 9px", fontSize: 12 }}>
                            <span style={{ color: "var(--muted)" }}>{l}: </span><strong style={{ color: "var(--accent)" }}>{v}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>อยากรู้ขนาดเฉพาะจุด พิมพ์ถามที่เมนูผู้ช่วย AI ได้ เช่น “ระยะเคาน์เตอร์บาร์สูงเท่าไหร่”</div>
    </div>
  );
}

function PrintModal({ project, totals, onClose }) {
  const { company, activeTemplate } = useApp();
  const tpl = activeTemplate;
  const t = totals;
  const today = new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" });
  const A = tpl.accent, A2 = tpl.accent2, HT = tpl.headerText;
  const showImg = tpl.showImages, breakdown = tpl.showCostBreakdown;
  const colSpan = (showImg ? 1 : 0) + (breakdown ? 9 : 6);
  let idx = 0;
  return (
    <div className="es-modal-bg" onClick={onClose}>
      <div style={{ background: "var(--surface)", borderRadius: 14, width: "100%", maxWidth: 860, maxHeight: "92vh", overflow: "auto", padding: 16 }} onClick={(e) => e.stopPropagation()}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>ตัวอย่าง · เทมเพลต “{tpl.name}”</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="es-btn es-btn-primary" onClick={() => window.print()}><FileDown size={16} /> พิมพ์ / บันทึก PDF</button>
            <button className="es-btn" onClick={onClose}><X size={16} /></button>
          </div>
        </div>
        <div id="print-area" style={{ background: "#fff", color: "#1a1a1a", padding: 36, fontFamily: tpl.font, fontSize: 13 }}>
          {tpl.accentBar && <div style={{ height: 8, background: `linear-gradient(90deg, ${A}, ${A2})`, borderRadius: 4, marginBottom: 20 }} />}

          {tpl.showCover && (
            <div style={{ textAlign: "center", padding: "60px 0 70px", borderBottom: `1px solid #eee`, marginBottom: 24, pageBreakAfter: "always" }}>
              {tpl.showLogo && company.logo && <img src={company.logo} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 16, marginBottom: 18 }} />}
              <div style={{ fontSize: 34, fontWeight: 800, color: A }}>{tpl.docTitle}</div>
              <div style={{ color: "#888", letterSpacing: 3, marginBottom: 30 }}>{tpl.docTitleEn}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{project.name}</div>
              <div style={{ color: "#666", marginTop: 6 }}>{project.type} · {project.style} · {project.area} ตร.ม.</div>
              <div style={{ marginTop: 40, color: "#444" }}>เสนอแด่ {project.client.name || "—"}<br />โดย {company.name}</div>
            </div>
          )}

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${A}`, paddingBottom: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 12 }}>
              {tpl.showLogo && company.logo && <img src={company.logo} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />}
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{company.name}</div>
                <div style={{ fontSize: 11, color: "#555" }}>{company.address}<br />โทร {company.phone} · เลขภาษี {company.taxId}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1, color: A }}>{tpl.docTitle}</div>
              <div style={{ fontSize: 11, color: "#555" }}>{tpl.docTitleEn}</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>เลขที่: {project.code}<br />วันที่: {today}</div>
            </div>
          </div>
          {/* Client */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 12 }}>
            <div><strong>เรียน:</strong> {project.client.name || "—"}<br />{project.client.company}<br />{project.client.address}</div>
            <div style={{ textAlign: "right" }}><strong>โครงการ:</strong> {project.name}<br />{project.type} · {project.style} · {project.area} ตร.ม.</div>
          </div>
          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
            <thead>
              <tr style={{ background: A, color: HT }}>
                <th style={{ padding: 6, textAlign: "center", width: 24 }}>#</th>
                {showImg && <th style={{ padding: 6, textAlign: "center", width: 40 }}>รูป</th>}
                <th style={{ padding: 6, textAlign: "left" }}>รายการ</th>
                <th style={{ padding: 6, textAlign: "center" }}>จำนวน</th>
                <th style={{ padding: 6, textAlign: "center" }}>หน่วย</th>
                {breakdown && <th style={{ padding: 6, textAlign: "right" }}>ค่าวัสดุ/หน่วย</th>}
                {breakdown && <th style={{ padding: 6, textAlign: "right" }}>รวมวัสดุ</th>}
                {breakdown && <th style={{ padding: 6, textAlign: "right" }}>ค่าแรง/หน่วย</th>}
                {breakdown && <th style={{ padding: 6, textAlign: "right" }}>รวมค่าแรง</th>}
                {!breakdown && <th style={{ padding: 6, textAlign: "right" }}>ราคา/หน่วย</th>}
                <th style={{ padding: 6, textAlign: "right" }}>รวม</th>
              </tr>
            </thead>
            <tbody>
              {project.sections.map((sec) => (
                <React.Fragment key={sec.id}>
                  <tr style={{ background: sec.color, color: "#fff" }}><td colSpan={colSpan} style={{ padding: "5px 7px", fontWeight: 700 }}>{sec.title}</td></tr>
                  {sec.rows.map((r) => {
                    const c = calcRow(r); idx++;
                    const unit = num(r.qty) ? c.lineSell / num(r.qty) : c.lineSell;
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{ padding: 5, textAlign: "center" }}>{idx}</td>
                        {showImg && <td style={{ padding: 4, textAlign: "center" }}>{r.image ? <img src={r.image} style={{ width: 34, height: 34, objectFit: "cover", borderRadius: 5 }} /> : ""}</td>}
                        <td style={{ padding: 5 }}>{r.name}{r.spec && <div style={{ fontSize: 9.5, color: "#777" }}>{r.spec}</div>}</td>
                        <td style={{ padding: 5, textAlign: "center" }}>{baht(r.qty)}</td>
                        <td style={{ padding: 5, textAlign: "center" }}>{r.unit}</td>
                        {breakdown && <td style={{ padding: 5, textAlign: "right" }}>{baht2(r.matUnitPrice)}</td>}
                        {breakdown && <td style={{ padding: 5, textAlign: "right" }}>{baht2(c.materialTotal)}</td>}
                        {breakdown && <td style={{ padding: 5, textAlign: "right" }}>{baht2(r.laborUnitPrice)}</td>}
                        {breakdown && <td style={{ padding: 5, textAlign: "right" }}>{baht2(c.laborTotal)}</td>}
                        {!breakdown && <td style={{ padding: 5, textAlign: "right" }}>{baht2(unit)}</td>}
                        <td style={{ padding: 5, textAlign: "right", fontWeight: 600 }}>{baht2(c.lineSell)}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <table style={{ fontSize: 12, minWidth: 280 }}>
              <tbody>
                {breakdown && <tr><td style={{ padding: "3px 10px", color: "#555" }}>รวมค่าวัสดุ</td><td style={{ padding: "3px 10px", textAlign: "right" }}>{baht2(t.sumMaterial)}</td></tr>}
                {breakdown && <tr><td style={{ padding: "3px 10px", color: "#555" }}>รวมค่าแรง</td><td style={{ padding: "3px 10px", textAlign: "right" }}>{baht2(t.sumLabor)}</td></tr>}
                <tr><td style={{ padding: "3px 10px", color: "#555" }}>รวมเป็นเงิน</td><td style={{ padding: "3px 10px", textAlign: "right" }}>{baht2(t.preVat)}</td></tr>
                {project.settings.vatEnabled && <tr><td style={{ padding: "3px 10px", color: "#555" }}>VAT {project.settings.vatPct}%</td><td style={{ padding: "3px 10px", textAlign: "right" }}>{baht2(t.vat)}</td></tr>}
                {t.wht > 0 && <tr><td style={{ padding: "3px 10px", color: "#555" }}>หัก ณ ที่จ่าย {project.settings.whtPct}%</td><td style={{ padding: "3px 10px", textAlign: "right" }}>-{baht2(t.wht)}</td></tr>}
                <tr style={{ borderTop: `2px solid ${A}`, fontWeight: 800, fontSize: 14, color: A }}><td style={{ padding: "6px 10px" }}>ยอดสุทธิ</td><td style={{ padding: "6px 10px", textAlign: "right" }}>{baht2(t.net)} ฿</td></tr>
              </tbody>
            </table>
          </div>
          {/* Terms + Sign */}
          <div style={{ marginTop: 24, fontSize: 11, color: "#555", whiteSpace: "pre-line" }}>
            <strong style={{ color: A }}>เงื่อนไข</strong>
            <div style={{ marginTop: 4 }}>{tpl.terms}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
            <div style={{ textAlign: "center", width: 200 }}>
              <div style={{ borderBottom: "1px solid #999", height: 50 }} />
              <div style={{ fontSize: 11, marginTop: 4 }}>ผู้อนุมัติ / ลูกค้า</div>
            </div>
            <div style={{ textAlign: "center", width: 200 }}>
              {company.signature && <img src={company.signature} style={{ height: 48, objectFit: "contain" }} />}
              <div style={{ borderBottom: "1px solid #999", height: company.signature ? 2 : 50 }} />
              <div style={{ fontSize: 11, marginTop: 4 }}>{company.proposer} · {company.proposerPos}</div>
            </div>
          </div>
          {tpl.footerText && <div style={{ textAlign: "center", marginTop: 28, fontSize: 11, color: A, fontStyle: "italic" }}>{tpl.footerText}</div>}
        </div>
      </div>
    </div>
  );
}

/* ============================== SHARED UI ============================== */
function SectionHead({ title, sub, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
      <div><h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{title}</h1>{sub && <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{sub}</div>}</div>
      {action}
    </div>
  );
}
function Field({ label, children }) { return <div style={{ marginBottom: 12 }}><label className="es-label">{label}</label>{children}</div>; }
function MiniField({ label, children }) { return <div><label className="es-label" style={{ fontSize: 11, marginBottom: 3 }}>{label}</label>{children}</div>; }
function Line({ k, v, bold }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0", fontWeight: bold ? 700 : 400 }}><span style={{ color: bold ? "var(--text)" : "var(--muted)" }}>{k}</span><span>{baht(v)} ฿</span></div>;
}
function StatusPill({ status }) {
  const map = { "ร่าง": ["var(--muted)", "var(--surface2)"], "ส่งแล้ว": ["#5b8def", "color-mix(in srgb,#5b8def 16%,transparent)"], "อนุมัติแล้ว": ["#2f6f4f", "color-mix(in srgb,#2f6f4f 16%,transparent)"], "แก้ไข": ["#c8a45c", "color-mix(in srgb,#c8a45c 20%,transparent)"], "ปิดงาน": ["var(--muted)", "var(--surface2)"] };
  const [c, bg] = map[status] || map["ร่าง"];
  return <span className="es-pill" style={{ color: c, background: bg }}>{status}</span>;
}
function ConfPill({ c }) {
  const map = { "สูง": "#2f6f4f", "กลาง": "#c8a45c", "ต่ำ": "var(--danger)" };
  return <span className="es-pill" style={{ color: map[c] || "var(--muted)", background: "color-mix(in srgb, currentColor 14%, transparent)", fontSize: 10 }}>{c}</span>;
}
function Skeleton() {
  return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[1, 2, 3].map((i) => <div key={i} className="es-soft" style={{ height: 56, borderRadius: 12, opacity: 0.6 }} />)}</div>;
}

function boqHealth(project) {
  const issues = [];
  let rowCount = 0;
  project.sections.forEach((s) => s.rows.forEach((r) => {
    rowCount++;
    if (r.matUnitPrice === 0 && r.laborUnitPrice === 0) issues.push(`"${r.name || "รายการว่าง"}" ยังไม่มีราคา`);
    if (r.profitPct < 8) issues.push(`"${r.name || "รายการ"}" กำไรต่ำกว่า 8%`);
  }));
  if (rowCount === 0) issues.push("ยังไม่มีรายการใน BOQ");
  if (!project.client.name) issues.push("ยังไม่ได้กรอกชื่อลูกค้า");
  const score = Math.max(0, Math.min(100, 100 - issues.length * 12));
  return { score, issues };
}
