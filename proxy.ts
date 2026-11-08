import { NextResponse, type NextRequest } from "next/server";
import { UNLOCK_COOKIE, isValidUnlockToken } from "@/lib/site-lock";

// 관리 화면(/login, /mypage) 비밀번호 보호 — 개인 링크 페이지·첫 화면은 누구나 접속
// Vercel 환경변수 SITE_PASSWORD가 있으면 잠금(→ /unlock 페이지), 없으면 공개
export async function proxy(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  if (await isValidUnlockToken(request.cookies.get(UNLOCK_COOKIE)?.value, password)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // 관리 화면만 보호
  matcher: ["/login", "/mypage/:path*"],
};
