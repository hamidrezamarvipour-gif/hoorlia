import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "فروشگاه آنلاین اختصاصی",
  description: "خرید آنلاین انواع محصولات با کیفیت برتر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}