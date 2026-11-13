import NextLink from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_COLOR, DEFAULT_DESCRIPTION, GITHUB_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

// 14주차: 랜딩 페이지 (히어로 → 기능 소개 → 미리보기 → 푸터)
const features = [
  { icon: "🔗", title: "링크 관리", desc: "유튜브 채널, SNS, 블로그 링크를 추가·수정·삭제" },
  { icon: "📊", title: "클릭 통계", desc: "어떤 링크가 인기 있는지 클릭 수로 한눈에" },
  { icon: "🙋", title: "개인 URL", desc: "나만의 주소 /username 으로 어디든 공유" },
];

const previewLinks = [
  { icon: "📺", title: "메인 채널" },
  { icon: "📺", title: "서브 채널" },
  { icon: "🔗", title: "블로그" },
];

const cta = cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base text-white hover:opacity-90");

export default function Landing() {
  return (
    <main className="flex flex-1 flex-col">
      {/* 1. 히어로 */}
      <section className="flex flex-col items-center gap-6 px-4 pt-20 pb-16 text-center" style={{ background: `${BRAND_COLOR}0f` }}>
        <p className="text-sm font-medium" style={{ color: BRAND_COLOR }}>링크트리 대신, 마이링크</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">마이링크</h1>
        <p className="max-w-md text-lg text-muted-foreground">{DEFAULT_DESCRIPTION}</p>
        <NextLink href="/login" className={cta} style={{ background: BRAND_COLOR }}>
          시작하기
        </NextLink>
      </section>

      {/* 2. 기능 소개 */}
      <section className="mx-auto grid w-full max-w-4xl gap-4 px-4 py-16 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col gap-2 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <span aria-hidden className="text-3xl">{f.icon}</span>
            <h2 className="font-semibold">{f.title}</h2>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. 미리보기 */}
      <section className="flex flex-col items-center gap-8 bg-muted/40 px-4 py-16">
        <h2 className="text-2xl font-bold">이런 페이지가 만들어져요</h2>
        <div className="flex w-full max-w-[320px] flex-col items-center gap-3 rounded-[2rem] bg-card p-6 shadow-lg ring-1 ring-foreground/10">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground">
            마
          </div>
          <p className="font-semibold">내 채널 이름</p>
          <p className="text-xs text-muted-foreground">소개글이 여기에 표시돼요</p>
          <div className="mt-2 flex w-full flex-col gap-2">
            {previewLinks.map((l) => (
              <div key={l.title} className="flex h-11 items-center gap-3 rounded-lg px-4 text-sm ring-1 ring-foreground/10">
                <span aria-hidden>{l.icon}</span>
                {l.title}
              </div>
            ))}
          </div>
        </div>
        <NextLink href="/login" className={cta} style={{ background: BRAND_COLOR }}>
          나도 만들어보기
        </NextLink>
      </section>

      {/* 4. 푸터 */}
      <footer className="flex flex-col items-center gap-2 px-4 py-10 text-center text-xs text-muted-foreground">
        <p>한양대학교 · 아이디어를 현실로 - 바이브 코딩</p>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
          GitHub
        </a>
        <p>© {new Date().getFullYear()} 마이링크</p>
      </footer>
    </main>
  );
}
