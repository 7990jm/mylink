import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { DEFAULT_DESCRIPTION, SITE_URL } from "@/lib/site";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 14주차: SEO 메타태그 + OG 태그 (공유 미리보기)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "마이링크 - 나만의 링크 페이지", template: "%s" },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: "마이링크 - 나만의 링크 페이지",
    description: DEFAULT_DESCRIPTION,
    url: "/",
    siteName: "마이링크",
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
