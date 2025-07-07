"use client"

import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = React.useCallback((props: ToastProps) => {
    console.log("Toast:", props)
    // 실제 토스트 구현은 나중에 추가
  }, [])

  return { toast }
}
