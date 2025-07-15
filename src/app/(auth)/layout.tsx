"use client"

import type React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">{children}</main>
    </div>
  )
}