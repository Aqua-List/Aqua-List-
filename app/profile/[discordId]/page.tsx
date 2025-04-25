"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Globe, Github, Twitter, Linkedin, Calendar, MapPin, Users, Award, Bot, Shield, CheckCircle, Rocket, ThumbsUp, BadgeCheck, Code, User, ExternalLink, Mail, Edit, Star } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface UserProfile {
  discordId: string
  username: string
  avatar: string
  image?: string
  bio: string
  website: string
  github: string
  twitter: string
  linkedin: string
  isAdmin: boolean
  createdAt: string
}

interface UserBot {
  _id: string
  clientId: string
  name: string
  avatar: string
  description: string
  tags: string[]
  votes: number
  servers: number
  featured?: boolean
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const discordId = params.discordId as string
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [userBots, setUserBots] = useState<UserBot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (status !== "loading" && discordId) {
      fetchUserProfile()
    }
    
    if (status === "authenticated" && session?.user) {
      setIsOwner((session.user as any).discordId === discordId)
    }
  }, [status, discordId, session])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      const profileResponse = await fetch(`/api/users/${discordId}`)
      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile")
      }
      const profileData = await profileResponse.json()
      setProfile(profileData.user)

      const botsResponse = await fetch(`/api/users/${discordId}/bots/public`)
      if (botsResponse.ok) {
        const botsData = await botsResponse.json()
        setUserBots(botsData.bots)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-4">
        <Card className="border-border/40 shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Profile Not Found</CardTitle>
            <CardDescription>
              {error || "User profile not found. The user may not exist or has been removed."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Button asChild size="lg">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const hasSocialLinks = profile.website || profile.github || profile.twitter || profile.linkedin

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const daysSinceJoined = Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500 opacity-90"></div>
            <div className="absolute inset-0 bg-grid-light opacity-10"></div>
            
            <div className="relative z-10 p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative">
                  <div className="relative">
                    <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white/20 shadow-xl">
                      <AvatarImage 
                        src={profile?.avatar || profile?.image || '/placeholder.png'} 
                        alt={profile?.username || "User"} 
                      />
                      <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                        {profile?.username ? profile.username.substring(0, 2).toUpperCase() : 'UN'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white"></div>
                  </div>
                  
                  {profile.isAdmin && (
                    <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500/90 text-white px-3 py-1">
                      <Shield className="h-3 w-3 mr-1" /> Admin
                    </Badge>
                  )}
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                  <div className="flex items-center gap-2 mt-2 text-white/80 justify-center md:justify-start">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {memberSince}</span>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                    {isOwner ? (
                      <Button 
                        asChild 
                        variant="outline" 
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        <Link href="/dashboard">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/40 shadow-sm bg-card/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-2 border-b border-border/20">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {profile.bio ? (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {profile.bio}
                      </p>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <User className="h-12 w-12 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground italic">This user hasn't added a bio yet.</p>
                        
                        {isOwner && (
                          <Button variant="outline" size="sm" className="mt-4" asChild>
                            <Link href="/dashboard/settings">
                              Add Bio
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
              
              <Card className="border-border/40 shadow-sm bg-card/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-2 border-b border-border/20">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-sm">Member Since</span>
                      </div>
                      <span className="font-medium">{memberSince}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">Days on Platform</span>
                        <span className="text-sm font-medium">{daysSinceJoined} days</span>
                      </div>
                      <Progress value={Math.min(100, (daysSinceJoined / 365) * 100)} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-purple-500" />
                        </div>
                        <span className="text-sm">Bots</span>
                      </div>
                      <span className="font-medium">{userBots.length}</span>
                    </div>
                    
                    {profile.isAdmin && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-amber-500" />
                          </div>
                          <span className="text-sm">Role</span>
                        </div>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                          Admin
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-sm">Status</span>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {hasSocialLinks && (
                <Card className="border-border/40 shadow-sm bg-card/50">
                  <CardHeader className="bg-muted/30 pb-2 border-b border-border/20">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Connect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 gap-3">
                      {profile.website && (
                        <Button variant="outline" size="sm" asChild className="justify-start gap-2 bg-blue-500/5 text-blue-500 border-blue-500/20 hover:bg-blue-500/10">
                          <a href={ensureHttps(profile.website)} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4" />
                            Website
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        </Button>
                      )}
                      {profile.github && (
                        <Button variant="outline" size="sm" asChild className="justify-start gap-2 bg-gray-800/5 text-gray-800 dark:text-gray-200 border-gray-800/20 dark:border-gray-200/20 hover:bg-gray-800/10 dark:hover:bg-gray-200/10">
                          <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                            GitHub
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        </Button>
                      )}
                      {profile.twitter && (
                        <Button variant="outline" size="sm" asChild className="justify-start gap-2 bg-blue-400/5 text-blue-400 border-blue-400/20 hover:bg-blue-400/10">
                          <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                            Twitter
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        </Button>
                      )}
                      {profile.linkedin && (
                        <Button variant="outline" size="sm" asChild className="justify-start gap-2 bg-blue-700/5 text-blue-700 border-blue-700/20 hover:bg-blue-700/10">
                          <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                            <ExternalLink className="h-3 w-3 ml-auto" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="lg:col-span-2">
              <Card className="border-border/40 shadow-sm bg-card/50 overflow-hidden h-full">
                <CardHeader className="bg-muted/30 pb-2 border-b border-border/20">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Bots
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {userBots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Bot className="h-16 w-16 text-muted-foreground/20 mb-4" />
                      <p className="text-muted-foreground">This user hasn't submitted any bots yet</p>
                      {isOwner && (
                        <Button asChild className="mt-6 bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                          <Link href="/dashboard/bots/new">
                            <Bot className="h-4 w-4 mr-2" />
                            Add Your First Bot
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {userBots.map((bot) => (
                        <motion.div
                          key={bot._id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="group relative rounded-xl border border-border/40 bg-card hover:bg-card/80 transition-colors overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="relative p-5 flex gap-4">
                              <Avatar className="h-16 w-16 rounded-lg">
                                <AvatarImage src={bot.avatar} alt={bot.name} className="object-cover" />
                                <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                                  {bot.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg truncate">{bot.name}</h3>
                                  {bot.featured && (
                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                                      <Star className="h-3 w-3 mr-1" /> Featured
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">{bot.description}</p>
                                
                                <div className="flex flex-wrap gap-1 mb-3">
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
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <ThumbsUp className="h-4 w-4 text-amber-500" />
                                      <span>{bot.votes} votes</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="h-4 w-4 text-blue-500" />
                                      <span>{bot.servers} servers</span>
                                    </div>
                                  </div>
                                  
                                  <Button size="sm" asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                                    <Link href={`/bots/${bot.clientId}`}>View Bot</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ensureHttps(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
