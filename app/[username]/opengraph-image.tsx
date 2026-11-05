import { ImageResponse } from "next/og";
import { fetchImageDataUrl, ogFonts, ogSize } from "@/lib/og";
import { getPublicPage } from "@/lib/server-db";
import { BRAND_COLOR, SITE_HOST_LABEL } from "@/lib/site";

// 14주차: 사용자마다 다른 동적 OG 이미지 (카카오톡 등 공유 미리보기)
export const alt = "마이링크 프로필";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const page = await getPublicPage(decodeURIComponent(username));
  const name = page?.profile.displayName ?? username;
  const bio = page?.profile.bio ?? "";
  const linkCount = page?.links.length ?? 0;
  const avatar = await fetchImageDataUrl(page?.profile.image ?? "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: 72, background: BRAND_COLOR, color: "white",
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, opacity: 0.9 }}>마이링크</div>
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          {avatar ? (
            <img src={avatar} width={200} height={200} style={{ borderRadius: 100, objectFit: "cover" }} alt="" />
          ) : (
            <div
              style={{
                width: 200, height: 200, borderRadius: 100, background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 96,
              }}
            >
              {name.charAt(0)}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
            <div style={{ fontSize: 76, lineHeight: 1.1 }}>{name}</div>
            {bio && <div style={{ fontSize: 34, opacity: 0.85, lineHeight: 1.3 }}>{bio.split("\n")[0].slice(0, 60)}</div>}
            <div style={{ display: "flex" }}>
              <div style={{ display: "flex", fontSize: 28, padding: "8px 24px", borderRadius: 999, background: "rgba(255,255,255,0.2)" }}>
                {linkCount}개의 링크
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.8 }}>{`${SITE_HOST_LABEL}/${username}`}</div>
      </div>
    ),
    { ...size, fonts: await ogFonts() }
  );
}
