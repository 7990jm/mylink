// 처음 접속했을 때 보여줄 기본값 (내 정보는 /mypage에서 수정)
// 9주차에 Firebase 데이터로 교체 예정

export type Link = {
  id: number; // 각 링크를 구분하는 고유 번호
  title: string; // 화면에 표시될 제목
  url: string; // 클릭 시 이동할 주소
  icon: string; // 앞에 붙는 이모지/아이콘
};

export type Profile = {
  name: string;
  bio: string;
  image: string; // 프로필 이미지 주소 (비우면 이름 첫 글자 표시)
};

export const defaultProfile: Profile = {
  name: "마이링크",
  bio: "내 링크 관리에서 프로필을 수정해보세요.",
  image: "",
};

export const defaultLinks: Link[] = [];
