import type { Profile } from "@/lib/types";

export function ProfileHeader({ profile }: { profile: Pick<Profile, "displayName" | "bio" | "image"> }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {profile.image ? (
        // 외부 이미지 주소를 그대로 쓰기 위해 <img> 사용
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.image}
          alt=""
          referrerPolicy="no-referrer"
          className="size-24 rounded-full bg-muted object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex size-24 items-center justify-center rounded-full bg-muted text-3xl font-semibold text-muted-foreground"
        >
          {profile.displayName.trim().charAt(0) || "?"}
        </div>
      )}
      <h1 className="text-xl font-semibold">{profile.displayName}</h1>
      {profile.bio && (
        <p className="text-sm whitespace-pre-line text-muted-foreground">{profile.bio}</p>
      )}
    </div>
  );
}
