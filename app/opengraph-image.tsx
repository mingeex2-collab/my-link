import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontData ? '"Pretendard"' : 'sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "70px 100px",
            backgroundColor: "#ffffff",
            borderRadius: "48px",
            border: "2px solid #e2e8f0",
          }}
        >
          {/* Logo/Icon */}
          <div style={{ display: "flex", marginBottom: 32, padding: 20, backgroundColor: "#f3e8ff", borderRadius: 32 }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>

          <div
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.04em",
              marginBottom: 20,
              display: "flex",
            }}
          >
            My Link
          </div>
          
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#475569",
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            단 하나의 링크로 모든 것을 연결하세요
          </div>
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
