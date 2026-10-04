"use client";

import { useSyncExternalStore } from "react";
import { defaultLinks, defaultProfile, type Link, type Profile } from "@/data/links";

// 프로필과 링크를 브라우저(localStorage)에 저장 → 새로고침해도 유지
// 단, 이 브라우저에서만 보임. 방문자 모두에게 보이려면 9주차 Firebase 필요
export type MyLinkData = { profile: Profile; links: Link[] };

const KEY = "mylink:v1";
const defaults: MyLinkData = { profile: defaultProfile, links: defaultLinks };
const listeners = new Set<() => void>();

let cacheRaw: string | null = null;
let cache: MyLinkData = defaults;

function read(): MyLinkData {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return defaults;
  }
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    cache = {
      profile: { ...defaultProfile, ...parsed.profile },
      links: Array.isArray(parsed.links) ? parsed.links : defaultLinks,
    };
  } catch {
    cache = defaults;
  }
  return cache;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback); // 다른 탭에서 바꿔도 반영
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function saveMyLink(data: MyLinkData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // 저장 공간을 쓸 수 없는 환경(시크릿 모드 등)
  }
  listeners.forEach((l) => l());
}

export function useMyLink(): MyLinkData {
  return useSyncExternalStore(subscribe, read, () => defaults);
}
