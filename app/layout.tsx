import { Geist_Mono, Noto_Sans_KR } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/Header"
import { Providers } from "@/lib/providers";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://my-link-minji.vercel.app";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "My Link - 나만의 멀티 링크 프로필",
    template: "%s | My Link",
  },
  description: "단 하나의 링크로 모든 것을 연결하세요. 개발자와 크리에이터를 위한 가장 간결하고 아름다운 싱글페이지 멀티 링크 서비스입니다.",
  openGraph: {
    title: {
      default: "My Link - 나만의 멀티 링크 프로필",
      template: "%s | My Link",
    },
    description: "단 하나의 링크로 모든 것을 연결하세요. 가장 간결하고 아름다운 싱글페이지 멀티 링크 서비스입니다.",
    url: "/",
    siteName: "My Link",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "My Link - 나만의 멀티 링크 프로필",
      template: "%s | My Link",
    },
    description: "단 하나의 링크로 모든 것을 연결하세요. 가장 간결하고 아름다운 싱글페이지 멀티 링크 서비스입니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
    >
      <body className={cn("antialiased", fontMono.variable, "font-sans", noto.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Header />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
