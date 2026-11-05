import { ImageResponse } from "next/og";
import { ogFonts, ogSize } from "@/lib/og";
import { BRAND_COLOR, DEFAULT_DESCRIPTION, SITE_HOST_LABEL } from "@/lib/site";

export const alt = "마이링크";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 24, background: BRAND_COLOR,
          color: "white", fontFamily: "Pretendard",
        }}
      >
        <div style={{ fontSize: 120 }}>마이링크</div>
        <div style={{ fontSize: 44, opacity: 0.9 }}>{DEFAULT_DESCRIPTION}</div>
        <div style={{ fontSize: 30, opacity: 0.7 }}>{SITE_HOST_LABEL}</div>
      </div>
    ),
    { ...size, fonts: await ogFonts() }
  );
}
