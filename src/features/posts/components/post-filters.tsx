"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { usePostStore } from "@/shared/stores/post-store"
import { POST_CATEGORIES, AGE_GROUPS } from "../types/post-type"

const categories = [
  { value: "all", label: "전체" },
  ...Object.entries(POST_CATEGORIES).map(([key, label]) => ({
    value: key.toLowerCase(),
    label
  }))
]

const ageGroups = [
  { value: "all", label: "전체" },
  ...Object.entries(AGE_GROUPS).filter(([key]) => key !== "ALL").map(([key, label]) => ({
    value: key.toLowerCase().replace('_', '-'),
    label
  }))
]