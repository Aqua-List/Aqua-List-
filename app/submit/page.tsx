"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Info, Loader2, Bot, Hash, Link2, MessageSquare, Github, Check, ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const availableTags = [
  "moderation", "music", "economy", "utility", "fun", "games", "social", 
  "leveling", "developer", "ai", "chat", "roleplay", "notification", 
  "art", "productivity", "entertainment", "anime", "memes", "nsfw",
  "logging", "statistics", "dashboard", "customizable", "multilingual"
];

export default function SubmitBotPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [progress, setProgress] = useState(25)
  const [formData, setFormData] = useState({
    clientId: "",
    prefix: "",
    shortDescription: "",
    longDescription: "",
    website: "",
    supportServer: "",
    githubRepo: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/submit")
    }
  }, [status])

  useEffect(() => {
    let completedFields = 0;
    const requiredFields = ["clientId", "prefix", "shortDescription", "longDescription"];
    
    requiredFields.forEach(field => {
      if (formData[field as keyof typeof formData]) completedFields++;
    });
    
    if (selectedTags.length > 0) completedFields++;
    
    const newProgress = Math.min(100, Math.round((completedFields / (requiredFields.length + 1)) * 100));
    setProgress(newProgress);
  }, [formData, selectedTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 6) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      toast({
        title: "Tag limit reached",
        description: "You can select up to 6 tags",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: formData.clientId,
          name: "",
          description: formData.shortDescription,
          longDescription: formData.longDescription,
          prefix: formData.prefix,
          tags: selectedTags,
          website: formData.website,
          supportServer: formData.supportServer,
          githubRepo: formData.githubRepo,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Bot Submitted!",
          description: "Your bot has been submitted for review.",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit bot",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting bot:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"></div>
        <div className="relative p-8 md:p-12">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 py-1 px-3 mb-4">
            <Bot className="h-3.5 w-3.5 mr-1.5" />
            Bot Submission
          </Badge>
          <h1 className="text-4xl font-bold mb-3">Submit Your Bot</h1>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Fill out the form below to submit your Discord bot for review and listing on our platform.
          </p>
          
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm">
              <span>Submission Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800/30">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-400">Important</AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          Make sure your bot follows our guidelines before submitting. Bots are manually reviewed before being listed.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-8 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="basic" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <div className="flex items-center">
                <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">1</span>
                Basic Info
              </div>
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <div className="flex items-center">
                <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">2</span>
                Details
              </div>
            </TabsTrigger>
            <TabsTrigger value="links" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
              <div className="flex items-center">
                <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">3</span>
                Links
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="mt-0">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="client-id" className="flex items-center gap-2 text-base">
                    <Bot className="h-4 w-4 text-primary" />
                    Bot Client ID
                  </Label>
                  <Input 
                    id="client-id" 
                    name="clientId" 
                    placeholder="Enter your bot's client ID" 
                    value={formData.clientId}
                    onChange={handleInputChange}
                    className="border-input/50 focus-visible:ring-primary"
                    required 
                  />
                  <p className="text-sm text-muted-foreground">
                    Your bot's client ID can be found in the Discord Developer Portal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prefix" className="flex items-center gap-2 text-base">
                    <Hash className="h-4 w-4 text-primary" />
                    Bot Prefix
                  </Label>
                  <Input 
                    id="prefix" 
                    name="prefix" 
                    placeholder="!" 
                    value={formData.prefix}
                    onChange={handleInputChange}
                    className="border-input/50 focus-visible:ring-primary"
                    required 
                  />
                  <p className="text-sm text-muted-foreground">The character(s) users type before commands</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short-description" className="flex items-center gap-2 text-base">
                    Short Description
                  </Label>
                  <Input
                    id="short-description"
                    name="shortDescription"
                    placeholder="A brief description of your bot (max 100 characters)"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="border-input/50 focus-visible:ring-primary"
                    required
                  />
                  <div className="flex justify-end text-xs text-muted-foreground">
                    {formData.shortDescription.length}/100
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("details")}
                    className="bg-gradient-primary hover:opacity-90 text-white"
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-0">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="long-description" className="text-base">Detailed Description</Label>
                  <Textarea
                    id="long-description"
                    name="longDescription"
                    placeholder="Provide a detailed description of your bot, its features, and how to use it"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    className="min-h-[200px] border-input/50 focus-visible:ring-primary"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Markdown formatting is supported
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Bot Tags (Select up to 6)</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer capitalize py-1.5 px-3 ${
                          selectedTags.includes(tag) 
                            ? "bg-primary hover:bg-primary/90" 
                            : "hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {selectedTags.includes(tag) && <Check className="mr-1 h-3 w-3" />}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedTags.length}/6
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("basic")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab("links")}
                    className="bg-gradient-primary hover:opacity-90 text-white"
                  >
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="links" className="mt-0">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2 text-base">
                    <Link2 className="h-4 w-4 text-primary" />
                    Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://yourbotwebsite.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="border-input/50 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-server" className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Support Server (Optional)
                  </Label>
                  <Input
                    id="support-server"
                    name="supportServer"
                    placeholder="https://discord.gg/yourinvite"
                    value={formData.supportServer}
                    onChange={handleInputChange}
                    className="border-input/50 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github-repo" className="flex items-center gap-2 text-base">
                    <Github className="h-4 w-4 text-primary" />
                    GitHub Repository (Optional)
                  </Label>
                  <Input
                    id="github-repo"
                    name="githubRepo"
                    placeholder="https://github.com/yourusername/yourbot"
                    value={formData.githubRepo}
                    onChange={handleInputChange}
                    className="border-input/50 focus-visible:ring-primary"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("details")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-primary hover:opacity-90 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Bot
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
