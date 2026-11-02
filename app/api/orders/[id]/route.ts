import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function getOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) return [];
    const data = fs.readFileSync(ordersFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveOrders(orders: any[]) {
  try {
    const dir = path.dirname(ordersFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving orders:", e);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const orders = getOrders();

    const orderIndex = orders.findIndex((o: any) => String(o.id) === String(id));
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // به‌روزرسانی وضعیت و کد رهگیری
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: body.status || orders[orderIndex].status,
      trackingCode: body.trackingCode !== undefined ? body.trackingCode : orders[orderIndex].trackingCode,
      updatedAt: new Date().toISOString(),
    };

    saveOrders(orders);
    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}