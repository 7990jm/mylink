"use client";

import NextLink from "next/link";
import { LinkList } from "@/components/link-list";
import { ProfileHeader } from "@/components/profile-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useMyLink } from "@/lib/store";

export function MyLinkPage() {
  const { profile, links, loading } = useMyLink();

  return (
    <main className="flex flex-1 justify-center bg-muted/40 px-4 py-10">
      {/* 반응형: 모바일 100% / 태블릿 80%(최대 480px) / 데스크탑 400px */}
      <Card className="h-fit w-full md:w-4/5 md:max-w-[480px] lg:w-[400px]">
        <CardHeader className={loading ? "invisible" : undefined}>
          <ProfileHeader profile={profile} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">불러오는 중…</p>
          ) : (
            <LinkList links={links} />
          )}
          <NextLink
            href="/mypage"
            className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            내 링크 관리 →
          </NextLink>
        </CardContent>
      </Card>
    </main>
  );
}
