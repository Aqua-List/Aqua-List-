"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface FeatureButtonProps {
  botId: string
  isFeatured: boolean
}

export function FeatureButton({ botId, isFeatured }: FeatureButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFeatureToggle = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bots/${botId}/feature`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update featured status")
      }

      const data = await response.json()
      toast.success(data.message || "Featured status updated")
      router.refresh()
    } catch (error) {
      toast.error((error as Error).message || "An error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFeatured ? "default" : "outline"}
      size="sm"
      className={isFeatured ? "bg-secondary hover:bg-secondary/90" : "border-secondary/20 text-secondary hover:bg-secondary/10 hover:border-secondary/30"}
      onClick={handleFeatureToggle}
      disabled={isLoading}
    >
      <Zap className={`h-4 w-4 mr-2 ${isFeatured ? "" : "text-secondary"}`} />
      {isFeatured ? "Unfeature Bot" : "Feature Bot"}
    </Button>
  )
} 