import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BotCard } from "@/components/bot-card"
import { Search, Zap, Shield, Award, ArrowRight, Star, Users, Bot, Check, Sparkles, Code, MessageSquare, ChevronRight, Flame, Bookmark, TrendingUp, Clock, ArrowUpRight, Cpu, Layers, Lightbulb, Rocket, ThumbsUp } from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { metadata } from './metadata'
import { formatDistanceToNow } from "date-fns"
import { formatNumber } from "@/lib/utils"
import { redirect } from "next/navigation"

interface Bot {
  _id: any
  clientId: string
  name: string
  description: string
  shortDescription?: string
  avatar?: string
  ownerId: string
  ownerUsername?: string
  prefix: string
  tags?: string[]
  votes?: number
  servers?: number
  inviteUrl: string
  website?: string
  supportServer?: string
  githubRepo?: string
  status: string
  isVerified?: boolean
  createdAt?: Date
  featured?: boolean
  owner?: {
    id: string
    username: string
    avatar: string
  }
}

async function getFeaturedBots() {
  const { db } = await connectToDatabase()
  
  return await db.collection("bots")
    .find({ status: "approved", featured: true })
    .sort({ votes: -1 })
    .limit(6)
    .toArray()
}

async function getNewestBots() {
  const { db } = await connectToDatabase()
  
  const fiveDaysAgo = new Date()
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
  
  return await db.collection("bots")
    .find({ 
      status: "approved",
      createdAt: { $gte: fiveDaysAgo } 
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray()
}

async function getMostVotedBots() {
  const { db } = await connectToDatabase()
  
  return await db.collection("bots")
    .find({ status: "approved" })
    .sort({ votes: -1 })
    .limit(6)
    .toArray()
}

export { metadata }

export default async function Home({
  searchParams,
}: {
  searchParams?: { query?: string }
}) {
  if (searchParams?.query) {
    redirect(`/search?query=${encodeURIComponent(searchParams.query)}`)
  }
  
  const featuredBots = await getFeaturedBots()
  const newestBots = await getNewestBots()
  const mostVotedBots = await getMostVotedBots()

  const { db } = await connectToDatabase()
  const botCount = await db.collection("bots").countDocuments({ status: "approved" })
  const userCount = await db.collection("users").countDocuments()

  return (
    <div className="min-h-screen">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 lg:pr-8">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1.5 px-3">
                <Rocket className="h-3.5 w-3.5 mr-1.5" />
                <span>Discover · Connect · Enhance</span>
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                The <span className="text-primary">Ultimate</span> Discord Bot Directory
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[600px]">
                Find the perfect bots to transform your Discord server experience. Curated by the community, for the community.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <form action="/" className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="query"
                    placeholder="Search for bots..." 
                    className="pl-10 pr-20 py-6 h-12 bg-background border-muted"
                  />
                  <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-10">
                    Search
                  </Button>
                </form>
                <Button asChild size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                  <Link href="/submit">Submit Your Bot</Link>
                </Button>
              </div>
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{botCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Verified Bots</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">{userCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Active Users</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">24/7</p>
                    <p className="text-xs text-muted-foreground">Support</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full filter blur-3xl"></div>
              
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-xl rotate-12"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-secondary/10 rounded-xl -rotate-12"></div>
                
                <div className="relative z-10 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <p className="font-medium text-sm">Featured Bots</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                        <Flame className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {featuredBots.slice(0, 3).map((bot) => (
                        <Link href={`/bots/${bot._id.toString()}`} key={bot._id.toString()} className="block">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/80 hover:bg-background transition-colors border border-border/50">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {bot.avatar ? (
                                <Image src={bot.avatar} alt={bot.name} width={40} height={40} className="object-cover" />
                              ) : (
                                <Bot className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <h4 className="font-medium text-sm truncate">{bot.name}</h4>
                                {bot.isVerified && (
                                  <Check className="h-3.5 w-3.5 text-primary" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">{bot.description}</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-full mt-3 text-primary" asChild>
                      <Link href="/bots">
                        View All Bots
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                Discover <span className="text-primary">Amazing</span> Bots
              </h2>
              <p className="text-muted-foreground mt-2">
                Browse through our collection of high-quality Discord bots
              </p>
            </div>
            <Tabs defaultValue="featured" className="w-full md:w-auto">
              <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto p-1">
                <TabsTrigger value="featured" className="text-xs md:text-sm py-2">
                  <Flame className="h-3.5 w-3.5 mr-1.5 md:mr-2" />
                  Featured
                </TabsTrigger>
                <TabsTrigger value="newest" className="text-xs md:text-sm py-2">
                  <Clock className="h-3.5 w-3.5 mr-1.5 md:mr-2" />
                  Newest
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Tabs defaultValue="featured" className="w-full">
            <TabsContent value="featured" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredBots.map((bot) => (
                  <BotCard
                    key={bot._id.toString()}
                    bot={{
                      id: bot._id.toString(),
                      name: bot.name,
                      avatar: bot.avatar || "/placeholder.svg?height=80&width=80",
                      description: bot.description,
                      tags: bot.tags,
                      votes: bot.votes || 0,
                      servers: bot.servers || 0,
                      isVerified: bot.isVerified || false,
                      featured: true,
                    }}
                    variant="featured"
                  />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/bots?sort=popular">
                    View All Featured Bots
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="newest" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newestBots.length > 0 ? (
                  newestBots.map((bot) => (
                    <BotCard 
                      key={bot.clientId} 
                      bot={{
                        id: bot.clientId,
                        name: bot.name,
                        avatar: bot.avatar || "/placeholder.svg",
                        description: bot.shortDescription || bot.description,
                        tags: bot.tags || [],
                        votes: bot.votes || 0,
                        servers: bot.servers || 0,
                        isVerified: bot.isVerified || false,
                        createdAt: bot.createdAt,
                      }} 
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">No bots added in the last 5 days. Check back soon!</p>
                  </div>
                )}
              </div>
              <div className="text-center mt-8">
                <Link href="/bots?sort=newest">
                  <Button variant="outline" size="lg" className="gap-2">
                    View All New Bots
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <ThumbsUp className="h-6 w-6 text-primary" />
              Most Voted Bots
            </h2>
            <Link href="/bots?sort=votes">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mostVotedBots.map((bot) => (
              <BotCard 
                key={bot.clientId} 
                bot={{
                  id: bot.clientId,
                  name: bot.name,
                  avatar: bot.avatar || "/placeholder.svg",
                  description: bot.shortDescription || bot.description,
                  tags: bot.tags || [],
                  votes: bot.votes || 0,
                  servers: bot.servers || 0,
                  isVerified: bot.isVerified || false,
                  createdAt: bot.createdAt,
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 py-1 px-3 mb-2">
              <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
              Find Your Perfect Bot
            </Badge>
            <h2 className="text-3xl font-bold">
              Browse by <span className="text-accent">Category</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Discover bots tailored to your specific needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Moderation", icon: Shield, color: "primary", description: "Keep your server safe and organized" },
              { name: "Music", icon: MessageSquare, color: "secondary", description: "Play music in voice channels" },
              { name: "Economy", icon: Award, color: "accent", description: "Virtual currency and economy systems" },
              { name: "Utility", icon: Zap, color: "primary", description: "Useful tools for your server" },
              { name: "Fun", icon: Sparkles, color: "secondary", description: "Games and entertainment" },
              { name: "Games", icon: Users, color: "accent", description: "Interactive games for members" },
              { name: "Leveling", icon: Star, color: "primary", description: "Track member activity and growth" },
              { name: "Developer", icon: Code, color: "secondary", description: "Tools for developers" },
            ].map((category, i) => (
              <Link 
                href={`/bots?category=${category.name.toLowerCase()}`} 
                key={i}
                className="group"
              >
                <Card className="h-full border-border/50 bg-background backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group-hover:shadow-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/0 z-0"></div>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-${category.color}`}></div>
                  <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                    <div className={`w-12 h-12 rounded-full bg-${category.color}/10 flex items-center justify-center mb-4 group-hover:bg-${category.color}/20 transition-colors`}>
                      <category.icon className={`h-6 w-6 text-${category.color}`} />
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 hidden md:block">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                  <Rocket className="h-3.5 w-3.5 mr-1.5" />
                  For Bot Developers
                </Badge>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to showcase your creation?
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Join thousands of developers who have already listed their bots on our platform and reach more users.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/submit" className="gap-2">
                      Submit Your Bot
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary/20 text-primary hover:bg-primary/10">
                    <Link href="/docs">Read Documentation</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/10 rounded-xl rotate-12"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-primary/10 rounded-xl -rotate-12"></div>
                
                <div className="bg-card backdrop-blur-sm border border-border rounded-2xl p-6 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Developer Benefits</h3>
                      <p className="text-xs text-muted-foreground">Why list your bot with us</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      "Increased visibility to thousands of users",
                      "Detailed analytics and insights",
                      "Developer community support",
                      "Verified badge for trusted bots"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                        <Check className="h-4 w-4 text-primary" />
                        <p className="text-sm text-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
