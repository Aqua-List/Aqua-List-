import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, Bot, Calendar, Github, Globe, Linkedin, Twitter, 
  ExternalLink, MapPin, Award, Star, Users, MessageSquare,
  Sparkles, Shield, CheckCircle, Code, Zap, Heart, ThumbsUp
} from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb"
import { formatDistanceToNow } from "date-fns"
import { RoleBadge } from "@/components/role-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  params: {
    discordId: string
  }
}

interface UserData {
  id: string;
  _id: any;
  username: string;
  avatar: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  roles?: string[];
  discordRoles?: string[];
  reputation?: number;
  contributions?: number;
  createdAt: string;
  bots: {
    id: string;
    name: string;
    avatar: string;
    description: string;
    tags: string[];
    votes: number;
    servers: number;
  }[];
}

async function getUser(discordId: string): Promise<UserData | null> {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({
    discordId: discordId,
  })

  if (!user) {
    return null
  }

  const bots = await db
    .collection("bots")
    .find({
      ownerId: user.discordId,
      status: "approved",
    })
    .toArray()

  return {
    ...user,
    id: user._id.toString(),
    bots: bots.map((bot) => ({
      id: bot._id.toString(),
      name: bot.name,
      avatar: bot.avatar || "/placeholder.svg?height=80&width=80",
      description: bot.description,
      tags: bot.tags,
      votes: bot.votes || 0,
      servers: bot.servers || 0,
    })),
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const user = await getUser(params.discordId)

  if (!user) {
    return (
      <div className="container mx-auto max-w-6xl py-16 px-4 text-center">
        <Card className="max-w-md mx-auto border-border/40 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">User Not Found</CardTitle>
            <CardDescription>
              The user you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="bg-muted/30 p-8 rounded-full mb-6">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
              <Link href="/bots">Browse Bots</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const daysSinceJoining = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="relative mb-8 rounded-xl overflow-hidden border border-border/40 shadow-sm">
          <div className="h-48 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 relative">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundPosition: 'center',
            }}></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 px-6 pb-6 -mt-16">
            <div className="flex-shrink-0 relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                <AvatarImage src={user.avatar || "/placeholder.svg?height=150&width=150"} alt={user.username} />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                  {user.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-green-500 border-2 border-background"></div>
            </div>
            
            <div className="flex-1 pt-16 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <p className="text-muted-foreground">{user.bio || "No bio provided."}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {user.roles &&
                    user.roles.length > 0 &&
                    user.roles.map((role: string) => <RoleBadge key={role} role={role} />)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Bot className="h-4 w-4 text-primary" />
                    <span>Bots</span>
                  </div>
                  <span className="text-2xl font-bold">{user.bots?.length || 0}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Member For</span>
                  </div>
                  <span className="text-2xl font-bold">{daysSinceJoining} days</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span>Reputation</span>
                  </div>
                  <span className="text-2xl font-bold">{user.reputation || 0}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Heart className="h-4 w-4 text-purple-500" />
                    <span>Contributions</span>
                  </div>
                  <span className="text-2xl font-bold">{user.contributions || 0}</span>
                </div>
              </div>
              
              {(user.website || user.github || user.linkedin || user.twitter) && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {user.website && (
                    <a
                      href={ensureHttps(user.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="text-sm">Website</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={ensureHttps(`github.com/${user.github}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-4 w-4 text-primary" />
                      <span className="text-sm">GitHub</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={ensureHttps(`linkedin.com/in/${user.linkedin}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-primary" />
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  )}
                  {user.twitter && (
                    <a
                      href={ensureHttps(`twitter.com/${user.twitter}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-4 w-4 text-primary" />
                      <span className="text-sm">Twitter</span>
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="bots" className="w-full">
          <TabsList className="mb-6 p-1 bg-muted/50 border border-border/40 rounded-lg">
            <TabsTrigger value="bots" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-sky-500 data-[state=active]:text-white rounded-md">
              <Bot className="h-4 w-4 mr-2" />
              Bots
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-sky-500 data-[state=active]:text-white rounded-md">
              <User className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bots" className="space-y-6">
            {user.bots && user.bots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.bots.map((bot: any) => (
                  <Card key={bot.id} className="group relative overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <CardHeader className="pb-2 relative">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-lg">
                          <AvatarImage src={bot.avatar} alt={bot.name} />
                          <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                            {bot.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <CardTitle className="text-lg">{bot.name}</CardTitle>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {bot.tags.slice(0, 2).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {bot.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{bot.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-2">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bot.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-blue-500" />
                            <span>{bot.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-purple-500" />
                            <span>{bot.servers}</span>
                          </div>
                        </div>
                        
                        <Button size="sm" asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                          <Link href={`/bots/${bot.id}`}>View Bot</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border/40 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-muted/30 p-6 rounded-full mb-4">
                    <Bot className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Bots Found</h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md">
                    This user hasn't added any bots yet.
                  </p>
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                    <Link href="/bots">Browse Bots</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  About {user.username}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{user.bio || "No bio provided."}</p>
                </div>
              </CardContent>
            </Card>

            {(user.website || user.github || user.linkedin || user.twitter) && (
              <Card className="border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {user.website && (
                      <a
                        href={ensureHttps(user.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <Globe className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">Website</p>
                          <p className="text-sm text-muted-foreground truncate">{user.website}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {user.github && (
                      <a
                        href={ensureHttps(`github.com/${user.github}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <Github className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-muted-foreground truncate">{user.github}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {user.linkedin && (
                      <a
                        href={ensureHttps(`linkedin.com/in/${user.linkedin}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <Linkedin className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">LinkedIn</p>
                          <p className="text-sm text-muted-foreground truncate">{user.linkedin}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {user.twitter && (
                      <a
                        href={ensureHttps(`twitter.com/${user.twitter}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          <Twitter className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">Twitter</p>
                          <p className="text-sm text-muted-foreground truncate">{user.twitter}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {user.roles && user.roles.length > 0 && (
              <Card className="border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role: string) => (
                      <div key={role} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                        <RoleBadge role={role} showIcon={true} />
                        <span className="text-sm">{role}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {user.discordRoles && user.discordRoles.length > 0 && (
              <Card className="border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                    Discord Server Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.discordRoles.map((role: string) => (
                      <Badge key={role} variant="outline" className="bg-[#5865F2]/10 text-[#5865F2] border-[#5865F2]/30 py-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ensureHttps(url: string): string {
  if (!url) return "";
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
