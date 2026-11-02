import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // پشتیبانی از نام‌های مختلف فیلد فایل در فرانت‌اند
    const file = (
      formData.get("file") || 
      formData.get("image") || 
      formData.get("photo") || 
      formData.get("avatar")
    ) as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "فایلی ارسال نشده است" }, { status: 400 });
    }

    // بررسی اینکه فایل ارسالی حتماً تصویر باشد (اختیاری ولی امن)
    if (file.type && !file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "فقط ارسال فایل تصویری مجاز است" }, { status: 400 });
    }

    // مسیر پوشه public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // ایجاد پوشه در صورت عدم وجود با دسترسی کامل
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ایمن‌سازی نام فایل برای جلوگیری از کاراکترهای فارسی و فاصله
    const originalExt = path.extname(file.name).toLowerCase() || ".png";
    const safeFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${originalExt}`;
    const targetPath = path.join(uploadDir, safeFilename);

    // تبدیل به بافر و ذخیره‌سازی روی دیسک سرور
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(targetPath, buffer);

    // بازگرداندن URL استاندارد برای ذخیره در دیتابیس یا state
    return NextResponse.json({
      success: true,
      url: `/uploads/${safeFilename}`,
      message: "تصویر با موفقیت آپلود شد",
    });

  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطا در پردازش و ذخیره تصویر روی سرور" },
      { status: 500 }
    );
  }
}