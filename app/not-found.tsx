import NextLink from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-muted-foreground">주소가 맞는지 확인해주세요.</p>
      <NextLink href="/" className="text-sm underline-offset-4 hover:underline">
        마이링크 홈으로
      </NextLink>
    </main>
  );
}
