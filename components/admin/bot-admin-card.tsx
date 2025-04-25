"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Star, StarOff, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

interface BotAdminCardProps {
  bot: any;
  isPending: boolean;
}

export function BotAdminCard({ bot, isPending }: BotAdminCardProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rejectReason.trim()) {
      return 
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/admin/bots/${bot.clientId || bot._id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: rejectReason,
          deleteBot: false
        }),
      })
      
      if (response.ok) {
        window.location.reload()
      } else {
        console.error("Failed to reject bot")
      }
    } catch (error) {
      console.error("Error rejecting bot:", error)
    } finally {
      setIsSubmitting(false)
      setRejectDialogOpen(false)
    }
  }

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Image
              src={bot.avatar || "/placeholder-bot.png"}
              alt={bot.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div>
              <CardTitle className="text-lg font-semibold">
                <Link href={`/bots/${bot.clientId || bot._id}`} className="hover:text-primary transition-colors">
                  {bot.name}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {bot.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[(bot.status || "pending") as keyof typeof statusColors]}>
            {bot.status || "pending"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {bot.tags && bot.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
              {tag}
            </Badge>
          ))}
          {(!bot.tags || bot.tags.length === 0) && (
            <Badge variant="outline" className="text-muted-foreground">
              No tags
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {isPending && (
            <>
              <form action={`/api/admin/bots/${bot.clientId || bot._id}/approve`} method="POST">
                <Button type="submit" size="sm" variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
              </form>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                onClick={() => setRejectDialogOpen(true)}
              >
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
            </>
          )}
          
          <form action={`/api/admin/bots/${bot.clientId || bot._id}/feature`} method="POST">
            <Button 
              type="submit" 
              size="sm" 
              variant="outline" 
              className={bot.featured ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"}
              formAction={`/api/admin/bots/${bot.clientId || bot._id}/feature?redirect=/bots/${bot.clientId || bot._id}`}
            >
              {bot.featured ? (
                <>
                  <StarOff className="h-4 w-4 mr-1" /> Unfeature
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-1" /> Feature
                </>
              )}
            </Button>
          </form>
          
          <form action={`/api/admin/bots/${bot.clientId || bot._id}/delete`} method="POST">
            <Button 
              type="submit" 
              size="sm" 
              variant="outline" 
              className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </form>
        </div>
      </CardContent>

   
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bot</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this bot. This will be sent to the bot owner.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="rejection-reason" className="text-base font-medium">
              Rejection Reason
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter rejection reason..."
              className="min-h-[120px] mt-2"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              disabled={!rejectReason.trim() || isSubmitting}
              onClick={handleRejectSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Bot
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}