"use client"

import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        <main className="pb-20">{children}</main>
      </div>
    </AuthGuard>
  )
}