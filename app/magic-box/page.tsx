"use client";

import Link from "next/link";

export default function MagicBoxPage() {
  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#FAF8F5", fontFamily: "Vazirmatn, sans-serif", padding: "30px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#1C1917", margin: 0 }}>🎁 جعبه جادویی شگفت‌انگیز هورلیا</h1>
          <Link href="/" style={{ fontSize: "12px", color: "#8E1B24", fontWeight: "bold", textDecoration: "none" }}>
            ← بازگشت به فروشگاه
          </Link>
        </div>

        <div style={{ background: "linear-gradient(135deg, #1C1917 0%, #3D332A 100%)", borderRadius: "24px", padding: "40px", color: "#FFFFFF", textAlign: "center", marginBottom: "30px" }}>
          <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>✨</span>
          <h2 style={{ fontSize: "22px", fontWeight: "900", marginBottom: "10px" }}>محصولات سورپرایز و پک‌های اختصاصی</h2>
          <p style={{ fontSize: "13px", color: "#CCC", maxWidth: "600px", margin: "0 auto 24px auto", lineHeight: "1.7" }}>
            با خرید جعبه جادویی هورلیا، ترکیبی از بهترین لوازم آرایشی و اکسسوری‌های رنگ ثابت را با تخفیف باورنکردنی ۴۰٪ تا ۷۰٪ دریافت کنید.
          </p>
          <button style={{ backgroundColor: "#D4AF37", color: "#1C1917", border: "none", padding: "12px 28px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>
            سفارش جعبه جادویی اختصاصی
          </button>
        </div>
      </div>
    </div>
  );
}