import "server-only";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  collection, connectFirestoreEmulator, doc, getDoc, getDocs, getFirestore, orderBy, query,
} from "firebase/firestore/lite";
import { firebaseConfig } from "./firebase-config";
import type { Link, Profile } from "./types";

// 서버에서 공개 데이터 읽기 (개인 페이지, OG 이미지, sitemap)
const app = getApps().some((a) => a.name === "server") ? getApp("server") : initializeApp(firebaseConfig, "server");
const db = getFirestore(app);
if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "1") {
  try {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  } catch {
    // 이미 연결됨
  }
}

export type PublicPage = { uid: string; profile: Profile; links: Link[] };

// /username → usernames/{username}.uid → users/{uid} + links
export async function getPublicPage(username: string): Promise<PublicPage | null> {
  const name = await getDoc(doc(db, "usernames", username));
  const uid = name.data()?.uid as string | undefined;
  if (!uid) return null;

  const [user, links] = await Promise.all([
    getDoc(doc(db, "users", uid)),
    getDocs(query(collection(db, "users", uid, "links"), orderBy("createdAt"))),
  ]);
  const d = user.data();
  if (!d) return null;

  return {
    uid,
    profile: { username, displayName: d.displayName ?? username, bio: d.bio ?? "", image: d.image ?? "" },
    links: links.docs.map((l) => {
      const x = l.data();
      return {
        id: l.id,
        title: String(x.title ?? ""),
        url: String(x.url ?? ""),
        icon: String(x.icon ?? "🔗"),
        clickCount: Number(x.clickCount ?? 0),
        createdAt: Number(x.createdAt ?? 0),
      };
    }),
  };
}

export async function listUsernames(): Promise<string[]> {
  const snap = await getDocs(collection(db, "usernames"));
  return snap.docs.map((d) => d.id);
}
