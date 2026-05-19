import { Geist_Mono, Noto_Sans_KR } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/Header"
import { ToastProvider } from "@/lib/toast-context";
import { CustomToaster } from "@/components/ui/custom-toaster";
import { cn } from "@/lib/utils";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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
          <ToastProvider>
            <Header />
            <CustomToaster />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
