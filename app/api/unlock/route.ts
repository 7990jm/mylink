import { NextResponse } from "next/server";
import { UNLOCK_COOKIE, UNLOCK_SECONDS, createUnlockToken, safeEqual } from "@/lib/site-lock";

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
  res.cookies.set(UNLOCK_COOKIE, await createUnlockToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UNLOCK_SECONDS,
  });
  return res;
}
