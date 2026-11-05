import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, connectAuthEmulator, getAuth, signInWithCredential } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";

// 9주차: Firebase 연결 (Firestore = 데이터 저장, Auth = 로그인)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// 테스트용: NEXT_PUBLIC_FIREBASE_EMULATOR=1 이면 내 컴퓨터의 가짜 Firebase(에뮬레이터)에 연결
if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "1") {
  try {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  } catch {
    // 이미 연결됨
  }
  // 자동 테스트용: 에뮬레이터에서만 가짜 Google 계정으로 로그인
  if (typeof window !== "undefined") {
    (window as unknown as { __emuSignIn: (email: string, name: string) => Promise<unknown> }).__emuSignIn = (email, name) =>
      signInWithCredential(
        auth,
        GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true, name }))
      );
  }
}
