import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상태 및 통계",
  description: "내 링크들의 트래픽과 반응을 한눈에 확인하세요.",
  openGraph: {
    title: "상태 및 통계 | My Link",
    description: "내 링크들의 트래픽과 반응을 한눈에 확인하세요.",
    url: "/status",
  },
  twitter: {
    title: "상태 및 통계 | My Link",
    description: "내 링크들의 트래픽과 반응을 한눈에 확인하세요.",
  },
};

export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
