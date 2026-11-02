"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  category?: string;
  brand?: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState("همه");

  // باز/بسته بودن مگامنوی دسته‌بندی‌ها و منوی کاربر
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("سید حمیدرضا مروی پور");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // رفرنس اسلایدر ریلی
  const dealScrollRef = useRef<HTMLDivElement>(null);

  // لیست ۱۰ دسته‌بندی استاندارد مطابق سایت خانومی
  const categoriesList = [
    { name: "آرایشی", icon: "💄" },
    { name: "مراقبت پوست", icon: "✨" },
    { name: "مراقبت و زیبایی مو", icon: "💇‍♀️" },
    { name: "بهداشت شخصی و حمام", icon: "🧼" },
    { name: "مکمل غذایی و ورزشی", icon: "💊" },
    { name: "عطر و اسپری", icon: "🌸" },
    { name: "لوازم برقی", icon: "🔌" },
    { name: "مد و پوشاک", icon: "👗" },
    { name: "کالای دیجیتال", icon: "🎧" },
    { name: "طلا و نقره", icon: "💍" },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const defaultProducts: Product[] = [
    {
      id: 1,
      name: "کرم مرطوب‌کننده و آبرسان قوی پوست",
      price: 345000,
      oldPrice: 590000,
      discount: 42,
      brand: "لومینس",
      category: "مراقبت پوست",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80",
      description: "حاوی هیالورونیک اسید، روشن‌کننده و تغذیه‌کننده عمیق بافت پوست."
    },
    {
      id: 2,
      name: "سرم ضدچروک و جوانساز طلا و خاویار",
      price: 490000,
      oldPrice: 850000,
      discount: 42,
      brand: "اوریف‌گلد",
      category: "مراقبت پوست",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80",
      description: "اکسیر کلاژن‌ساز و شاداب‌کننده صورت."
    },
    {
      id: 3,
      name: "گردنبند مروارید باروک با قفل رزگلد",
      price: 280000,
      oldPrice: 420000,
      discount: 33,
      brand: "جواهری آریا",
      category: "طلا و نقره",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
      description: "ضدحساسیت، آبکاری طلا ۱۸ عیار و طراحی بسیار شیک مجلسی."
    },
    {
      id: 4,
      name: "ادوپرفیوم زنانه نوت وانیل و ارکیده",
      price: 680000,
      oldPrice: 1100000,
      discount: 38,
      brand: "میس والنتینا",
      category: "عطر و اسپری",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80",
      description: "ماندگاری ۴۸ ساعته با پخش بوی مخملی و لوکس."
    },
    {
      id: 5,
      name: "دستبند کارتیه زنانه استیل رنگ ثابت",
      price: 195000,
      oldPrice: 320000,
      discount: 39,
      brand: "لوکس استایل",
      category: "طلا و نقره",
      image: "https://images.unsplash.com/photo-1611591475155-426475489c36?w=500&q=80",
      description: "رنگ کاملاً ثابت، طراحی مینیمال و مناسب استفاده روزانه."
    },
    {
      id: 6,
      name: "رژلب مات مخملی با بافت ابریشمی",
      price: 185000,
      oldPrice: 260000,
      discount: 29,
      brand: "فلورمار",
      category: "آرایشی",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80",
      description: "بافت نرم و مات بدون ایجاد خشکی روی لب."
    }
  ];

  useEffect(() => {
    const savedPhone = localStorage.getItem("userPhone");
    const savedName = localStorage.getItem("userName");

    if (savedPhone) {
      setUserPhone(savedPhone);
      if (savedName) setUserName(savedName);
    }

    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((p: any, idx: number) => ({
            ...p,
            oldPrice: p.oldPrice || Math.round(p.price * 1.42),
            discount: p.discount || (idx % 2 === 0 ? 35 : 42),
            brand: p.brand || "برند لوکس",
            category: p.category || (idx % 2 === 0 ? "آرایشی" : "طلا و نقره")
          }));
          setProducts(formatted);
        } else {
          setProducts(defaultProducts);
        }
      } catch {
        setProducts(defaultProducts);
      }
    }
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    setUserPhone(null);
    setIsUserMenuOpen(false);
  };

  const scrollDeal = (direction: "left" | "right") => {
    if (dealScrollRef.current) {
      const scrollOffset = 260;
      dealScrollRef.current.scrollBy({
        left: direction === "right" ? scrollOffset : -scrollOffset,
        behavior: "smooth",
      });
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart,
          totalPrice,
        }),
      });

      if (res.ok) {
        setStep("success");
        setCart([]);
      } else {
        const errorData = await res.json();
        alert("خطا در ثبت سفارش: " + (errorData.error || "خطای ناشناخته"));
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDrawer = () => {
    setIsCartOpen(false);
    setStep("cart");
  };

  const filteredProducts = activeCategoryTab === "همه"
    ? products
    : products.filter((p) => p.category === activeCategoryTab);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F5", color: "#2D2D2D", direction: "rtl", paddingBottom: "80px" }}>
      
      {/* ۱. نوار اعلان بالا */}
      <div style={{ background: "linear-gradient(to right, #8E1B24, #B82834, #8E1B24)", color: "#FFFFFF", padding: "8px 16px", textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>
        ✨ جشنواره پاییزه: ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان | کد تخفیف: LUXE
      </div>

      {/* ۲. هدر سایت */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EFE9DF", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          
          {/* لوگو */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #B38E5D, #D4AF37)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: "900", fontSize: "20px" }}>
              L
            </div>
            <div>
              <span style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", display: "block" }}>لوکس‌استور</span>
              <span style={{ fontSize: "10px", color: "#A68A68", fontWeight: "bold", letterSpacing: "1px" }}>LUXE & ACCESSIBLE</span>
            </div>
          </Link>

          {/* باکس جستجو */}
          <div style={{ flex: 1, maxWidth: "550px", position: "relative" }}>
            <input
              type="text"
              placeholder="جستجو در بین کالاهای آرایشی، اکسسوری و برندها..."
              style={{ width: "100%", backgroundColor: "#F5F2EC", border: "1px solid transparent", borderRadius: "999px", padding: "10px 38px 10px 16px", fontSize: "12px", color: "#2D2D2D", outline: "none" }}
            />
            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "13px" }}>🔍</span>
          </div>

          {/* اکشن‌های هدر */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            
            {/* وضعیت ورود / منوی کشویی کاربر */}
            <div style={{ position: "relative" }}>
              {!userPhone ? (
                <Link
                  href="/login"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#8E1B24",
                    textDecoration: "none",
                    border: "1.5px solid #8E1B24",
                    borderRadius: "10px",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <span>👤</span>
                  <span>ورود | ثبت‌نام</span>
                </Link>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "7px 12px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2D9CF",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#1C1917",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>👤</span>
                    <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {userName || userPhone}
                    </span>
                    <span style={{ fontSize: "10px", color: "#888" }}>▼</span>
                  </button>

                  {/* منوی کشویی پروفایل */}
                  {isUserMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "calc(100% + 8px)",
                        width: "220px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                        border: "1px solid #EFE9DF",
                        zIndex: 100,
                        overflow: "hidden",
                        textAlign: "right",
                      }}
                    >
                      <Link
                        href="/profile?tab=info"
                        style={{
                          padding: "14px 16px",
                          borderBottom: "1px solid #F2ECE4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#FAF8F5",
                          textDecoration: "none",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "900", color: "#1C1917" }}>{userName}</div>
                          <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }} dir="ltr">{userPhone}</div>
                        </div>
                        <span style={{ fontSize: "12px", color: "#AAA" }}>‹</span>
                      </Link>

                      <div style={{ padding: "6px 0" }}>
                        <Link href="/profile?tab=orders" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "12px", color: "#333", textDecoration: "none" }}>
                          <span>🛍️</span>
                          <span>سفارش‌های من</span>
                        </Link>
                        <Link href="/profile?tab=favorites" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "12px", color: "#333", textDecoration: "none" }}>
                          <span>🤍</span>
                          <span>علاقه‌مندی‌ها</span>
                        </Link>
                        <Link href="/profile?tab=addresses" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "12px", color: "#333", textDecoration: "none" }}>
                          <span>📍</span>
                          <span>آدرس‌های من</span>
                        </Link>
                        <Link href="/profile?tab=wallet" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "12px", color: "#333", textDecoration: "none" }}>
                          <span>💳</span>
                          <span>کیف پول</span>
                        </Link>
                        <Link href="/profile?tab=support" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "12px", color: "#333", textDecoration: "none" }}>
                          <span>🎧</span>
                          <span>پشتیبانی</span>
                        </Link>
                        <div style={{ height: "1px", backgroundColor: "#F2ECE4", margin: "6px 0" }} />
                        <button type="button" onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "12px", color: "#DC2626", background: "none", border: "none", textAlign: "right", cursor: "pointer" }}>
                          <span>🚪</span>
                          <span>خروج از حساب</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/admin"
              style={{ padding: "8px 12px", fontSize: "12px", color: "#555", textDecoration: "none", border: "1px solid #E5E0D8", borderRadius: "10px", backgroundColor: "#FFFFFF" }}
            >
              مدیریت
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#8E1B24", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
            >
              <span>سبد خرید</span>
              <span style={{ backgroundColor: "#FFFFFF", color: "#8E1B24", borderRadius: "999px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "900" }}>
                {totalCount}
              </span>
            </button>
          </div>
        </div>

        {/* ۳. نوار دسته‌بندی مجهز به مگامنوی کشویی ۱۰ تایی */}
        <nav style={{ backgroundColor: "#1C1917", color: "#E0DCD6", fontSize: "12px", padding: "10px 20px", position: "relative" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", whiteSpace: "nowrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              
              {/* کلید بازشونده مگامنو */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#D4AF37",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>☰</span>
                  <span>دسته‌بندی محصولات</span>
                  <span style={{ fontSize: "10px" }}>{isCategoryMenuOpen ? "▲" : "▼"}</span>
                </button>

                {/* منوی بازشونده عمودی دسته‌بندی‌ها (دقیقاً مشابه اسکرین‌شات خانومی) */}
                {isCategoryMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 12px)",
                      width: "250px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                      border: "1px solid #EFE9DF",
                      zIndex: 100,
                      overflow: "hidden",
                      textAlign: "right",
                    }}
                  >
                    {categoriesList.map((cat, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setActiveCategoryTab(cat.name);
                          setIsCategoryMenuOpen(false);
                          const el = document.getElementById("products-section");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 18px",
                          fontSize: "13px",
                          color: activeCategoryTab === cat.name ? "#8E1B24" : "#2D2D2D",
                          fontWeight: activeCategoryTab === cat.name ? "800" : "500",
                          backgroundColor: activeCategoryTab === cat.name ? "#FDF2F2" : "#FFFFFF",
                          borderRight: activeCategoryTab === cat.name ? "4px solid #8E1B24" : "4px solid transparent",
                          cursor: "pointer",
                          borderBottom: "1px solid #F8F5F0",
                          transition: "0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (activeCategoryTab !== cat.name) e.currentTarget.style.backgroundColor = "#FAF8F5";
                        }}
                        onMouseLeave={(e) => {
                          if (activeCategoryTab !== cat.name) e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#AAA" }}>‹</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span style={{ cursor: "pointer" }} onClick={() => { const el = document.getElementById("deal-box"); el?.scrollIntoView({ behavior: "smooth" }); }}>پیشنهاد ویژه حراج</span>
              <span style={{ cursor: "pointer" }}>جعبه جادویی</span>
              <span style={{ cursor: "pointer" }}>برندها</span>
              <span style={{ cursor: "pointer" }}>مجله زیبایی</span>
            </div>

            <div style={{ color: "#C5A880", fontSize: "11px" }}>ضمانت اصالت و سلامت کالا</div>
          </div>
        </nav>
      </header>

      {/* محتوای بدنه */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "36px" }}>

        {/* بنرهای هدر */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <div style={{ backgroundColor: "#1C1917", color: "#FFFFFF", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <span style={{ backgroundColor: "#8E1B24", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "999px" }}>تخفیف تا ۶۰٪</span>
              <h3 style={{ fontSize: "18px", fontWeight: "900", margin: "14px 0 6px 0" }}>ست‌های لوکس کادویی</h3>
              <p style={{ fontSize: "12px", color: "#BBB", margin: 0 }}>زیباترین بسته‌بندی مناسب هدیه با قیمت شگفت‌انگیز.</p>
            </div>
            <a href="#deal-box" style={{ marginTop: "20px", textAlign: "center", backgroundColor: "#C5A880", color: "#1C1917", padding: "10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", textDecoration: "none" }}>
              مشاهده ست‌ها
            </a>
          </div>

          <div style={{ background: "linear-gradient(135deg, #F0ECE1, #DFD3BF)", borderRadius: "24px", padding: "30px", border: "1px solid #E2D9CF" }}>
            <span style={{ backgroundColor: "#8E1B24", color: "#FFF", fontSize: "11px", fontWeight: "900", padding: "4px 10px", borderRadius: "999px" }}>حراج پاییزی</span>
            <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#1C1917", margin: "12px 0 8px 0" }}>
              درخشش لوکس، <br />
              <span style={{ color: "#8E1B24" }}>با قیمتی کاملاً اقتصادی!</span>
            </h1>
            <p style={{ fontSize: "12px", color: "#555", margin: "0 0 16px 0" }}>منتخب پرطرفدارترین محصولات آرایشی و اکسسوری‌های رنگ ثابت با گارانتی سلامت کالا.</p>
            <a href="#products-section" style={{ backgroundColor: "#1C1917", color: "#FFF", padding: "10px 18px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", textDecoration: "none", display: "inline-block" }}>
              مشاهده محصولات ←
            </a>
          </div>
        </section>

        {/* دسته‌بندی‌های دایره‌ای */}
        <section style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "20px", border: "1px solid #EFE9DF", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "12px", textAlign: "center" }}>
          {[
            { title: "اکسسوری", icon: "💍", bg: "#F7F2EB" },
            { title: "مراقبت پوست", icon: "✨", bg: "#FDF0ED" },
            { title: "آرایش صورت", icon: "💄", bg: "#FBF1F2" },
            { title: "عطر و ادکلن", icon: "🌸", bg: "#F3F4F6" },
            { title: "مراقبت مو", icon: "💇‍♀️", bg: "#F5F2EB" },
            { title: "پک‌های هدیه", icon: "🎁", bg: "#FAF0E6" },
          ].map((cat, i) => (
            <div key={i} onClick={() => setActiveCategoryTab(cat.title === "اکسسوری" ? "طلا و نقره" : cat.title === "مراقبت پوست" ? "مراقبت پوست" : "همه")} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}>
                {cat.icon}
              </div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#444", marginTop: "8px" }}>{cat.title}</span>
            </div>
          ))}
        </section>

        {/* حراج ریلی */}
        <section
          id="deal-box"
          style={{
            background: "linear-gradient(135deg, #8E1B24 0%, #B82834 50%, #75141C 100%)",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 10px 25px rgba(142, 27, 36, 0.25)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.2)", paddingBottom: "16px", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "28px" }}>🔥</span>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#FFFFFF", margin: 0 }}>حراج شگفت‌انگیز روزانه</h2>
                <p style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.85)", margin: "4px 0 0 0" }}>فرصت استثنایی خرید اکسسوری و لوازم آرایشی با بیشترین تخفیف</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div dir="ltr" style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(0, 0, 0, 0.35)", padding: "6px 14px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.15)", color: "#FFFFFF", fontSize: "13px", fontWeight: "bold" }}>
                <span style={{ background: "#FFFFFF", color: "#8E1B24", padding: "2px 6px", borderRadius: "6px", fontFamily: "monospace" }}>14</span> :
                <span style={{ background: "#FFFFFF", color: "#8E1B24", padding: "2px 6px", borderRadius: "6px", fontFamily: "monospace" }}>35</span> :
                <span style={{ background: "#FFFFFF", color: "#8E1B24", padding: "2px 6px", borderRadius: "6px", fontFamily: "monospace" }}>20</span>
                <span style={{ marginRight: "4px", fontSize: "11px", color: "rgba(255,255,255,0.9)" }}>زمان باقی‌مانده</span>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button type="button" onClick={() => scrollDeal("right")} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.2)", border: "none", color: "#FFFFFF", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
                <button type="button" onClick={() => scrollDeal("left")} style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.2)", border: "none", color: "#FFFFFF", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              </div>
            </div>
          </div>

          <div ref={dealScrollRef} style={{ display: "flex", alignItems: "stretch", gap: "16px", overflowX: "auto", paddingBottom: "8px", scrollBehavior: "smooth", scrollbarWidth: "none" }}>
            <div style={{ width: "180px", flexShrink: 0, background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.25)", borderRadius: "20px", padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "center", color: "#FFFFFF" }}>
              <div>
                <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎁</div>
                <h3 style={{ fontSize: "16px", fontWeight: "900", margin: "0 0 6px 0" }}>پیشنهاد روز</h3>
                <p style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.8)", lineHeight: "1.6", margin: 0 }}>تخفیف‌های تکرارنشدنی تا ۶۰٪ مخصوص امروز</p>
              </div>
              <div style={{ background: "#FFFFFF", color: "#8E1B24", fontSize: "11px", fontWeight: "800", padding: "8px 12px", borderRadius: "12px", cursor: "pointer", marginTop: "16px" }}>مشاهده همه ←</div>
            </div>

            {products.map((item) => (
              <div key={item.id} style={{ width: "220px", flexShrink: 0, backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)", position: "relative" }}>
                <div>
                  <div style={{ width: "100%", height: "160px", borderRadius: "14px", backgroundColor: "#F9F8F6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", marginBottom: "12px", border: "1px solid #F0ECE4" }}>
                    <img src={item.image} alt={item.name} style={{ maxHeight: "135px", maxWidth: "90%", objectFit: "contain" }} />
                    <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#8E1B24", color: "#FFFFFF", fontSize: "11px", fontWeight: "900", padding: "3px 7px", borderRadius: "8px" }}>%{item.discount || 35}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#9E8A78", fontWeight: "600", display: "block" }}>{item.brand || "لوکس‌استور"}</span>
                  <h3 style={{ fontSize: "13px", fontWeight: "800", color: "#1E1E1E", margin: "4px 0 0 0", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "36px" }}>{item.name}</h3>
                </div>

                <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #F3EFE9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#A0A0A0", textDecoration: "line-through", display: "block" }}>{(item.oldPrice || Math.round(item.price * 1.4)).toLocaleString("fa-IR")}</span>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: "#8E1B24" }}>{item.price.toLocaleString("fa-IR")} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#666" }}>تومان</span></span>
                  </div>
                  <button onClick={() => addToCart(item)} style={{ backgroundColor: "#1C1917", color: "#FFFFFF", border: "none", padding: "6px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>+ خرید</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ویترین عمومی */}
        <section id="products-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EFE9DF", paddingBottom: "12px", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: 0 }}>منتخب محصولات فروشگاه</h2>
              <p style={{ fontSize: "11px", color: "#777", margin: "4px 0 0 0" }}>تضمین کیفیت عالی و ارسال در بسته‌بندی محکم</p>
            </div>

            <div style={{ display: "flex", gap: "6px", overflowX: "auto", maxWidth: "60%", paddingBottom: "4px" }}>
              {["همه", ...categoriesList.map(c => c.name)].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategoryTab(tab)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    border: activeCategoryTab === tab ? "none" : "1px solid #E5E0D8",
                    backgroundColor: activeCategoryTab === tab ? "#8E1B24" : "#FFFFFF",
                    color: activeCategoryTab === tab ? "#FFFFFF" : "#555",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {filteredProducts.map((item) => (
              <div key={item.id} style={{ backgroundColor: "#FFFFFF", border: "1px solid #EFE9DF", borderRadius: "20px", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div>
                  <div style={{ width: "100%", height: "180px", borderRadius: "14px", backgroundColor: "#F9F8F6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "12px", border: "1px solid #F0ECE4" }}>
                    <img src={item.image} alt={item.name} style={{ maxHeight: "150px", maxWidth: "90%", objectFit: "contain" }} />
                  </div>
                  <span style={{ fontSize: "11px", color: "#A68A68", fontWeight: "bold" }}>{item.brand || "لوکس‌استور"}</span>
                  <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1C1917", margin: "4px 0" }}>{item.name}</h3>
                  <p style={{ fontSize: "11px", color: "#777", lineHeight: "1.5", margin: 0 }}>{item.description}</p>
                </div>

                <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #F3EFE9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "10px", color: "#888", display: "block" }}>قیمت:</span>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: "#1C1917" }}>{item.price.toLocaleString("fa-IR")} <span style={{ fontSize: "10px", fontWeight: "normal", color: "#666" }}>تومان</span></span>
                  </div>
                  <button onClick={() => addToCart(item)} style={{ backgroundColor: "#C5A880", color: "#1C1917", border: "none", padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>افزودن به سبد</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* نمادهای اعتماد */}
        <section style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "20px", border: "1px solid #EFE9DF", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { title: "ارسال سریع پیشتاز", desc: "تحویل فوری در سراسر کشور", icon: "📦" },
            { title: "۷ روز ضمانت بازگشت", desc: "در صورت هرگونه مغایرت کالا", icon: "🛡️" },
            { title: "ضمانت اصالت و سلامت", desc: "۱۰۰٪ اصالت و کیفیت تضمینی", icon: "✨" },
            { title: "پشتیبانی دلسوزانه", desc: "پاسخگویی سریع به خریداران", icon: "💬" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "28px" }}>{item.icon}</span>
              <div>
                <h4 style={{ fontSize: "12px", fontWeight: "bold", color: "#1C1917", margin: 0 }}>{item.title}</h4>
                <p style={{ fontSize: "11px", color: "#777", margin: "2px 0 0 0" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

      </main>

      {/* فوتر */}
      <footer style={{ backgroundColor: "#1C1917", color: "#9E9E9E", fontSize: "12px", marginTop: "60px", padding: "40px 20px 24px 20px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "30px", borderBottom: "1px solid #2D2D2D", paddingBottom: "30px" }}>
          <div>
            <h3 style={{ color: "#FFF", fontSize: "16px", fontWeight: "900", margin: "0 0 10px 0" }}>فروشگاه آنلاین لوکس‌استور</h3>
            <p style={{ lineHeight: "1.7", margin: 0 }}>مرجع تخصصی خرید آنلاین اکسسوری‌های رنگ ثابت و محصولات بهداشتی و آرایشی با بالاترین استاندارد کیفیت و قیمت‌های اقتصادی مستقیم.</p>
          </div>
          <div>
            <h4 style={{ color: "#FFF", fontSize: "13px", fontWeight: "bold", margin: "0 0 12px 0" }}>خدمات مشتریان</h4>
            <p style={{ margin: "6px 0" }}>پرسش‌های متداول</p>
            <p style={{ margin: "6px 0" }}>راهنمای ثبت سفارش</p>
            <p style={{ margin: "6px 0" }}>رویه‌های بازگرداندن کالا</p>
          </div>
          <div>
            <h4 style={{ color: "#FFF", fontSize: "13px", fontWeight: "bold", margin: "0 0 12px 0" }}>ارتباط با ما</h4>
            <p style={{ margin: "6px 0" }}>اینستاگرام: @luxe_store</p>
            <p style={{ margin: "6px 0", color: "#D4AF37", fontWeight: "bold" }} dir="ltr">پشتیبانی: ۰۲۱-۹۱۰۰۵۰۰۰</p>
          </div>
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px", fontSize: "11px" }}>
          کلیه حقوق این وبسایت متعلق به فروشگاه لوکس‌استور می‌باشد.
        </div>
      </footer>

      {/* کشوی سبد خرید */}
      {isCartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }} onClick={resetDrawer} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px", backgroundColor: "#FFFFFF", height: "100%", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)", overflowY: "auto" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EFE9DF", paddingBottom: "14px", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#1C1917", margin: 0 }}>
                  {step === "cart" && "سبد خرید شما"}
                  {step === "checkout" && "مشخصات تحویل گیرنده"}
                  {step === "success" && "ثبت نهایی شد"}
                </h3>
                <button onClick={resetDrawer} style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#888" }}>✕</button>
              </div>

              {step === "cart" && (
                <>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                      <div style={{ fontSize: "36px", marginBottom: "10px" }}>🛍️</div>
                      <p style={{ fontSize: "12px", color: "#777" }}>سبد خرید شما در حال حاضر خالی است.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "55vh", overflowY: "auto" }}>
                      {cart.map((item) => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FAF8F5", padding: "10px", borderRadius: "14px", border: "1px solid #EFE9DF" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={item.image} alt={item.name} style={{ width: "44px", height: "44px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#FFF", padding: "2px", border: "1px solid #E5E0D8" }} />
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1C1917" }}>{item.name}</div>
                              <div style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}>
                                {item.quantity} عدد × {item.price.toLocaleString("fa-IR")} تومان
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
                            حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === "checkout" && (
                <form id="orderForm" onSubmit={handleSubmitOrder} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>نام و نام خانوادگی</label>
                    <input required type="text" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", outline: "none" }} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>شماره همراه</label>
                    <input required type="tel" dir="ltr" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", textAlign: "right", outline: "none" }} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>استان</label>
                      <input required type="text" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", outline: "none" }} value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>شهر</label>
                      <input required type="text" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", outline: "none" }} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>کد پستی (۱۰ رقمی)</label>
                    <input required type="text" dir="ltr" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", textAlign: "right", outline: "none" }} value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>نشانی دقیق پستی</label>
                    <textarea required rows={3} style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", outline: "none", resize: "none" }} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                </form>
              )}

              {step === "success" && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#D1FAE5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto", fontSize: "24px", fontWeight: "bold" }}>✓</div>
                  <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#1C1917", margin: "0 0 6px 0" }}>سفارش با موفقیت ثبت شد</h4>
                  <p style={{ fontSize: "11px", color: "#777", margin: "0 0 16px 0" }}>اطلاعات سفارش برای بسته‌بندی و ارسال ذخیره شد.</p>
                  <button onClick={resetDrawer} style={{ padding: "8px 16px", backgroundColor: "#1C1917", color: "#FFF", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>ادامه خرید</button>
                </div>
              )}
            </div>

            {step === "cart" && cart.length > 0 && (
              <div style={{ borderTop: "1px solid #EFE9DF", paddingTop: "14px", marginTop: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "12px", fontWeight: "bold" }}>
                  <span>مجموع قابل پرداخت:</span>
                  <span style={{ fontSize: "14px", fontWeight: "900", color: "#8E1B24" }}>{totalPrice.toLocaleString("fa-IR")} تومان</span>
                </div>
                <button onClick={() => setStep("checkout")} style={{ width: "100%", padding: "12px", backgroundColor: "#8E1B24", color: "#FFFFFF", borderRadius: "12px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  تکمیل اطلاعات و ثبت سفارش
                </button>
              </div>
            )}

            {step === "checkout" && (
              <div style={{ borderTop: "1px solid #EFE9DF", paddingTop: "14px", marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <button type="submit" form="orderForm" disabled={isSubmitting} style={{ width: "100%", padding: "12px", backgroundColor: "#8E1B24", color: "#FFFFFF", borderRadius: "12px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", opacity: isSubmitting ? 0.6 : 1 }}>
                  {isSubmitting ? "در حال ارسال..." : "ثبت نهایی سفارش"}
                </button>
                <button type="button" onClick={() => setStep("cart")} style={{ background: "none", border: "none", fontSize: "11px", color: "#777", cursor: "pointer", padding: "6px" }}>
                  بازگشت به سبد
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}