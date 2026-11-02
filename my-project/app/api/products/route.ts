import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "products.json");

const defaultProducts = [
  {
    id: 1,
    name: "محصول نمونه اول",
    price: 450000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "توضیحات کوتاه درباره کیفیت و کارایی این کالا."
  },
  {
    id: 2,
    name: "محصول نمونه دوم",
    price: 890000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    description: "کیفیت عالی، گارانتی سلامت و ضمانت بازگشت."
  },
  {
    id: 3,
    name: "محصول نمونه سوم",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    description: "طراحی شیک و مناسب استفاده روزمره."
  }
];

function readProducts() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultProducts, null, 2), "utf-8");
    return defaultProducts;
  }
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

// دریافت لیست محصولات
export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

// افزودن محصول جدید
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = readProducts();

    const newProduct = {
      id: Date.now(),
      name: body.name,
      price: Number(body.price),
      image: body.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      description: body.description || "",
    };

    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "خطا در ثبت محصول" }, { status: 500 });
  }
}

// حذف محصول
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    let products = readProducts();
    products = products.filter((p: any) => p.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "خطا در حذف محصول" }, { status: 500 });
  }
}