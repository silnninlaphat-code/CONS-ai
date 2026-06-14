import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CONS — Interior OS",
  description: "ระบบบริหารงานออกแบบ & ก่อสร้างครบวงจร",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body style={{ margin: 0, background: "#fafbfa" }}>{children}</body>
    </html>
  );
}
