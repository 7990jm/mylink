"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ensureProfile } from "@/lib/db";
import { useAuth } from "@/lib/use-auth";

// 11주차: 구글 소셜 로그인 — 관리자 계정만 허용
export default function LoginPage() {
  const router = useRouter();
  const { user, ready, denied, signIn } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    ensureProfile(user)
      .then(() => router.replace("/mypage"))
      .catch(() => setError("프로필을 만들지 못했어요. 다시 시도해주세요"));
  }, [user, router]);

  return (
    <main className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-10">
      <div className="flex w-full max-w-xs flex-col gap-4 rounded-xl bg-card p-6 text-center ring-1 ring-foreground/10">
        <h1 className="text-xl font-semibold">관리자 로그인</h1>
        <p className="text-sm text-muted-foreground">관리자 Google 계정으로 로그인해주세요</p>
        <Button
          size="lg"
          disabled={!ready || !!user}
          className="h-11 bg-[#5B5FC7] text-white hover:bg-[#4A4EB0]"
          onClick={() => {
            setError("");
            signIn().catch((err) => {
              if (err?.code !== "auth/popup-closed-by-user") setError("로그인하지 못했어요. 다시 시도해주세요");
            });
          }}
        >
          {user ? "이동 중…" : "Google로 로그인"}
        </Button>
        {denied && <p className="text-sm text-destructive">관리자 계정만 로그인할 수 있어요</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </main>
  );
}
