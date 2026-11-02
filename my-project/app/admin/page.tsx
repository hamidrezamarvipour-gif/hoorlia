"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProductSpec {
  skinType?: string;
  concern?: string;
  targetArea?: string;
  texture?: string;
  ingredients?: string;
}

interface Product {
  id: any;
  name: string;
  enName?: string;
  brand: string;
  category: string;
  size?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  galleryImages?: string[];
  description?: string;
  features?: string;
  specs?: ProductSpec;
  rating?: number;
  inStock?: boolean;
}

export default function ComprehensiveAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "header_branding" | "banners" | "categories" | "deals" | "footer" | "crm" | "coupons"
  >("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [smsTargetPhone, setSmsTargetPhone] = useState("");
  const [smsCustomText, setSmsCustomText] = useState("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCouponForm, setNewCouponForm] = useState({
    code: "",
    type: "percent",
    value: "",
    minOrder: "",
    maxDiscount: "",
  });

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);

  const [trackingInputs, setTrackingInputs] = useState<{ [key: string]: string }>({});
  const [smsNotification, setSmsNotification] = useState<string | null>(null);

  const [siteSettings, setSiteSettings] = useState({
    storeName: "لوکس‌استور",
    storeSubtitle: "LUXE & ACCESSIBLE",
    storeLogoLetter: "L",
    storeLogoImage: "",
    topBarAnnouncement: "✨ جشنواره پاییزه: ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان | کد تخفیف: LUXE",

    banner1Badge: "تخفیف تا ۶۰٪",
    banner1Title: "ست‌های لوکس کادویی",
    banner1Desc: "زیباترین بسته‌بندی مناسب هدیه با قیمت شگفت‌انگیز.",
    banner1BtnText: "مشاهده ست‌ها",
    banner1Link: "#deal-box",

    banner2Badge: "حراج پاییزی",
    banner2Title: "درخشش لوکس، با قیمتی کاملاً اقتصادی!",
    banner2Desc: "منتخب پرطرفدارترین محصولات آرایشی و اکسسوری‌های رنگ ثابت با گارانتی سلامت کالا.",
    banner2BtnText: "مشاهده محصولات ←",
    banner2Link: "#products-section",

    sliderBanners: [] as string[],

    circleCategories: [
      { title: "اکسسوری", icon: "💍", targetCategory: "طلا و نقره" },
      { title: "مراقبت پوست", icon: "✨", targetCategory: "مراقبت پوست" },
      { title: "آرایش صورت", icon: "💄", targetCategory: "آرایشی" },
      { title: "عطر و ادکلن", icon: "🌸", targetCategory: "عطر و اسپری" },
      { title: "مراقبت مو", icon: "💇‍♀️", targetCategory: "مراقبت و زیبایی مو" },
      { title: "پک‌های هدیه", icon: "🎁", targetCategory: "همه" },
    ],

    dealHours: 14,
    dealMinutes: 35,
    dealSeconds: 20,

    footerAboutTitle: "فروشگاه آنلاین لوکس‌استور",
    footerAboutText: "مرجع تخصصی خرید آنلاین اکسسوری‌های رنگ ثابت و محصولات بهداشتی و آرایشی با بالاترین استاندارد کیفیت و قیمت‌های اقتصادی مستقیم.",
    footerPhone: "۰۲۱-۹۱۰۰۵۰۰۰",
    footerInstagram: "@luxe_store",
    footerCopyright: "کلیه حقوق این وبسایت متعلق به فروشگاه لوکس‌استور می‌باشد.",
    footerTrustLogos: [] as { id: number; title: string; image: string; link?: string }[],
    footerCustomScript: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    enName: "",
    brand: "",
    category: "مراقبت پوست",
    size: "۵۰ میلی‌لیتر",
    price: "",
    oldPrice: "",
    discount: "",
    image: "",
    galleryImages: "",
    description: "",
    features: "",
    skinType: "خشک و حساس",
    concern: "خشکی شدید، قرمزی پوست",
    targetArea: "صورت و گردن",
    texture: "کرم با جذب سریع",
    ingredients: "هیالورونیک اسید، اوره ۵٪",
    rating: "4.8",
    inStock: true,
  });

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authenticated");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }

    fetchProducts();
    fetchOrders();

    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch(console.error);

    fetch("/api/setting")
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSiteSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(console.error);
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (data.url) {
        setSiteSettings({ ...siteSettings, storeLogoImage: data.url });
      }
    } catch {
      alert("خطا در آپلود لوگو");
    }
  };

  const handleSliderBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (data.url) {
        const updated = [...(siteSettings.sliderBanners || [])];
        updated[index] = data.url;
        setSiteSettings({ ...siteSettings, sliderBanners: updated });
      }
    } catch {
      alert("خطا در ارسال تصویر بنر");
    }
  };

  const removeSliderBanner = (index: number) => {
    const updated = [...(siteSettings.sliderBanners || [])];
    updated.splice(index, 1);
    setSiteSettings({ ...siteSettings, sliderBanners: updated });
  };

  const handleTrustLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      const data = await res.json();
      if (data.url) {
        const updated = (siteSettings.footerTrustLogos || []).map((item) =>
          item.id === id ? { ...item, image: data.url } : item
        );
        setSiteSettings({ ...siteSettings, footerTrustLogos: updated });
      }
    } catch {
      alert("خطا در آپلود نماد");
    }
  };

  const addTrustLogoField = () => {
    const newLogo = { id: Date.now(), title: "نماد جدید", image: "", link: "" };
    setSiteSettings({
      ...siteSettings,
      footerTrustLogos: [...(siteSettings.footerTrustLogos || []), newLogo],
    });
  };

  const removeTrustLogoField = (id: number) => {
    setSiteSettings({
      ...siteSettings,
      footerTrustLogos: (siteSettings.footerTrustLogos || []).filter((item) => item.id !== id),
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === "admin" && passwordInput === "123456") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setLoginError("");
    } else {
      setLoginError("نام کاربری یا رمز عبور اشتباه است (پیش‌فرض: admin / 123456)");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data.reverse());
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch("/api/setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });

      if (res.ok) {
        alert("✅ تنظیمات با موفقیت ذخیره شد!");
      } else {
        alert("خطا در ذخیره تنظیمات روی سرور");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    }
  };

  const resetProductForm = () => {
    setFormData({
      name: "",
      enName: "",
      brand: "",
      category: "مراقبت پوست",
      size: "۵۰ میلی‌لیتر",
      price: "",
      oldPrice: "",
      discount: "",
      image: "",
      galleryImages: "",
      description: "",
      features: "",
      skinType: "خشک و حساس",
      concern: "خشکی شدید، قرمزی پوست",
      targetArea: "صورت و گردن",
      texture: "کرم با جذب سریع",
      ingredients: "هیالورونیک اسید، اوره ۵٪",
      rating: "4.8",
      inStock: true,
    });
    setEditingId(null);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || "",
      enName: p.enName || "",
      brand: p.brand || "",
      category: p.category || "مراقبت پوست",
      size: p.size || "",
      price: String(p.price || ""),
      oldPrice: String(p.oldPrice || ""),
      discount: String(p.discount || ""),
      image: p.image || "",
      galleryImages: (p.galleryImages || []).join("\n"),
      description: p.description || "",
      features: p.features || "",
      skinType: p.specs?.skinType || "",
      concern: p.specs?.concern || "",
      targetArea: p.specs?.targetArea || "",
      texture: p.specs?.texture || "",
      ingredients: p.specs?.ingredients || "",
      rating: String(p.rating || 4.8),
      inStock: p.inStock ?? true,
    });
    setIsAddingProduct(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(formData.price) || 0;
    const oldPriceNum = Number(formData.oldPrice) || Math.round(priceNum * 1.35);
    const discountNum =
      Number(formData.discount) ||
      (oldPriceNum > priceNum ? Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100) : 0);

    const payload: Partial<Product> = {
      name: formData.name,
      enName: formData.enName,
      brand: formData.brand,
      category: formData.category,
      size: formData.size,
      price: priceNum,
      oldPrice: oldPriceNum,
      discount: discountNum,
      image: formData.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
      galleryImages: formData.galleryImages
        ? formData.galleryImages.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      description: formData.description,
      features: formData.features,
      specs: {
        skinType: formData.skinType,
        concern: formData.concern,
        targetArea: formData.targetArea,
        texture: formData.texture,
        ingredients: formData.ingredients,
      },
      rating: Number(formData.rating) || 4.8,
      inStock: formData.inStock,
    };

    try {
      if (editingId) {
        await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, id: Date.now() }),
        });
      }
      fetchProducts();
      resetProductForm();
    } catch {
      alert("خطا در ذخیره کالا");
    }
  };

  const handleDeleteProduct = async (id: any) => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        fetchProducts();
      } catch {
        alert("خطا در حذف کالا");
      }
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: any,
    newStatus: string,
    phone: string,
    customerName: string
  ) => {
    const trackingCode = trackingInputs[orderId] || "";

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, trackingCode }),
      });

      if (res.ok) {
        fetchOrders();
        if (newStatus === "shipped") {
          const sms = `پیامک به ${phone} ارسال شد:\n«سلام ${customerName} عزیز، مرسوله شما تحویل شرکت پست شد.\nکد رهگیری: ${
            trackingCode || "درج نشده"
          }\nسامانه رهگیری پست: tracking.post.ir»`;
          setSmsNotification(sms);
          setTimeout(() => setSmsNotification(null), 8000);
        }
      }
    } catch {
      alert("خطا در به‌روزرسانی وضعیت سفارش");
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          backgroundColor: "#FAF8F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Vazirmatn', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "36px 28px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid #EAE5DE",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #B38E5D, #D4AF37)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1C1917",
              fontWeight: "900",
              fontSize: "22px",
              margin: "0 auto 16px auto",
            }}
          >
            L
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: "0 0 6px 0" }}>ورود به پنل ادمین</h2>
          <p style={{ fontSize: "12px", color: "#777", margin: "0 0 20px 0" }}>دسترسی امن به تنظیمات و مدیریت فروشگاه</p>

          <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "right" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>نام کاربری</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                dir="ltr"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>رمز عبور</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                dir="ltr"
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {loginError && <span style={{ fontSize: "11px", color: "#DC2626", display: "block" }}>{loginError}</span>}

            <button
              type="submit"
              style={{
                backgroundColor: "#8E1B24",
                color: "#FFFFFF",
                border: "none",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "6px",
              }}
            >
              ورود به سیستم
            </button>
          </form>

          <Link href="/" style={{ display: "inline-block", marginTop: "20px", fontSize: "11px", color: "#888", textDecoration: "none" }}>
            ← بازگشت به صفحه اصلی فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F5F0",
        color: "#2D2D2D",
        direction: "rtl",
        textAlign: "right",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Vazirmatn', 'Segoe UI', sans-serif",
      }}
    >
      <header
        style={{
          backgroundColor: "#1C1917",
          color: "#FFFFFF",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "1px solid #2B2623",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #B38E5D, #D4AF37)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1C1917",
              fontWeight: "900",
              fontSize: "18px",
            }}
          >
            {siteSettings.storeLogoLetter}
          </div>
          <div>
            <h1 style={{ fontSize: "15px", fontWeight: "bold", margin: 0 }}>پنل ادمین جامع {siteSettings.storeName}</h1>
            <span style={{ fontSize: "11px", color: "#A68A68" }}>کنترل کامل ویترین، لوگو، بنرها، محصولات و فوتر</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href="/"
            target="_blank"
            style={{ backgroundColor: "#8E1B24", color: "#FFFFFF", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", textDecoration: "none" }}
          >
            👁️ مشاهده سایت
          </Link>
          <button
            onClick={handleAdminLogout}
            style={{ backgroundColor: "#332C27", color: "#EF4444", border: "1px solid #443B34", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
          >
            خروج ادمین 🚪
          </button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", minHeight: "calc(100vh - 67px)" }}>
        <aside
          style={{
            backgroundColor: "#FFFFFF",
            borderLeft: "1px solid #EAE5DE",
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: "bold", color: "#9E8A78", padding: "0 10px 6px 10px" }}>
            بخش‌های مدیریتی
          </div>

          {[
            { id: "dashboard", title: "داشبورد و آمار", icon: "📊" },
            { id: "products", title: "مدیریت کالاها", icon: "📦", badge: products.length },
            { id: "orders", title: "سفارش‌ها و ارسال", icon: "🚚", badge: orders.length },
            { id: "header_branding", title: "لوگو و هدر بالای سایت", icon: "🏷️" },
            { id: "banners", title: "بنرهای تبلیغاتی", icon: "🎨" },
            { id: "categories", title: "دسته‌بندی‌های دایره‌ای", icon: "🔘" },
            { id: "deals", title: "حراج و تایمر روزانه", icon: "🔥" },
            { id: "footer", title: "تنظیم کامل فوتر", icon: "📄" },
            { id: "crm", title: "مشتریان و پیامک (CRM)", icon: "👥", badge: customers.length },
            { id: "coupons", title: "کدهای تخفیف", icon: "🎟️", badge: coupons.length },
          ].map((item: any) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsAddingProduct(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: isSelected ? "800" : "600",
                  backgroundColor: isSelected ? "#FAF0F1" : "transparent",
                  color: isSelected ? "#8E1B24" : "#444",
                  borderRight: isSelected ? "4px solid #8E1B24" : "4px solid transparent",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "none",
                  cursor: "pointer",
                  textAlign: "right",
                  transition: "0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: isSelected ? "#8E1B24" : "#EAE5DE",
                      color: isSelected ? "#FFF" : "#555",
                      padding: "2px 7px",
                      borderRadius: "10px",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        <main style={{ padding: "30px", overflowX: "auto" }}>
          {smsNotification && (
            <div
              style={{
                backgroundColor: "#ECFDF5",
                border: "1.5px solid #10B981",
                color: "#065F46",
                padding: "14px 18px",
                borderRadius: "14px",
                marginBottom: "22px",
                fontSize: "12px",
                lineHeight: "1.8",
                whiteSpace: "pre-line",
                fontWeight: "bold",
              }}
            >
              🔔 {smsNotification}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 20px 0" }}>وضعیت کلی و خلاصه فروشگاه</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "30px" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "18px", border: "1px solid #EAE5DE" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>مجموع درآمد حاصل از فروش</span>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#8E1B24", marginTop: "8px" }}>
                    {totalSales.toLocaleString("fa-IR")} <span style={{ fontSize: "12px", color: "#555", fontWeight: "normal" }}>تومان</span>
                  </div>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "18px", border: "1px solid #EAE5DE" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>سفارش‌های ثبت شده</span>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#1C1917", marginTop: "8px" }}>
                    {orders.length} <span style={{ fontSize: "12px", color: "#555", fontWeight: "normal" }}>سفارش</span>
                  </div>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "18px", border: "1px solid #EAE5DE" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>کالاهای فعال در کاتالوگ</span>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#1C1917", marginTop: "8px" }}>
                    {products.length} <span style={{ fontSize: "12px", color: "#555", fontWeight: "normal" }}>محصول</span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "22px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 16px 0" }}>آخرین تراکنش‌ها و سفارش‌ها</h3>
                {orders.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>هنوز سفارشی ثبت نشده است.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {orders.slice(0, 5).map((o) => (
                      <div
                        key={o.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 14px",
                          backgroundColor: "#FAF8F5",
                          borderRadius: "12px",
                          border: "1px solid #F0ECE4",
                          fontSize: "12px",
                        }}
                      >
                        <div>
                          <strong>{o.fullName}</strong>
                          <span style={{ color: "#888", marginRight: "10px" }} dir="ltr">({o.phone})</span>
                          <span style={{ color: "#AAA", marginRight: "10px" }}>کد #{o.id}</span>
                        </div>
                        <span style={{ fontWeight: "900", color: "#8E1B24" }}>{Number(o.totalPrice).toLocaleString("fa-IR")} تومان</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              {!isAddingProduct ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <h2 style={{ fontSize: "17px", fontWeight: "900", margin: 0 }}>کاتالوگ کالاها ({products.length})</h2>
                    <button
                      onClick={() => {
                        resetProductForm();
                        setIsAddingProduct(true);
                      }}
                      style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
                    >
                      + افزودن کالای جدید
                    </button>
                  </div>

                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #EAE5DE", color: "#666" }}>
                          <th style={{ padding: "14px 16px" }}>عکس</th>
                          <th style={{ padding: "14px 16px" }}>عنوان کالا و برند</th>
                          <th style={{ padding: "14px 16px" }}>دسته‌بندی و حجم</th>
                          <th style={{ padding: "14px 16px" }}>قیمت</th>
                          <th style={{ padding: "14px 16px", textAlign: "center" }}>عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} style={{ borderBottom: "1px solid #F5F2EC" }}>
                            <td style={{ padding: "12px 16px" }}>
                              <img src={p.image} alt={p.name} style={{ width: "45px", height: "45px", objectFit: "contain", borderRadius: "8px", border: "1px solid #EAE5DE", backgroundColor: "#FAF8F5" }} />
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontWeight: "bold", color: "#1C1917" }}>{p.name}</div>
                              <div style={{ fontSize: "11px", color: "#A68A68", marginTop: "2px" }}>{p.brand} {p.enName && `| ${p.enName}`}</div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span>{p.category}</span>
                              <span style={{ display: "block", fontSize: "11px", color: "#888", marginTop: "2px" }}>{p.size || "فاقد سایز"}</span>
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#8E1B24" }}>{p.price.toLocaleString("fa-IR")} تومان</td>
                            <td style={{ padding: "12px 16px", textAlign: "center" }}>
                              <button onClick={() => handleEditProduct(p)} style={{ backgroundColor: "#FAF0E6", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", marginLeft: "6px" }}>
                                ویرایش
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
                                حذف
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #EAE5DE", padding: "30px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", borderBottom: "1px solid #EAE5DE", paddingBottom: "14px" }}>
                    <h2 style={{ fontSize: "17px", fontWeight: "900", margin: 0 }}>{editingId ? "ویرایش مشخصات کالا" : "ثبت محصول جدید با مشخصات کامل"}</h2>
                    <button onClick={resetProductForm} style={{ background: "none", border: "1px solid #DDD", padding: "6px 14px", borderRadius: "10px", fontSize: "12px", cursor: "pointer" }}>
                      انصراف و بازگشت
                    </button>
                  </div>

                  <form onSubmit={handleSubmitProduct} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>عنوان فارسی محصول *</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "right" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>عنوان انگلیسی</label>
                        <input type="text" dir="ltr" value={formData.enName} onChange={(e) => setFormData({ ...formData, enName: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "left" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>برند سازنده *</label>
                        <input required type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "right" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>دسته‌بندی</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px" }}>
                          {["آرایشی", "مراقبت پوست", "مراقبت و زیبایی مو", "بهداشت شخصی و حمام", "مکمل غذایی و ورزشی", "عطر و اسپری", "لوازم برقی", "مد و پوشاک", "کالای دیجیتال", "طلا و نقره"].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>قیمت فروش (تومان) *</label>
                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "right" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>حجم / سایز کالا</label>
                        <input type="text" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "right" }} />
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>آدرس عکس اصلی محصول</label>
                        <input type="text" dir="ltr" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px" }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>توضیحات و درباره محصول</label>
                      <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", resize: "none", textAlign: "right" }} />
                    </div>

                    <button type="submit" style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", width: "fit-content" }}>
                      ذخیره کالا
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "24px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 16px 0" }}>مدیریت سفارش‌ها و ارسال پستی</h2>
              {orders.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>هیچ سفارشی ثبت نشده است.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {orders.map((o) => (
                    <div key={o.id} style={{ border: "1px solid #EAE5DE", borderRadius: "16px", padding: "18px", backgroundColor: "#FAF8F5" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ECE6DC", paddingBottom: "12px", marginBottom: "12px" }}>
                        <div>
                          <strong style={{ fontSize: "14px" }}>{o.fullName}</strong>
                          <span style={{ fontSize: "12px", color: "#8E1B24", marginRight: "10px", fontWeight: "bold" }} dir="ltr">({o.phone})</span>
                          <span style={{ fontSize: "11px", color: "#888", marginRight: "10px" }}>کد سفارش: #{o.id}</span>
                        </div>
                        <span style={{ fontWeight: "900", color: "#8E1B24", fontSize: "15px" }}>{Number(o.totalPrice).toLocaleString("fa-IR")} تومان</span>
                      </div>

                      <div style={{ fontSize: "12px", color: "#555", marginBottom: "10px", lineHeight: "1.7" }}>
                        📍 <strong>نشانی:</strong> {o.province}، {o.city}، {o.address} (کدپستی: <span dir="ltr">{o.postalCode}</span>)
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", margin: "12px 0" }}>
                        {[
                          { key: "supply", title: "تامین کالا" },
                          { key: "warehouse", title: "پردازش انبار" },
                          { key: "shipped", title: "ارسال و رهگیری" },
                          { key: "delivered", title: "تحویل مشتری" },
                        ].map((st) => {
                          const isCurrent = (o.status || "supply") === st.key;
                          return (
                            <button
                              key={st.key}
                              onClick={() => handleUpdateOrderStatus(o.id, st.key, o.phone, o.fullName)}
                              style={{
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: isCurrent ? "2px solid #8E1B24" : "1px solid #DDD",
                                backgroundColor: isCurrent ? "#FDF2F2" : "#FFF",
                                color: isCurrent ? "#8E1B24" : "#666",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              {st.title}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#444" }}>کد رهگیری پست:</span>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder={o.trackingCode || "کد ۲۴ رقمی پست"}
                          value={trackingInputs[o.id] !== undefined ? trackingInputs[o.id] : o.trackingCode || ""}
                          onChange={(e) => setTrackingInputs({ ...trackingInputs, [o.id]: e.target.value })}
                          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", textAlign: "center" }}
                        />
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, "shipped", o.phone, o.fullName)}
                          style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                        >
                          ثبت و ارسال پیامک
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "header_branding" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 18px 0" }}>تنظیم لوگوی تصویری و متن نوار قرمز بالا</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "650px" }}>
                <div style={{ border: "1.5px dashed #C5A880", borderRadius: "16px", padding: "20px", backgroundColor: "#FAF8F5" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", color: "#1C1917", marginBottom: "8px" }}>
                    🖼️ آپلود لوگوی فروشگاه (تصویر PNG بدون پس‌زمینه):
                  </label>
                  <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleLogoUpload} style={{ fontSize: "12px", cursor: "pointer" }} />

                  {siteSettings.storeLogoImage && (
                    <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#666" }}>پیش‌نمایش لوگو:</span>
                      <img
                        src={siteSettings.storeLogoImage}
                        alt="Logo Preview"
                        style={{ maxHeight: "50px", maxWidth: "160px", objectFit: "contain", backgroundColor: "#FFF", padding: "4px 8px", borderRadius: "8px", border: "1px solid #E5E0D8" }}
                      />
                      <button
                        type="button"
                        onClick={() => setSiteSettings({ ...siteSettings, storeLogoImage: "" })}
                        style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                      >
                        حذف لوگو
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#555", marginBottom: "6px" }}>
                    📢 متن نوار قرمز بالای سایت (جشنواره / اطلاعیه):
                  </label>
                  <input
                    type="text"
                    value={siteSettings.topBarAnnouncement}
                    onChange={(e) => setSiteSettings({ ...siteSettings, topBarAnnouncement: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", textAlign: "right" }}
                  />
                </div>
              </div>

              <button
                onClick={saveSettings}
                style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "12px 26px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", marginTop: "24px" }}
              >
                ذخیره تنظیمات لوگو و نوار بالا
              </button>
            </div>
          )}

          {activeTab === "banners" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <div>
                  <h2 style={{ fontSize: "17px", fontWeight: "900", margin: 0 }}>اسلایدر بنرهای بالای صفحه اول (ورق‌زن ۳ ثانیه‌ای)</h2>
                  <p style={{ fontSize: "12px", color: "#777", margin: "4px 0 0 0" }}>
                    می‌توانید تا ۵ تصویر بنر آپلود کنید. تصاویر هر ۳ ثانیه به صورت خودکار ورق می‌خورند (هیچ‌کدام اجباری نیست).
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const currentImage = (siteSettings.sliderBanners || [])[idx];
                  return (
                    <div
                      key={idx}
                      style={{
                        border: currentImage ? "1.5px solid #10B981" : "1.5px dashed #C5A880",
                        borderRadius: "16px",
                        padding: "16px",
                        backgroundColor: "#FAF8F5",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", color: "#1C1917" }}>
                          بنر شماره {idx + 1} {idx === 0 ? "(پیش‌فرض اول)" : "(اختیاری)"}
                        </span>
                        {currentImage && (
                          <button
                            type="button"
                            onClick={() => removeSliderBanner(idx)}
                            style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                          >
                            حذف
                          </button>
                        )}
                      </div>

                      <input type="file" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleSliderBannerUpload(e, idx)} style={{ fontSize: "11px", cursor: "pointer" }} />

                      {currentImage ? (
                        <div style={{ width: "100%", height: "110px", borderRadius: "10px", overflow: "hidden", border: "1px solid #E5E0D8" }}>
                          <img src={currentImage} alt={`بنر ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ width: "100%", height: "110px", borderRadius: "10px", border: "1px dashed #DDD", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAA", fontSize: "11px" }}>
                          تصویری انتخاب نشده
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={saveSettings}
                style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "12px 26px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
              >
                ذخیره بنرهای اسلایدر
              </button>
            </div>
          )}

          {activeTab === "categories" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 18px 0" }}>تنظیم لوگو و عناوین دسته‌بندی‌های دایره‌ای</h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                {siteSettings.circleCategories.map((cat, idx) => (
                  <div key={idx} style={{ border: "1px solid #EAE5DE", borderRadius: "14px", padding: "14px", backgroundColor: "#FAF8F5" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                      <input
                        type="text"
                        value={cat.icon}
                        onChange={(e) => {
                          const updated = [...siteSettings.circleCategories];
                          updated[idx].icon = e.target.value;
                          setSiteSettings({ ...siteSettings, circleCategories: updated });
                        }}
                        style={{ width: "45px", height: "45px", textAlign: "center", fontSize: "20px", borderRadius: "10px", border: "1px solid #CCC" }}
                      />
                      <input
                        type="text"
                        value={cat.title}
                        onChange={(e) => {
                          const updated = [...siteSettings.circleCategories];
                          updated[idx].title = e.target.value;
                          setSiteSettings({ ...siteSettings, circleCategories: updated });
                        }}
                        style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", border: "1px solid #CCC", fontSize: "13px", fontWeight: "bold" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={saveSettings}
                style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", marginTop: "20px" }}
              >
                ذخیره دسته‌بندی‌های دایره‌ای
              </button>
            </div>
          )}

          {activeTab === "deals" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "24px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 18px 0" }}>تنظیمات ساعت و تایمر حراج روزانه</h2>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>ساعت</label>
                  <input
                    type="number"
                    value={siteSettings.dealHours}
                    onChange={(e) => setSiteSettings({ ...siteSettings, dealHours: Number(e.target.value) })}
                    style={{ width: "75px", padding: "8px", borderRadius: "8px", border: "1px solid #DDD", textAlign: "center" }}
                  />
                </div>
                <span style={{ fontWeight: "bold", marginTop: "16px" }}>:</span>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>دقیقه</label>
                  <input
                    type="number"
                    value={siteSettings.dealMinutes}
                    onChange={(e) => setSiteSettings({ ...siteSettings, dealMinutes: Number(e.target.value) })}
                    style={{ width: "75px", padding: "8px", borderRadius: "8px", border: "1px solid #DDD", textAlign: "center" }}
                  />
                </div>
                <span style={{ fontWeight: "bold", marginTop: "16px" }}>:</span>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>ثانیه</label>
                  <input
                    type="number"
                    value={siteSettings.dealSeconds}
                    onChange={(e) => setSiteSettings({ ...siteSettings, dealSeconds: Number(e.target.value) })}
                    style={{ width: "75px", padding: "8px", borderRadius: "8px", border: "1px solid #DDD", textAlign: "center" }}
                  />
                </div>
              </div>
              <button
                onClick={saveSettings}
                style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
              >
                به‌روزرسانی تایمر حراج
              </button>
            </div>
          )}

          {activeTab === "footer" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 18px 0" }}>تنظیم کامل فوتر، اطلاعات تماس و نمادهای اعتماد</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "750px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>عنوان معرفی فروشگاه در فوتر:</label>
                  <input
                    type="text"
                    value={siteSettings.footerAboutTitle}
                    onChange={(e) => setSiteSettings({ ...siteSettings, footerAboutTitle: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "right" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>متن درباره فروشگاه در فوتر:</label>
                  <textarea
                    rows={3}
                    value={siteSettings.footerAboutText}
                    onChange={(e) => setSiteSettings({ ...siteSettings, footerAboutText: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", resize: "none", textAlign: "right" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>شماره تماس پشتیبانی:</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={siteSettings.footerPhone}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerPhone: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "right" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>آیدی اینستاگرام:</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={siteSettings.footerInstagram}
                      onChange={(e) => setSiteSettings({ ...siteSettings, footerInstagram: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "left" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>متن کپی‌رایت انتهای صفحه:</label>
                  <input
                    type="text"
                    value={siteSettings.footerCopyright}
                    onChange={(e) => setSiteSettings({ ...siteSettings, footerCopyright: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "right" }}
                  />
                </div>

                <div style={{ borderTop: "1.5px solid #F0ECE4", paddingTop: "18px", marginTop: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <div>
                      <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1C1917", margin: 0 }}>🛡️ نمادهای اعتماد و لوگوهای پرداخت (اینماد، درگاه بانکی، اسنپ‌پی و ...)</h3>
                      <p style={{ fontSize: "11px", color: "#777", margin: "4px 0 0 0" }}>می‌توانید به تعداد دلخواه لوگو و لینک مربوطه را اضافه کنید.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addTrustLogoField}
                      style={{ backgroundColor: "#1C1917", color: "#FFF", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
                    >
                      + افزودن نماد جدید
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(siteSettings.footerTrustLogos || []).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "140px 1fr 1fr auto",
                          gap: "10px",
                          alignItems: "center",
                          padding: "12px",
                          backgroundColor: "#FAF8F5",
                          borderRadius: "12px",
                          border: "1px solid #EAE5DE",
                        }}
                      >
                        <div>
                          <input
                            type="text"
                            placeholder="عنوان نماد (مثلاً اینماد)"
                            value={item.title}
                            onChange={(e) => {
                              const updated = siteSettings.footerTrustLogos.map((x) =>
                                x.id === item.id ? { ...x, title: e.target.value } : x
                              );
                              setSiteSettings({ ...siteSettings, footerTrustLogos: updated });
                            }}
                            style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "11px" }}
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            dir="ltr"
                            placeholder="لینک اعتبارسنجی (اختیاری)"
                            value={item.link || ""}
                            onChange={(e) => {
                              const updated = siteSettings.footerTrustLogos.map((x) =>
                                x.id === item.id ? { ...x, link: e.target.value } : x
                              );
                              setSiteSettings({ ...siteSettings, footerTrustLogos: updated });
                            }}
                            style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "11px", textAlign: "left" }}
                          />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTrustLogoUpload(e, item.id)}
                            style={{ fontSize: "10px", width: "130px" }}
                          />
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "6px", backgroundColor: "#FFF", border: "1px solid #DDD" }}
                            />
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeTrustLogoField(item.id)}
                          style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", cursor: "pointer" }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {(siteSettings.footerTrustLogos || []).length === 0 && (
                      <div style={{ textAlign: "center", padding: "20px", color: "#999", fontSize: "12px", border: "1px dashed #DDD", borderRadius: "12px" }}>
                        هنوز نمادی ثبت نشده است. روی دکمه «+ افزودن نماد جدید» کلیک کنید.
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>
                    کد اختصاصی اینماد / ساماندهی (اختیاری برای کدهای Embed):
                  </label>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={siteSettings.footerCustomScript || ""}
                    onChange={(e) => setSiteSettings({ ...siteSettings, footerCustomScript: e.target.value })}
                    placeholder="<a referrerpolicy='origin' target='_blank' href='...'><img src='...' /></a>"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "11px", fontFamily: "monospace", textAlign: "left" }}
                  />
                </div>
              </div>

              <button
                onClick={saveSettings}
                style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", marginTop: "24px" }}
              >
                ذخیره تنظیمات فوتر و نمادها
              </button>
            </div>
          )}

          {activeTab === "crm" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "17px", fontWeight: "900", margin: 0 }}>باشگاه مشتریان و سامانه پیامکی (CRM)</h2>
                  <p style={{ fontSize: "12px", color: "#777", margin: "4px 0 0 0" }}>
                    مشاهده سوابق خرید کاربران، وفادارسازی و ارسال پیامک‌های مناسبتی یا کد تخفیف.
                  </p>
                </div>
              </div>

              <div style={{ border: "1.5px solid #F0ECE4", borderRadius: "16px", padding: "18px", backgroundColor: "#FAF8F5", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 10px 0" }}>💬 ارسال پیامک سریع یا اطلاع‌رسانی:</h3>
                <div style={{ display: "grid", gridTemplateColumns: "220px 1fr auto", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="شماره موبایل (یا خالی برای همه)"
                    value={smsTargetPhone}
                    onChange={(e) => setSmsTargetPhone(e.target.value)}
                    style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", textAlign: "left" }}
                  />
                  <input
                    type="text"
                    placeholder="متن پیامک (مثال: سلام، کد تخفیف ۲۰٪ ویژه خرید دوم: LUXE20)"
                    value={smsCustomText}
                    onChange={(e) => setSmsCustomText(e.target.value)}
                    style={{ padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px" }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!smsCustomText) return alert("متن پیامک را وارد کنید");
                      const target = smsTargetPhone || "همه مشتریان";
                      await fetch("/api/sms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ phone: smsTargetPhone, message: smsCustomText }),
                      });
                      alert(`پیامک با موفقیت برای ${target} ثبت و ارسال شد.`);
                      setSmsCustomText("");
                    }}
                    style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "9px 18px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    ارسال پیامک
                  </button>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #EAE5DE", color: "#666" }}>
                      <th style={{ padding: "12px 14px" }}>نام مشتری</th>
                      <th style={{ padding: "12px 14px" }}>شماره تماس</th>
                      <th style={{ padding: "12px 14px" }}>شهر / استان</th>
                      <th style={{ padding: "12px 14px" }}>تعداد سفارش</th>
                      <th style={{ padding: "12px 14px" }}>مجموع خرید</th>
                      <th style={{ padding: "12px 14px" }}>سطح کاربر</th>
                      <th style={{ padding: "12px 14px", textAlign: "center" }}>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, i) => {
                      const isVip = c.totalSpent > 1000000 || c.orderCount >= 3;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #F5F2EC" }}>
                          <td style={{ padding: "12px 14px", fontWeight: "bold" }}>{c.fullName}</td>
                          <td style={{ padding: "12px 14px" }} dir="ltr">{c.phone}</td>
                          <td style={{ padding: "12px 14px" }}>{c.province}، {c.city}</td>
                          <td style={{ padding: "12px 14px" }}>{c.orderCount} سفارش</td>
                          <td style={{ padding: "12px 14px", color: "#8E1B24", fontWeight: "bold" }}>
                            {c.totalSpent.toLocaleString("fa-IR")} تومان
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "bold",
                              backgroundColor: isVip ? "#FEF3C7" : "#F3F4F6",
                              color: isVip ? "#92400E" : "#4B5563"
                            }}>
                              {isVip ? "⭐ مشتری وفادار (VIP)" : "کاربر عادی"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <button
                              onClick={() => {
                                setSmsTargetPhone(c.phone);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              style={{ backgroundColor: "#FAF0E6", border: "none", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
                            >
                              ارسال پیامک اختصاصی
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                          هنوز مشتری یا سفارشی برای تحلیل ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* تب مدیریت کدهای تخفیف و جشنواره */}
          {activeTab === "coupons" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 16px 0" }}>مدیریت کوپن‌ها و کدهای تخفیف</h2>

              {/* فرم افزودن کوپن جدید */}
              <div style={{ border: "1.5px solid #F0ECE4", borderRadius: "16px", padding: "20px", backgroundColor: "#FAF8F5", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 14px 0" }}>+ تعریف کد تخفیف جدید:</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newCouponForm.code || !newCouponForm.value) return alert("کد و مقدار الزامی است");

                    const res = await fetch("/api/coupons", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newCouponForm),
                    });

                    if (res.ok) {
                      const refresh = await fetch("/api/coupons").then((r) => r.json());
                      if (Array.isArray(refresh)) setCoupons(refresh);
                      setNewCouponForm({ code: "", type: "percent", value: "", minOrder: "", maxDiscount: "" });
                      alert("کد تخفیف جدید فعال شد!");
                    }
                  }}
                  style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", alignItems: "end" }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>کد کوپن (انگلیسی):</label>
                    <input
                      required
                      type="text"
                      dir="ltr"
                      placeholder="مثلاً YALDA"
                      value={newCouponForm.code}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", textTransform: "uppercase" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>نوع تخفیف:</label>
                    <select
                      value={newCouponForm.type}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px" }}
                    >
                      <option value="percent">درصدی (٪)</option>
                      <option value="fixed">مبلغ ثابت (تومان)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>مقدار تخفیف:</label>
                    <input
                      required
                      type="number"
                      placeholder={newCouponForm.type === "percent" ? "مثلاً ۲۰ (درصد)" : "مثلاً ۵۰۰۰۰ (تومان)"}
                      value={newCouponForm.value}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, value: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>حداقل خرید (تومان):</label>
                    <input
                      type="number"
                      placeholder="اختیاری (مثلاً ۲۰۰ هزار)"
                      value={newCouponForm.minOrder}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrder: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px" }}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      style={{ width: "100%", backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                    >
                      ثبت و فعال‌سازی کد
                    </button>
                  </div>
                </form>
              </div>

              {/* لیست کدهای موجود */}
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #EAE5DE", color: "#666" }}>
                    <th style={{ padding: "12px" }}>کد تخفیف</th>
                    <th style={{ padding: "12px" }}>میزان تخفیف</th>
                    <th style={{ padding: "12px" }}>شرط حداقل خرید</th>
                    <th style={{ padding: "12px" }}>وضعیت</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid #F5F2EC" }}>
                      <td style={{ padding: "12px", fontWeight: "900", color: "#1C1917" }} dir="ltr">
                        {c.code}
                      </td>
                      <td style={{ padding: "12px", fontWeight: "bold", color: "#8E1B24" }}>
                        {c.type === "percent" ? `%${c.value}` : `${Number(c.value).toLocaleString("fa-IR")} تومان`}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {c.minOrder ? `${Number(c.minOrder).toLocaleString("fa-IR")} تومان` : "بدون محدودیت"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ backgroundColor: "#DCFCE7", color: "#166534", padding: "3px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>
                          فعال
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={async () => {
                            if (confirm(`حذف کد تخفیف ${c.code}؟`)) {
                              await fetch(`/api/coupons?id=${c.id}`, { method: "DELETE" });
                              setCoupons(coupons.filter((x) => x.id !== c.id));
                            }
                          }}
                          style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}

                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                        هیچ کد تخفیفی ثبت نشده است.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}