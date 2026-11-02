import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, phone, description } = body;

    // مرچنت کد اختصاصی شما
    const merchantId = "14c784bb-bd83-4f8e-b2f8-1a2a3be24d79";

    // درخواست به وب‌سرویس زرین‌پال (حالت ادران / پروداکشن)
    const zarinpalRes = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: amount, // مبلغ به تومان
        callback_url: `https://hoorlia.ir/api/payment/verify?orderId=${orderId}`,
        description: description || `سفارش شماره ${orderId}`,
        metadata: { mobile: phone },
      }),
    });

    const data = await zarinpalRes.json();

    if (data.data && data.data.code === 100) {
      const paymentUrl = `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`;
      return NextResponse.json({ success: true, url: paymentUrl });
    } else {
      return NextResponse.json(
        { success: false, error: data.errors?.message || "خطا در اتصال به درگاه زرین‌پال" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}