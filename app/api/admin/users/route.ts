import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'admins.json');

// تابع کمکی برای خواندن فایل ادمین‌ها
function getAdmins() {
  try {
    if (!fs.existsSync(filePath)) {
      const defaultData = [{ username: 'admin', password: '123', role: 'superadmin' }];
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    return [];
  }
}

// دریافت لیست ادمین‌ها
export async function GET() {
  const admins = getAdmins();
  // حذف پسوردها هنگام بازگرداندن به فرانت‌اند برای امنیت
  const safeAdmins = admins.map(({ password, ...rest }: any) => rest);
  return NextResponse.json(safeAdmins);
}

// تغییر رمز یا تعریف ادمین جدید
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, oldPassword, newPassword, newUsername, role } = body;
    let admins = getAdmins();

    // سناریو ۱: تغییر رمز عبور خود ادمین
    if (action === 'change_password') {
      const adminIndex = admins.findIndex((a: any) => a.username === username);
      if (adminIndex === -1) {
        return NextResponse.json({ success: false, error: 'کاربر یافت نشد' }, { status: 404 });
      }
      if (admins[adminIndex].password !== oldPassword) {
        return NextResponse.json({ success: false, error: 'رمز عبور فعلی نادرست است' }, { status: 400 });
      }

      if (newUsername) admins[adminIndex].username = newUsername;
      if (newPassword) admins[adminIndex].password = newPassword;

      fs.writeFileSync(filePath, JSON.stringify(admins, null, 2), 'utf-8');
      return NextResponse.json({ success: true, message: 'اطلاعات با موفقیت به‌روزرسانی شد' });
    }

    // سناریو ۲: تعریف ادمین جدید
    if (action === 'add_admin') {
      const exists = admins.some((a: any) => a.username === username);
      if (exists) {
        return NextResponse.json({ success: false, error: 'این نام کاربری قبلاً ثبت شده است' }, { status: 400 });
      }

      admins.push({
        username,
        password: newPassword,
        role: role || 'admin'
      });

      fs.writeFileSync(filePath, JSON.stringify(admins, null, 2), 'utf-8');
      return NextResponse.json({ success: true, message: 'مدیر جدید با موفقیت اضافه شد' });
    }

    // سناریو ۳: حذف ادمین
    if (action === 'delete_admin') {
      admins = admins.filter((a: any) => a.username !== username);
      fs.writeFileSync(filePath, JSON.stringify(admins, null, 2), 'utf-8');
      return NextResponse.json({ success: true, message: 'مدیر حذف شد' });
    }

    return NextResponse.json({ success: false, error: 'درخواست نامعتبر است' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'خطای سرور' }, { status: 500 });
  }
}