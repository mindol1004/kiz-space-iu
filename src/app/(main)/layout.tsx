"use client"

import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { TopNav } from "@/components/navigation/top-nav"
import { BottomNav } from "@/components/navigation/bottom-nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <TopNav />
        <main className="pb-20">{children}</main>
        <BottomNav />
      </div>
    </AuthGuard>
  )
}