import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { listUsernames } from "@/lib/server-db";
import { SITE_URL } from "@/lib/site";

// 14주차: 검색엔진에 사이트 구조 알려주기 (/sitemap.xml)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const usernames = await listUsernames().catch(() => []);
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...usernames.map((u) => ({ url: `${SITE_URL}/${u}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
