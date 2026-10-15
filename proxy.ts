import { NextResponse, type NextRequest } from "next/server";

// 사이트 전체 비밀번호 보호 (HTTP Basic Auth)
// Vercel 환경변수 SITE_PASSWORD가 있으면 잠금, 없으면 공개
// 아이디 칸은 아무거나 입력해도 됨 (비밀번호만 확인)

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function passwordFrom(header: string | null): string | null {
  if (!header?.startsWith("Basic ")) return null;
  try {
    const decoded = new TextDecoder().decode(
      Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0))
    );
    return decoded.slice(decoded.indexOf(":") + 1);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const expected = process.env.SITE_PASSWORD;
  if (!expected) return NextResponse.next();

  const given = passwordFrom(request.headers.get("authorization"));
  if (given !== null && safeEqual(given, expected)) return NextResponse.next();

  return new NextResponse("비밀번호가 필요합니다.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="mylink", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  // 이미지·폰트 등 빌드 파일은 제외하고 모든 페이지 보호
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
