import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone, message, patternCode, patternValues } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "شماره همراه الزامی است" }, { status: 400 });
    }

    // کلید و مشخصات پنل پیامکی (می‌توانید در .env.local قرار دهید)
    const API_KEY = process.env.SMS_API_KEY || "YOUR_SMS_API_KEY";

    // لاگ جهت تست در محیط لوکال قبل از اتصال به درگاه واقعی
    console.log(`[SMS Gateway] Sending to ${phone}:`, { message, patternCode, patternValues });

    /*
      نمونه ارسال با سرویس‌های ایرانی (مانند کاوه‌نگار / فراز اس‌ام‌اس):
      const res = await fetch(`https://api.kavenegar.com/v1/${API_KEY}/verify/lookup.json`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          receptor: phone,
          template: patternCode,
          ...patternValues
        })
      });
    */

    return NextResponse.json({ success: true, message: "پیامک با موفقیت ارسال شد" });
  } catch (error) {
    console.error("SMS Error:", error);
    return NextResponse.json({ error: "خطا در ارسال پیامک" }, { status: 500 });
  }
}