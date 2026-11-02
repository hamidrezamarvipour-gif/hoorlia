import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

const defaultSettings = {
  announcement: "✨ جشنواره پاییزه: ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان | کد تخفیف: LUXE",
  siteTitle: "لوکس‌استور",
  siteSubtitle: "LUXE & ACCESSIBLE",
  heroBannerTitle: "درخشش لوکس، با قیمتی کاملاً اقتصادی!",
  heroBannerSubtitle: "منتخب پرطرفدارترین محصولات آرایشی و اکسسوری‌های رنگ ثابت با گارانتی سلامت کالا.",
  bannerBadge: "حراج پاییزی",
  phoneSupport: "۰۲۱-۹۱۰۰۵۰۰۰",
  telegramSupport: "@luxe_support",
  instagram: "@luxe_store",
  dealHours: 14,
  dealMinutes: 35,
};

function getSettings() {
  try {
    if (!fs.existsSync(settingsFilePath)) return defaultSettings;
    const content = fs.readFileSync(settingsFilePath, "utf-8");
    return { ...defaultSettings, ...JSON.parse(content) };
  } catch {
    return defaultSettings;
  }
}

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = getSettings();
    const updated = { ...current, ...body };

    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(settingsFilePath, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}