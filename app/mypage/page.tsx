"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { ProfileHeader } from "@/components/profile-header";
import { Button } from "@/components/ui/button";
import { ensureProfile, useLinks, useProfile } from "@/lib/db";
import { useAuth } from "@/lib/use-auth";
import { AddLinkForm, LinkRows } from "./link-manager";
import { ProfileForm } from "./profile-form";
import { Stats } from "./stats";
import { panel } from "./ui";

// 마이페이지: 프로필 수정 + 링크 관리(CRUD) + 클릭 통계 — 로그인한 본인만
export default function MyPage() {
  const router = useRouter();
  const { user, ready, signOut } = useAuth();
  const profile = useProfile(user?.uid);
  const links = useLinks(user?.uid);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
    if (user) ensureProfile(user).catch((err) => console.error(err));
  }, [ready, user, router]);

  if (!user || !profile || !links) {
    return <p className="py-20 text-center text-sm text-muted-foreground">불러오는 중…</p>;
  }

  const myUrl = typeof window === "undefined" ? `/${profile.username}` : `${window.location.origin}/${profile.username}`;

  return (
    <main className="flex flex-1 justify-center bg-muted/40 px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">내 링크 관리</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">{profile.displayName}님</span>
            <button type="button" onClick={() => signOut()} className="shrink-0 underline-offset-4 hover:underline">
              로그아웃
            </button>
          </div>
        </header>

        <section className={panel}>
          <ProfileHeader profile={profile} />
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
            <NextLink href={`/${profile.username}`} target="_blank" className="min-w-0 flex-1 truncate underline-offset-4 hover:underline">
              {decodeURI(myUrl)}
            </NextLink>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(myUrl).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                });
              }}
            >
              {copied ? "복사됨 ✓" : "주소 복사"}
            </Button>
          </div>
        </section>

        <ProfileForm uid={user.uid} profile={profile} />
        <AddLinkForm uid={user.uid} />

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">내 링크 {links.length}개</h2>
          <LinkRows uid={user.uid} links={links} />
        </section>

        <Stats links={links} />
      </div>
    </main>
  );
}
