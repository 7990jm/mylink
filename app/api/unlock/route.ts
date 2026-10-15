import { NextResponse } from "next/server";
import { UNLOCK_COOKIE, safeEqual, unlockToken } from "@/lib/site-lock";

export async function POST(request: Request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.json({ ok: true });

  const body = await request.json().catch(() => ({}));
  const given = typeof body.password === "string" ? body.password : "";

  if (!safeEqual(given, password)) {
    // 마구 대입하는 시도를 느리게
    await new Promise((r) => setTimeout(r, 1000));
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(UNLOCK_COOKIE, await unlockToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30일 동안 다시 묻지 않음
  });
  return res;
}
