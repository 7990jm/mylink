"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UnlockPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password) {
      setError("비밀번호를 입력해주세요");
      return;
    }
    setPending(true);
    setError("");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    setPending(false);

    if (!res?.ok) {
      setError(res ? "비밀번호가 맞지 않아요" : "연결에 실패했어요. 다시 시도해주세요");
      setPassword("");
      return;
    }
    // 원래 가려던 페이지로 (같은 사이트 경로만 허용)
    const next = new URLSearchParams(window.location.search).get("next") ?? "/";
    window.location.replace(next.startsWith("/") && !next.startsWith("//") ? next : "/");
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-muted/40 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-xs flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
      >
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-lg font-semibold">🔒 비공개 페이지</h1>
          <p className="text-sm text-muted-foreground">비밀번호를 입력해주세요</p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="sr-only">
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
            className="h-11 text-center tracking-widest"
          />
          {error && <p className="text-center text-sm text-destructive">{error}</p>}
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 bg-[#5B5FC7] text-white hover:bg-[#4A4EB0]"
        >
          {pending ? "확인 중…" : "들어가기"}
        </Button>
      </form>
    </main>
  );
}
