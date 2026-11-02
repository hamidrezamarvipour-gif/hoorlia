"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProductSpec {
  skinType?: string;
  concern?: string;
  targetArea?: string;
  texture?: string;
  ingredients?: string;
  brandOrigin?: string;
  ageRange?: string;
}

interface Product {
  id?: any;
  _id?: any;
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
  colors?: { name: string; hex: string }[];
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
    | "dashboard"
    | "products"
    | "orders"
    | "header_branding"
    | "banners"
    | "categories"
    | "deals"
    | "footer"
    | "crm"
    | "coupons"
    | "users"
    | "setting"
    | "articles"
  >("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([
    { username: "admin", role: "superadmin", addedDate: "1403/08/01" }
  ]);

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

  const [articleForm, setArticleForm] = useState({
    title: "",
    readTime: "۵ دقیقه",
    image: "",
    excerpt: "",
    content: "",
  });
  const [editingArticleId, setEditingArticleId] = useState<any>(null);

  // پالت رنگ پیشرفته برای انتخاب رنگ محصول
  const [colorListInput, setColorListInput] = useState<{ name: string; hex: string }[]>([
    { name: "صورتی کلاسیک", hex: "#FFC0CB" },
    { name: "قرمز مخملی", hex: "#8E1B24" },
    { name: "نود طبیعی", hex: "#E3BC9A" },
  ]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#B38E5D");

  const [siteSettings, setSiteSettings] = useState({
    storeName: "لوکس‌استور",
    storeSubtitle: "LUXE & ACCESSIBLE",
    storeLogoLetter: "L",
    storeLogoImage: "",
    topBarAnnouncement: "✨ جشنواره پاییزه: ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان | کد تخفیف: LUXE",
    sliderBanners: [] as string[],
    circleCategories: [
      { title: "اکسسوری", icon: "💍", targetCategory: "طلا و نقره" },
      { title: "مراقبت پوست", icon: "✨", targetCategory: "مراقبت پوست" },
      { title: "آرایش صورت", icon: "💄", targetCategory: "آرایشی" },
      { title: "عطر و ادکلن", icon: "🌸", targetCategory: "عطر و اسپری" },
      { title: "مراقبت مو", icon: "💇‍♀️", targetCategory: "مراقبت و زیبایی مو" },
      { title: "پک‌های هدیه", icon: "🎁", targetCategory: "همه" },
    ],
    dealTargetTime: Date.now() + 24 * 3600 * 1000,
    footerAboutTitle: "فروشگاه آنلاین لوکس‌استور",
    footerAboutText: "مرجع تخصصی خرید آنلاین اکسسوری‌های رنگ ثابت و محصولات بهداشتی و آرایشی با بالاترین استاندارد کیفیت.",
    footerPhone: "۰۲۱-۹۱۰۰۵۰۰۰",
    footerInstagram: "@luxe_store",
    footerTelegram: "@hoorlia_support",
    footerWhatsapp: "989150000000",
    footerBale: "hoorlia",
    footerCopyright: "کلیه حقوق این وبسایت متعلق به فروشگاه لوکس‌استور می‌باشد.",
    footerTrustLogos: [] as { id: number; title: string; image: string; link?: string }[],
    footerCustomScript: "",
    zarinpalMerchantId: "14c784bb-bd83-4f8e-b2f8-1a2a3be24d79",
    snappPayClientId: "",
    activeGateway: "zarinpal",
    smsApiKey: "",
    templateOtp: 538129,
    templateOrder: 100001,
    templateTracking: 240906,
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
    gallery1: "",
    gallery2: "",
    gallery3: "",
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

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      const data = await res.json();
      if (Array.isArray(data)) setArticles(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        sessionStorage.getItem("admin_authenticated") === "true" ||
        localStorage.getItem("admin_authenticated") === "true";
      if (isAuth) setIsAuthenticated(true);
    }

    fetchProducts();
    fetchOrders();
    fetchArticles();

    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch(() => {});

    fetch("/api/setting")
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSiteSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCoupons(data);
      })
      .catch(() => {});
  }, []);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) setSiteSettings({ ...siteSettings, storeLogoImage: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSliderBannerUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
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
          const optimizedBanner = canvas.toDataURL("image/jpeg", 0.9);
          const updated = [...(siteSettings.sliderBanners || [])];
          updated[index] = optimizedBanner;
          setSiteSettings({ ...siteSettings, sliderBanners: updated });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeSliderBanner = (index: number) => {
    const updated = [...(siteSettings.sliderBanners || [])];
    updated.splice(index, 1);
    setSiteSettings({ ...siteSettings, sliderBanners: updated });
  };

  const handleCategoryIconUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const updated = [...siteSettings.circleCategories];
        updated[index] = { ...updated[index], icon: base64 };
        setSiteSettings({ ...siteSettings, circleCategories: updated });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTrustLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        const updated = (siteSettings.footerTrustLogos || []).map((item) =>
          item.id === id ? { ...item, image: base64 } : item
        );
        setSiteSettings({ ...siteSettings, footerTrustLogos: updated });
      }
    };
    reader.readAsDataURL(file);
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
      gallery1: "",
      gallery2: "",
      gallery3: "",
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
    setColorListInput([
      { name: "صورتی کلاسیک", hex: "#FFC0CB" },
      { name: "قرمز مخملی", hex: "#8E1B24" },
      { name: "نود طبیعی", hex: "#E3BC9A" },
    ]);
    setEditingId(null);
    setIsAddingProduct(false);
  };

  const handleEditProduct = (p: Product) => {
    setEditingId(p.id || p._id);
    const gal = p.galleryImages || [];
    setFormData({
      name: p.name || "",
      enName: p.enName || "",
      brand: p.brand || "",
      category: p.category || "مراقبت پوست",
      size: p.size || "",
      price: String(p.price || ""),
      oldPrice: String(p.oldPrice || ""),
      discount: String(p.discount || "0"),
      image: p.image || "",
      gallery1: gal[0] || "",
      gallery2: gal[1] || "",
      gallery3: gal[2] || "",
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
    if (p.colors && p.colors.length > 0) {
      setColorListInput(p.colors as any);
    }
    setIsAddingProduct(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(formData.price) || 0;
    const discountNum = Number(formData.discount) || 0;
    let oldPriceNum = 0;

    if (discountNum > 0 && priceNum > 0) {
      oldPriceNum = Math.round(priceNum / (1 - discountNum / 100));
    } else if (Number(formData.oldPrice) > priceNum) {
      oldPriceNum = Number(formData.oldPrice);
    }

    const galleryList = [formData.gallery1, formData.gallery2, formData.gallery3].filter(Boolean);

    const payload: any = {
      name: formData.name,
      enName: formData.enName,
      brand: formData.brand,
      category: formData.category,
      size: formData.size,
      price: priceNum,
      oldPrice: oldPriceNum,
      discount: discountNum,
      image: formData.image || galleryList[0] || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
      galleryImages: galleryList,
      colors: colorListInput,
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
      const targetId = editingId || Date.now();
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: targetId }),
      });

      if (res.ok) {
        alert("✅ کالا با موفقیت ذخیره شد.");
        fetchProducts();
        resetProductForm();
      } else {
        const err = await res.json().catch(() => ({}));
        alert("خطا در ذخیره کالا: " + (err.error || ""));
      }
    } catch {
      alert("خطا در ذخیره کالا");
    }
  };

  const handleDeleteProduct = async (id: any) => {
    if (!confirm("آیا از حذف این کالا اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p: any) => String(p.id || p._id) !== String(id)));
        alert("✅ کالا حذف شد.");
      }
    } catch {
      alert("خطا در حذف کالا");
    }
  };

  const handleUpdateOrderStatus = async (orderId: any, newStatus: string, phone: string, customerName: string) => {
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
          await fetch("/api/sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: phone,
              templateId: siteSettings.templateTracking || 240906,
              parameters: [
                { name: "Name", value: customerName || "مشتری گرامی" },
                { name: "Code", value: trackingCode || "درج نشده" },
                { name: "TrackingCode", value: trackingCode || "درج نشده" },
              ],
            }),
          });
          setSmsNotification(`پیامک رهگیری با موفقیت به شماره ${phone} ارسال شد.`);
          setTimeout(() => setSmsNotification(null), 6000);
        }
      }
    } catch {
      alert("خطا در به‌روزرسانی سفارش");
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);

  if (!isAuthenticated) {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#FAF8F5", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "Vazirmatn, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: "380px", backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "32px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid #EAE5DE", textAlign: "center" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "14px", background: "linear-gradient(135deg, #B38E5D, #D4AF37)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1917", fontWeight: "900", fontSize: "22px", margin: "0 auto 16px auto" }}>L</div>
          <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: "0 0 6px 0" }}>ورود به پنل ادمین</h2>
          <p style={{ fontSize: "12px", color: "#777", margin: "0 0 20px 0" }}>دسترسی امن به تنظیمات و مدیریت فروشگاه</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (usernameInput.trim() === "admin" && passwordInput.trim() === "123456") {
              sessionStorage.setItem("admin_authenticated", "true");
              setIsAuthenticated(true);
            } else {
              setLoginError("نام کاربری یا رمز عبور اشتباه است (پیش‌فرض: admin / 123456)");
            }
          }} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "right" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>نام کاربری</label>
              <input type="text" required value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="admin" dir="ltr" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>رمز عبور</label>
              <input type="password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="••••••" dir="ltr" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px", boxSizing: "border-box" }} />
            </div>
            {loginError && <span style={{ fontSize: "11px", color: "#DC2626" }}>{loginError}</span>}
            <button type="submit" style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "12px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>ورود به سیستم</button>
          </form>
          <Link href="/" style={{ display: "inline-block", marginTop: "20px", fontSize: "11px", color: "#888", textDecoration: "none" }}>← بازگشت به صفحه اصلی</Link>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: "#F7F5F0", color: "#2D2D2D", textAlign: "right", fontFamily: "Vazirmatn, sans-serif" }}>
      <header style={{ backgroundColor: "#1C1917", color: "#FFFFFF", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid #2B2623" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #B38E5D, #D4AF37)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1917", fontWeight: "900", fontSize: "18px" }}>{siteSettings.storeLogoLetter}</div>
          <div>
            <h1 style={{ fontSize: "15px", fontWeight: "bold", margin: 0 }}>پنل ادمین جامع {siteSettings.storeName}</h1>
            <span style={{ fontSize: "11px", color: "#A68A68" }}>کنترل کامل ویترین، محصولات، سفارشات و درگاه‌ها</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/" target="_blank" style={{ backgroundColor: "#8E1B24", color: "#FFFFFF", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", textDecoration: "none" }}>👁️ مشاهده سایت</Link>
          <button onClick={() => { sessionStorage.removeItem("admin_authenticated"); setIsAuthenticated(false); }} style={{ backgroundColor: "#332C27", color: "#EF4444", border: "1px solid #443B34", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>خروج ادمین 🚪</button>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", minHeight: "calc(100vh - 67px)" }}>
        <aside style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid #EAE5DE", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ fontSize: "11px", fontWeight: "bold", color: "#9E8A78", padding: "0 10px 6px 10px" }}>بخش‌های مدیریتی</div>

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
            { id: "users", title: "مدیران و دسترسی‌ها", icon: "👥", badge: adminsList.length },
            { id: "setting", title: "تنظیمات فروشگاه و درگاه", icon: "⚙️" },
            { id: "articles", title: "مجله و مقالات سئو", icon: "📰", badge: articles.length },
            { id: "coupons", title: "کدهای تخفیف", icon: "🎟️", badge: coupons.length },
          ].map((item: any) => {
            const isSelected = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsAddingProduct(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: "12px", fontSize: "13px", fontWeight: isSelected ? "800" : "600", backgroundColor: isSelected ? "#FAF0F1" : "transparent", color: isSelected ? "#8E1B24" : "#444", borderRight: isSelected ? "4px solid #8E1B24" : "4px solid transparent", borderLeft: "none", borderTop: "none", borderBottom: "none", cursor: "pointer", textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                {item.badge !== undefined && (
                  <span style={{ fontSize: "11px", backgroundColor: isSelected ? "#8E1B24" : "#EAE5DE", color: isSelected ? "#FFF" : "#555", padding: "2px 7px", borderRadius: "10px" }}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </aside>

        <main style={{ padding: "30px", overflowX: "auto" }}>
          {smsNotification && (
            <div style={{ backgroundColor: "#ECFDF5", border: "1.5px solid #10B981", color: "#065F46", padding: "14px 18px", borderRadius: "14px", marginBottom: "22px", fontSize: "12px", fontWeight: "bold" }}>
              🔔 {smsNotification}
            </div>
          )}

          {/* ۱. داشبورد و آمار */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "900", margin: 0 }}>📊 آمار دقیق فروش، نمودارها و گزارشات</h2>
                <a href="/api/admin/export-excel" download style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#10B981", color: "#FFFFFF", padding: "9px 18px", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "12px" }}>
                  📥 دانلود گزارش ماهانه (Excel)
                </a>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "18px", border: "1px solid #EAE5DE" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>کل درآمد فروش</span>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#8E1B24", marginTop: "8px" }}>{totalSales.toLocaleString("fa-IR")} تومان</div>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "18px", border: "1px solid #EAE5DE" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>تعداد سفارش‌ها</span>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#1C1917", marginTop: "8px" }}>{orders.length} سفارش</div>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "18px", border: "1px solid #EAE5DE" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>محصولات فعال کاتالوگ</span>
                  <div style={{ fontSize: "22px", fontWeight: "900", color: "#1C1917", marginTop: "8px" }}>{products.length} کالا</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "20px", border: "1px solid #EAE5DE" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>📈 نمودار میله‌ای درآمد روزانه</h3>
                  <div style={{ height: "180px", display: "flex", alignItems: "flex-end", gap: "12px", paddingBottom: "10px", borderBottom: "2px solid #EEE" }}>
                    {[40, 70, 55, 90, 65, 85, 100].map((val, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "100%", height: `${val}%`, backgroundColor: "#8E1B24", borderRadius: "6px 6px 0 0" }} />
                        <span style={{ fontSize: "10px", color: "#777" }}>روز {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", padding: "24px", borderRadius: "20px", border: "1px solid #EAE5DE", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>🥧 نمودار دایره‌ای وضعیت دسته‌بندی‌ها</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                    <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "conic-gradient(#8E1B24 0% 45%, #D4AF37 45% 75%, #1C1917 75% 100%)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                    <div style={{ fontSize: "11px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div><span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#8E1B24", borderRadius: "2px", marginLeft: "6px" }}></span>مراقبت پوست (۴۵٪)</div>
                      <div><span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#D4AF37", borderRadius: "2px", marginLeft: "6px" }}></span>آرایشی (۳۰٪)</div>
                      <div><span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#1C1917", borderRadius: "2px", marginLeft: "6px" }}></span>سایر (۲۵٪)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ۲. مدیریت کالاها (با طیف رنگ انتخابی) */}
          {activeTab === "products" && (
            <div>
              {!isAddingProduct ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <h2 style={{ fontSize: "17px", fontWeight: "900", margin: 0 }}>📦 مدیریت کالاها ({products.length})</h2>
                    <button onClick={() => { resetProductForm(); setIsAddingProduct(true); }} style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>+ افزودن کالای جدید</button>
                  </div>

                  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #EAE5DE", color: "#666" }}>
                          <th style={{ padding: "14px 16px" }}>عکس</th>
                          <th style={{ padding: "14px 16px" }}>عنوان کالا و برند</th>
                          <th style={{ padding: "14px 16px" }}>دسته‌بندی و رنگ‌ها</th>
                          <th style={{ padding: "14px 16px" }}>قیمت</th>
                          <th style={{ padding: "14px 16px", textAlign: "center" }}>عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p: any) => {
                          const prodId = p.id || p._id;
                          return (
                            <tr key={prodId} style={{ borderBottom: "1px solid #F5F2EC" }}>
                              <td style={{ padding: "12px 16px" }}><img src={p.image} alt="" style={{ width: "45px", height: "45px", objectFit: "contain", borderRadius: "8px", border: "1px solid #EAE5DE", backgroundColor: "#FAF8F5" }} /></td>
                              <td style={{ padding: "12px 16px" }}>
                                <Link href={`/products/${prodId}`} style={{ fontWeight: "bold", color: "#1C1917", textDecoration: "none" }}>{p.name}</Link>
                                <div style={{ fontSize: "11px", color: "#A68A68", marginTop: "2px" }}>{p.brand}</div>
                              </td>
                              <td style={{ padding: "12px 16px" }}>
                                <span>{p.category}</span>
                                <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                                  {p.colors?.map((col: any, ci: number) => (
                                    <span key={ci} title={col.name} style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: col.hex, border: "1px solid #CCC", display: "inline-block" }} />
                                  ))}
                                </div>
                              </td>
                              <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#8E1B24" }}>{p.price?.toLocaleString("fa-IR")} تومان</td>
                              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                <Link href={`/products/${prodId}`} style={{ backgroundColor: "#E6F4EA", color: "#137333", padding: "6px 10px", borderRadius: "8px", textDecoration: "none", fontSize: "11px", fontWeight: "bold", marginLeft: "6px" }}>مشاهده</Link>
                                <button onClick={() => handleEditProduct(p)} style={{ backgroundColor: "#FAF0E6", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", marginLeft: "6px" }}>ویرایش</button>
                                <button onClick={() => handleDeleteProduct(prodId)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>حذف</button>
                              </td>
                            </tr>
                          );
                        })}
                        {products.length === 0 && (
                          <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#888" }}>هیچ محصولی در دیتابیس ثبت نشده است.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #EAE5DE", padding: "30px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", borderBottom: "1px solid #EAE5DE", paddingBottom: "14px" }}>
                    <h2 style={{ fontSize: "17px", fontWeight: "900", margin: 0 }}>{editingId ? "ویرایش کالا" : "ثبت محصول جدید با پالت رنگی"}</h2>
                    <button onClick={resetProductForm} style={{ background: "none", border: "1px solid #DDD", padding: "6px 14px", borderRadius: "10px", fontSize: "12px", cursor: "pointer" }}>انصراف</button>
                  </div>

                  <form onSubmit={handleSubmitProduct} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>عنوان فارسی محصول *</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>برند سازنده *</label>
                        <input required type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>دسته‌بندی</label>
                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", boxSizing: "border-box" }}>
                          {["آرایشی", "مراقبت پوست", "مراقبت و زیبایی مو", "بهداشت شخصی", "عطر و اسپری", "طلا و نقره"].map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>قیمت فروش (تومان) *</label>
                        <input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#8E1B24", fontWeight: "bold", marginBottom: "6px" }}>تخفیف (٪ - اختیاری)</label>
                        <input type="number" min="0" max="99" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} style={{ width: "100%", padding: "9px 12px", borderRadius: "10px", border: "1.5px solid #8E1B24", fontSize: "12px", boxSizing: "border-box" }} />
                      </div>
                    </div>

                    {/* بخش پالت رنگ پویا */}
                    <div style={{ border: "1.5px solid #E5E0D8", borderRadius: "16px", padding: "16px", backgroundColor: "#FAF8F5" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#1C1917", marginBottom: "10px" }}>🎨 مدیریت رنگ‌ها و طیف‌های محصول:</label>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                        {colorListInput.map((col, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#FFF", padding: "6px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px" }}>
                            <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: col.hex, border: "1px solid #CCC" }} />
                            <span>{col.name}</span>
                            <button type="button" onClick={() => setColorListInput(colorListInput.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: "#DC2626", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>×</button>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input type="text" placeholder="نام رنگ (مثلاً قرمز اناری)" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px" }} />
                        <input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} style={{ width: "36px", height: "32px", border: "none", cursor: "pointer", background: "none" }} />
                        <button type="button" onClick={() => { if (newColorName) { setColorListInput([...colorListInput, { name: newColorName, hex: newColorHex }]); setNewColorName(""); }}} style={{ backgroundColor: "#1C1917", color: "#FFF", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>+ افزودن رنگ</button>
                      </div>
                    </div>

                    {/* آپلود گالری ۳ عکسی */}
                    <div style={{ border: "1.5px dashed #C5A880", borderRadius: "16px", padding: "16px", backgroundColor: "#FAF8F5" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#1C1917", marginBottom: "10px" }}>📸 آپلود ۳ عکس گالری کالا:</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                        <div>
                          <span style={{ fontSize: "11px", color: "#555", display: "block", marginBottom: "4px" }}>عکس اصلی:</span>
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setFormData({ ...formData, image: ev.target?.result as string, gallery1: ev.target?.result as string });
                            reader.readAsDataURL(file);
                          }} style={{ fontSize: "10px" }} />
                          {formData.image && <img src={formData.image} alt="" style={{ width: "45px", height: "45px", objectFit: "contain", marginTop: "6px", borderRadius: "6px", border: "1px solid #DDD" }} />}
                        </div>
                        <div>
                          <span style={{ fontSize: "11px", color: "#555", display: "block", marginBottom: "4px" }}>عکس دوم:</span>
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setFormData({ ...formData, gallery2: ev.target?.result as string });
                            reader.readAsDataURL(file);
                          }} style={{ fontSize: "10px" }} />
                          {formData.gallery2 && <img src={formData.gallery2} alt="" style={{ width: "45px", height: "45px", objectFit: "contain", marginTop: "6px", borderRadius: "6px", border: "1px solid #DDD" }} />}
                        </div>
                        <div>
                          <span style={{ fontSize: "11px", color: "#555", display: "block", marginBottom: "4px" }}>عکس سوم:</span>
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setFormData({ ...formData, gallery3: ev.target?.result as string });
                            reader.readAsDataURL(file);
                          }} style={{ fontSize: "10px" }} />
                          {formData.gallery3 && <img src={formData.gallery3} alt="" style={{ width: "45px", height: "45px", objectFit: "contain", marginTop: "6px", borderRadius: "6px", border: "1px solid #DDD" }} />}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>توضیحات محصول</label>
                      <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>

                    <button type="submit" style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", width: "fit-content" }}>ذخیره کالا در دیتابیس</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ۳. سفارش‌ها و ارسال (با تغییر رنگ پویا: قرمز -> زرد -> سبز) */}
          {activeTab === "orders" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "24px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 16px 0" }}>🚚 مدیریت سفارش‌ها و وضعیت پستی</h2>
              {orders.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#888" }}>هیچ سفارشی تاکنون ثبت نشده است.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {orders.map((o: any) => {
                    const st = o.status || "supply";
                    // تعیین رنگ بر اساس مرحله سفارش
                    let statusBg = "#FEE2E2"; // قرمز برای شروع (تامین)
                    let statusColor = "#DC2626";
                    let statusText = "در حال تامین کالا (قرمز)";
                    if (st === "warehouse" || st === "processing") {
                      statusBg = "#FEF3C7"; // زرد (پردازش)
                      statusColor = "#D97706";
                      statusText = "پردازش انبار (زرد)";
                    } else if (st === "shipped" || st === "delivered") {
                      statusBg = "#D1FAE5"; // سبز (ارسال شده)
                      statusColor = "#059669";
                      statusText = "ارسال شده / تحویل (سبز)";
                    }

                    return (
                      <div key={o.id} style={{ border: `1.5px solid ${statusColor}`, borderRadius: "16px", padding: "18px", backgroundColor: "#FAF8F5" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ECE6DC", paddingBottom: "12px", marginBottom: "12px" }}>
                          <div>
                            <strong style={{ fontSize: "14px" }}>{o.fullName}</strong>
                            <span style={{ fontSize: "12px", color: "#8E1B24", marginRight: "10px", fontWeight: "bold" }} dir="ltr">({o.phone})</span>
                            <span style={{ fontSize: "11px", color: "#888", marginRight: "10px" }}>کد سفارش: #{o.id}</span>
                          </div>
                          <span style={{ backgroundColor: statusBg, color: statusColor, padding: "4px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold" }}>{statusText}</span>
                        </div>

                        <div style={{ fontSize: "12px", color: "#555", marginBottom: "12px", lineHeight: "1.7" }}>
                          📍 <strong>نشانی:</strong> {o.province}، {o.city}، {o.address} (کدپستی: <span dir="ltr">{o.postalCode}</span>)
                        </div>

                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", fontWeight: "bold" }}>تغییر وضعیت:</span>
                          <button onClick={() => handleUpdateOrderStatus(o.id, "supply", o.phone, o.fullName)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}>تامین (قرمز)</button>
                          <button onClick={() => handleUpdateOrderStatus(o.id, "warehouse", o.phone, o.fullName)} style={{ backgroundColor: "#FEF3C7", color: "#D97706", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}>پردازش (زرد)</button>
                          <button onClick={() => handleUpdateOrderStatus(o.id, "shipped", o.phone, o.fullName)} style={{ backgroundColor: "#D1FAE5", color: "#059669", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}>ارسال و پیامک (سبز)</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ۴. لوگو و هدر بالای سایت (با پشتیبانی از GIF) */}
          {activeTab === "header_branding" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px", maxWidth: "700px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 16px 0" }}>🏷️ تنظیم لوگو، هدر متحرک (GIF) و نوار تخفیف</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ border: "1.5px dashed #C5A880", borderRadius: "16px", padding: "18px", backgroundColor: "#FAF8F5" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "bold", marginBottom: "8px" }}>🖼️ آپلود لوگو (پشتیبانی از فرمت‌های PNG, JPG, GIF):</label>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ fontSize: "12px" }} />
                  {siteSettings.storeLogoImage && (
                    <div style={{ marginTop: "12px" }}>
                      <img src={siteSettings.storeLogoImage} alt="Logo" style={{ maxHeight: "50px", objectFit: "contain", backgroundColor: "#FFF", padding: "4px", borderRadius: "8px", border: "1px solid #DDD" }} />
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>متن نوار اعلامیه بالا:</label>
                  <input type="text" value={siteSettings.topBarAnnouncement} onChange={(e) => setSiteSettings({ ...siteSettings, topBarAnnouncement: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "13px" }} />
                </div>

                <button onClick={saveSettings} style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", width: "fit-content" }}>ذخیره تنظیمات هدر</button>
              </div>
            </div>
          )}

          {/* ۵. بنرهای تبلیغاتی (حداکثر ۵ بنر با ورق‌زن ۳ ثانیه‌ای) */}
          {activeTab === "banners" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 6px 0" }}>🎨 اسلایدر بنرهای تبلیغاتی (سایز ۱۲۰۰ در ۵۰۰ - چرخش ۳ ثانیه‌ای)</h2>
              <p style={{ fontSize: "12px", color: "#777", marginBottom: "20px" }}>تا ۵ بنر قابل آپلود است که به صورت خودکار هر ۳ ثانیه ورق می‌خورند.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                {[0, 1, 2, 3, 4].map((idx) => {
                  const currentImage = (siteSettings.sliderBanners || [])[idx];
                  return (
                    <div key={idx} style={{ border: currentImage ? "1.5px solid #10B981" : "1.5px dashed #C5A880", borderRadius: "16px", padding: "16px", backgroundColor: "#FAF8F5" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: "bold" }}>بنر شماره {idx + 1}</span>
                        {currentImage && <button type="button" onClick={() => removeSliderBanner(idx)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>حذف</button>}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleSliderBannerUpload(e, idx)} style={{ fontSize: "11px", marginBottom: "10px" }} />
                      {currentImage ? (
                        <div style={{ width: "100%", height: "100px", borderRadius: "8px", overflow: "hidden", border: "1px solid #DDD" }}>
                          <img src={currentImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ width: "100%", height: "100px", borderRadius: "8px", border: "1px dashed #DDD", display: "flex", alignItems: "center", justifyContent: "center", color: "#AAA", fontSize: "11px" }}>بدون تصویر</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={saveSettings} style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>ذخیره بنرهای اسلایدر</button>
            </div>
          )}

          {/* ۶. دسته‌بندی‌های دایره‌ای */}
          {activeTab === "categories" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 8px 0" }}>🔘 مدیریت دسته‌بندی‌های دایره‌ای صفحه اصلی</h2>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>می‌توانید عکس یا آیکون اختصاصی با فرمت دلخواه برای هر دایره آپلود کنید.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                {siteSettings.circleCategories.map((cat: any, idx: number) => (
                  <div key={idx} style={{ border: "1px solid #EAE5DE", borderRadius: "16px", padding: "16px", backgroundColor: "#FAF8F5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#FFF", border: "1px solid #DDD", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {cat.icon?.startsWith("data:image") || cat.icon?.startsWith("http") ? (
                          <img src={cat.icon} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: "20px" }}>{cat.icon || "🔘"}</span>
                        )}
                      </div>
                      <input type="text" value={cat.title} onChange={(e) => {
                        const updated = [...siteSettings.circleCategories];
                        updated[idx].title = e.target.value;
                        setSiteSettings({ ...siteSettings, circleCategories: updated });
                      }} style={{ flex: 1, padding: "8px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", fontWeight: "bold" }} />
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleCategoryIconUpload(e, idx)} style={{ fontSize: "11px" }} />
                  </div>
                ))}
              </div>

              <button onClick={saveSettings} style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>ذخیره تغییرات دسته‌بندی‌ها</button>
            </div>
          )}

          {/* ۷. حراج و تایمر روزانه */}
          {activeTab === "deals" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px", maxWidth: "500px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 8px 0" }}>🔥 تنظیمات تایمر شگفت‌انگیز</h2>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>تاریخ و ساعت دقیق پایان حراج را مشخص کنید.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>زمان پایان حراج:</label>
                  <input type="datetime-local" value={siteSettings.dealTargetTime ? new Date(Number(siteSettings.dealTargetTime)).toISOString().slice(0, 16) : ""} onChange={(e) => {
                    const ts = new Date(e.target.value).getTime();
                    setSiteSettings({ ...siteSettings, dealTargetTime: ts });
                  }} style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #DDD", fontSize: "13px", direction: "ltr" }} />
                </div>

                <button onClick={saveSettings} style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>ذخیره تایمر حراج</button>
              </div>
            </div>
          )}

          {/* ۸. تنظیم کامل فوتر */}
          {activeTab === "footer" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px", maxWidth: "800px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 18px 0" }}>📄 تنظیم کامل فوتر و نمادهای اعتماد (اینماد، زرین‌پال، اسنپ‌پی)</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>متن درباره ما در فوتر:</label>
                  <textarea rows={3} value={siteSettings.footerAboutText} onChange={(e) => setSiteSettings({ ...siteSettings, footerAboutText: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>تلفن پشتیبانی:</label>
                    <input type="text" dir="ltr" value={siteSettings.footerPhone} onChange={(e) => setSiteSettings({ ...siteSettings, footerPhone: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", textAlign: "right" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>اینستاگرام:</label>
                    <input type="text" dir="ltr" value={siteSettings.footerInstagram} onChange={(e) => setSiteSettings({ ...siteSettings, footerInstagram: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", textAlign: "left" }} />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #EEE", paddingTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "bold", margin: 0 }}>🛡️ نمادهای اعتماد و درگاه‌ها (اینماد، زرین‌پال و...)</h3>
                    <button type="button" onClick={addTrustLogoField} style={{ backgroundColor: "#1C1917", color: "#FFF", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>+ افزودن نماد</button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(siteSettings.footerTrustLogos || []).map((item) => (
                      <div key={item.id} style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr auto", gap: "10px", alignItems: "center", padding: "10px", backgroundColor: "#FAF8F5", borderRadius: "10px", border: "1px solid #EAE5DE" }}>
                        <input type="text" placeholder="عنوان نماد" value={item.title} onChange={(e) => {
                          const updated = siteSettings.footerTrustLogos.map((x) => x.id === item.id ? { ...x, title: e.target.value } : x);
                          setSiteSettings({ ...siteSettings, footerTrustLogos: updated });
                        }} style={{ padding: "6px", borderRadius: "6px", border: "1px solid #CCC", fontSize: "11px" }} />

                        <input type="text" dir="ltr" placeholder="لینک (اختیاری)" value={item.link || ""} onChange={(e) => {
                          const updated = siteSettings.footerTrustLogos.map((x) => x.id === item.id ? { ...x, link: e.target.value } : x);
                          setSiteSettings({ ...siteSettings, footerTrustLogos: updated });
                        }} style={{ padding: "6px", borderRadius: "6px", border: "1px solid #CCC", fontSize: "11px", textAlign: "left" }} />

                        <input type="file" accept="image/*" onChange={(e) => handleTrustLogoUpload(e, item.id)} style={{ fontSize: "10px" }} />

                        <button type="button" onClick={() => removeTrustLogoField(item.id)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={saveSettings} style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>ذخیره تنظیمات فوتر</button>
              </div>
            </div>
          )}

          {/* ۹. مشتریان و پیامک (CRM کامل با SMS.ir) */}
          {activeTab === "crm" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "18px", padding: "22px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: "0 0 6px 0" }}>📲 مرکز هوشمند CRM و پیامک (SMS.ir)</h2>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>ارسال پترن ورود، کد رهگیری پست و بازاریابی پیامکی</p>
                </div>
                <span style={{ backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "6px 12px", borderRadius: "10px", fontSize: "11px", fontWeight: "bold" }}>● فعال و متصل</span>
              </div>

              <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "bold", marginBottom: "14px" }}>⚙️ شناسه‌های قالب پترن (Template IDs)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#475569", display: "block", marginBottom: "4px" }}>قالب کد تایید ورود (OTP)</label>
                    <input type="number" value={siteSettings.templateOtp} onChange={(e) => setSiteSettings({ ...siteSettings, templateOtp: Number(e.target.value) })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#475569", display: "block", marginBottom: "4px" }}>قالب تایید ثبت سفارش</label>
                    <input type="number" value={siteSettings.templateOrder} onChange={(e) => setSiteSettings({ ...siteSettings, templateOrder: Number(e.target.value) })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#475569", display: "block", marginBottom: "4px" }}>قالب ارسال کد رهگیری پست</label>
                    <input type="number" value={siteSettings.templateTracking} onChange={(e) => setSiteSettings({ ...siteSettings, templateTracking: Number(e.target.value) })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                </div>
                <button onClick={saveSettings} style={{ marginTop: "16px", backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>ذخیره تنظیمات پیامک</button>
              </div>

              <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px" }}>👥 باشگاه مشتریان و سابقه خرید</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f1f5f9", color: "#64748b" }}>
                      <th style={{ padding: "8px" }}>نام مشتری</th>
                      <th style={{ padding: "8px" }}>شماره تماس</th>
                      <th style={{ padding: "8px" }}>تعداد خرید</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: "16px", textAlign: "center", color: "#999" }}>هنوز مشتری ثبت نشده است.</td></tr>
                    ) : (
                      customers.map((c: any, i: number) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                          <td style={{ padding: "10px 8px" }}>{c.fullName || "مشتری"}</td>
                          <td style={{ padding: "10px 8px", direction: "ltr", textAlign: "right" }}>{c.phone}</td>
                          <td style={{ padding: "10px 8px" }}>{c.ordersCount || 1} سفارش</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ۱۰. مدیران و دسترسی‌ها */}
          {activeTab === "users" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px", maxWidth: "750px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 8px 0" }}>👥 مدیریت ادمین‌ها و سطوح دسترسی</h2>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>می‌توانید همکاران جدید اضافه کنید یا دسترسی آن‌ها را مدیریت کنید.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                <div style={{ border: "1.5px solid #F0ECE4", borderRadius: "16px", padding: "18px", backgroundColor: "#FAF8F5" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "10px" }}>+ افزودن مدیر همکار جدید</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as any;
                    const newAdmin = { username: form.admUser.value, role: form.admRole.value, addedDate: "1403/08/10" };
                    setAdminsList([...adminsList, newAdmin]);
                    form.reset();
                    alert("مدیر جدید با موفقیت اضافه شد.");
                  }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px", alignItems: "end" }}>
                    <div>
                      <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>نام کاربری</label>
                      <input name="admUser" required style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>رمز عبور</label>
                      <input type="password" name="admPass" required style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>سطح دسترسی</label>
                      <select name="admRole" style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }}>
                        <option value="manager">مدیر کالاها و سفارشات</option>
                        <option value="superadmin">مدیر ارشد (کامل)</option>
                      </select>
                    </div>
                    <button type="submit" style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "9px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>افزودن</button>
                  </form>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #EAE5DE", color: "#666" }}>
                      <th style={{ padding: "10px" }}>نام کاربری</th>
                      <th style={{ padding: "10px" }}>سطح دسترسی</th>
                      <th style={{ padding: "10px" }}>تاریخ افزودن</th>
                      <th style={{ padding: "10px", textAlign: "center" }}>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminsList.map((adm, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F5F2EC" }}>
                        <td style={{ padding: "10px", fontWeight: "bold" }}>{adm.username}</td>
                        <td style={{ padding: "10px" }}>{adm.role === "superadmin" ? "مدیر ارشد" : "مدیر بخش‌ها"}</td>
                        <td style={{ padding: "10px", color: "#777" }}>{adm.addedDate}</td>
                        <td style={{ padding: "10px", textAlign: "center" }}>
                          {adm.username !== "admin" && (
                            <button onClick={() => setAdminsList(adminsList.filter((_, idx) => idx !== i))} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>حذف</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ۱۱. تنظیمات فروشگاه و درگاه */}
          {activeTab === "setting" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px", maxWidth: "750px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 18px 0" }}>⚙️ تنظیمات عمومی و درگاه‌های پرداخت (زرین‌پال، اسنپ‌پی)</h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>نام فروشگاه:</label>
                    <input type="text" value={siteSettings.storeName} onChange={(e) => setSiteSettings({ ...siteSettings, storeName: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", color: "#555", marginBottom: "6px" }}>شعار فروشگاه:</label>
                    <input type="text" value={siteSettings.storeSubtitle} onChange={(e) => setSiteSettings({ ...siteSettings, storeSubtitle: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px" }} />
                  </div>
                </div>

                <div style={{ border: "1px solid #F0ECE4", borderRadius: "14px", padding: "16px", backgroundColor: "#FAF8F5" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "10px" }}>💳 درگاه پرداخت فعال</h3>
                  <select value={siteSettings.activeGateway} onChange={(e) => setSiteSettings({ ...siteSettings, activeGateway: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", marginBottom: "12px" }}>
                    <option value="zarinpal">زرین‌پال (درگاه مستقیم)</option>
                    <option value="snapppay">اسنپ‌پی (خرید اقساطی)</option>
                  </select>
                  <label style={{ display: "block", fontSize: "11px", color: "#666", marginBottom: "4px" }}>مرچنت کد زرین‌پال:</label>
                  <input type="text" dir="ltr" value={siteSettings.zarinpalMerchantId} onChange={(e) => setSiteSettings({ ...siteSettings, zarinpalMerchantId: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", textAlign: "left" }} />
                </div>

                <button onClick={saveSettings} style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "11px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>ذخیره تنظیمات فروشگاه</button>
              </div>
            </div>
          )}

          {/* ۱۲. مجله و مقالات سئو */}
          {activeTab === "articles" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 16px 0" }}>📰 مجله زیبایی و مقالات سئو (SEO Articles)</h2>

              <div style={{ border: "1.5px solid #F0ECE4", borderRadius: "16px", padding: "18px", backgroundColor: "#FAF8F5", marginBottom: "22px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "12px" }}>{editingArticleId ? "ویرایش مقاله" : "+ نگارش مقاله جدید برای بهبود سئو"}</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await fetch("/api/articles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editingArticleId ? { ...articleForm, id: editingArticleId } : articleForm),
                  });
                  if (res.ok) {
                    alert("✅ مقاله با موفقیت ذخیره شد.");
                    fetchArticles();
                    setArticleForm({ title: "", readTime: "۵ دقیقه", image: "", excerpt: "", content: "" });
                    setEditingArticleId(null);
                  }
                }} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input required type="text" placeholder="عنوان سئو مقاله..." value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} />
                  <input type="text" placeholder="لینک عکس شاخص..." value={articleForm.image} onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} dir="ltr" />
                  <textarea rows={2} placeholder="چکیده کوتاه مقاله..." value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} />
                  <textarea rows={4} placeholder="متن کامل مقاله..." value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} />
                  <button type="submit" style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", width: "fit-content" }}>انتشار مقاله</button>
                </form>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #EAE5DE", color: "#666" }}>
                    <th style={{ padding: "10px" }}>عنوان مقاله</th>
                    <th style={{ padding: "10px" }}>زمان مطالعه</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((art: any) => (
                    <tr key={art.id} style={{ borderBottom: "1px solid #F5F2EC" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }}>{art.title}</td>
                      <td style={{ padding: "10px", color: "#777" }}>{art.readTime}</td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <button onClick={async () => {
                          if (confirm("حذف این مقاله؟")) {
                            await fetch(`/api/articles?id=${art.id}`, { method: "DELETE" });
                            fetchArticles();
                          }
                        }} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ۱۳. کدهای تخفیف */}
          {activeTab === "coupons" && (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #EAE5DE", padding: "26px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: "900", margin: "0 0 16px 0" }}>🎟️ مدیریت کدهای تخفیف پویا</h2>

              <div style={{ border: "1.5px solid #F0ECE4", borderRadius: "16px", padding: "18px", backgroundColor: "#FAF8F5", marginBottom: "22px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "12px" }}>+ تعریف کد تخفیف جدید با شرط حداقل خرید</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newCouponForm.code || !newCouponForm.value) return alert("کد و مقدار تخفیف الزامی است");
                  const res = await fetch("/api/coupons", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCouponForm),
                  });
                  if (res.ok) {
                    const refresh = await fetch("/api/coupons").then((r) => r.json());
                    if (Array.isArray(refresh)) setCoupons(refresh);
                    setNewCouponForm({ code: "", type: "percent", value: "", minOrder: "", maxDiscount: "" });
                    alert("کد تخفیف با موفقیت ایجاد شد!");
                  }
                }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>کد کوپن</label>
                    <input required type="text" placeholder="YALDA1403" value={newCouponForm.code} onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", textTransform: "uppercase", boxSizing: "border-box" }} dir="ltr" />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>نوع تخفیف</label>
                    <select value={newCouponForm.type} onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }}>
                      <option value="percent">درصدی (٪)</option>
                      <option value="fixed">مبلغ ثابت (تومان)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>مقدار تخفیف</label>
                    <input required type="number" placeholder="مثلاً 20" value={newCouponForm.value} onChange={(e) => setNewCouponForm({ ...newCouponForm, value: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>حداقل خرید (تومان)</label>
                    <input type="number" placeholder="مثلاً 200000" value={newCouponForm.minOrder} onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrder: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "12px", boxSizing: "border-box" }} />
                  </div>
                  <button type="submit" style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "9px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>ثبت کد</button>
                </form>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FAF8F5", borderBottom: "1px solid #EAE5DE", color: "#666" }}>
                    <th style={{ padding: "10px" }}>کد تخفیف</th>
                    <th style={{ padding: "10px" }}>مقدار</th>
                    <th style={{ padding: "10px" }}>حداقل خرید</th>
                    <th style={{ padding: "10px", textAlign: "center" }}>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c: any) => (
                    <tr key={c.id || c._id} style={{ borderBottom: "1px solid #F5F2EC" }}>
                      <td style={{ padding: "10px", fontWeight: "bold" }} dir="ltr">{c.code}</td>
                      <td style={{ padding: "10px", color: "#8E1B24", fontWeight: "bold" }}>{c.type === "percent" ? `%${c.value}` : `${Number(c.value).toLocaleString("fa-IR")} تومان`}</td>
                      <td style={{ padding: "10px" }}>{c.minOrder ? `${Number(c.minOrder).toLocaleString("fa-IR")} تومان` : "بدون محدودیت"}</td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <button onClick={async () => {
                          if (confirm(`حذف کد ${c.code}؟`)) {
                            await fetch(`/api/coupons?id=${c.id || c._id}`, { method: "DELETE" });
                            setCoupons(coupons.filter((x: any) => String(x.id || x._id) !== String(c.id || c._id)));
                          }
                        }} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}