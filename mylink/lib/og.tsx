import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };

// 한글 폰트 (OG 이미지는 ttf/otf만 지원)
let fontData: Promise<Buffer> | null = null;
export function ogFonts() {
  fontData ??= readFile(join(process.cwd(), "assets/fonts/Pretendard-Bold.otf"));
  return fontData.then((data) => [{ name: "Pretendard", data, weight: 700 as const, style: "normal" as const }]);
}

// 프로필 이미지를 미리 받아 둠 (실패하면 null → 이름 첫 글자로 대체)
export async function fetchImageDataUrl(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/^image\/(png|jpe?g|gif|webp)/.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 1_500_000) return null;
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
