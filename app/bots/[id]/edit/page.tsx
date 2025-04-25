"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, ArrowLeft, X, Plus, Bot, Hash, Link2, MessageSquare, Github, AlertCircle, Check, ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const availableTags = [
  "moderation", "music", "economy", "utility", "fun", "games", "social", 
  "leveling", "developer", "ai", "chat", "roleplay", "notification", 
  "art", "productivity", "entertainment", "anime", "memes", "nsfw",
  "logging", "statistics", "dashboard", "customizable", "multilingual"
];

export default function EditBotPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [progress, setProgress] = useState(25)
  const [botId, setBotId] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    prefix: "",
    description: "",
    longDescription: "",
    website: "",
    supportServer: "",
    githubRepo: "",
    avatar: ""
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setBotId(params.id)
  }, [params.id])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/bots/${botId}/edit`)
      return
    }

    if (status === "authenticated" && botId) {
      fetchBotData()
    }
  }, [status, botId])

  useEffect(() => {
    let completedFields = 0;
    const requiredFields = ["prefix", "description", "longDescription"];
    
    requiredFields.forEach(field => {
      if (formData[field as keyof typeof formData]) completedFields++;
    });
    
    if (selectedTags.length > 0) completedFields++;
    
    const newProgress = Math.min(100, Math.round((completedFields / (requiredFields.length + 1)) * 100));
    setProgress(newProgress);
  }, [formData, selectedTags]);

  const fetchBotData = async () => {
    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const botData = await response.json()
      
      const userId = (session?.user as any)?.id || (session?.user as any)?.discordId || session?.user?.name
      console.log("Current user ID:", userId)
      console.log("Bot owner ID:", botData.ownerId)
      
      if (userId !== botData.ownerId) {
        setError("You don't have permission to edit this bot")
        return
      }
      
      setFormData({
        name: botData.name || "",
        prefix: botData.prefix || "",
        description: botData.description || "",
        longDescription: botData.longDescription || "",
        website: botData.website || "",
        supportServer: botData.supportServer || "",
        githubRepo: botData.githubRepo || "",
        avatar: botData.avatar || ""
      })
      
      setSelectedTags(botData.tags || [])
    } catch (error) {
      console.error("Error fetching bot data:", error)
      setError("Failed to fetch bot data")
    } finally {
      setIsLoading(false)
    }
  }

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
      toast("You can select up to 6 tags")
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTags.length === 0) {
      toast("Please select at least one tag for your bot")
      return;
    }
    
    setIsSaving(true);

    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: selectedTags,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update bot");
      }
      
      toast("Your bot has been updated successfully")
      
      router.push(`/bots/${botId}`);
    } catch (error: any) {
      console.error("Error updating bot:", error);
      toast("Failed to update bot: " + error.message)
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">Loading bot data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-10">
      <div className="container max-w-6xl">
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 opacity-90"></div>
          <div className="absolute inset-0 bg-grid-light opacity-10"></div>
          
          <div className="relative z-10 p-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Edit Bot</h1>
              <p className="text-white/80 mt-1">Update your bot's information and settings</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/bots/${botId}`)}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border/50">
                <CardTitle>Preview</CardTitle>
                <CardDescription>How your bot appears to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20 rounded-xl border border-border">
                    <AvatarImage src={formData.avatar || "/placeholder.png"} alt={formData.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">BOT</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{formData.name || "Bot Name"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.description || "No description provided"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20">
                        {tag}
                      </Badge>
                    ))}
                    {selectedTags.length === 0 && (
                      <span className="text-sm text-muted-foreground italic">No tags selected</span>
                    )}
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4 text-primary" />
                      Prefix: <span className="font-mono bg-primary/5 px-1.5 py-0.5 rounded text-primary">{formData.prefix || "!"}</span>
                    </div>
                    
                    {formData.website && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link2 className="h-4 w-4 text-primary" />
                        Website available
                      </div>
                    )}
                    
                    {formData.supportServer && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        Support server available
                      </div>
                    )}
                    
                    {formData.githubRepo && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Github className="h-4 w-4 text-primary" />
                        GitHub repository available
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-border/50" />
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Long Description Preview
                  </h4>
                  <ScrollArea className="h-[200px] w-full rounded-md border border-border/50 p-4">
                    <div className="prose prose-sm dark:prose-invert">
                      {formData.longDescription || "No long description provided"}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Completion Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Required information</span>
                  <span className="font-medium">{progress}% complete</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bot Information</CardTitle>
                  <CardDescription>Update your bot's details and configuration</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Editing
                </Badge>
              </div>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-6 border-b border-border/50">
                  <TabsList className="w-full justify-start gap-6 h-14 bg-transparent">
                    <TabsTrigger 
                      value="basic" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
                    >
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2">1</span>
                        Basic Information
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="details" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:text-primary"
                    >
                      <span className="flex items-center">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2">2</span>
                        Details & Links
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="basic" className="p-6 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="prefix" className="flex items-center gap-2 text-base">
                        <Hash className="h-4 w-4 text-primary" />
                        Command Prefix
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
                      <p className="text-sm text-muted-foreground">
                        The character(s) users type before commands
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="flex items-center gap-2 text-base">
                        Short Description
                      </Label>
                      <Input 
                        id="description" 
                        name="description" 
                        placeholder="A brief description of your bot (max 100 characters)" 
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength={100}
                        className="border-input/50 focus-visible:ring-primary"
                        required
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs ${formData.description.length > 90 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                          {formData.description.length}/100
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longDescription" className="flex items-center gap-2 text-base">
                        Long Description
                      </Label>
                      <Textarea 
                        id="longDescription" 
                        name="longDescription" 
                        placeholder="A detailed description of your bot, features, commands, etc. Markdown is supported." 
                        value={formData.longDescription}
                        onChange={handleInputChange}
                        className="min-h-[200px] border-input/50 focus-visible:ring-primary"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Markdown formatting is supported. Be detailed about what your bot does.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-base">
                        Tags (Select up to 6)
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedTags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20 cursor-pointer flex items-center gap-1"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                            <X className="h-3 w-3" />
                          </Badge>
                        ))}
                        {selectedTags.length < 6 && (
                          <Badge 
                            variant="outline" 
                            className="border-dashed cursor-pointer"
                            onClick={() => document.getElementById('tags-dropdown')?.classList.toggle('hidden')}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Tag
                          </Badge>
                        )}
                      </div>
                      <div id="tags-dropdown" className="hidden mt-2 p-2 border rounded-md bg-background shadow-sm">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {availableTags
                            .filter(tag => !selectedTags.includes(tag))
                            .map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline"
                                className="cursor-pointer justify-center"
                                onClick={() => toggleTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center justify-between">
                        <span>Select tags that best describe your bot's functionality</span>
                        <span className="font-medium">{selectedTags.length}/6</span>
                      </p>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => router.push(`/bots/${botId}`)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90" 
                        onClick={() => setActiveTab("details")}
                      >
                        Continue
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="p-6 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2 text-base">
                        <Link2 className="h-4 w-4 text-primary" />
                        Website URL (optional)
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
                      <Label htmlFor="supportServer" className="flex items-center gap-2 text-base">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        Support Server Invite (optional)
                      </Label>
                      <Input 
                        id="supportServer" 
                        name="supportServer" 
                        placeholder="https://discord.gg/yourinvite" 
                        value={formData.supportServer}
                        onChange={handleInputChange}
                        className="border-input/50 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="githubRepo" className="flex items-center gap-2 text-base">
                        <Github className="h-4 w-4 text-primary" />
                        GitHub Repository (optional)
                      </Label>
                      <Input 
                        id="githubRepo" 
                        name="githubRepo" 
                        placeholder="https://github.com/yourusername/yourrepo" 
                        value={formData.githubRepo}
                        onChange={handleInputChange}
                        className="border-input/50 focus-visible:ring-primary"
                      />
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("basic")}
                      >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90" 
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}