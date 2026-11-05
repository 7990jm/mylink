"use client";

import { buttonVariants } from "@/components/ui/button";
import { countClick } from "@/lib/db";
import type { Link } from "@/lib/types";
import { cn } from "@/lib/utils";

// 링크 목록 (Read) — 배열을 순회하며 각 링크를 버튼으로 표시
// uid를 넘기면 클릭할 때마다 클릭 수 +1 (13주차)
export function LinkList({ links, uid }: { links: Link[]; uid?: string }) {
  if (links.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">아직 등록된 링크가 없어요.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (uid) countClick(uid, link.id).catch((err) => console.error("클릭 수 저장 실패", err));
            }}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-auto min-h-11 w-full min-w-0 justify-start gap-3 px-4 py-2.5"
            )}
          >
            <span aria-hidden className="text-lg">{link.icon}</span>
            <span className="flex min-w-0 flex-col items-start">
              <span className="w-full truncate font-medium">{link.title}</span>
              <span className="w-full truncate text-xs text-muted-foreground">{link.url}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
