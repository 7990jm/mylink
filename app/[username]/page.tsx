import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { LinkList } from "@/components/link-list";
import { ProfileHeader } from "@/components/profile-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPublicPage } from "@/lib/server-db";
import { DEFAULT_DESCRIPTION } from "@/lib/site";

type Props = { params: Promise<{ username: string }> };

// 12주차: /username 개인 페이지 (동적 라우팅)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { username } = await params;
  const page = await getPublicPage(decodeURIComponent(username));
  if (!page) return { title: "페이지를 찾을 수 없어요" };

  const title = `마이링크 - ${page.profile.displayName}`;
  const description = page.profile.bio || DEFAULT_DESCRIPTION;
  return {
    title,
    description,
    openGraph: { title, description, url: `/${page.profile.username}`, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function UserPage({ params }: Props) {
  await connection(); // 항상 최신 데이터로
  const { username } = await params;
  const page = await getPublicPage(decodeURIComponent(username));
  if (!page) notFound();

  return (
    <main className="flex flex-1 justify-center bg-muted/40 px-4 py-10">
      {/* 반응형: 모바일 100% / 태블릿 80%(최대 480px) / 데스크탑 400px */}
      <Card className="h-fit w-full md:w-4/5 md:max-w-[480px] lg:w-[400px]">
        <CardHeader>
          <ProfileHeader profile={page.profile} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LinkList links={page.links} uid={page.uid} />
          <NextLink href="/" className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline">
            마이링크로 나만의 페이지 만들기
          </NextLink>
        </CardContent>
      </Card>
    </main>
  );
}
