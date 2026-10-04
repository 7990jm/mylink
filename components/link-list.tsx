import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Link } from "@/data/links";

// 링크 목록 (Read) — 배열을 순회하며 각 링크를 버튼으로 표시
// onDelete를 넘기면 각 링크 옆에 삭제 버튼 표시 (관리 페이지용)
export function LinkList({
  links,
  onDelete,
}: {
  links: Link[];
  onDelete?: (id: number) => void;
}) {
  if (links.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        아직 등록된 링크가 없어요.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {links.map((link) => (
        <li key={link.id} className="flex items-center gap-2">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-auto min-h-11 min-w-0 flex-1 justify-start gap-3 px-4 py-2.5"
            )}
          >
            <span aria-hidden className="text-lg">
              {link.icon}
            </span>
            <span className="flex min-w-0 flex-col items-start">
              <span className="w-full truncate font-medium">{link.title}</span>
              <span className="w-full truncate text-xs text-muted-foreground">
                {link.url}
              </span>
            </span>
          </a>
          {onDelete && (
            <Button
              variant="destructive"
              size="lg"
              className="h-11"
              onClick={() => onDelete(link.id)}
              aria-label={`${link.title} 삭제`}
            >
              삭제
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
