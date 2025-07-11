import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers/providers"
import { Toaster } from "@/components/ui/sonner"
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KIZ-SPACE - 안전한 육아 커뮤니티",
  description: "유아부터 초등학생 자녀를 둔 부모들을 위한 안전하고 신뢰할 수 있는 육아 정보 공유 플랫폼",
  generator: 'mindol',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
          <ShadcnToaster />
        </Providers>
      </body>
    </html>
  )
}