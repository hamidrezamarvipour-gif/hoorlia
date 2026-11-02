"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
}

interface CartItem extends Product {
  quantity: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // مدیریت سبد خرید و مراحل ثبت سفارش داخل همین صفحه
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });

  // خواندن اطلاعات کالا و سبد خرید ذخیره‌شده
  useEffect(() => {
    const rawCart = localStorage.getItem("userCart");
    if (rawCart) {
      try {
        setCart(JSON.parse(rawCart));
      } catch (e) {
        console.error(e);
      }
    }

    async function loadProduct() {
      try {
        const res = await fetch("/api/products");
        const list = await res.json();
        if (Array.isArray(list)) {
          const found = list.find((p: any) => String(p.id) === String(productId));
          if (found) {
            setProduct(found);
            setSelectedImage(found.image);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }

      // داده پیش‌فرض
      const fallback: Product = {
        id: productId,
        name: "کرم مرطوب‌کننده قوی صورت مدل Dry Relief حجم ۵۰ میلی‌لیتر",
        enName: "Ardene Atopia Urea Moisturizing Facial Cream 50ml",
        brand: "لومینس",
        category: "مراقبت پوست",
        size: "۵۰ میلی‌لیتر",
        price: 56000,
        oldPrice: 85000,
        discount: 34,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80"
        ],
        description: "فرموله شده با هیالورونیک اسید و ترکیبات آبرسان عمیق جهت رفع خشکی و حفظ رطوبت ۲۴ ساعته پوست.",
        features: "آبرسانی با ماندگاری بالا\nمناسب انواع پوست و ضدحساسیت\nجذب سریع بدون ایجاد حس چربی",
        specs: {
          skinType: "خشک و حساس",
          concern: "کم‌آبی و خشکی شدید",
          targetArea: "صورت و گردن",
          texture: "کرم سبک",
          ingredients: "هیالورونیک اسید، ویتامین B5، سرامید"
        }
      };
      setProduct(fallback);
      setSelectedImage(fallback.image);
    }

    if (productId) loadProduct();
  }, [productId]);

  // ذخیره هماهنگ تغییرات سبد خرید
  const updateCartStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("userCart", JSON.stringify(newCart));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const existing = cart.find((it) => String(it.id) === String(product.id));

    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map((it) =>
        String(it.id) === String(product.id) ? { ...it, quantity: it.quantity + 1 } : it
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    updateCartStorage(updatedCart);
    setStep("cart");
    setIsCartOpen(true); // باز شدن خودکار سبد خرید بدون پرش به صفحه اصلی
  };

  const removeFromCart = (id: any) => {
    const updated = cart.filter((it) => String(it.id) !== String(id));
    updateCartStorage(updated);
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
        updateCartStorage([]);
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F5", color: "#2D2D2D", direction: "rtl", fontFamily: "-apple-system, BlinkMacSystemFont, 'Vazirmatn', sans-serif", paddingBottom: "80px" }}>
      
      {/* سربرگ هدر */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EFE9DF", padding: "14px 24px", position: "sticky", top: 0, zIndex: 30, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, #B38E5D, #D4AF37)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: "900", fontSize: "18px" }}>
              L
            </div>
            <div>
              <span style={{ fontSize: "17px", fontWeight: "900", color: "#1C1917", display: "block" }}>لوکس‌استور</span>
              <span style={{ fontSize: "9px", color: "#A68A68", fontWeight: "bold" }}>LUXE & ACCESSIBLE</span>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#8E1B24", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
            >
              <span>سبد خرید</span>
              <span style={{ backgroundColor: "#FFFFFF", color: "#8E1B24", borderRadius: "999px", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "900" }}>
                {totalCount}
              </span>
            </button>
            <Link href="/" style={{ fontSize: "12px", color: "#666", textDecoration: "none", border: "1px solid #E5E0D8", padding: "7px 14px", borderRadius: "10px", backgroundColor: "#FFFFFF" }}>
              ← بازگشت به فروشگاه
            </Link>
          </div>

        </div>
      </header>

      {/* محتوای صفحه کالا */}
      <main style={{ maxWidth: "1240px", margin: "24px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "28px" }}>
        
        {/* مسیر راهنما */}
        <div style={{ fontSize: "12px", color: "#888", display: "flex", gap: "8px" }}>
          <Link href="/" style={{ color: "#666", textDecoration: "none" }}>فروشگاه</Link>
          <span>/</span>
          <span>{product?.category || "محصولات"}</span>
          <span>/</span>
          <span style={{ color: "#1C1917", fontWeight: "bold" }}>{product?.brand}</span>
        </div>

        {/* کادر اصلی محصول: گالری + مشخصات + جعبه قیمت و خرید */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #EFE9DF", padding: "30px", display: "grid", gridTemplateColumns: "1fr 1.2fr 330px", gap: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          
          {/* عکس محصول */}
          <div style={{ height: "320px", borderRadius: "16px", backgroundColor: "#FAF8F5", border: "1px solid #F0ECE4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img src={selectedImage || product?.image} alt={product?.name} style={{ maxHeight: "260px", maxWidth: "90%", objectFit: "contain" }} />
          </div>

          {/* نام و مشخصات اصلی کالا */}
          <div>
            <span style={{ fontSize: "12px", color: "#A68A68", fontWeight: "bold" }}>{product?.brand}</span>
            <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: "6px 0", lineHeight: "1.5" }}>{product?.name}</h1>
            {product?.enName && (
              <div style={{ fontSize: "12px", color: "#888", direction: "ltr", textAlign: "right", marginBottom: "16px" }}>{product?.enName}</div>
            )}
            <div style={{ fontSize: "12px", color: "#555", marginTop: "12px" }}>
              <strong>حجم / سایز:</strong> {product?.size || "استاندارد"}
            </div>
            <div style={{ borderTop: "1px solid #F2ECE4", paddingTop: "14px", marginTop: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>ویژگی‌های اصلی:</div>
              <p style={{ fontSize: "12px", color: "#666", whiteSpace: "pre-line", lineHeight: "1.8", margin: 0 }}>{product?.features || "ضمانت کیفیت، ماندگاری و اصالت کامل کالا"}</p>
            </div>
          </div>

          {/* کادر خرید و قیمت (با تراز قیمت در سمت چپ) */}
          <div style={{ border: "1.5px solid #EFE9DF", borderRadius: "18px", padding: "20px", backgroundColor: "#FAF8F5", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px", color: "#666" }}>
              <div>🛡️ ضمانت اصالت ۱۰۰٪ کالا</div>
              <div>📦 ارسال سریع با پست پیشتاز</div>
              <div>🔄 ۷ روز ضمانت بازگشت</div>

              {/* بخش قیمت با تراز دقیق در سمت چپ */}
              <div style={{ borderTop: "1px solid #EAE5DE", paddingTop: "14px", marginTop: "10px", textAlign: "left" }}>
                {product?.oldPrice && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#999", textDecoration: "line-through" }}>
                      {product.oldPrice.toLocaleString("fa-IR")}
                    </span>
                    <span style={{ backgroundColor: "#8E1B24", color: "#FFFFFF", fontSize: "10px", fontWeight: "900", padding: "2px 6px", borderRadius: "6px" }}>
                      %{product.discount || 35}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: "4px", marginTop: "4px" }}>
                  <span style={{ fontSize: "22px", fontWeight: "900", color: "#8E1B24" }}>
                    {product?.price?.toLocaleString("fa-IR")}
                  </span>
                  <span style={{ fontSize: "12px", color: "#555" }}>تومان</span>
                </div>
              </div>
            </div>

            {/* کلید عملیاتی افزودن به سبد */}
            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                width: "100%",
                backgroundColor: "#8E1B24",
                color: "#FFFFFF",
                border: "none",
                padding: "13px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "16px",
                boxShadow: "0 4px 12px rgba(142,27,36,0.25)",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#73141B")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#8E1B24")}
            >
              افزودن به سبد خرید
            </button>
          </div>

        </div>

        {/* جدول مشخصات تخصصی */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #EFE9DF", padding: "26px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "900", margin: "0 0 16px 0", borderBottom: "1px solid #F0ECE4", paddingBottom: "10px" }}>مشخصات فنی کالا</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
              <span style={{ color: "#888" }}>نوع پوست:</span>
              <span style={{ fontWeight: "bold" }}>{product?.specs?.skinType || "انواع پوست"}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
              <span style={{ color: "#888" }}>کارکرد و دغدغه:</span>
              <span style={{ fontWeight: "bold" }}>{product?.specs?.concern || "آبرسانی و شاداب‌کننده"}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
              <span style={{ color: "#888" }}>ناحیه استفاده:</span>
              <span style={{ fontWeight: "bold" }}>{product?.specs?.targetArea || "صورت و گردن"}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
              <span style={{ color: "#888" }}>بافت محصول:</span>
              <span style={{ fontWeight: "bold" }}>{product?.specs?.texture || "کرم"}</span>
            </div>
          </div>
        </div>

      </main>

      {/* کشوی کامل سبد خرید و ثبت نهایی سفارش */}
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
                  <p style={{ fontSize: "11px", color: "#777", margin: "0 0 16px 0" }}>سفارش برای ارسال و تخصیص کد رهگیری ذخیره گردید.</p>
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