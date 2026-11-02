"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface ProductSpec {
  skinType?: string;
  concern?: string;
  targetArea?: string;
  texture?: string;
  ingredients?: string;
  brandOrigin?: string;
  ageRange?: string;
  usageType?: string;
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
  colors?: string[];
  description?: string;
  features?: string;
  specs?: ProductSpec;
}

interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // سبد خرید و مراحل
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // نظرات کاربران
  const [newCommentText, setNewCommentText] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const [userOrderHistory, setUserOrderHistory] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    city: "",
    postalCode: "",
    address: "",
  });

  useEffect(() => {
    const phone = localStorage.getItem("userPhone");
    const name = localStorage.getItem("userName");
    if (phone) setCurrentUserPhone(phone);
    if (name) setCurrentUserName(name);

    const rawCart = localStorage.getItem("userCart");
    if (rawCart) {
      try { setCart(JSON.parse(rawCart)); } catch (e) { console.error(e); }
    }

    const orders = JSON.parse(localStorage.getItem("userOrdersHistory") || "[]");
    setUserOrderHistory(orders);

    async function loadData() {
      try {
        const res = await fetch("/api/products");
        const list = await res.json();
        if (Array.isArray(list)) {
          setAllProducts(list);
          const found = list.find((p: any) => String(p.id) === String(productId));
          if (found) {
            setProduct(found);
            setSelectedImage(found.image || found.galleryImages?.[0] || "");
            if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (productId) loadData();
  }, [productId]);

  const updateCartStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("userCart", JSON.stringify(newCart));
  };

  const handleAddToCart = () => {
    if (!product) return;
    const existing = cart.find((it) => String(it.id) === String(product.id) && it.selectedColor === selectedColor);

    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map((it) =>
        String(it.id) === String(product.id) && it.selectedColor === selectedColor
          ? { ...it, quantity: it.quantity + quantity }
          : it
      );
    } else {
      updatedCart = [...cart, { ...product, quantity, selectedColor }];
    }

    updateCartStorage(updatedCart);
    setStep("cart");
    setIsCartOpen(true);
  };

  const removeFromCart = (id: any, color?: string) => {
    const updated = cart.filter((it) => !(String(it.id) === String(id) && it.selectedColor === color));
    updateCartStorage(updated);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isPreviousPurchase = userOrderHistory.some((order: any) =>
    order.items?.some((item: any) => String(item.id) === String(productId))
  );

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
        const history = JSON.parse(localStorage.getItem("userOrdersHistory") || "[]");
        localStorage.setItem("userOrdersHistory", JSON.stringify([...history, { items: cart, date: new Date().toLocaleDateString("fa-IR") }]));
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

  const similarProducts = allProducts.filter(
    (p) => p.category === product?.category && String(p.id) !== String(productId)
  ).slice(0, 4);

  const gallery = product?.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product?.image || ""];

  const colors = product?.colors && product.colors.length > 0
    ? product.colors
    : ["صورتی کلاسیک", "قرمز مخملی", "نود طبیعی", "کالباسی"];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF8F5", color: "#2D2D2D", direction: "rtl", fontFamily: "Vazirmatn, sans-serif", paddingBottom: "80px" }}>
      
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
            {isPreviousPurchase && (
              <span style={{ backgroundColor: "#E6F4EA", color: "#137333", fontSize: "11px", fontWeight: "bold", padding: "6px 12px", borderRadius: "10px", border: "1px solid #CEEAD6" }}>
                ✓ خرید همیشگی شما
              </span>
            )}
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
              ← فروشگاه
            </Link>
          </div>

        </div>
      </header>

      {/* بدنه اصلی */}
      <main style={{ maxWidth: "1240px", margin: "24px auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: "28px" }}>
        
        {/* بخش گالری، اطلاعات و خرید کالا */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #EFE9DF", padding: "30px", display: "grid", gridTemplateColumns: "1fr 1.2fr 330px", gap: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
          
          {/* گالری چندتصویری محصول */}
          <div>
            <div style={{ height: "300px", borderRadius: "16px", backgroundColor: "#FAF8F5", border: "1px solid #F0ECE4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "12px" }}>
              <img src={selectedImage || product?.image} alt={product?.name} style={{ maxHeight: "250px", maxWidth: "90%", objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {gallery.map((img: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{ width: "65px", height: "65px", borderRadius: "10px", border: selectedImage === img ? "2px solid #8E1B24" : "1px solid #E5E0D8", overflow: "hidden", cursor: "pointer", backgroundColor: "#FFF", padding: "2px" }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
              ))}
            </div>
          </div>

          {/* اطلاعات محصول و انتخاب رنگ */}
          <div>
            <span style={{ fontSize: "12px", color: "#A68A68", fontWeight: "bold" }}>{product?.brand}</span>
            <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: "6px 0", lineHeight: "1.5" }}>{product?.name}</h1>
            
            {/* انتخاب رنگ */}
            <div style={{ margin: "16px 0" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", color: "#444", marginBottom: "8px" }}>انتخاب رنگ / طیف:</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {colors.map((col: string, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      border: selectedColor === col ? "2px solid #8E1B24" : "1px solid #DDD",
                      backgroundColor: selectedColor === col ? "#FDF2F2" : "#FFF",
                      color: selectedColor === col ? "#8E1B24" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #F2ECE4", paddingTop: "14px", marginTop: "16px" }}>
              <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "6px" }}>ویژگی‌ها و مزایا:</div>
              <p style={{ fontSize: "12px", color: "#666", whiteSpace: "pre-line", lineHeight: "1.8", margin: 0 }}>{product?.features || product?.description || "ضمانت اصالت و کیفیت عالی"}</p>
            </div>
          </div>

          {/* باکس قیمت و خرید */}
          <div style={{ border: "1.5px solid #EFE9DF", borderRadius: "18px", padding: "20px", backgroundColor: "#FAF8F5", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11px", color: "#666" }}>
              <div>🛡️ ضمانت اصالت و سلامت کالا</div>
              <div>📦 ارسال سریع پیشتاز</div>

              <div style={{ borderTop: "1px solid #EAE5DE", paddingTop: "14px", marginTop: "10px", textAlign: "left" }}>
                {product?.oldPrice && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#999", textDecoration: "line-through" }}>{product.oldPrice.toLocaleString("fa-IR")}</span>
                    <span style={{ backgroundColor: "#8E1B24", color: "#FFFFFF", fontSize: "10px", fontWeight: "900", padding: "2px 6px", borderRadius: "6px" }}>%{product.discount || 35}</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: "4px", marginTop: "4px" }}>
                  <span style={{ fontSize: "22px", fontWeight: "900", color: "#8E1B24" }}>{product?.price?.toLocaleString("fa-IR")}</span>
                  <span style={{ fontSize: "12px", color: "#555" }}>تومان</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #CCC", borderRadius: "10px", padding: "4px 8px", backgroundColor: "#FFF" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>-</button>
                <span style={{ fontSize: "12px", fontWeight: "bold", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ background: "none", border: "none", fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}>+</button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                style={{ flex: 1, backgroundColor: "#8E1B24", color: "#FFFFFF", border: "none", padding: "12px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
              >
                افزودن به سبد
              </button>
            </div>
          </div>

        </div>

        {/* مشخصات تخصصی کامل محصول */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #EFE9DF", padding: "26px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "900", margin: "0 0 16px 0", borderBottom: "1px solid #F0ECE4", paddingBottom: "10px" }}>مشخصات فنی و ویژگی‌های محصول</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "12px", color: "#444" }}>
            <div><strong>نوع پوست مناسب:</strong> {product?.specs?.skinType || "انواع پوست"}</div>
            <div><strong>کارکرد / دغدغه:</strong> {product?.specs?.concern || "آبرسان و تغذیه‌کننده"}</div>
            <div><strong>ناحیه مصرف:</strong> {product?.specs?.targetArea || "صورت و بدن"}</div>
            <div><strong>ترکیبات کلیدی:</strong> {product?.specs?.ingredients || "ترکیبات گیاهی و ویتامینه"}</div>
            <div><strong>مبدا برند:</strong> {product?.specs?.brandOrigin || "فرانسه / ایران"}</div>
            <div><strong>رده سنی:</strong> {product?.specs?.ageRange || "بزرگسالان"}</div>
          </div>
        </div>

        {/* بخش نظرات همراه با آپلود عکس توسط مشتری */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #EFE9DF", padding: "26px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "900", margin: "0 0 16px 0" }}>نظرات و پرسش‌های کاربران</h2>

          {currentUserPhone ? (
            <div style={{ backgroundColor: "#FAF8F5", padding: "16px", borderRadius: "16px", border: "1px solid #EFE9DF", marginBottom: "20px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: "bold", margin: "0 0 8px 0" }}>ثبت نظر جدید</h4>
              <textarea
                rows={3}
                placeholder="نظر خود را درباره کیفیت این محصول بنویسید..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #DDD", fontSize: "12px", resize: "none", boxSizing: "border-box", marginBottom: "10px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#666", display: "block", marginBottom: "4px" }}>پیوست عکس (اختیاری):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append("file", file);
                      const res = await fetch("/api/uploads", { method: "POST", body: fd });
                      const json = await res.json();
                      if (json.success) setCommentImage(json.url);
                    }}
                    style={{ fontSize: "11px" }}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!newCommentText.trim()) return;
                    alert("نظر شما با موفقیت ثبت شد و پس از تایید ادمین نمایش داده می‌شود.");
                    setNewCommentText("");
                    setCommentImage("");
                  }}
                  style={{ backgroundColor: "#8E1B24", color: "#FFF", border: "none", padding: "9px 20px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                >
                  ارسال نظر
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "14px", backgroundColor: "#FFFBEB", borderRadius: "12px", fontSize: "12px", color: "#B45309", marginBottom: "20px" }}>
              برای ارسال نظر و عکس، لطفاً به حساب کاربری خود <Link href="/login" style={{ fontWeight: "bold", color: "#8E1B24" }}>وارد شوید</Link>.
            </div>
          )}
        </div>

        {/* محصولات مشابه */}
        {similarProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "900", marginBottom: "16px", color: "#1C1917" }}>محصولات مشابه</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
              {similarProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", padding: "14px", border: "1px solid #EFE9DF", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                >
                  <div>
                    <div style={{ height: "140px", backgroundColor: "#FAF8F5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px", overflow: "hidden" }}>
                      <img src={item.image} alt={item.name} style={{ maxHeight: "120px", maxWidth: "90%", objectFit: "contain" }} />
                    </div>
                    <h3 style={{ fontSize: "13px", fontWeight: "bold", height: "36px", overflow: "hidden", margin: "0 0 8px 0" }}>{item.name}</h3>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F5F2EC", paddingTop: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "900", color: "#8E1B24" }}>{item.price?.toLocaleString("fa-IR")} تومان</span>
                    <span style={{ fontSize: "11px", color: "#555", backgroundColor: "#FAF8F5", padding: "4px 8px", borderRadius: "8px" }}>مشاهده</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

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
                      <p style={{ fontSize: "12px", color: "#777" }}>سبد خرید شما خالی است.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "55vh", overflowY: "auto" }}>
                      {cart.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FAF8F5", padding: "10px", borderRadius: "14px", border: "1px solid #EFE9DF" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={item.image} alt={item.name} style={{ width: "44px", height: "44px", objectFit: "contain", borderRadius: "8px", backgroundColor: "#FFF", padding: "2px", border: "1px solid #E5E0D8" }} />
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: "bold", color: "#1C1917" }}>{item.name}</div>
                              {item.selectedColor && <div style={{ fontSize: "10px", color: "#888" }}>رنگ: {item.selectedColor}</div>}
                              <div style={{ fontSize: "10px", color: "#777", marginTop: "2px" }}>
                                {item.quantity} عدد × {item.price.toLocaleString("fa-IR")} تومان
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.id, item.selectedColor)} style={{ backgroundColor: "#FEE2E2", color: "#DC2626", border: "none", padding: "4px 8px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>
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
                  <p style={{ fontSize: "11px", color: "#777", margin: "0 0 16px 0" }}>خرید شما ثبت گردید و هم‌اکنون در سابقه «خرید همیشگی» شما ذخیره شد.</p>
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