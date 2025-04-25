"use client"

import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface NewBadgeProps {
  createdAt: Date | string
}

export function NewBadge({ createdAt }: NewBadgeProps) {
  const isNew = () => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 24
  }

  if (!isNew()) {
    return null
  }

  return (
    <Badge 
      className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse"
    >
      <Sparkles className="h-3 w-3 mr-1" />
      New
    </Badge>
  )
} 