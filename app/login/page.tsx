"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// تبدیل اعداد فارسی و عربی به انگلیسی
const toEnglishDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.split(persianDigits[i]).join(String(i));
    result = result.split(arabicDigits[i]).join(String(i));
  }
  return result;
};

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  
  // نگهداری کد ارسال‌شده برای صحت‌سنجی
  const [sentCode, setSentCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // مرحله‌های ورود: ۱. شماره موبایل ۲. نام‌خانوادگی (کاربر جدید) ۳. کد تایید
  const [step, setStep] = useState<"phone" | "register_name" | "otp">("phone");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  // تایمر معکوس کد تایید
  useEffect(() => {
    let interval: any;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // تابع مشترک ارسال کد تایید با قالب تاییدشده SMS.ir
  const sendOtpCode = async (targetPhone: string) => {
    setIsLoading(true);
    setError("");

    // تولید کد تصادفی ۵ رقمی
    const generatedCode = Math.floor(10000 + Math.random() * 90000).toString();

    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: targetPhone,
          code: generatedCode,
          templateId: 538129, // شناسه قالب تاییدشده شما
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSentCode(generatedCode);
        setStep("otp");
        setTimer(60);
        setCanResend(false);
      } else {
        setError(data.error || "خطا در ارسال پیامک. لطفاً دقایقی دیگر تلاش کنید.");
      }
    } catch {
      setError("خطای اتصال به سرور ارسال پیامک.");
    } finally {
      setIsLoading(false);
    }
  };

  // ۱. بررسی شماره موبایل
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = toEnglishDigits(phone.trim().replace(/\s+/g, ""));

    if (!/^09\d{9}$/.test(cleanPhone)) {
      setError("لطفاً یک شماره موبایل معتبر ۱۱ رقمی وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹).");
      return;
    }

    setPhone(cleanPhone);

    // بررسی آیا این شماره قبلاً ثبت‌نام شده است؟
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "{}");

    if (registeredUsers[cleanPhone]) {
      // کاربر قدیمی است -> ارسال آنی کد تایید و رفتن به گام OTP
      setFullName(registeredUsers[cleanPhone]);
      await sendOtpCode(cleanPhone);
    } else {
      // کاربر جدید است -> دریافت نام و نام خانوادگی
      setStep("register_name");
    }
  };

  // ۲. ثبت نام کاربر جدید و ارسال کد
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 3) {
      setError("لطفاً نام و نام خانوادگی خود را کامل وارد کنید.");
      return;
    }
    setError("");
    await sendOtpCode(phone);
  };

  // ۳. تأیید نهایی کد OTP و ورود به سایت
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanOtp = toEnglishDigits(otp.trim());

    if (cleanOtp.length < 4) {
      setError("لطفاً کد تایید را کامل وارد کنید.");
      return;
    }

    // بررسی تطابق کد پیامک‌شده با کد واردشده توسط کاربر
    if (cleanOtp !== sentCode) {
      setError("کد تایید وارد شده نادرست است.");
      return;
    }

    // ذخیره در لیست کاربران ثبت‌نام شده
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "{}");
    registeredUsers[phone] = fullName;
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    // ذخیره وضعیت ورود کاربر فعال
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userName", fullName);

    // هدایت به صفحه اصلی
    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF8F5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        direction: "rtl",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Vazirmatn', sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "40px 32px",
          boxShadow: "0 10px 35px rgba(0, 0, 0, 0.05)",
          border: "1px solid #EFE9DF",
          position: "relative",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        {/* لوگو */}
        <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #B38E5D, #D4AF37)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontWeight: "900",
                fontSize: "24px",
              }}
            >
              L
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#1C1917", display: "block" }}>
                لوکس‌استور
              </span>
              <span style={{ fontSize: "10px", color: "#A68A68", fontWeight: "bold", letterSpacing: "1px" }}>
                LUXE & ACCESSIBLE
              </span>
            </div>
          </div>
        </Link>

        {/* مرحله ۱: شماره موبایل */}
        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit}>
            <div style={{ textAlign: "right", marginBottom: "24px" }}>
              <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: "0 0 8px 0" }}>
                ورود | ثبت‌نام
              </h1>
              <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                لطفاً شماره موبایل خود را وارد کنید.
              </p>
            </div>

            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <input
                type="tel"
                required
                disabled={isLoading}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "12px",
                  border: "1.5px solid #E2D9CF",
                  backgroundColor: "#FFFFFF",
                  padding: "0 16px",
                  fontSize: "16px",
                  color: "#1C1917",
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: "center",
                  letterSpacing: "1px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8E1B24")}
                onBlur={(e) => (e.target.style.borderColor = "#E2D9CF")}
              />
              {error && (
                <span style={{ color: "#DC2626", fontSize: "11px", display: "block", marginTop: "6px" }}>
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: isLoading ? "#C5A880" : "#8E1B24",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "در حال ارسال کد..." : "ادامه"}
            </button>
          </form>
        )}

        {/* مرحله ۲: دریافت نام و نام خانوادگی */}
        {step === "register_name" && (
          <form onSubmit={handleNameSubmit}>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", color: "#8E1B24", fontWeight: "bold", backgroundColor: "#FDF2F2", padding: "4px 8px", borderRadius: "6px" }}>
                کاربر جدید
              </span>
              <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: "10px 0 6px 0" }}>
                تکمیل اطلاعات ثبت‌نام
              </h1>
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                برای ایجاد حساب کاربری، لطفاً نام و نام خانوادگی خود را بنویسید:
              </p>
            </div>

            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <input
                type="text"
                required
                disabled={isLoading}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: مریم کریمی"
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "12px",
                  border: "1.5px solid #E2D9CF",
                  backgroundColor: "#FFFFFF",
                  padding: "0 16px",
                  fontSize: "14px",
                  color: "#1C1917",
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: "right",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8E1B24")}
                onBlur={(e) => (e.target.style.borderColor = "#E2D9CF")}
              />
              {error && (
                <span style={{ color: "#DC2626", fontSize: "11px", display: "block", marginTop: "6px" }}>
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: isLoading ? "#C5A880" : "#8E1B24",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "در حال ارسال پیامک..." : "دریافت کد تایید"}
            </button>
          </form>
        )}

        {/* مرحله ۳: کد تایید پیامکی */}
        {step === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h1 style={{ fontSize: "18px", fontWeight: "900", color: "#1C1917", margin: 0 }}>
                  کد تایید ورود
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setError("");
                  }}
                  style={{ background: "none", border: "none", color: "#8E1B24", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}
                >
                  تغییر شماره
                </button>
              </div>
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                کد پیامک‌شده به شماره <span dir="ltr" style={{ fontWeight: "bold", color: "#1C1917" }}>{phone}</span> را وارد کنید:
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                dir="ltr"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="•••••"
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "12px",
                  border: "1.5px solid #E2D9CF",
                  backgroundColor: "#FFFFFF",
                  padding: "0 16px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#1C1917",
                  outline: "none",
                  boxSizing: "border-box",
                  textAlign: "center",
                  letterSpacing: "6px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8E1B24")}
                onBlur={(e) => (e.target.style.borderColor = "#E2D9CF")}
              />
              {error && (
                <span style={{ color: "#DC2626", fontSize: "11px", display: "block", marginTop: "6px", textAlign: "right" }}>
                  {error}
                </span>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                height: "48px",
                backgroundColor: "#8E1B24",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              تأیید و ورود به لوکس‌استور
            </button>

            <div style={{ marginTop: "20px", fontSize: "12px", color: "#777" }}>
              {!canResend ? (
                <span>ارسال مجدد کد تا <span style={{ fontWeight: "bold", color: "#8E1B24" }}>{timer}</span> ثانیه دیگر</span>
              ) : (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => sendOtpCode(phone)}
                  style={{ background: "none", border: "none", color: "#8E1B24", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                >
                  {isLoading ? "در حال ارسال..." : "ارسال مجدد کد تایید"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}