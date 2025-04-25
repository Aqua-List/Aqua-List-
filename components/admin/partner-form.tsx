"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, Image as ImageIcon } from "lucide-react"
import { Partner } from "@/lib/models/partner"
import { ObjectId } from "mongodb"
import Image from "next/image"
import { MarkdownEditor } from "@/components/markdown-editor"

interface PartnerFormProps {
  partner?: Partner & { _id: ObjectId }
}

export function PartnerForm({ partner }: PartnerFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: partner?.name || "",
    image: partner?.image || "",
    description: partner?.description || "",
    url: partner?.url || "",
    featured: partner?.featured || false,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(partner?.image || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
  }

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, image: value }))
    setPreviewImage(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = partner
        ? `/api/admin/partners/${partner._id}`
        : "/api/admin/partners"

      const response = await fetch(url, {
        method: partner ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Something went wrong")
      }

      toast.success(partner ? "Partner updated successfully" : "Partner added successfully")
      router.push("/admin?tab=partners")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to save partner")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Partner Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Discord Bot List"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Logo URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleImageChange}
              placeholder="https://example.com/logo.png"
              required
            />
          </div>
          
          {previewImage && (
            <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
              <div className="relative w-32 h-32 overflow-hidden rounded-lg border border-border">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => setPreviewImage(null)}
                />
              </div>
            </div>
          )}
          
          {!previewImage && (
            <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
              <div className="w-32 h-32 flex items-center justify-center rounded-lg border border-border bg-background">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Supports Markdown)</Label>
            <MarkdownEditor
              value={formData.description || ""}
              onChange={handleDescriptionChange}
              placeholder="Describe the partnership..."
              minHeight="200px"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="featured">Feature this partner</Label>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin?tab=partners")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {partner ? "Updating..." : "Creating..."}
                </>
              ) : (
                partner ? "Update Partner" : "Add Partner"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
} 