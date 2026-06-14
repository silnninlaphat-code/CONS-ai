"use client";
import dynamic from "next/dynamic";

// โหลด BoqApp เฉพาะฝั่งเบราว์เซอร์ (ssr:false) เพื่อให้ build/deploy ผ่านแน่นอน
const BoqApp = dynamic(() => import("@/components/BoqApp"), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#16241b" }}>
      กำลังโหลด CONS...
    </div>
  ),
});

export default function Home() { return <BoqApp />; }
