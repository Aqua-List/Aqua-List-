import { Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BotCard } from "@/components/bot-card"
import { Search, Filter, SlidersHorizontal, X, Zap, Server, ThumbsUp, Clock, Bot as BotIcon, Sparkles, Compass } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { connectToDatabase } from "@/lib/mongodb"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BotSearch } from "@/components/bot-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryFilter } from "@/components/category-filter"
import { SortSelector } from "@/components/sort-selector"
import { BotTabs } from "@/components/bot-tabs"
import { Metadata } from 'next'

const categories = [
  { id: "moderation", label: "Moderation", icon: "🛡️" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "economy", label: "Economy", icon: "💰" },
  { id: "fun", label: "Fun", icon: "🎮" },
  { id: "utility", label: "Utility", icon: "🛠️" },
  { id: "social", label: "Social", icon: "💬" },
  { id: "ai", label: "AI", icon: "🤖" },
  { id: "games", label: "Games", icon: "🎲" },
  { id: "leveling", label: "Leveling", icon: "⭐" },
  { id: "anime", label: "Anime", icon: "🎭" },
  { id: "developer", label: "Developer", icon: "👨‍💻" },
  { id: "chat", label: "Chat", icon: "💭" },
  { id: "roleplay", label: "Roleplay", icon: "🎭" },
  { id: "notification", label: "Notification", icon: "🔔" },
  { id: "art", label: "Art", icon: "🎨" },
  { id: "productivity", label: "Productivity", icon: "📊" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "memes", label: "Memes", icon: "😂" },
  { id: "logging", label: "Logging", icon: "📝" },
  { id: "statistics", label: "Statistics", icon: "📈" },
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "customizable", label: "Customizable", icon: "⚙️" },
  { id: "multilingual", label: "Multilingual", icon: "🌐" }
]

export default async function BotsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const resolvedParams = await searchParams
  const sortValue = resolvedParams.sort?.toString() || "newest"
  const categoryValue = resolvedParams.category?.toString() || ""
  const searchQuery = resolvedParams.q?.toString() || ""
  const tabValue = resolvedParams.tab?.toString() || "all"
  
  const bots = await getBots({
    query: searchQuery,
    category: categoryValue,
    sort: sortValue,
    featured: tabValue === "featured"
  })

  const featuredBots = bots.filter(bot => bot.featured)
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-primary"></div>
          <div className="absolute inset-0 bg-grid-light opacity-10"></div>
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 mb-6">
              <Compass className="h-3.5 w-3.5 mr-1.5" />
              Explore Bots
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Discover Amazing Discord Bots
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Find the perfect bots to enhance your Discord server experience
            </p>
            
            <BotSearch className="max-w-xl w-full" />
            
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.slice(0, 6).map((category) => (
                <a 
                  key={category.id}
                  href={`/bots?category=${category.id}`}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.label}
                </a>
              ))}
              <a 
                href="#categories"
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
              >
                <span className="mr-1.5">+</span>
                More
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block space-y-6">
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                <CardTitle className="text-xl">Filters</CardTitle>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2 text-primary" />
                    Sort By
                  </h3>
                  <div className="flex-1">
                    <SortSelector defaultValue={sortValue} />
                  </div>
                </div>
                
                <Separator />
                
                <div id="categories" className="space-y-3">
                  <h3 className="text-sm font-medium flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-primary" />
                    Categories
                  </h3>
                  <CategoryFilter 
                    categories={categories} 
                    selectedCategory={categoryValue} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-secondary/10 to-accent/10 p-4">
                <CardTitle className="text-xl">Stats</CardTitle>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                    <BotIcon className="h-6 w-6 text-primary mb-2" />
                    <span className="text-xs text-muted-foreground">Total Bots</span>
                    <span className="font-medium text-lg">{bots.length}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-secondary mb-2" />
                    <span className="text-xs text-muted-foreground">Featured</span>
                    <span className="font-medium text-lg">{featuredBots.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:hidden mb-6">
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                    <div className="py-6 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center">
                          <SlidersHorizontal className="h-4 w-4 mr-2 text-primary" />
                          Sort By
                        </h3>
                        <div className="flex-1">
                          <SortSelector defaultValue={sortValue} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium flex items-center">
                          <Filter className="h-4 w-4 mr-2 text-primary" />
                          Categories
                        </h3>
                        <CategoryFilter 
                          categories={categories} 
                          selectedCategory={categoryValue} 
                        />
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              
              <SortSelector defaultValue={sortValue} className="flex-1" />
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-lg overflow-hidden">
              <BotTabs defaultValue={tabValue}>
                <TabsContent value="all" className="m-0 p-6">
                  <Suspense fallback={<BotListSkeleton />}>
                    {bots.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bots.map((bot) => (
                          <BotCard
                            key={bot._id.toString()}
                            bot={{
                              id: bot._id.toString(),
                              name: bot.name,
                              avatar: bot.avatar || "/placeholder.png",
                              description: bot.description,
                              tags: bot.tags || [],
                              votes: bot.votes || 0,
                              servers: bot.servers || 0,
                              isVerified: bot.isVerified || false,
                              featured: bot.featured || false,
                              createdAt: bot.createdAt,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center border border-border/50">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-muted-foreground" />
                          <h3 className="font-semibold">No bots found</h3>
                          <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </Card>
                    )}
                  </Suspense>
                </TabsContent>
                
                <TabsContent value="featured" className="m-0 p-6">
                  <Suspense fallback={<BotListSkeleton />}>
                    {featuredBots.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredBots.map((bot) => (
                          <BotCard
                            key={bot._id.toString()}
                            bot={{
                              id: bot._id.toString(),
                              name: bot.name,
                              avatar: bot.avatar || "/placeholder.png",
                              description: bot.description,
                              tags: bot.tags || [],
                              votes: bot.votes || 0,
                              servers: bot.servers || 0,
                              isVerified: bot.isVerified || false,
                              featured: true,
                              createdAt: bot.createdAt,
                            }}
                            variant="featured"
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-8 text-center border border-border/50">
                        <div className="flex flex-col items-center gap-2">
                          <Zap className="h-8 w-8 text-muted-foreground" />
                          <h3 className="font-semibold">No featured bots</h3>
                          <p className="text-sm text-muted-foreground">
                            Check back later for featured bots
                          </p>
                        </div>
                      </Card>
                    )}
                  </Suspense>
                </TabsContent>
                
                <TabsContent value="trending" className="m-0 p-6">
                  <Suspense fallback={<BotListSkeleton />}>
                    <Card className="p-8 text-center border border-border/50">
                      <div className="flex flex-col items-center gap-2">
                        <Sparkles className="h-8 w-8 text-muted-foreground" />
                        <h3 className="font-semibold">Trending bots coming soon</h3>
                        <p className="text-sm text-muted-foreground">
                          We're working on this feature
                        </p>
                      </div>
                    </Card>
                  </Suspense>
                </TabsContent>
              </BotTabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function BotListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </CardContent>
          <div className="px-6 py-4 bg-muted/30">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

async function getBots({ 
  query, 
  category, 
  sort,
  featured = false
}: { 
  query?: string
  category?: string
  sort?: string
  featured?: boolean
}) {
  try {
    const { db } = await connectToDatabase()

    const filter: any = { status: "approved" }
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ]
    }
    
    if (category) {
      filter.tags = category
    }
    
    if (featured) {
      filter.featured = true
    }

    let sortOptions: any = {}
    switch (sort) {
      case "popular":
        sortOptions = { votes: -1 }
        break
      case "servers":
        sortOptions = { servers: -1 }
        break
      case "votes":
        sortOptions = { votes: -1 }
        break
      case "newest":
      default:
        sortOptions = { createdAt: -1 }
    }

    const bots = await db.collection("bots")
      .find(filter)
      .sort(sortOptions)
      .limit(20)
      .toArray()

    return bots
  } catch (error) {
    console.error("Error fetching bots:", error)
    return []
  }
}

export const metadata: Metadata = {
  title: 'Discord Bots Directory - AquaList',
  description: 'Browse our curated collection of Discord bots. Find the perfect bot to enhance your server with moderation, music, games, and more.',
  openGraph: {
    title: 'Discord Bots Directory - AquaList',
    description: 'Browse our curated collection of Discord bots. Find the perfect bot to enhance your server with moderation, music, games, and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discord Bots Directory - AquaList',
    description: 'Browse our curated collection of Discord bots. Find the perfect bot to enhance your server with moderation, music, games, and more.',
  },
}
