import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "articles.json");

function getArticles() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
    return [];
  }
  const fileContent = fs.readFileSync(dataFilePath, "utf8");
  try {
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

function saveArticles(articles: any[]) {
  const dir = path.dirname(dataFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dataFilePath, JSON.stringify(articles, null, 2));
}

// دریافت لیست مقالات
export async function GET() {
  const articles = getArticles();
  return NextResponse.json(articles);
}

// ثبت یا ویرایش مقاله
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const articles = getArticles();

    if (body.id) {
      const index = articles.findIndex((a: any) => String(a.id) === String(body.id));
      if (index !== -1) {
        articles[index] = { ...articles[index], ...body, updatedAt: new Date().toLocaleDateString("fa-IR") };
      } else {
        articles.unshift(body);
      }
    } else {
      const newArticle = {
        ...body,
        id: Date.now(),
        date: new Date().toLocaleDateString("fa-IR"),
      };
      articles.unshift(newArticle);
    }

    saveArticles(articles);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// حذف مقاله
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "شناسه یافت نشد" }, { status: 400 });

    let articles = getArticles();
    articles = articles.filter((a: any) => String(a.id) !== String(id));
    saveArticles(articles);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}