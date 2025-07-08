import { Toaster } from "@/components/ui/sonner"
import type React from "react"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  )
}
