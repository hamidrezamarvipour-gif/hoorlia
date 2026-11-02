import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ثبت سفارش جدید (مشتری)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const orderData = {
      id: Date.now(),
      fullName: body.fullName,
      phone: body.phone,
      province: body.province,
      city: body.city,
      postalCode: body.postalCode,
      address: body.address,
      items: body.items,
      totalPrice: body.totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // مسیر پوشه ذخیره‌سازی داده‌ها
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "orders.json");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let orders = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      try {
        orders = JSON.parse(fileContent);
      } catch {
        orders = [];
      }
    }

    orders.push(orderData);
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), "utf-8");

    return NextResponse.json({ success: true, order: orderData });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "خطای سرور در ثبت سفارش" },
      { status: 500 }
    );
  }
}

// خواندن لیست سفارش‌ها (پنل ادمین)
export async function GET() {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "orders.json");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json([]);
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(fileContent));
  } catch {
    return NextResponse.json([]);
  }
}