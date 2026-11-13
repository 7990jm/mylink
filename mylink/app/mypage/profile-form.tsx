"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UsernameTakenError, saveProfile } from "@/lib/db";
import type { Profile } from "@/lib/types";
import { normalizeUrl } from "@/lib/url";
import { validateUsername } from "@/lib/username";
import { panel, purpleButton, textarea } from "./ui";

type Errors = Partial<Record<keyof Profile | "form", string>>;

// 12주차: 프로필 수정 (username = 공유 주소, displayName, bio)
export function ProfileForm({ uid, profile }: { uid: string; profile: Profile }) {
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  const set = (key: keyof Profile) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Profile = {
      username: form.username.trim().toLowerCase(),
      displayName: form.displayName.trim(),
      bio: form.bio.trim(),
      image: "",
    };
    const nextErrors: Errors = {};
    const usernameError = validateUsername(next.username);
    if (usernameError) nextErrors.username = usernameError;
    if (!next.displayName) nextErrors.displayName = "이름을 입력해주세요";
    if (form.image.trim()) {
      const n = normalizeUrl(form.image.trim());
      if (n) next.image = n;
      else nextErrors.image = "올바른 이미지 주소를 입력해주세요";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setPending(true);
    try {
      await saveProfile(uid, profile.username, next);
      setForm(next);
      setSaved(true);
    } catch (err) {
      setErrors(
        err instanceof UsernameTakenError
          ? { username: "이미 사용 중인 주소예요" }
          : { form: "저장하지 못했어요. 다시 시도해주세요" }
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={panel}>
      <h2 className="font-medium">프로필 수정</h2>
      <Field id="username" label="공유 주소" error={errors.username}>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">/</span>
          <Input
            id="username"
            value={form.username}
            onChange={(e) => set("username")(e.target.value)}
            aria-invalid={!!errors.username}
            autoCapitalize="none"
          />
        </div>
      </Field>
      <Field id="displayName" label="이름 (채널명)" error={errors.displayName}>
        <Input
          id="displayName"
          value={form.displayName}
          onChange={(e) => set("displayName")(e.target.value)}
          aria-invalid={!!errors.displayName}
        />
      </Field>
      <Field id="bio" label="소개글">
        <textarea id="bio" rows={3} value={form.bio} onChange={(e) => set("bio")(e.target.value)} className={textarea} />
      </Field>
      <Field id="image" label="프로필 이미지 주소 (선택)" error={errors.image}>
        <Input
          id="image"
          placeholder="비우면 이름 첫 글자가 표시돼요"
          value={form.image}
          onChange={(e) => set("image")(e.target.value)}
          aria-invalid={!!errors.image}
        />
      </Field>
      {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
      {saved && <p className="text-sm text-muted-foreground">저장했어요 ✓</p>}
      <Button type="submit" size="lg" disabled={pending} className={purpleButton}>
        {pending ? "저장 중…" : "프로필 저장"}
      </Button>
    </form>
  );
}

export function Field({
  id, label, error, children,
}: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
