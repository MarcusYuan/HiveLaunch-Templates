import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  
  // TODO: 实现认证逻辑
  
  return NextResponse.json({ success: true });
}
