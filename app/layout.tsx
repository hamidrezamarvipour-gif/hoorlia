import type { Metadata, Viewport } from "next";
import "./fontiran.css";
import "./globals.css";

// تنظیمات تم بار و اسکیل برای نمایش بهینه در حالت اپلیکیشن
export const viewport: Viewport = {
  themeColor: "#8E1B24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "فروشگاه تخصصی لوازم آرایشی هورلیا",
    template: "%s | هورلیا",
  },
  description: "خرید آنلاین انواع لوازم آرایشی و بهداشتی اصل با بهترین کیفیت و ارسال سریع در هورلیا",
  keywords: ["لوازم آرایشی", "هورلیا", "خرید رژ لب", "مراقبت پوست", "آرایشی بهداشتی"],
  authors: [{ name: "Hoorlia" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ثبت کالا هورلیا",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "فروشگاه اینترنتی هورلیا",
    description: "مرجع تخصصی محصولات آرایشی و بهداشتی",
    url: "https://hoorlia.ir",
    siteName: "Hoorlia Store",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, padding: 0 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: "فروشگاه تخصصی لوازم آرایشی هورلیا",
              url: "https://hoorlia.ir",
              description: "مرجع تخصصی خرید آنلاین لوازم آرایشی و بهداشتی اصل",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}