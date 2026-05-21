import { ImageResponse } from "next/og";
import { findUidByUsername, fetchProfile } from "@/lib/firebase-queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// In Next.js 15+, params is a Promise
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
    // fallback generic OG image data
    displayName = username;
    bio = 'My Link 프로필';
    photoURL = '';
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

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f0f9ff 0%, #fef3c7 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Dynamic Abstract Background Elements */}
        <div
          style={{
            position: "absolute",
            top: -150,
            left: -150,
            width: 700,
            height: 700,
            background: "linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: -200,
            width: 800,
            height: 800,
            background: "linear-gradient(to top left, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))",
            borderRadius: "50%",
          }}
        />

        {/* Central Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 80px",
              background: "rgba(255, 255, 255, 0.85)",
              border: "1px solid rgba(255, 255, 255, 1)",
              borderRadius: "48px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
              width: "850px",
            }}
          >
            {/* Avatar Container with glowing border effect */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                background: "linear-gradient(135deg, #bae6fd 0%, #fcd34d 100%)",
                borderRadius: "100%",
                marginBottom: 32,
                boxShadow: "0 0 40px rgba(252, 211, 77, 0.2)",
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
                    background: "#f8fafc",
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
                background: "rgba(107, 33, 168, 0.1)",
                borderRadius: "32px",
                border: "1px solid rgba(107, 33, 168, 0.2)",
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
      </div>
    ),
    { ...size }
  );
}
