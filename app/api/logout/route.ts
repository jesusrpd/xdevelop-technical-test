import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.json({ success: true })
  res.cookies.delete

  return NextResponse.json({ success: true })
}