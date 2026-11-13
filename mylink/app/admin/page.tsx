"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { deleteUserPage, listUsers, type UserSummary } from "@/lib/db";
import { ADMIN_UID } from "@/lib/site";
import { useAuth } from "@/lib/use-auth";
import { panel } from "../mypage/ui";

// 관리자 페이지: 전체 사용자 목록 + 부적절한 페이지 삭제 — 관리자 계정만
export default function AdminPage() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const isAdmin = user?.uid === ADMIN_UID;
  const [users, setUsers] = useState<UserSummary[] | null>(null);
  const [deleting, setDeleting] = useState<UserSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !user) router.replace("/login");
    if (ready && user && !isAdmin) router.replace("/mypage");
    if (isAdmin) listUsers().then(setUsers).catch(() => setError("목록을 불러오지 못했어요"));
  }, [ready, user, isAdmin, router]);

  if (!isAdmin || (!users && !error)) {
    return <p className="py-20 text-center text-sm text-muted-foreground">불러오는 중…</p>;
  }

  return (
    <main className="flex flex-1 justify-center bg-muted/40 px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold">관리자</h1>
          <NextLink href="/mypage" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            마이페이지로
          </NextLink>
        </header>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <section className={panel}>
          <h2 className="text-sm font-medium text-muted-foreground">사용자 {users?.length ?? 0}명</h2>
          <ul className="flex flex-col divide-y">
            {users?.map((u) => (
              <li key={u.uid} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {u.displayName || "(이름 없음)"}
                    {u.uid === ADMIN_UID && <span className="ml-1 text-xs text-[#5B5FC7]">관리자</span>}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {u.username ? (
                      <NextLink href={`/${u.username}`} target="_blank" className="underline-offset-4 hover:underline">
                        /{u.username}
                      </NextLink>
                    ) : (
                      "주소 없음"
                    )}
                    {" · "}링크 {u.linkCount}개 · {u.totalClicks} 클릭
                  </p>
                </div>
                {u.uid !== ADMIN_UID && (
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => setDeleting(u)}>
                    삭제
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.displayName}&quot; 님의 페이지와 링크 {deleting?.linkCount}개가 삭제됩니다.
              <span className="mt-1 block font-medium text-destructive">⚠️ 이 작업은 되돌릴 수 없습니다</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (!deleting) return;
                const target = deleting;
                setDeleting(null);
                try {
                  await deleteUserPage(target.uid, target.username);
                  setUsers((prev) => prev?.filter((u) => u.uid !== target.uid) ?? null);
                } catch {
                  setError("삭제하지 못했어요. 다시 시도해주세요");
                }
              }}
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
