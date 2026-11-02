import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ordersPath = path.join(process.cwd(), "data", "orders.json");

export async function GET() {
  try {
    let orders: any[] = [];
    if (fs.existsSync(ordersPath)) {
      orders = JSON.parse(fs.readFileSync(ordersPath, "utf-8"));
    }

    // تجمیع سفارش‌ها بر اساس شماره موبایل مشتری
    const customerMap: { [phone: string]: any } = {};

    orders.forEach((o) => {
      const phone = o.phone || "نامشخص";
      if (!customerMap[phone]) {
        customerMap[phone] = {
          phone,
          fullName: o.fullName || "کاربر مهمان",
          city: o.city || "-",
          province: o.province || "-",
          orderCount: 0,
          totalSpent: 0,
          lastOrderDate: o.id ? new Date(o.id).toLocaleDateString("fa-IR") : "-",
          orders: [],
        };
      }
      customerMap[phone].orderCount += 1;
      customerMap[phone].totalSpent += Number(o.totalPrice) || 0;
      customerMap[phone].orders.push(o);
    });

    const customers = Object.values(customerMap);
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: "خطا در دریافت لیست مشتریان" }, { status: 500 });
  }
}