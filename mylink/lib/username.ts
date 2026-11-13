// 공유 주소(username) 규칙: 영문 소문자·숫자·-·_ 3~20자
const USERNAME_RE = /^[a-z0-9][a-z0-9_-]{2,19}$/;

// 사이트의 다른 페이지 주소와 겹치면 안 되는 이름
const RESERVED = new Set([
  "login", "mypage", "unlock", "api", "admin", "settings",
  "sitemap.xml", "robots.txt", "opengraph-image", "favicon.ico", "_next",
]);

export function validateUsername(name: string): string | null {
  if (!name) return "공유 주소를 입력해주세요";
  if (!USERNAME_RE.test(name)) return "영문 소문자, 숫자, -, _ 로 3~20자만 가능해요";
  if (RESERVED.has(name)) return "사용할 수 없는 주소예요";
  return null;
}

// 로그인하면 이메일 앞부분으로 기본 주소 생성 (예: hong@gmail.com → hong)
export function usernameFromEmail(email: string) {
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "").replace(/^[-_]+/, "");
  const name = base.slice(0, 20);
  return validateUsername(name) ? "user" : name;
}
