import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Abstract Background Shapes (White/Bright Orbs) */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: -200,
            width: 800,
            height: 800,
            background: "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0))",
            borderRadius: "50%",
            transform: "rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -300,
            right: -100,
            width: 1000,
            height: 1000,
            background: "linear-gradient(to top left, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))",
            borderRadius: "50%",
            transform: "rotate(-45deg)",
          }}
        />

        {/* Floating Elements for Decoration */}
        <div style={{
          position: "absolute", top: 100, right: 150, width: 200, height: 60,
          background: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: 30, display: "flex", alignItems: "center", padding: "0 20px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.02)"
        }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: "#c084fc", marginRight: 15 }} />
          <div style={{ width: 100, height: 10, borderRadius: 5, background: "rgba(15, 23, 42, 0.1)" }} />
        </div>

        <div style={{
          position: "absolute", bottom: 120, left: 100, width: 250, height: 70,
          background: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.6)",
          borderRadius: 35, display: "flex", alignItems: "center", padding: "0 25px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.02)"
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: "#a855f7", marginRight: 20 }} />
          <div style={{ width: 130, height: 12, borderRadius: 6, background: "rgba(15, 23, 42, 0.1)" }} />
        </div>

        {/* Content Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "70px 100px",
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(255, 255, 255, 1)",
              borderRadius: "48px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
            }}
          >
            {/* Logo/Icon */}
            <div style={{ display: "flex", marginBottom: 32, padding: 20, background: "rgba(192, 132, 252, 0.1)", borderRadius: 32 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>

            <div
              style={{
                fontSize: 90,
                fontWeight: 900,
                color: "#1e293b",
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
                color: "#64748b",
                letterSpacing: "-0.01em",
                display: "flex",
              }}
            >
              개발자와 크리에이터를 위한 싱글페이지 멀티 링크
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
