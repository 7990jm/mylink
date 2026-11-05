// Firestore 데이터 구조
// users/{uid}                 → Profile
// users/{uid}/links/{linkId}  → Link
// usernames/{username}        → { uid }  (공유 주소 중복 방지용)

export type Profile = {
  username: string; // 공유 주소: /username
  displayName: string; // 화면에 표시될 이름
  bio: string; // 소개글
  image: string; // 프로필 이미지 주소 (비우면 이름 첫 글자)
};

export type Link = {
  id: string;
  title: string;
  url: string;
  icon: string;
  clickCount: number;
  createdAt: number;
};
