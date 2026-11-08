"use client";

import { useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth } from "./firebase";
import { ADMIN_UID } from "./site";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      // 관리자 계정이 아니면 바로 로그아웃
      if (u && u.uid !== ADMIN_UID && process.env.NEXT_PUBLIC_FIREBASE_EMULATOR !== "1") {
        setDenied(true);
        setUser(null);
        setReady(true);
        signOut(auth);
        return;
      }
      setUser(u);
      setReady(true);
    });
  }, []);

  return {
    user,
    ready,
    denied,
    signIn: () => signInWithPopup(auth, new GoogleAuthProvider()),
    signOut: () => signOut(auth),
  };
}
