"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MagazinePage() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArticles(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#FAF8F5", fontFamily: "Vazirmatn, sans-serif", padding: "30px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#1C1917", margin: 0 }}>مجله زیبایی و مراقبت تخصصی</h1>
          <Link href="/" style={{ fontSize: "12px", color: "#8E1B24", fontWeight: "bold", textDecoration: "none" }}>
            ← بازگشت به فروشگاه
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {articles.map((art) => (
            <div key={art.id} style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", border: "1px solid #EAE5DE", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <img src={art.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80"} alt={art.title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              <div style={{ padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{art.date} • {art.readTime || "۵ دقیقه"} مطالعه</div>
                  <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1C1917", margin: "0 0 8px 0", lineHeight: "1.5" }}>{art.title}</h3>
                  <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.6", margin: 0 }}>{art.excerpt}</p>
                </div>
                <Link
                  href={`/mag/${art.id}`}
                  style={{ display: "inline-block", marginTop: "16px", backgroundColor: "#FAF0F1", color: "#8E1B24", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", textDecoration: "none", textAlign: "center" }}
                >
                  مطالعه کامل مقاله ←
                </Link>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999", fontSize: "13px" }}>
              در حال حاضر مقاله‌ای منتشر نشده است.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}