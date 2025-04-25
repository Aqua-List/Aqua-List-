"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { ArrowBigUp, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Confetti } from "@/components/confetti"

interface VoteButtonProps {
  botId: string
  botName: string
  initialVotes: number
}

export function VoteButton({ botId, botName, initialVotes = 0 }: VoteButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [votes, setVotes] = useState(initialVotes)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [timeUntilNextVote, setTimeUntilNextVote] = useState<string | null>(null)

  const handleVote = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/bots/${botId}`)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/bots/${botId}/vote`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.nextVoteTime) {
          const nextVoteTime = new Date(data.nextVoteTime)
          const now = new Date()
          const diffHours = Math.floor((nextVoteTime.getTime() - now.getTime()) / (1000 * 60 * 60))
          const diffMinutes = Math.floor(((nextVoteTime.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60))
          
          setTimeUntilNextVote(`${diffHours}h ${diffMinutes}m`)
          toast.error(`You can vote again in ${diffHours}h ${diffMinutes}m`)
        } else {
          toast.error(data.message || "Failed to vote")
        }
        return
      }

      setVotes(data.totalVotes)
      
      setShowSuccessDialog(true)
      setShowConfetti(true)
      
      router.refresh()
    } catch (error) {
      toast.error("An error occurred while voting")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}
      
      <Button
        onClick={handleVote}
        className="w-full bg-white text-primary hover:bg-white/90 flex items-center justify-center gap-2"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <ArrowBigUp className="h-5 w-5" />
            Vote for {botName}
          </>
        )}
      </Button>
      
      {timeUntilNextVote && (
        <div className="mt-2 text-center text-white/80 text-xs">
          You can vote again in {timeUntilNextVote}
        </div>
      )}
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Thank You for Voting!
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                +1 Vote
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Your vote for {botName} has been counted. You've helped this bot gain visibility!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            <div className="text-5xl font-bold text-primary mb-2">{votes}</div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              You can vote again in 12 hours. Share this bot with your friends to help it grow!
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={() => setShowSuccessDialog(false)}
            >
              Close
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={() => {
                setShowSuccessDialog(false)
                const botUrl = `${window.location.origin}/bots/${botId}`
                navigator.clipboard.writeText(botUrl)
                toast.success("Bot URL copied to clipboard")
              }}
            >
              Share This Bot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

