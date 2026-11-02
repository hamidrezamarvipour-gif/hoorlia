import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// مسیر اصلی در پروژه و مسیر جایگزین سیستم‌عامل
const primaryDataDir = path.join(process.cwd(), "data");
const fallbackDataDir = "/tmp/data";

function getActiveFilePath() {
  // اگر پوشه اصلی قابل نوشتن باشد از آن استفاده می‌کند، در غیر این صورت از مسیر سیستم‌عامل
  try {
    if (!fs.existsSync(primaryDataDir)) {
      fs.mkdirSync(primaryDataDir, { recursive: true, mode: 0o777 });
    }
    // تست دسترسی نوشتن
    const testFile = path.join(primaryDataDir, ".perm_test");
    fs.writeFileSync(testFile, "ok");
    fs.unlinkSync(testFile);
    return path.join(primaryDataDir, "settings.json");
  } catch {
    if (!fs.existsSync(fallbackDataDir)) {
      fs.mkdirSync(fallbackDataDir, { recursive: true, mode: 0o777 });
    }
    return path.join(fallbackDataDir, "settings.json");
  }
}

export async function GET() {
  try {
    const filePath = getActiveFilePath();
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({});
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(content ? JSON.parse(content) : {});
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = getActiveFilePath();

    let current = {};
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        current = fileContent ? JSON.parse(fileContent) : {};
      } catch {
        current = {};
      }
    }

    const updated = { ...current, ...body };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "تنظیمات با موفقیت ذخیره شد" });
  } catch (error: any) {
    console.error("Save settings error:", error);
    return NextResponse.json(
      { error: "خطا در ذخیره تنظیمات روی سرور", details: error?.message },
      { status: 500 }
    );
  }
}