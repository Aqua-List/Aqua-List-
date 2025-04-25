"use client"

import { Facebook, Twitter } from "lucide-react"
import { ShareButton } from "@/components/share-button"

interface SocialShareProps {
  botId: string
  botName: string
}

export function SocialShare({ botId, botName }: SocialShareProps) {
  return (
    <div className="flex justify-between">
      <button 
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
        className="p-3 rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
      >
        <Facebook className="w-5 h-5" />
      </button>
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${botName} on AquaList!`)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
        className="p-3 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors"
      >
        <Twitter className="w-5 h-5" />
      </button>
      <ShareButton botId={botId} botName={botName} />
    </div>
  )
} 