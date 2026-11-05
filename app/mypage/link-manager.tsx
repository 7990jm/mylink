"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addLink, deleteLink, updateLink } from "@/lib/db";
import type { Link } from "@/lib/types";
import { iconFor, normalizeUrl } from "@/lib/url";
import { Field } from "./profile-form";
import { panel, purpleButton } from "./ui";

type Errors = { title?: string; url?: string; form?: string };

// 7주차 검증 규칙: 빈 칸 → 주소 형식
function validate(title: string, url: string) {
  const errors: Errors = {};
  if (!title.trim()) errors.title = "제목을 입력해주세요";
  if (!url.trim()) errors.url = "주소를 입력해주세요";
  const normalized = url.trim() ? normalizeUrl(url.trim()) : null;
  if (url.trim() && !normalized) errors.url = "올바른 주소를 입력해주세요";
  return { errors, data: normalized ? { title: title.trim(), url: normalized, icon: iconFor(normalized) } : null };
}

// 링크 추가 (Create) — 흐름: 입력 → 버튼 클릭 → 데이터 추가 → 화면 갱신
export function AddLinkForm({ uid }: { uid: string }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { errors: nextErrors, data } = validate(title, url);
    setErrors(nextErrors);
    if (!data || nextErrors.title) return; // 실패: 경고 + 입력 칸 유지
    // 성공: 입력 칸 비우기 (바로 다음 링크를 입력할 수 있게 먼저 비움)
    setTitle("");
    setUrl("");
    try {
      await addLink(uid, data);
    } catch {
      setTitle(title); // 실패하면 입력값 되돌리기
      setUrl(url);
      setErrors({ form: "추가하지 못했어요. 다시 시도해주세요" });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={panel}>
      <h2 className="font-medium">링크 추가</h2>
      <Field id="title" label="링크 제목" error={errors.title}>
        <Input id="title" placeholder="예: 내 유튜브 채널" value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={!!errors.title} />
      </Field>
      <Field id="url" label="링크 주소" error={errors.url}>
        <Input id="url" placeholder="예: youtube.com/@채널핸들" value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={!!errors.url} />
      </Field>
      {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
      <Button type="submit" size="lg" className={purpleButton}>추가하기</Button>
    </form>
  );
}

// 링크 목록 — 10주차: 인라인 편집(Update) + 삭제 확인 모달(Delete)
export function LinkRows({ uid, links }: { uid: string; links: Link[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Link | null>(null);
  const [deleteError, setDeleteError] = useState("");

  if (links.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">아직 등록된 링크가 없어요.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-3">
        {links.map((link) =>
          editingId === link.id ? (
            <EditRow key={link.id} uid={uid} link={link} onDone={() => setEditingId(null)} />
          ) : (
            <li key={link.id} className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 ring-1 ring-foreground/10">
              <span aria-hidden className="text-lg">{link.icon}</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{link.title}</span>
                <span className="truncate text-xs text-muted-foreground">{link.url}</span>
              </a>
              <Button variant="outline" size="sm" onClick={() => setEditingId(link.id)} aria-label={`${link.title} 수정`}>
                수정
              </Button>
              <Button variant="destructive" size="sm" onClick={() => { setDeleteError(""); setDeleting(link); }} aria-label={`${link.title} 삭제`}>
                삭제
              </Button>
            </li>
          )
        )}
      </ul>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.title}&quot; 링크가 삭제됩니다.
              <span className="mt-1 block font-medium text-destructive">⚠️ 이 작업은 되돌릴 수 없습니다</span>
            </DialogDescription>
          </DialogHeader>
          {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>취소</DialogClose>
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (!deleting) return;
                try {
                  await deleteLink(uid, deleting.id);
                  setDeleting(null);
                } catch {
                  setDeleteError("삭제하지 못했어요. 다시 시도해주세요");
                }
              }}
            >
              삭제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EditRow({ uid, link, onDone }: { uid: string; link: Link; onDone: () => void }) {
  const [title, setTitle] = useState(link.title); // 기존 값 미리 채우기
  const [url, setUrl] = useState(link.url);
  const [errors, setErrors] = useState<Errors>({});

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const { errors: nextErrors, data } = validate(title, url);
    setErrors(nextErrors);
    if (!data || nextErrors.title) return;
    try {
      await updateLink(uid, link.id, data);
      onDone();
    } catch {
      setErrors({ form: "저장하지 못했어요. 다시 시도해주세요" });
    }
  }

  return (
    <li className="rounded-lg bg-card p-3 ring-2 ring-[#5B5FC7]/40">
      <form onSubmit={handleSave} noValidate className="flex flex-col gap-3">
        <Field id={`edit-title-${link.id}`} label="제목" error={errors.title}>
          <Input id={`edit-title-${link.id}`} value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={!!errors.title} autoFocus />
        </Field>
        <Field id={`edit-url-${link.id}`} label="주소" error={errors.url}>
          <Input id={`edit-url-${link.id}`} value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={!!errors.url} />
        </Field>
        {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
        <div className="flex justify-end gap-2">
          {/* 취소: 원래 값으로 복구 (편집 내용 버림) */}
          <Button type="button" variant="outline" onClick={onDone}>취소</Button>
          <Button type="submit" className="bg-[#5B5FC7] text-white hover:bg-[#4A4EB0]">저장</Button>
        </div>
      </form>
    </li>
  );
}
