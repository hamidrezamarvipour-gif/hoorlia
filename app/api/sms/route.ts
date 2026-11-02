import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code, message, apiKey, templateId, parameters } = body;

    if (!phone) {
      return NextResponse.json({ error: "شماره موبایل الزامی است" }, { status: 400 });
    }

    // نرمال‌سازی شماره موبایل
    let cleanPhone = String(phone).trim().replace(/\s+/g, "");
    cleanPhone = cleanPhone.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

    // کلید وب‌سرویس اختصاصی و معتبر شما
    const ACTIVE_KEY = (apiKey && apiKey.trim().length > 10)
      ? apiKey.trim()
      : (process.env.SMS_API_KEY || "XJZL4A4xRmzcedlMWTu1oQNmW6Y2ZdrP7gaxUbez4VsPPBg1");

    // ۱. ارسال با قالب سریع (Verify / Pattern)
    if (templateId) {
      const paramsPayload = parameters || [
        { name: "Code", value: String(code || "1234") },
        { name: "CODE", value: String(code || "1234") }
      ];

      const res = await fetch("https://api.sms.ir/v1/send/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/plain",
          "x-api-key": ACTIVE_KEY,
        },
        body: JSON.stringify({
          mobile: cleanPhone,
          templateId: Number(templateId),
          parameters: paramsPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok || (data.status !== 1 && data.status !== 200)) {
        return NextResponse.json(
          { error: data.message || "خطا در ارسال پیامک با قالب" },
          { status: res.status || 400 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    // ۲. ارسال پیامک متنی (Bulk)
    if (message) {
      const res = await fetch("https://api.sms.ir/v1/send/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ACTIVE_KEY,
        },
        body: JSON.stringify({
          lineNumber: 30007732,
          messageText: String(message),
          mobiles: [cleanPhone],
          sendDateTime: null,
        }),
      });

      const data = await res.json();

      if (!res.ok || (data.status !== 1 && data.status !== 200)) {
        return NextResponse.json(
          { error: data.message || "خطا در ارسال پیامک متنی" },
          { status: res.status || 400 }
        );
      }

      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "پارامترهای ارسال مشخص نشده است" }, { status: 400 });
  } catch (error: any) {
    console.error("SMS API Error:", error);
    return NextResponse.json({ error: error?.message || "خطای ارتباط با سامانه پیامک" }, { status: 500 });
  }
}