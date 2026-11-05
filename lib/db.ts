"use client";

import { useEffect, useState } from "react";
import {
  addDoc, collection, deleteDoc, doc, getDoc, increment, onSnapshot,
  orderBy, query, runTransaction, updateDoc,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";
import type { Link, Profile } from "./types";
import { usernameFromEmail, validateUsername } from "./username";

const userRef = (uid: string) => doc(db, "users", uid);
const linksRef = (uid: string) => collection(db, "users", uid, "links");
const nameRef = (name: string) => doc(db, "usernames", name);

export class UsernameTakenError extends Error {}

// 첫 로그인: 이메일 앞부분으로 username, 구글 이름으로 displayName 자동 생성
export async function ensureProfile(user: User) {
  const snap = await getDoc(userRef(user.uid));
  if (snap.exists() && snap.data().username) return;

  const base = usernameFromEmail(user.email ?? "");
  for (let i = 0; i < 10; i++) {
    const candidate = i === 0 ? base : `${base.slice(0, 15)}${Math.floor(1000 + Math.random() * 9000)}`;
    if (validateUsername(candidate)) continue;
    try {
      await runTransaction(db, async (tx) => {
        if ((await tx.get(nameRef(candidate))).exists()) throw new UsernameTakenError();
        tx.set(nameRef(candidate), { uid: user.uid });
        tx.set(userRef(user.uid), {
          username: candidate,
          displayName: user.displayName || candidate,
          bio: "",
          image: user.photoURL ?? "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });
      return;
    } catch (err) {
      if (!(err instanceof UsernameTakenError)) throw err;
    }
  }
  throw new Error("공유 주소를 만들지 못했어요");
}

// 프로필 저장 (username이 바뀌면 중복 체크 후 주소 매핑도 교체)
export async function saveProfile(uid: string, prevUsername: string, next: Profile) {
  await runTransaction(db, async (tx) => {
    if (next.username !== prevUsername) {
      const taken = await tx.get(nameRef(next.username));
      if (taken.exists() && taken.data().uid !== uid) throw new UsernameTakenError();
      if (!taken.exists()) tx.set(nameRef(next.username), { uid });
      if (prevUsername) tx.delete(nameRef(prevUsername));
    }
    tx.update(userRef(uid), { ...next, updatedAt: Date.now() });
  });
}

export function addLink(uid: string, link: Pick<Link, "title" | "url" | "icon">) {
  return addDoc(linksRef(uid), { ...link, clickCount: 0, createdAt: Date.now(), updatedAt: Date.now() });
}

export function updateLink(uid: string, id: string, data: Pick<Link, "title" | "url" | "icon">) {
  return updateDoc(doc(linksRef(uid), id), { ...data, updatedAt: Date.now() });
}

export function deleteLink(uid: string, id: string) {
  return deleteDoc(doc(linksRef(uid), id));
}

// 13주차: 클릭 수 +1 — 서버에 "+1 해줘"라고 요청해서 동시 클릭도 정확하게
export function countClick(uid: string, id: string) {
  return updateDoc(doc(linksRef(uid), id), { clickCount: increment(1) });
}

// 데이터가 바뀌면 화면 자동 갱신
export function useProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(userRef(uid), (snap) => {
      const d = snap.data();
      setProfile(
        d ? { username: d.username ?? "", displayName: d.displayName ?? "", bio: d.bio ?? "", image: d.image ?? "" } : null
      );
    });
  }, [uid]);
  return profile;
}

export function useLinks(uid: string | undefined) {
  const [links, setLinks] = useState<Link[] | null>(null);
  useEffect(() => {
    if (!uid) return;
    return onSnapshot(query(linksRef(uid), orderBy("createdAt")), (snap) => {
      setLinks(snap.docs.map((d) => toLink(d.id, d.data())));
    });
  }, [uid]);
  return links;
}

export function toLink(id: string, d: Record<string, unknown>): Link {
  return {
    id,
    title: String(d.title ?? ""),
    url: String(d.url ?? ""),
    icon: String(d.icon ?? "🔗"),
    clickCount: Number(d.clickCount ?? 0),
    createdAt: Number(d.createdAt ?? 0),
  };
}
