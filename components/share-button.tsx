"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Facebook, Twitter, Link2, Share2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShareButtonProps {
  botId: string
  botName: string
}

export function ShareButton({ botId, botName }: ShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/bots/${botId}` : ''

  const handleShare = async (type?: string) => {
    try {
      setIsLoading(true)

      switch (type) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${botName} on AquaList!`)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
          break
        default:
          await navigator.clipboard.writeText(shareUrl)
          toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      toast.error("Failed to share")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
          <Facebook className="w-4 h-4 mr-2 text-[#1877F2]" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
          <Twitter className="w-4 h-4 mr-2 text-[#1DA1F2]" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare()} className="cursor-pointer">
          <Link2 className="w-4 h-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 