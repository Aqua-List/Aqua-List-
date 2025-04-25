"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface BotSearchProps {
  className?: string
}

export function BotSearch({ className }: BotSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      
      if (searchQuery) {
        params.set("q", searchQuery)
      } else {
        params.delete("q")
      }
      
      router.push(`/bots?${params.toString()}`)
    })
  }
  
  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder="Search for bots..." 
        className="pl-10 pr-20" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button 
        type="submit"
        size="sm" 
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
        disabled={isPending}
      >
        {isPending ? "Searching..." : "Search"}
      </Button>
    </form>
  )
} 