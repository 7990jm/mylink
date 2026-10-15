"use client";

import { useState, type FormEvent } from "react";
import NextLink from "next/link";
import { LinkList } from "@/components/link-list";
import { ProfileHeader } from "@/components/profile-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/data/links";
import { OWNER_EMAIL } from "@/lib/firebase";
import { saveMyLink, useMyLink } from "@/lib/store";
import { useAuth } from "@/lib/use-auth";

type Errors = { title?: string; url?: string };

const purpleButton = "h-11 bg-[#5B5FC7] text-white hover:bg-[#4A4EB0]";
const panel = "flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10";

// 주소 형식 검증: "blog.com"처럼 http(s)가 없으면 https://를 붙여서 확인
function normalizeUrl(raw: string): string | null {
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withScheme);
    if (!parsed.hostname.includes(".")) return null; // "abc" 같은 입력 차단
    return parsed.href;
  } catch {
    return null;
  }
}

function iconFor(url: string) {
  const host = new URL(url).hostname;
  return /(^|\.)(youtube\.com|youtu\.be)$/.test(host) ? "📺" : "🔗";
}

// 프로필 수정 폼 — 저장 버튼을 눌러야 반영
function ProfileForm({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => Promise<void> }) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [image, setImage] = useState(profile.image);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("이름을 입력해주세요");
      setSaved(false);
      return;
    }
    let normalizedImage = "";
    if (image.trim()) {
      const n = normalizeUrl(image.trim());
      if (!n) {
        setError("올바른 이미지 주소를 입력해주세요");
        setSaved(false);
        return;
      }
      normalizedImage = n;
    }
    setError("");
    onSave({ name: name.trim(), bio: bio.trim(), image: normalizedImage })
      .then(() => setSaved(true))
      .catch(() => setError("저장하지 못했어요. 다시 시도해주세요"));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={panel}>
      <h2 className="font-medium">프로필 수정</h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">이름 (채널명)</Label>
        <Input id="name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">소개글</Label>
        <textarea
          id="bio"
          rows={3}
          value={bio}
          onChange={(e) => { setBio(e.target.value); setSaved(false); }}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="image">프로필 이미지 주소 (선택)</Label>
        <Input
          id="image"
          placeholder="비우면 이름 첫 글자가 표시돼요"
          value={image}
          onChange={(e) => { setImage(e.target.value); setSaved(false); }}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-muted-foreground">저장했어요 ✓</p>}
      <Button type="submit" size="lg" className={purpleButton}>
        프로필 저장
      </Button>
    </form>
  );
}

// 링크 추가 (Create) / 삭제 (Delete)
// 흐름: 1 입력 → 2 버튼 클릭 → 3 데이터 추가 → 4 화면 갱신
export default function MyPage() {
  const { user, ready, signIn, signOut } = useAuth();
  const isOwner = !!user && user.email === OWNER_EMAIL;
  const { loading, ...data } = useMyLink();
  const { profile, links } = data;
  const [saveError, setSaveError] = useState("");

  function save(next: typeof data) {
    setSaveError("");
    return saveMyLink(next).catch((err) => {
      setSaveError("저장하지 못했어요. 로그인 상태를 확인해주세요");
      throw err;
    });
  }
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // 1. 제목/주소 가져오기
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    // 2. 검증 (빈 칸 → 주소 형식)
    const nextErrors: Errors = {};
    if (!trimmedTitle) nextErrors.title = "제목을 입력해주세요";
    if (!trimmedUrl) nextErrors.url = "주소를 입력해주세요";

    const normalized = trimmedUrl ? normalizeUrl(trimmedUrl) : null;
    if (trimmedUrl && !normalized) nextErrors.url = "올바른 주소를 입력해주세요";

    // 검증 실패: 경고 메시지 + 입력 칸 유지
    if (nextErrors.title || nextErrors.url || !normalized) {
      setErrors(nextErrors);
      return;
    }

    // 3. 목록에 추가 → 데이터가 바뀌면 화면이 자동으로 갱신됨
    save({
      ...data,
      links: [
        ...links,
        { id: Date.now(), title: trimmedTitle, url: normalized, icon: iconFor(normalized) },
      ],
    }).catch(() => {});

    // 검증 성공: 입력 칸 비우기
    setTitle("");
    setUrl("");
    setErrors({});
  }

  function handleDelete(id: number) {
    save({ ...data, links: links.filter((link) => link.id !== id) }).catch(() => {});
  }

  return (
    <main className="flex flex-1 justify-center bg-muted/40 px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">내 링크 관리</h1>
          <NextLink
            href="/"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← 내 페이지
          </NextLink>
        </header>

        {!ready || (isOwner && loading) ? (
          <p className="py-10 text-center text-sm text-muted-foreground">불러오는 중…</p>
        ) : !isOwner ? (
          <section className={panel}>
            <p className="text-sm">
              {user
                ? `${user.email} 계정은 수정 권한이 없어요. 주인 계정으로 로그인해주세요.`
                : "링크를 관리하려면 Google 계정으로 로그인해주세요."}
            </p>
            <Button
              size="lg"
              className={purpleButton}
              onClick={() => (user ? signOut() : signIn().catch(() => {}))}
            >
              {user ? "로그아웃" : "Google로 로그인"}
            </Button>
          </section>
        ) : (
        <>
        <section className={panel}>
          <ProfileHeader profile={profile} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{user.email}</span>
            <button type="button" onClick={() => signOut()} className="underline-offset-4 hover:underline">
              로그아웃
            </button>
          </div>
        </section>

        {saveError && <p className="text-sm text-destructive">{saveError}</p>}

        <ProfileForm
          profile={profile}
          onSave={(p) => save({ ...data, profile: p })}
        />

        <form onSubmit={handleSubmit} noValidate className={panel}>
          <h2 className="font-medium">링크 추가</h2>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">링크 제목</Label>
            <Input
              id="title"
              placeholder="예: 내 유튜브 채널"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="url">링크 주소</Label>
            <Input
              id="url"
              placeholder="예: youtube.com/@채널핸들"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-invalid={!!errors.url}
              aria-describedby={errors.url ? "url-error" : undefined}
            />
            {errors.url && (
              <p id="url-error" className="text-sm text-destructive">
                {errors.url}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" className={purpleButton}>
            추가하기
          </Button>
        </form>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            내 링크 {links.length}개
          </h2>
          <LinkList links={links} onDelete={handleDelete} />
        </section>
        </>
        )}
      </div>
    </main>
  );
}
