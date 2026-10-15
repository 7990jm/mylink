import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";

// 9주차: Firebase 연결 (Firestore = 데이터 저장, Auth = 로그인)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// 이 이메일로 로그인한 사람만 /mypage에서 수정 가능 (firestore.rules와 같아야 함)
export const OWNER_EMAIL = "7990jm@gmail.com";
