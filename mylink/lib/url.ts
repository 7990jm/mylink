// 주소 형식 검증: "blog.com"처럼 http(s)가 없으면 https://를 붙여서 확인
export function normalizeUrl(raw: string): string | null {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withScheme);
    if (!parsed.hostname.includes(".")) return null; // "abc" 같은 입력 차단
    return parsed.href;
  } catch {
    return null;
  }
}

export function iconFor(url: string) {
  const host = new URL(url).hostname;
  return /(^|\.)(youtube\.com|youtu\.be)$/.test(host) ? "📺" : "🔗";
}
