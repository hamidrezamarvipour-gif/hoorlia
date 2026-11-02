import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // خواندن فایل سفارشات و محصولات
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    const productsPath = path.join(process.cwd(), 'data', 'products.json');

    const orders = fs.existsSync(ordersPath) ? JSON.parse(fs.readFileSync(ordersPath, 'utf8')) : [];
    const products = fs.existsSync(productsPath) ? JSON.parse(fs.readFileSync(productsPath, 'utf8')) : [];

    // ۱. شیت اول: گزارش کامل سفارشات ماه
    const ordersData = orders.map((o: any) => ({
      "شناسه سفارش": o.id,
      "نام مشتری": o.customerName || "کاربر",
      "شماره تماس": o.phone,
      "مبلغ کل (تومان)": o.totalPrice || 0,
      "وضعیت": o.status || "تکمیل شده",
      "تاریخ ثبت": o.createdAt || new Date().toLocaleDateString('fa-IR')
    }));

    // ۲. شیت دوم: تحلیل علایق و نیازهای مشتریان بر اساس کالاها
    const demandData = products.map((p: any) => ({
      "کد محصول": p.id,
      "نام محصول": p.title || p.name,
      "دسته‌بندی": p.category || "آرایشی",
      "موجودی فعلی": p.stock || 0,
      "قیمت واحد (تومان)": p.price || 0,
      "میزان تقاضا / فروش": p.soldCount || 0
    }));

    // ساخت ورک‌بوک چندبرگی
    const workbook = XLSX.utils.book_new();
    const ordersSheet = XLSX.utils.json_to_sheet(ordersData);
    const demandSheet = XLSX.utils.json_to_sheet(demandData);

    XLSX.utils.book_append_sheet(workbook, ordersSheet, "گزارش فروش ماهانه");
    XLSX.utils.book_append_sheet(workbook, demandSheet, "تحلیل تقاضای مشتریان");

    // خروجی بافر
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new Response(buffer, {
      headers: {
        'Content-Disposition': 'attachment; filename="Monthly_Report_Hoorlia.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error("Excel Export Error:", error);
    return NextResponse.json({ error: "خطا در تولید فایل اکسل" }, { status: 500 });
  }
}