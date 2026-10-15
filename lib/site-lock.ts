// 사이트 비밀번호 잠금 (proxy.ts와 /api/unlock에서 함께 사용)
// 쿠키 = "만료시각.서명" → 만료되면 다시 비밀번호 입력, 비밀번호를 바꾸면 기존 쿠키도 무효
export const UNLOCK_COOKIE = "mylink_unlock";
export const UNLOCK_SECONDS = 60 * 60 * 6; // 6시간마다 다시 묻기

async function sign(password: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`mylink-unlock-v2:${message}`));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createUnlockToken(password: string) {
  const expires = Math.floor(Date.now() / 1000) + UNLOCK_SECONDS;
  return `${expires}.${await sign(password, String(expires))}`;
}

export async function isValidUnlockToken(token: string | undefined, password: string) {
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(sig, await sign(password, expires));
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
