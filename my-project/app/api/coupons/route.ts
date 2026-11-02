import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const couponsFilePath = path.join(process.cwd(), "data", "coupons.json");

function getCoupons() {
  try {
    if (!fs.existsSync(couponsFilePath)) {
      // ایجاد چند کوپن پیش‌فرض اولیه
      const initialCoupons = [
        {
          id: 1,
          code: "LUXE",
          type: "percent", // 'percent' یا 'fixed'
          value: 15, // ۱۵ درصد
          minOrder: 300000,
          maxDiscount: 150000,
          isActive: true,
        },
        {
          id: 2,
          code: "WELCOME",
          type: "fixed",
          value: 50000, // ۵۰ هزار تومان تخفیف
          minOrder: 200000,
          isActive: true,
        },
      ];
      const dir = path.dirname(couponsFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(couponsFilePath, JSON.stringify(initialCoupons, null, 2), "utf-8");
      return initialCoupons;
    }
    const content = fs.readFileSync(couponsFilePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function saveCoupons(coupons: any[]) {
  try {
    const dir = path.dirname(couponsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(couponsFilePath, JSON.stringify(coupons, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving coupons:", e);
  }
}

// دریافت لیست تمام کوپن‌ها
export async function GET() {
  const coupons = getCoupons();
  return NextResponse.json(coupons);
}

// ثبت یا اعتبارسنجی کوپن جدید
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const coupons = getCoupons();

    // اگر درخواست فقط بررسی صحت کوپن در سبد خرید باشد:
    if (body.action === "validate") {
      const found = coupons.find(
        (c: any) => c.code.toUpperCase() === body.code.trim().toUpperCase() && c.isActive
      );

      if (!found) {
        return NextResponse.json({ valid: false, error: "کد تخفیف معتبر نیست یا منقضی شده است." }, { status: 400 });
      }

      if (body.totalPrice < (found.minOrder || 0)) {
        return NextResponse.json({
          valid: false,
          error: `حداقل مبلغ سفارش برای استفاده از این کد ${found.minOrder.toLocaleString("fa-IR")} تومان است.`,
        }, { status: 400 });
      }

      let discountAmount = 0;
      if (found.type === "percent") {
        discountAmount = Math.round((body.totalPrice * found.value) / 100);
        if (found.maxDiscount && discountAmount > found.maxDiscount) {
          discountAmount = found.maxDiscount;
        }
      } else {
        discountAmount = found.value;
      }

      return NextResponse.json({
        valid: true,
        coupon: found,
        discountAmount,
      });
    }

    // افزودن کوپن جدید از پنل ادمین:
    const newCoupon = {
      id: Date.now(),
      code: body.code.trim().toUpperCase(),
      type: body.type || "percent",
      value: Number(body.value) || 0,
      minOrder: Number(body.minOrder) || 0,
      maxDiscount: Number(body.maxDiscount) || 0,
      isActive: true,
    };

    coupons.push(newCoupon);
    saveCoupons(coupons);

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    return NextResponse.json({ error: "خطا در پردازش کوپن" }, { status: 500 });
  }
}

// حذف کوپن
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    let coupons = getCoupons();
    coupons = coupons.filter((c: any) => String(c.id) !== String(id));
    saveCoupons(coupons);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "خطا در حذف کوپن" }, { status: 500 });
  }
}