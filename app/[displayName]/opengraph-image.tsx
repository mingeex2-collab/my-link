import { ImageResponse } from "next/og";
import { findUidByUsername, fetchProfile } from "@/lib/firebase-queries";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ displayName: string }> }) {
  const resolvedParams = await params;
  const displayNameParam = Array.isArray(resolvedParams.displayName)
    ? resolvedParams.displayName[0]
    : resolvedParams.displayName;
  
  const username = decodeURIComponent(displayNameParam).replace("@", "");

  let displayName = username;
  let bio = "나만의 멀티 프로필 링크 모음";
  let photoURL = "";

  let uid = null;
  try {
    uid = await findUidByUsername(username);
  } catch (e) {
    console.error('Failed to find UID for OG image', e);
  }
  
  if (!uid) {
    displayName = username;
    bio = 'My Link 프로필';
  } else {
    try {
      const profile = await fetchProfile(uid, {
        displayName: username,
        username: username,
        bio: '',
        photoURL: '',
      });
      if (profile.displayName) displayName = profile.displayName;
      if (profile.bio) bio = profile.bio;
      if (profile.photoURL) photoURL = profile.photoURL;
    } catch (error) {
      console.error('Failed to fetch profile for OG image', error);
    }
  }

  // Load Pretendard font for Korean support
  let fontData = null;
  try {
    const fontRes = await fetch(
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/packages/pretendard/dist/public/static/Pretendard-Bold.ttf'
    );
    if (fontRes.ok) {
      fontData = await fontRes.arrayBuffer();
    }
  } catch (e) {
    console.error("Failed to load font", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#f0f9ff",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          fontFamily: fontData ? '"Pretendard"' : 'sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 80px",
            backgroundColor: "#ffffff",
            borderRadius: "48px",
            width: "850px",
            border: "2px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 8,
              backgroundColor: "#bae6fd",
              borderRadius: "100%",
              marginBottom: 32,
            }}
          >
            {photoURL ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={photoURL}
                alt={displayName}
                width={180}
                height={180}
                style={{
                  borderRadius: "100%",
                  objectFit: "cover",
                  border: "6px solid #ffffff",
                }}
              />
            ) : (
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: "100%",
                  backgroundColor: "#f8fafc",
                  border: "6px solid #ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 72,
                  fontWeight: 900,
                  color: "#6b21a8",
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              marginBottom: 16,
              display: "flex",
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: "#6b21a8",
              marginBottom: 24,
              display: "flex",
              padding: "8px 24px",
              backgroundColor: "#f3e8ff",
              borderRadius: "32px",
            }}
          >
            @{username}
          </div>

          {bio && (
            <div
              style={{
                fontSize: 28,
                fontWeight: 400,
                color: "#475569",
                textAlign: "center",
                maxWidth: "680px",
                lineHeight: 1.5,
                display: "flex",
              }}
            >
              {bio.length > 80 ? bio.slice(0, 80) + "..." : bio}
            </div>
          )}
        </div>
      </div>
    ),
    { 
      ...size,
      ...(fontData && {
        fonts: [
          {
            name: 'Pretendard',
            data: fontData,
            style: 'normal',
            weight: 700,
          }
        ]
      })
    }
  );
}
