import "./globals.css";

export const metadata = {
  title: "CONS — BOQ Studio",
  description: "BOQ · ใบเสนอราคา · แผนงานก่อสร้าง · สัญญา สำหรับนักออกแบบไทย",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="th"><body>{children}</body></html>);
}
