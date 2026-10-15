// 사이트 비밀번호 잠금 (proxy.ts와 /api/unlock에서 함께 사용)
// 쿠키에는 비밀번호 대신 서명값(HMAC)을 저장 → 비밀번호를 바꾸면 기존 쿠키는 자동 무효
export const UNLOCK_COOKIE = "mylink_unlock";

export async function unlockToken(password: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("mylink-unlock-v1"));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
