"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Sparkles, Server, ThumbsUp } from "lucide-react"

interface SortSelectorProps {
  defaultValue: string
  className?: string
}

export function SortSelector({ defaultValue }: SortSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    
    params.set("sort", value)
    
    router.push(`/bots?${params.toString()}`)
  }
  
  return (
    <Select defaultValue={defaultValue} onValueChange={handleSortChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Newest</span>
          </div>
        </SelectItem>
        <SelectItem value="popular">
          <div className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Popular</span>
          </div>
        </SelectItem>
        <SelectItem value="servers">
          <div className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            <span>Most Servers</span>
          </div>
        </SelectItem>
        <SelectItem value="votes">
          <div className="flex items-center">
            <ThumbsUp className="mr-2 h-4 w-4" />
            <span>Most Votes</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
} 