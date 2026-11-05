# 마이링크 (MyLink)

나만의 링크 페이지를 30분 만에! — 링크트리(Linktree) 클론

한양대학교 「아이디어를 현실로 - 바이브 코딩」 16주 프로젝트

- 서비스: https://이재명.kr (https://xn--v42bn0v2e.kr)
- 기술: Next.js 16 · shadcn/ui · Firebase (Firestore, Auth) · Vercel

## 주요 기능

| 주차 | 기능 | 위치 |
|---|---|---|
| 2~4 | 프로필 페이지, 반응형 | `components/profile-header.tsx` |
| 5 | 기획 문서 (PRD, 시나리오, 와이어프레임) | `docs/PRD.md` |
| 6 | 링크 목록 UI (Read) | `components/link-list.tsx` |
| 7 | 링크 추가 + 입력 검증 (Create) | `app/mypage/link-manager.tsx` |
| 9 | Firebase Firestore 영구 저장 | `lib/firebase.ts`, `lib/db.ts` |
| 10 | 인라인 편집 (Update), 삭제 확인 모달 (Delete) | `app/mypage/link-manager.tsx` |
| 11 | 구글 소셜 로그인 | `app/login/page.tsx`, `lib/use-auth.ts` |
| 12 | 개인 페이지 `/username`, 프로필 수정, Security Rules | `app/[username]/`, `firestore.rules` |
| 13 | 링크 클릭 통계 (동시 클릭도 정확하게 `increment`) | `app/mypage/stats.tsx` |
| 14 | Vercel 배포, SEO·OG 태그, 동적 OG 이미지, 랜딩 페이지, sitemap | `app/page.tsx`, `app/[username]/opengraph-image.tsx`, `app/sitemap.ts` |

## 페이지 구조

| 주소 | 내용 |
|---|---|
| `/` | 랜딩 페이지 (히어로 · 기능 소개 · 미리보기 · 푸터) |
| `/login` | Google 로그인 |
| `/mypage` | 프로필 수정, 링크 추가·수정·삭제, 클릭 통계 (본인만) |
| `/[username]` | 공개 링크 페이지 (누구나) |

## 데이터 구조 (Firestore)

```
users/{uid}                  username, displayName, bio, image
users/{uid}/links/{linkId}   title, url, icon, clickCount, createdAt
usernames/{username}         uid   ← 공유 주소 중복 방지
```

보안 규칙: 읽기는 누구나, 쓰기는 로그인한 본인만. 방문자는 `clickCount` +1만 가능.

## 실행

```bash
npm install
npm run dev        # http://localhost:3000
```

에뮬레이터로 테스트: `firebase emulators:start --only auth,firestore` 후
`NEXT_PUBLIC_FIREBASE_EMULATOR=1 npm run dev`

선택: Vercel 환경변수 `SITE_PASSWORD`를 넣으면 사이트 전체가 비밀번호로 잠겨요 (`proxy.ts`).
