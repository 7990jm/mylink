"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { defaultLinks, defaultProfile, type Link, type Profile } from "@/data/links";
import { db } from "./firebase";

// 프로필과 링크를 Firestore 문서 하나(sites/main)에 저장
// → 새로고침해도, 다른 기기·방문자에게도 똑같이 보임
export type MyLinkData = { profile: Profile; links: Link[] };

const siteDoc = doc(db, "sites", "main");
const defaults: MyLinkData = { profile: defaultProfile, links: defaultLinks };

export function saveMyLink(data: MyLinkData) {
  return setDoc(siteDoc, data);
}

// 데이터가 바뀌면(내가 저장하거나 다른 기기에서 저장해도) 화면이 자동 갱신
export function useMyLink(): MyLinkData & { loading: boolean } {
  const [state, setState] = useState<MyLinkData & { loading: boolean }>({
    ...defaults,
    loading: true,
  });

  useEffect(() => {
    return onSnapshot(
      siteDoc,
      (snap) => {
        const d = snap.data() as Partial<MyLinkData> | undefined;
        setState({
          profile: { ...defaultProfile, ...d?.profile },
          links: Array.isArray(d?.links) ? d.links : defaultLinks,
          loading: false,
        });
      },
      () => setState((s) => ({ ...s, loading: false }))
    );
  }, []);

  return state;
}
