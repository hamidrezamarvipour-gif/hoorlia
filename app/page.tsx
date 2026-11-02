"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Product {
  id: any;
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

  // سیستم کد تخفیف
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // مگامنوی دسته‌بندی
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryTimerRef = useRef<any>(null);

  // وضعیت کاربر
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("سید حمیدرضا مروی پور");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dealScrollRef = useRef<HTMLDivElement>(null);

  // تنظیمات CMS
  const [siteSettings, setSiteSettings] = useState({
    storeName: "لوکس‌استور",
    storeSubtitle: "LUXE & ACCESSIBLE",
    storeLogoLetter: "L",
    storeLogoImage: "",
    topBarAnnouncement: "✨ جشنواره پاییزه: ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان | کد تخفیف: LUXE",
    
    banner1Badge: "تخفیف تا ۶۰٪",
    banner1Title: "ست‌های لوکس کادویی",
    banner1Desc: "زیباترین بسته‌بندی مناسب هدیه با قیمت شگفت‌انگیز.",
    
    banner2Badge: "حراج پاییزی",
    banner2Title: "درخشش لوکس، با قیمتی کاملاً اقتصادی!",
    banner2Desc: "منتخب پرطرفدارترین محصولات آرایشی و اکسسوری‌های رنگ ثابت با گارانتی سلامت کالا.",
    sliderBanners: [] as string[],

    circleCategories: [
      { title: "اکسسوری", icon: "💍", targetCategory: "طلا و نقره" },
      { title: "مراقبت پوست", icon: "✨", targetCategory: "مراقبت پوست" },
      { title: "آرایش صورت", icon: "💄", targetCategory: "آرایشی" },
      { title: "عطر و ادکلن", icon: "🌸", targetCategory: "عطر و اسپری" },
      { title: "مراقبت مو", icon: "💇‍♀️", targetCategory: "مراقبت و زیبایی مو" },
      { title: "پک‌های هدیه", icon: "🎁", targetCategory: "همه" },
    ],

    footerAboutTitle: "فروشگاه آنلاین لوکس‌استور",
    footerAboutText: "مرجع تخصصی خرید آنلاین اکسسوری‌های رنگ ثابت و محصولات بهداشتی و آرایشی با بالاترین استاندارد کیفیت و قیمت‌های اقتصادی مستقیم.",
    footerPhone: "۰۲۱-۹۱۰۰۵۰۰۰",
    footerInstagram: "@luxe_store",
    footerTelegram: "@hoorlia_support",
    footerWhatsapp: "989150000000",
    footerBale: "hoorlia",
    footerCopyright: "کلیه حقوق این وبسایت متعلق به فروشگاه لوکس‌استور می‌باشد.",
  });

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const banners = (siteSettings.sliderBanners || []).filter(Boolean);
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [siteSettings.sliderBanners]);

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
      name: "کرم مرطوب‌کننده قوی صورت مدل Dry Relief حجم ۵۰ میلی‌لیتر",
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
    }
  ];

  useEffect(() => {
    const savedPhone = localStorage.getItem("userPhone");
    const savedName = localStorage.getItem("userName");
    if (savedPhone) {
      setUserPhone(savedPhone);
      if (savedName) setUserName(savedName);
    }

    const savedCart = localStorage.getItem("userCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(defaultProducts);
        }
      } catch {
        setProducts(defaultProducts);
      }
    }
    fetchProducts();
  }, []);

  // تایمر شگفت‌انگیز
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userName");
    setUserPhone(null);
    setIsUserMenuOpen(false);
  };

  const handleMouseEnterCategory = () => {
    if (categoryTimerRef.current) clearTimeout(categoryTimerRef.current);
    setIsCategoryMenuOpen(true);
  };

  const handleMouseLeaveCategory = () => {
    categoryTimerRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 200);
  };

  const updateCartStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("userCart", JSON.stringify(newCart));
  };

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const existing = cart.find((item) => String(item.id) === String(product.id));

    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map((item) =>
        String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    updateCartStorage(updatedCart);
  };

  const decreaseQuantity = (id: any) => {
    const existing = cart.find((item) => String(item.id) === String(id));
    if (!existing) return;

    let updatedCart: CartItem[];
    if (existing.quantity > 1) {
      updatedCart = cart.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      updatedCart = cart.filter((item) => String(item.id) !== String(id));
    }
    updateCartStorage(updatedCart);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalPayablePrice = Math.max(0, totalPrice - discountAmount);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCodeInput("");
    setCouponError("");
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponError("");
    setIsValidatingCoupon(true);

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          code: couponCodeInput.trim(),
          totalPrice,
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        setCouponError("");
      } else {
        setCouponError(data.error || "کد تخفیف نامعتبر یا منقضی شده است");
        setAppliedCoupon(null);
        setDiscountAmount(0);
      }
    } catch {
      setCouponError("خطا در بررسی کد تخفیف");
    } finally {
      setIsValidatingConnection: false;
      setIsValidatingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = Date.now();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          ...formData,
          items: cart,
          totalPrice: finalPayablePrice,
          discountApplied: discountAmount,
          couponCode: appliedCoupon?.code || null,
        }),
      });

      if (res.ok) {
        const paymentRes = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalPayablePrice,
            orderId: orderId,
            phone: formData.phone,
            description: `سفارش فروشگاه #${orderId}`,
          }),
        });

        const paymentData = await paymentRes.json();
        if (paymentRes.ok && paymentData.success && paymentData.url) {
          window.location.href = paymentData.url;
        } else {
          setStep("success");
          updateCartStorage([]);
        }
      } else {
        const errorData = await res.json();
        alert("خطا در ثبت سفارش: " + (errorData.error || "خطای دسترسی سرور"));
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
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF8F5",
        color: "#2D2D2D",
        direction: "rtl",
        textAlign: "right",
        fontFamily: "IRANSans, Tahoma, sans-serif",
        paddingBottom: "80px",
        overflowX: "hidden",
      }}
    >
      {/* ۱. نوار اعلان بالا */}
      <div style={{ background: "linear-gradient(to right, #8E1B24, #B82834, #8E1B24)", color: "#FFFFFF", padding: "8px 16px", textAlign: "center", fontSize: "11px", fontWeight: "bold" }}>
        {siteSettings.topBarAnnouncement}
      </div>

      {/* ۲. هدر سایت (اصلاح چیدمان: لوگو راست، سرچ وسط، دکمه‌ها چپ) */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EFE9DF", position: "sticky", top: 0, zIndex: 40, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "12px 16px", display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: "16px" }}>
          
          {/* سمت راست: لوگو */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            {siteSettings.storeLogoImage ? (
              <img
                src={siteSettings.storeLogoImage}
                alt={siteSettings.storeName || "لوگو"}
                style={{ maxHeight: "40px", maxWidth: "140px", objectFit: "contain" }}
              />
            ) : (
              <>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #B38E5D, #D4AF37)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: "900", fontSize: "18px" }}>
                  {siteSettings.storeLogoLetter}
                </div>
                <div>
                  <span style={{ fontSize: "16px", fontWeight: "900", color: "#1C1917", display: "block" }}>{siteSettings.storeName}</span>
                  <span style={{ fontSize: "9px", color: "#A68A68", fontWeight: "bold", letterSpacing: "1px" }}>{siteSettings.storeSubtitle}</span>
                </div>
              </>
            )}
          </Link>

          {/* مرکز: جستجوی کالاها دقیقاً در مرکز */}
          <div style={{ justifySelf: "center", width: "100%", maxWidth: "500px", position: "relative" }}>
            <input
              type="text"
              placeholder="جستجو در بین کالاهای آرایشی، اکسسوری و برندها..."
              style={{ width: "100%", backgroundColor: "#F5F2EC", border: "1px solid transparent", borderRadius: "999px", padding: "9px 36px 9px 16px", fontSize: "12px", color: "#2D2D2D", outline: "none", textAlign: "right", boxSizing: "border-box" }}
            />
            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#888", fontSize: "13px" }}>🔍</span>
          </div>

          {/* سمت چپ: آیکون ثبت‌نام/ورود و سبد خرید */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", justifySelf: "end" }}>
            <div style={{ position: "relative" }}>
              {!userPhone ? (
                <Link
                  href="/login"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 12px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: "#8E1B24",
                    textDecoration: "none",
                    border: "1.5px solid #8E1B24",
                    borderRadius: "8px",
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
                      gap: "6px",
                      padding: "6px 10px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2D9CF",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      color: "#1C1917",
                      cursor: "pointer",
                    }}
                  >
                    <span>👤</span>
                    <span style={{ maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {userName || userPhone}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "calc(100% + 8px)",
                        width: "200px",
                        backgroundColor: "#FFFFFF",
                        borderRadius: "14px",
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
                          padding: "12px 14px",
                          borderBottom: "1px solid #F2ECE4",
                          display: "block",
                          backgroundColor: "#FAF8F5",
                          textDecoration: "none",
                        }}
                      >
                        <div style={{ fontSize: "12px", fontWeight: "900", color: "#1C1917" }}>{userName}</div>
                        <div style={{ fontSize: "10px", color: "#888", marginTop: "2px" }} dir="ltr">{userPhone}</div>
                      </Link>

                      <div style={{ padding: "4px 0" }}>
                        <Link href="/profile?tab=orders" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", fontSize: "11px", color: "#333", textDecoration: "none" }}>
                          <span>🛍️</span>
                          <span>سفارش‌های من</span>
                        </Link>
                        <button type="button" onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", fontSize: "11px", color: "#DC2626", background: "none", border: "none", textAlign: "right", cursor: "pointer" }}>
                          <span>🚪</span>
                          <span>خروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#8E1B24", color: "#FFFFFF", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
            >
              <span>سبد خرید</span>
              <span style={{ backgroundColor: "#FFFFFF", color: "#8E1B24", borderRadius: "999px", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "900" }}>
                {totalCount}
              </span>
            </button>
          </div>
        </div>

        {/* ۳. نوار ناوبری با منوی کشویی هاور برای دسته‌بندی‌ها و لینک‌های مستقل */}
        <nav style={{ backgroundColor: "#1C1917", color: "#E0DCD6", fontSize: "12px", padding: "10px 20px" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", overflowX: "auto", scrollbarWidth: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", whiteSpace: "nowrap" }}>
              
              {/* منوی کشویی دسته‌بندی با هاور */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={handleMouseEnterCategory}
                onMouseLeave={handleMouseLeaveCategory}
              >
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  style={{ background: "none", border: "none", color: "#D4AF37", fontWeight: "bold", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>☰</span>
                  <span>دسته‌بندی محصولات</span>
                  <span style={{ fontSize: "10px" }}>{isCategoryMenuOpen ? "▲" : "▼"}</span>
                </button>

                {isCategoryMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 10px)",
                      width: "240px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "14px",
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
                          document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "11px 16px",
                          fontSize: "12px",
                          color: activeCategoryTab === cat.name ? "#8E1B24" : "#2D2D2D",
                          backgroundColor: activeCategoryTab === cat.name ? "#FDF2F2" : "#FFFFFF",
                          cursor: "pointer",
                          borderBottom: "1px solid #F8F5F0",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "15px" }}>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </div>
                        <span style={{ fontSize: "12px", color: "#AAA" }}>‹</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* لینک‌های مستقل مشتری */}
              <Link href="/deals" style={{ color: "#E0DCD6", textDecoration: "none" }}>
                پیشنهاد ویژه
              </Link>
              <Link href="/magic-box" style={{ color: "#E0DCD6", textDecoration: "none" }}>
                جعبه جادویی
              </Link>
              <Link href="/brands" style={{ color: "#E0DCD6", textDecoration: "none" }}>
                برندها
              </Link>
              <Link href="/mag" style={{ color: "#E0DCD6", textDecoration: "none" }}>
                مجله و مقالات
              </Link>
            </div>

            <div style={{ color: "#C5A880", fontSize: "11px", whiteSpace: "nowrap" }}>ضمانت اصالت و سلامت کالا</div>
          </div>
        </nav>
      </header>

      {/* ۴. محتوای اصلی */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px", display: "flex", flexDirection: "column", gap: "30px" }}>
        
        {/* بنرها یا اسلایدر */}
        {((siteSettings.sliderBanners || []).filter(Boolean).length > 0) ? (
          <section style={{ position: "relative", width: "100%", height: "260px", borderRadius: "20px", overflow: "hidden", border: "1px solid #EAE5DE" }}>
            <img
              src={(siteSettings.sliderBanners || []).filter(Boolean)[currentSlideIndex]}
              alt="اسلاید"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </section>
        ) : (
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div style={{ backgroundColor: "#1C1917", color: "#FFFFFF", borderRadius: "20px", padding: "20px" }}>
              <span style={{ backgroundColor: "#8E1B24", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "999px" }}>{siteSettings.banner1Badge}</span>
              <h3 style={{ fontSize: "16px", fontWeight: "900", margin: "12px 0 6px 0" }}>{siteSettings.banner1Title}</h3>
              <p style={{ fontSize: "11px", color: "#BBB", margin: 0 }}>{siteSettings.banner1Desc}</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, #F0ECE1, #DFD3BF)", borderRadius: "20px", padding: "20px" }}>
              <span style={{ backgroundColor: "#8E1B24", color: "#FFF", fontSize: "10px", fontWeight: "900", padding: "4px 8px", borderRadius: "999px" }}>حراج پاییزی</span>
              <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: "10px 0 6px 0" }}>{siteSettings.banner2Title}</h1>
              <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>{siteSettings.banner2Desc}</p>
            </div>
          </section>
        )}

        {/* دسته‌بندی‌های دایره‌ای */}
        <section style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "16px", border: "1px solid #EFE9DF", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(85px, 1fr))", gap: "12px", textAlign: "center" }}>
          {siteSettings.circleCategories.map((cat, i) => (
            <div
              key={i}
              onClick={() => {
                setActiveCategoryTab(cat.targetCategory || "همه");
                document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#FFFFFF", border: "1.5px solid #EAE5DE", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "4px", margin: "0 auto 6px auto", boxShadow: "0 4px 10px rgba(0,0,0,0.03)" }}>
                <span style={{ fontSize: "26px" }}>{cat.icon || "✨"}</span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#444" }}>{cat.title}</span>
            </div>
          ))}
        </section>

        {/* ۵. حراج و شگفت‌انگیز همراه با تایمر و صفحات مستقل محصولات */}
        <section id="deal-box" style={{ background: "linear-gradient(135deg, #8E1B24 0%, #B82834 100%)", borderRadius: "20px", padding: "20px", boxShadow: "0 10px 25px rgba(142, 27, 36, 0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>🔥</span>
              <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#FFFFFF", margin: 0 }}>حراج شگفت‌انگیز روزانه</h2>
            </div>
            {/* تایمر معکوس */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(0,0,0,0.3)", padding: "6px 12px", borderRadius: "10px", color: "#FFF", fontSize: "12px", fontWeight: "bold" }} dir="ltr">
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span> : 
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span> : 
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span style={{ fontSize: "10px", marginRight: "4px" }}>⏳</span>
            </div>
          </div>

          <div ref={dealScrollRef} style={{ display: "flex", alignItems: "stretch", gap: "14px", overflowX: "auto", paddingBottom: "6px", scrollbarWidth: "none" }}>
            {products.map((item) => (
              <div
                key={item.id}
                style={{ width: "200px", flexShrink: 0, backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}
              >
                {/* لینک به صفحه محصول مستقل */}
                <Link href={`/product/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ width: "100%", height: "140px", borderRadius: "12px", backgroundColor: "#F9F8F6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "10px" }}>
                    <img src={item.image} alt={item.name} style={{ maxHeight: "120px", maxWidth: "90%", objectFit: "contain" }} />
                  </div>
                  <h3 style={{ fontSize: "12px", fontWeight: "800", color: "#1E1E1E", margin: "2px 0", height: "34px", overflow: "hidden" }}>{item.name}</h3>
                </Link>

                <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #F3EFE9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#8E1B24" }}>{item.price.toLocaleString("fa-IR")} ت</span>
                  <button onClick={(e) => addToCart(item, e)} style={{ backgroundColor: "#1C1917", color: "#FFFFFF", border: "none", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>+ خرید</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* لیست محصولات با صفحه مستقل */}
        <section id="products-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EFE9DF", paddingBottom: "12px", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#1C1917", margin: 0 }}>منتخب محصولات فروشگاه</h2>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", maxWidth: "100%", paddingBottom: "4px", scrollbarWidth: "none" }}>
              {["همه", ...categoriesList.map(c => c.name)].map((tab) => (
                <button
                  key={tab}
                  style={{ padding: "6px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", backgroundColor: activeCategoryTab === tab ? "#8E1B24" : "#FFFFFF", color: activeCategoryTab === tab ? "#FFFFFF" : "#555", border: activeCategoryTab === tab ? "none" : "1px solid #E5E0D8", cursor: "pointer", whiteSpace: "nowrap" }}
                  onClick={() => setActiveCategoryTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {filteredProducts.map((item) => (
              <div key={item.id} style={{ backgroundColor: "#FFFFFF", border: "1px solid #EFE9DF", borderRadius: "16px", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Link href={`/product/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ width: "100%", height: "150px", borderRadius: "12px", backgroundColor: "#F9F8F6", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "10px" }}>
                    <img src={item.image} alt={item.name} style={{ maxHeight: "130px", maxWidth: "90%", objectFit: "contain" }} />
                  </div>
                  <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#1C1917", margin: "4px 0", height: "36px", overflow: "hidden" }}>{item.name}</h3>
                </Link>

                <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #F3EFE9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "#1C1917" }}>{item.price.toLocaleString("fa-IR")} تومان</span>
                  <button onClick={(e) => addToCart(item, e)} style={{ backgroundColor: "#C5A880", color: "#1C1917", border: "none", padding: "7px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>افزودن</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ۶. فوتر سایت تکمیل‌شده (لینک‌های مفید، پرسش‌های متداول، پیگیری سفارشات، شبکه‌های اجتماعی) */}
      <footer style={{ backgroundColor: "#1C1917", color: "#9E9E9E", fontSize: "12px", marginTop: "60px", padding: "40px 20px 24px 20px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", borderBottom: "1px solid #2D2D2D", paddingBottom: "30px" }}>
          <div>
            <h3 style={{ color: "#FFF", fontSize: "15px", fontWeight: "900", margin: "0 0 10px 0" }}>{siteSettings.footerAboutTitle}</h3>
            <p style={{ lineHeight: "1.7", margin: 0 }}>{siteSettings.footerAboutText}</p>
          </div>
          <div>
            <h4 style={{ color: "#FFF", fontSize: "13px", fontWeight: "bold", margin: "0 0 12px 0" }}>لینک‌های مفید</h4>
            <p style={{ margin: "6px 0" }}><Link href="/faq" style={{ color: "inherit", textDecoration: "none" }}>پرسش‌های متداول</Link></p>
            <p style={{ margin: "6px 0" }}><Link href="/tracking" style={{ color: "inherit", textDecoration: "none" }}>صفحه پیگیری سفارشات</Link></p>
            <p style={{ margin: "6px 0" }}><Link href="/guide" style={{ color: "inherit", textDecoration: "none" }}>راهنمای ثبت سفارش</Link></p>
          </div>
          <div>
            <h4 style={{ color: "#FFF", fontSize: "13px", fontWeight: "bold", margin: "0 0 12px 0" }}>صفحات مجازی و ارتباط</h4>
            <p style={{ margin: "6px 0" }}>اینستاگرام: <span dir="ltr">{siteSettings.footerInstagram}</span></p>
            <p style={{ margin: "6px 0" }}>تلگرام: <span dir="ltr">{siteSettings.footerTelegram}</span></p>
            <p style={{ margin: "6px 0" }}>واتساپ: <span dir="ltr">{siteSettings.footerWhatsapp}</span></p>
            <p style={{ margin: "6px 0", color: "#D4AF37", fontWeight: "bold" }}>پشتیبانی: <span dir="ltr">{siteSettings.footerPhone}</span></p>
          </div>
        </div>
        <div style={{ textAlign: "center", paddingTop: "20px", fontSize: "11px" }}>
          {siteSettings.footerCopyright}
        </div>
      </footer>

      {/* کشوی سبد خرید */}
      {isCartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)" }} onClick={resetDrawer} />
          <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px", backgroundColor: "#FFFFFF", height: "100%", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
            
            <div style={{ overflowY: "auto", flex: 1, paddingRight: "4px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EFE9DF", paddingBottom: "12px", marginBottom: "14px" }}>
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
                    <div style={{ textAlign: "center", padding: "50px 0" }}>
                      <p style={{ fontSize: "12px", color: "#777" }}>سبد خرید شما خالی است.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {cart.map((item) => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FAF8F5", padding: "10px", borderRadius: "12px", border: "1px solid #EFE9DF" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={item.image} alt={item.name} style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#FFF", border: "1px solid #E5E0D8" }} />
                            <div>
                              <div style={{ fontSize: "11px", fontWeight: "bold", color: "#1C1917" }}>{item.name}</div>
                              <div style={{ fontSize: "10px", color: "#8E1B24", fontWeight: "bold", marginTop: "2px" }}>
                                {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "6px", border: "1px solid #D4AF37", borderRadius: "8px", padding: "2px 6px", backgroundColor: "#FFF" }}>
                            <button type="button" onClick={() => decreaseQuantity(item.id)} style={{ background: "none", border: "none", fontSize: "13px", fontWeight: "bold", cursor: "pointer", color: "#8E1B24" }}>-</button>
                            <span style={{ fontSize: "11px", fontWeight: "bold" }}>{item.quantity}</span>
                            <button type="button" onClick={() => addToCart(item)} style={{ background: "none", border: "none", fontSize: "13px", fontWeight: "bold", cursor: "pointer", color: "#059669" }}>+</button>
                          </div>
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
                    <input required type="text" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxSizing: "border-box" }} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>شماره همراه</label>
                    <input required type="tel" dir="ltr" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", textAlign: "right", boxSizing: "border-box" }} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>استان</label>
                      <input required type="text" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxSizing: "border-box" }} value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>شهر</label>
                      <input required type="text" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", boxSizing: "border-box" }} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>کد پستی</label>
                    <input required type="text" dir="ltr" style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", textAlign: "right", boxSizing: "border-box" }} value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "4px" }}>نشانی دقیق پستی</label>
                    <textarea required rows={2} style={{ width: "100%", backgroundColor: "#FAF8F5", border: "1px solid #E2D9CF", borderRadius: "10px", padding: "8px 12px", fontSize: "12px", resize: "none", boxSizing: "border-box" }} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                </form>
              )}

              {step === "success" && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#D1FAE5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto", fontSize: "22px", fontWeight: "bold" }}>✓</div>
                  <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#1C1917", margin: "0 0 6px 0" }}>ثبت با موفقیت انجام شد</h4>
                  <button onClick={resetDrawer} style={{ padding: "8px 16px", backgroundColor: "#1C1917", color: "#FFF", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", marginTop: "12px" }}>ادامه خرید</button>
                </div>
              )}
            </div>

            {/* بخش کد تخفیف و دکمه نهایی */}
            {step === "cart" && cart.length > 0 && (
              <div style={{ borderTop: "1px solid #EAE5DE", paddingTop: "12px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="کد تخفیف (مثال: LUXE)"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      disabled={!!appliedCoupon}
                      style={{ flex: 1, padding: "7px 10px", borderRadius: "8px", border: "1px solid #CCC", fontSize: "11px", textTransform: "uppercase", boxSizing: "border-box" }}
                    />
                    {!appliedCoupon ? (
                      <button type="button" onClick={handleApplyCoupon} disabled={isValidatingCoupon} style={{ backgroundColor: "#1C1917", color: "#FFF", border: "none", padding: "7px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>اعمال</button>
                    ) : (
                      <button type="button" onClick={removeCoupon} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "7px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}>حذف</button>
                    )}
                  </div>
                  {couponError && <span style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px", display: "block" }}>{couponError}</span>}
                  {appliedCoupon && <span style={{ fontSize: "11px", color: "#059669", marginTop: "4px", display: "block" }}>✓ تخفیف اعمال شد</span>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "10px", fontSize: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#666" }}>
                    <span>مبلغ قابل پرداخت:</span>
                    <span style={{ fontSize: "14px", fontWeight: "900", color: "#8E1B24" }}>{finalPayablePrice.toLocaleString("fa-IR")} تومان</span>
                  </div>
                </div>

                <button onClick={() => setStep("checkout")} style={{ width: "100%", padding: "12px", backgroundColor: "#8E1B24", color: "#FFFFFF", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  تکمیل اطلاعات و ثبت سفارش
                </button>
              </div>
            )}

            {step === "checkout" && (
              <div style={{ borderTop: "1px solid #EFE9DF", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <button type="submit" form="orderForm" disabled={isSubmitting} style={{ width: "100%", padding: "12px", backgroundColor: "#8E1B24", color: "#FFFFFF", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>
                  {isSubmitting ? "در حال اتصال..." : "پرداخت آنلاین"}
                </button>
                <button type="button" onClick={() => setStep("cart")} style={{ background: "none", border: "none", fontSize: "11px", color: "#777", cursor: "pointer" }}>بازگشت به سبد</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}