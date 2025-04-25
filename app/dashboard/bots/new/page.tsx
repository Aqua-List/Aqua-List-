"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bot, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardNav from "@/components/dashboard-nav"

export default function NewBotPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create bot")
      }
      
      router.push("/dashboard/bots")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the bot")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            <span className="text-xl font-bold">DiscordBotList</span>
          </div>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
        <DashboardNav />
        <main className="flex w-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Add New Bot</h1>
          </div>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Bot Information</CardTitle>
                <CardDescription>Provide details about your Discord bot to list it on our platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && <div className="p-3 text-sm text-white bg-destructive rounded-md">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="botId">Bot ID (Client ID)</Label>
                  <Input id="botId" name="botId" required />
                  <p className="text-sm text-muted-foreground">The Client ID from your Discord Developer Portal</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botName">Bot Name</Label>
                  <Input id="botName" name="botName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botPrefix">Command Prefix</Label>
                  <Input id="botPrefix" name="botPrefix" placeholder="!" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botDescription">Short Description</Label>
                  <Input
                    id="botDescription"
                    name="botDescription"
                    placeholder="A brief description of your bot (max 100 characters)"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botLongDescription">Detailed Description</Label>
                  <Textarea
                    id="botLongDescription"
                    name="botLongDescription"
                    placeholder="Provide a comprehensive description of your bot's features and functionality"
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botCategory">Primary Category</Label>
                  <Select name="botCategory" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderation">Moderation</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="utility">Utility</SelectItem>
                      <SelectItem value="fun">Fun</SelectItem>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botTags">Tags (comma separated)</Label>
                  <Input id="botTags" name="botTags" placeholder="moderation, logs, auto-mod" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botInviteUrl">Bot Invite URL</Label>
                  <Input
                    id="botInviteUrl"
                    name="botInviteUrl"
                    type="url"
                    placeholder="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=0&scope=bot"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botWebsite">Website URL (optional)</Label>
                  <Input id="botWebsite" name="botWebsite" type="url" placeholder="https://yourbotwebsite.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botSupport">Support Server Invite (optional)</Label>
                  <Input id="botSupport" name="botSupport" placeholder="https://discord.gg/yourserver" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="botAvatar">Bot Avatar</Label>
                  <Input id="botAvatar" name="botAvatar" type="file" accept="image/png,image/jpeg" />
                  <p className="text-sm text-muted-foreground">Square image recommended (at least 128x128px)</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Bot"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}

