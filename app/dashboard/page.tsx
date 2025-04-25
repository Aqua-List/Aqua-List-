"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  ThumbsUp, Server, Edit, Trash2, Plus, Loader2, Globe, Github, 
  Linkedin, Twitter, BarChart3, Sparkles, Zap, Activity, 
  Calendar, Users, Bot, AlertCircle, CheckCircle, Clock,
  Rocket, Star, ArrowUpRight, Settings, User, ChevronRight,
  LayoutDashboard, PlusCircle, Gauge, Boxes, MessageSquare
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Bot {
  _id: string
  clientId: string
  name: string
  avatar: string | null
  description: string
  tags: string[]
  votes: number
  servers: number
  status: string
  featured?: boolean
  createdAt?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [userBots, setUserBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    bio: "",
    website: "",
    github: "",
    twitter: "",
    linkedin: ""
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchUserBots() {
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch(`/api/users/${(session.user as any).discordId}/bots`)
          if (response.ok) {
            const data = await response.json()
            setUserBots(data.bots)
          } else {
            console.error("Failed to fetch user bots")
          }
        } catch (error) {
          console.error("Error fetching user bots:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (status !== "loading") {
      fetchUserBots()
    }
  }, [session, status])

  useEffect(() => {
    async function fetchProfileData() {
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch(`/api/users/${(session.user as any).discordId}/update`);
          if (response.ok) {
            const data = await response.json();
            setProfileData({
              bio: data.bio || "",
              website: data.website || "",
              github: data.github || "",
              twitter: data.twitter || "",
              linkedin: data.linkedin || ""
            });
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    }
    
    if (status !== "loading") {
      fetchProfileData();
    }
  }, [session, status]);

  const handleDeleteBot = async (botId: string, clientId: string) => {
    if (confirm("Are you sure you want to delete this bot?")) {
      setDeleteLoading(botId)
      try {
        const response = await fetch(`/api/bots/${clientId}`, {
          method: "DELETE",
        })
        
        if (response.ok) {
          setUserBots(userBots.filter(bot => bot._id !== botId))
          toast.success("Bot deleted successfully")
        } else {
          toast.error("Failed to delete bot")
        }
      } catch (error) {
        console.error("Error deleting bot:", error)
        toast.error("An error occurred while deleting the bot")
      } finally {
        setDeleteLoading(null)
      }
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setProfileLoading(true);
    try {
      const response = await fetch(`/api/users/${(session.user as any).discordId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : "Something went wrong while updating your profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <Card className="border-border/40 shadow-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="bg-muted/30 p-8 rounded-full mb-6">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-center text-muted-foreground mb-6 max-w-md">
              Sign in with your Discord account to manage your bots, view analytics, and update your profile settings.
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
              <Link href="/login">Sign In with Discord</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBots = userBots.length
  const approvedBots = userBots.filter(bot => bot.status === "approved").length
  const pendingBots = userBots.filter(bot => bot.status === "pending").length
  const totalVotes = userBots.reduce((sum, bot) => sum + bot.votes, 0)
  const totalServers = userBots.reduce((sum, bot) => sum + bot.servers, 0)
  const featuredBots = userBots.filter(bot => bot.featured).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-sky-500/10"></div>
          <div className="absolute inset-0 bg-grid-light opacity-10"></div>
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-sky-500 p-3 rounded-xl shadow-lg">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground mt-1">Manage your bots and account settings</p>
                </div>
              </div>
              <Button className="gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90" asChild>
                <Link href="/submit">
                  <PlusCircle className="h-4 w-4" />
                  Add New Bot
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-12 md:col-span-3">
            <div className="space-y-6">
            
              <Card className="border-border/40 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-sky-500 h-16 relative">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <Avatar className="h-20 w-20 border-4 border-background">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <CardContent className="pt-12 pb-4 text-center">
                  <h3 className="font-bold text-lg">{session?.user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{(session?.user as any)?.discordId}</p>
                  
                  <div className="mt-4 flex justify-center">
                    <Button variant="outline" size="sm" asChild className="text-xs">
                      <Link href={`/profile/${(session?.user as any)?.discordId}`}>
                        <User className="h-3 w-3 mr-1" />
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/40 shadow-sm">
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <Button 
                      variant={activeTab === "overview" ? "secondary" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("overview")}
                    >
                      <Gauge className="h-4 w-4 mr-2" />
                      Overview
                    </Button>
                    <Button 
                      variant={activeTab === "my-bots" ? "secondary" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("my-bots")}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      My Bots
                    </Button>
                    <Button 
                      variant={activeTab === "analytics" ? "secondary" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button 
                      variant={activeTab === "settings" ? "secondary" : "ghost"} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
                <Card className="border-border/40 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Bots</span>
                      <Badge variant="outline" className="font-mono">{totalBots}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Approved</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 font-mono">{approvedBots}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono">{pendingBots}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Featured</span>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-mono">{featuredBots}</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Votes</span>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-mono">{totalVotes}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Servers</span>
                      <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-mono">{totalServers}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-9">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
                          <h3 className="text-3xl font-bold mt-1">{totalBots}</h3>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs">
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="h-3 w-3" />
                          <span>{approvedBots} approved</span>
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-3" />
                        <div className="flex items-center gap-1 text-amber-500">
                          <AlertCircle className="h-3 w-3" />
                          <span>{pendingBots} pending</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                          <h3 className="text-3xl font-bold mt-1">{totalVotes.toLocaleString()}</h3>
                        </div>
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <ThumbsUp className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Popularity ranking</p>
                        <Progress value={Math.min(totalVotes / 10, 100)} className="h-1.5 bg-blue-100 dark:bg-blue-950" indicatorClassName="bg-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Servers</p>
                          <h3 className="text-3xl font-bold mt-1">{totalServers.toLocaleString()}</h3>
                        </div>
                        <div className="bg-purple-500/10 p-2 rounded-full">
                          <Server className="h-5 w-5 text-purple-500" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Growth potential</p>
                        <Progress value={Math.min(totalServers / 100, 100)} className="h-1.5 bg-purple-100 dark:bg-purple-950" indicatorClassName="bg-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Avg. Engagement</p>
                          <h3 className="text-3xl font-bold mt-1">
                            {totalBots > 0 ? Math.round(totalVotes / totalBots) : 0}
                          </h3>
                        </div>
                        <div className="bg-amber-500/10 p-2 rounded-full">
                          <Activity className="h-5 w-5 text-amber-500" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Votes per bot</p>
                        <Progress 
                          value={totalBots > 0 ? Math.min((totalVotes / totalBots) / 10 * 100, 100) : 0} 
                          className="h-1.5 bg-amber-100 dark:bg-amber-950" 
                          indicatorClassName="bg-amber-500" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 border-border/40 shadow-sm">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-primary" />
                        Recent Activity
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userBots.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Clock className="h-12 w-12 text-muted-foreground/20 mb-2" />
                            <p className="text-muted-foreground">No recent activity to display</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              Submit your first bot to get started
                            </p>
                          </div>
                        ) : (
                          userBots.slice(0, 4).map((bot) => (
                            <div key={bot._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <Avatar className="h-10 w-10 rounded-md">
                                <AvatarImage src={bot.avatar || ""} alt={bot.name} />
                                <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                                  {bot.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium truncate">{bot.name}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      bot.status === "approved" 
                                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    }
                                  >
                                    {bot.status === "approved" ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Clock className="h-3 w-3 mr-1" />
                                    )}
                                    {bot.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">{bot.description}</p>
                                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <ThumbsUp className="h-3 w-3 mr-1 text-blue-500" />
                                    {bot.votes} votes
                                  </div>
                                  <div className="flex items-center">
                                    <Server className="h-3 w-3 mr-1 text-purple-500" />
                                    {bot.servers} servers
                                  </div>
                                  {bot.createdAt && (
                                    <div className="flex items-center">
                                      <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                      {new Date(bot.createdAt).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border/40 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Star className="h-5 w-5 mr-2 text-amber-500" />
                        Featured Bots
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userBots.filter(bot => bot.featured).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Star className="h-12 w-12 text-muted-foreground/20 mb-2" />
                          <p className="text-muted-foreground">No featured bots yet</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            Create exceptional bots to get featured
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {userBots.filter(bot => bot.featured).map((bot) => (
                            <div key={bot._id} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-md">
                                  <AvatarImage src={bot.avatar || ""} alt={bot.name} />
                                  <AvatarFallback className="rounded-md bg-amber-500/10 text-amber-500">
                                    {bot.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{bot.name}</p>
                                  <p className="text-sm text-muted-foreground truncate">{bot.description}</p>
                                </div>
                              </div>
                              <div className="mt-2 flex justify-end">
                                <Button size="sm" variant="outline" asChild className="text-xs">
                                  <Link href={`/bots/${bot.clientId}`}>
                                    View Bot
                                    <ArrowUpRight className="h-3 w-3 ml-1" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === "my-bots" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-primary" />
                      My Bots
                    </CardTitle>
                    <Button asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                      <Link href="/submit">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Bot
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {userBots.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-muted/30 p-6 rounded-full mb-4">
                          <Bot className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Bots Found</h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                          You haven't submitted any bots yet. Create your first bot to get started!
                        </p>
                        <Button size="lg" className="gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90" asChild>
                          <Link href="/submit">
                            <Sparkles className="h-4 w-4" />
                            Submit Your First Bot
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {userBots.map((bot) => (
                          <div key={bot._id} className="group relative rounded-xl border border-border/40 bg-card hover:bg-card/80 transition-colors overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative p-5 flex gap-4">
                              <Avatar className="h-16 w-16 rounded-lg">
                                <AvatarImage src={bot.avatar || ""} alt={bot.name} className="object-cover" />
                                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                                  {bot.name ? bot.name.substring(0, 2).toUpperCase() : "??"}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-lg truncate">{bot.name}</h3>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      bot.status === "approved" 
                                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    }
                                  >
                                    {bot.status === "approved" ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Clock className="h-3 w-3 mr-1" />
                                    )}
                                    {bot.status}
                                  </Badge>
                                  {bot.featured && (
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                      <Star className="h-3 w-3 mr-1" /> Featured
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{bot.description}</p>
                                
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {bot.tags && bot.tags.length > 0 ? (
                                    <>
                                      {bot.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                      {bot.tags.length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{bot.tags.length - 3} more
                                        </Badge>
                                      )}
                                    </>
                                  ) : (
                                    <Badge variant="outline" className="text-xs text-muted-foreground">
                                      No tags
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <ThumbsUp className="h-4 w-4 text-blue-500" />
                                      <span>{bot.votes || 0} votes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Server className="h-4 w-4 text-purple-500" />
                                      <span>{bot.servers || 0} servers</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    {bot.status === "approved" && (
                                      <Button size="sm" variant="outline" asChild className="h-8 px-2">
                                        <Link href={`/bots/${bot.clientId}`}>
                                          View
                                        </Link>
                                      </Button>
                                    )}
                                    <Button size="sm" variant="outline" asChild className="h-8 px-2 text-blue-500 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10">
                                      <Link href={`/bots/${bot.clientId}/edit`}>
                                        <Edit className="h-3.5 w-3.5" />
                                      </Link>
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 px-2 text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10"
                                      onClick={() => handleDeleteBot(bot._id, bot.clientId)}
                                      disabled={deleteLoading === bot._id}
                                    >
                                      {deleteLoading === bot._id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                      Analytics
                    </CardTitle>
                    <CardDescription>
                      Track your bots' performance and growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="bg-muted/30 p-6 rounded-full mb-4">
                        <BarChart3 className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
                      <p className="text-muted-foreground mb-6 text-center max-w-md">
                        We're working on detailed analytics to help you understand your bots' performance better.
                      </p>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 py-1.5">
                        <Rocket className="h-4 w-4 mr-2" />
                        Feature in Development
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-base">About Me</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            placeholder="Tell us about yourself..."
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            className="min-h-[120px] resize-none border-input/50 focus-visible:ring-primary"
                          />
                          <p className="text-xs text-muted-foreground">
                            This will be displayed on your public profile
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="website" className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-primary" />
                              Website
                            </Label>
                            <Input
                              id="website"
                              name="website"
                              placeholder="https://yourwebsite.com"
                              value={profileData.website}
                              onChange={handleProfileChange}
                              className="border-input/50 focus-visible:ring-primary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="github" className="flex items-center gap-2">
                              <Github className="h-4 w-4 text-primary" />
                              GitHub Username
                            </Label>
                            <Input
                              id="github"
                              name="github"
                              placeholder="yourusername"
                              value={profileData.github}
                              onChange={handleProfileChange}
                              className="border-input/50 focus-visible:ring-primary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="twitter" className="flex items-center gap-2">
                              <Twitter className="h-4 w-4 text-primary" />
                              Twitter Username
                            </Label>
                            <Input
                              id="twitter"
                              name="twitter"
                              placeholder="yourusername"
                              value={profileData.twitter}
                              onChange={handleProfileChange}
                              className="border-input/50 focus-visible:ring-primary"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="linkedin" className="flex items-center gap-2">
                              <Linkedin className="h-4 w-4 text-primary" />
                              LinkedIn Username
                            </Label>
                            <Input
                              id="linkedin"
                              name="linkedin"
                              placeholder="yourusername"
                              value={profileData.linkedin}
                              onChange={handleProfileChange}
                              className="border-input/50 focus-visible:ring-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          disabled={profileLoading}
                          className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90"
                        >
                          {profileLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}