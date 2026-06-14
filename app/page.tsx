"use client";
import dynamic from "next/dynamic";
const BoqApp = dynamic(() => import("../components/BoqApp"), { ssr: false });
export default function Page() {
  return <BoqApp />;
}
