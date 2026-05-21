import { Metadata } from "next";
import { findUidByUsername, fetchProfile } from "@/lib/firebase-queries";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ displayName: string }>
}): Promise<Metadata> {
  const { displayName } = await params;
  
  const displayNameParam = Array.isArray(displayName) ? displayName[0] : displayName;
  const username = displayNameParam.startsWith('%40') || displayNameParam.startsWith('@') 
      ? decodeURIComponent(displayNameParam).replace('@', '') 
      : decodeURIComponent(displayNameParam);

  const uid = await findUidByUsername(username);
  
  if (!uid) {
    return {
      title: "사용자를 찾을 수 없습니다",
      description: "존재하지 않거나 삭제된 사용자입니다.",
    };
  }

  let profile;
  try {
    profile = await fetchProfile(uid, {
      displayName: username,
      username: username,
      bio: "가장 간결하고 아름다운 멀티 링크 서비스.",
      photoURL: "",
    });
  } catch (e) {
    // Firestore 연결 오류 시 안전한 메타데이터 반환
    console.error("fetchProfile error", e);
    return {
      title: `${username} - My Link (오프라인)`,
      description: "일시적인 연결 오류로 메타데이터를 불러올 수 없습니다.",
    };
  }

  const url = `/${username}`;
  const pageTitle = `${profile.displayName} (@${profile.username})`;
  const pageDescription = profile.bio || `${profile.displayName}님의 멀티 링크 프로필입니다.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      type: "profile",
      images: profile.photoURL ? [
        {
          url: profile.photoURL,
          width: 800,
          height: 800,
          alt: `${profile.displayName}님의 프로필 이미지`,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: profile.photoURL ? [profile.photoURL] : undefined,
    },
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
