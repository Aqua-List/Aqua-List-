"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Zap, Sparkles } from "lucide-react"

interface BotTabsProps {
  defaultValue: string
  children: React.ReactNode
}

export function BotTabs({ defaultValue, children }: BotTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    params.set("tab", value)
    
    router.push(`/bots?${params.toString()}`)
  }
  
  return (
    <Tabs defaultValue={defaultValue} onValueChange={handleTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all" className="flex items-center gap-1">
          <Bot className="h-4 w-4" />
          All Bots
        </TabsTrigger>
        <TabsTrigger value="featured" className="flex items-center gap-1">
          <Zap className="h-4 w-4" />
          Featured
        </TabsTrigger>
        <TabsTrigger value="trending" className="flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          Trending
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
} 