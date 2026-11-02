"use client";

import { useState } from "react";
import Link from "next/link";

export default function QuickAddProductPWA() {
  const [formData, setFormData] = useState({
    name: "",
    enName: "",
    brand: "",
    category: "مراقبت پوست",
    price: "",
    discount: "0",
    size: "۵۰ میلی‌لیتر",
    image: "",
    gallery2: "",
    gallery3: "",
    colors: "صورتی کلاسیک, قرمز مخملی, نود طبیعی",
    skinType: "خشک و حساس",
    concern: "خشکی شدید و قرمزی پوست",
    targetArea: "صورت و گردن",
    brandOrigin: "فرانسه / ایران",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview1, setImagePreview1] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const [imagePreview3, setImagePreview3] = useState<string | null>(null);

  // تابع فشرده‌سازی و تبدیل عکس به Base64
  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: "image" | "gallery2" | "gallery3",
    setPreview: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setPreview(compressed);
          setFormData((prev) => ({ ...prev, [targetField]: compressed }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.brand) {
      alert("لطفاً فیلدهای ضروری (عنوان، برند و قیمت) را پر کنید");
      return;
    }

    setLoading(true);
    const priceNum = Number(formData.price) || 0;
    const discountNum = Number(formData.discount) || 0;

    // آماده‌سازی گالری و رنگ‌ها
    const galleryList = [formData.image, formData.gallery2, formData.gallery3].filter(Boolean);
    const colorList = formData.colors ? formData.colors.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const payload = {
      id: Date.now(),
      name: formData.name.trim(),
      enName: formData.enName.trim(),
      brand: formData.brand.trim(),
      category: formData.category,
      size: formData.size.trim(),
      price: priceNum,
      discount: discountNum,
      image: formData.image || galleryList[0] || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
      galleryImages: galleryList,
      colors: colorList,
      description: formData.description.trim(),
      specs: {
        skinType: formData.skinType,
        concern: formData.concern,
        targetArea: formData.targetArea,
        brandOrigin: formData.brandOrigin,
      },
      inStock: true,
      rating: 5,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("✅ کالا با گالری ۳ عکسی، رنگ‌بندی و مشخصات کامل به فروشگاه اضافه شد!");
        setFormData({
          name: "",
          enName: "",
          brand: "",
          category: formData.category,
          price: "",
          discount: "0",
          size: "۵۰ میلی‌لیتر",
          image: "",
          gallery2: "",
          gallery3: "",
          colors: "صورتی کلاسیک, قرمز مخملی, نود طبیعی",
          skinType: "خشک و حساس",
          concern: "خشکی شدید و قرمزی پوست",
          targetArea: "صورت و گردن",
          brandOrigin: "فرانسه / ایران",
          description: "",
        });
        setImagePreview1(null);
        setImagePreview2(null);
        setImagePreview3(null);
      } else {
        alert("خطا در ذخیره کالا روی سرور: " + (data.error || "خطای ناشناخته"));
      }
    } catch {
      alert("خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F5F0",
        padding: "16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Vazirmatn', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #EAE5DE",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid #ECE6DC", paddingBottom: "12px" }}>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: "900", margin: 0, color: "#1C1917" }}>ثبت سریع کالا (PWA) - کامل</h1>
            <span style={{ fontSize: "11px", color: "#888" }}>افزودن فوری با گالری ۳ عکسی و مشخصات فنی</span>
          </div>
          <Link href="/admin" style={{ fontSize: "12px", color: "#8E1B24", textDecoration: "none", fontWeight: "bold" }}>
            پنل دسکتاپ ←
          </Link>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>عنوان فارسی محصول *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>برند سازنده *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>عنوان انگلیسی</label>
              <input
                type="text"
                dir="ltr"
                value={formData.enName}
                onChange={(e) => setFormData({ ...formData, enName: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>قیمت فروش (تومان) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#8E1B24", marginBottom: "4px" }}>
                درصد تخفیف (٪)
              </label>
              <input
                type="number"
                min="0"
                max="99"
                placeholder="0"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1.5px solid #8E1B24", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>دسته‌بندی</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }}
              >
                {["آرایشی", "مراقبت پوست", "مراقبت و زیبایی مو", "بهداشت شخصی و حمام", "مکمل غذایی و ورزشی", "عطر و اسپری", "لوازم برقی", "مد و پوشاک", "کالای دیجیتال", "طلا و نقره"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>حجم / سایز کالا</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* بخش آپلود ۳ عکس گالری مجزا */}
          <div style={{ border: "1.5px dashed #D4AF37", borderRadius: "12px", padding: "14px", backgroundColor: "#FAF8F5" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#1C1917", marginBottom: "10px" }}>
              📸 آپلود ۳ عکس گالری محصول از داخل سیستم:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "3px" }}>عکس ۱ (اصلی):</span>
                <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, "image", setImagePreview1)} style={{ fontSize: "9px", width: "100%" }} />
                {imagePreview1 && <img src={imagePreview1} alt="" style={{ width: "45px", height: "45px", objectFit: "cover", marginTop: "4px", borderRadius: "6px", border: "1px solid #DDD" }} />}
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "3px" }}>عکس ۲ (گالری):</span>
                <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, "gallery2", setImagePreview2)} style={{ fontSize: "9px", width: "100%" }} />
                {imagePreview2 && <img src={imagePreview2} alt="" style={{ width: "45px", height: "45px", objectFit: "cover", marginTop: "4px", borderRadius: "6px", border: "1px solid #DDD" }} />}
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#666", display: "block", marginBottom: "3px" }}>عکس ۳ (گالری):</span>
                <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, "gallery3", setImagePreview3)} style={{ fontSize: "9px", width: "100%" }} />
                {imagePreview3 && <img src={imagePreview3} alt="" style={{ width: "45px", height: "45px", objectFit: "cover", marginTop: "4px", borderRadius: "6px", border: "1px solid #DDD" }} />}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>طیف رنگ‌ها (با کاما جدا کنید)</label>
            <input
              type="text"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              placeholder="صورتی کلاسیک, قرمز مخملی, نود طبیعی"
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>نوع پوست مناسب:</label>
              <input type="text" value={formData.skinType} onChange={(e) => setFormData({ ...formData, skinType: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #DDD", fontSize: "12px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>کارکرد / دغدغه:</label>
              <input type="text" value={formData.concern} onChange={(e) => setFormData({ ...formData, concern: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #DDD", fontSize: "12px", boxSizing: "border-box" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "4px" }}>توضیحات کوتاه محصول</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", resize: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? "#999" : "#8E1B24",
              color: "#FFF",
              border: "none",
              padding: "14px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "900",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(142, 27, 36, 0.25)",
            }}
          >
            {loading ? "در حال ثبت کالا..." : "➕ ذخیره فوری محصول"}
          </button>
        </form>
      </div>
    </div>
  );
}