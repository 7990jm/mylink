import type { Link } from "@/lib/types";
import { panel } from "./ui";

// 13주차: 통계 섹션 — 총 클릭 수 + 링크별 클릭 수(많은 순)
export function Stats({ links }: { links: Link[] }) {
  const total = links.reduce((sum, l) => sum + l.clickCount, 0);
  const sorted = [...links].sort((a, b) => b.clickCount - a.clickCount);
  const max = Math.max(1, ...links.map((l) => l.clickCount));

  return (
    <section className={panel}>
      <h2 className="font-medium">클릭 통계</h2>
      <p className="text-3xl font-bold">
        총 {total.toLocaleString()} <span className="text-base font-medium text-muted-foreground">클릭</span>
      </p>
      {sorted.length > 0 && (
        <ul className="flex flex-col gap-3">
          {sorted.map((l) => (
            <li key={l.id} className="flex flex-col gap-1">
              <div className="flex justify-between gap-2 text-sm">
                <span className="truncate">{l.icon} {l.title}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{l.clickCount.toLocaleString()} 클릭</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-[#5B5FC7]" style={{ width: `${(l.clickCount / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
