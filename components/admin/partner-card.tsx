"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Partner } from "@/lib/models/partner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Star, StarOff, Edit } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PartnerAdminCardProps {
  partner: Partner
}

export function PartnerAdminCard({ partner }: PartnerAdminCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isTogglingFeature, setIsTogglingFeature] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/partners/${partner._id}/delete`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to delete partner")
      }

      toast.success("Partner deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete partner")
      console.error(error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleFeatureToggle = async () => {
    setIsTogglingFeature(true)
    try {
      const response = await fetch(`/api/admin/partners/${partner._id}/feature`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to toggle feature status")
      }

      toast.success(partner.featured ? "Partner unfeatured" : "Partner featured")
      router.refresh()
    } catch (error) {
      toast.error("Failed to toggle feature status")
      console.error(error)
    } finally {
      setIsTogglingFeature(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden border-border/50">
        <CardHeader className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Image
                src={partner.image || "/placeholder-partner.png"}
                alt={partner.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <CardTitle className="text-lg font-semibold">
                  <Link href={partner.url} target="_blank" className="hover:text-primary transition-colors">
                    {partner.name}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-1">
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {new URL(partner.url).hostname}
                  </a>
                </CardDescription>
              </div>
            </div>
            {partner.featured && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Featured
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4 text-sm text-muted-foreground line-clamp-3">
            {partner.description}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Link href={`/admin/partners/${partner._id}/edit`}>
              <Button size="sm" variant="outline" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </Link>
            
            <Button 
              onClick={handleFeatureToggle}
              size="sm" 
              variant="outline" 
              className={partner.featured ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"}
              disabled={isTogglingFeature}
            >
              {partner.featured ? (
                <>
                  <StarOff className="h-4 w-4 mr-1" /> Unfeature
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-1" /> Feature
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              size="sm" 
              variant="outline" 
              className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the partner "{partner.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 