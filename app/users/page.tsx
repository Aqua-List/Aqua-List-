"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, Users, Bot, Award, Filter, ArrowUpDown, 
  Clock, Star, Sparkles, Zap, User, Shield
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCard } from "@/components/user-card"

interface SearchParams {
  query?: string
  sort?: string
  filter?: string
}

export default function UsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "newest")
  const [filterOption, setFilterOption] = useState(searchParams.get("filter") || "all")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("grid")

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set("query", searchQuery)
        if (sortOption) params.set("sort", sortOption)
        if (filterOption) params.set("filter", filterOption)
        
        const response = await fetch(`/api/users?${params.toString()}`)
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [searchQuery, sortOption, filterOption])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateQueryParams()
  }

  const updateQueryParams = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("query", searchQuery)
    if (sortOption !== "newest") params.set("sort", sortOption)
    if (filterOption !== "all") params.set("filter", filterOption)
    
    router.push(`/users?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl py-12 px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Users className="h-4 w-4 mr-2" />
            Community
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Discord Bot Developers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover talented developers building amazing Discord bots for your servers
          </p>
        </div>

        <Card className="mb-10 border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40 pb-4">
            <CardTitle className="flex items-center text-xl">
              <Search className="h-5 w-5 mr-2 text-primary" />
              Find Developers
            </CardTitle>
            <CardDescription>
              Search for developers by username or filter by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search by username..." 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="w-full sm:w-40">
                    <Select value={sortOption} onValueChange={(value) => {
                      setSortOption(value)
                      setTimeout(updateQueryParams, 0)
                    }}>
                      <SelectTrigger>
                        <div className="flex items-center">
                          <ArrowUpDown className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Sort by" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="bots">Most Bots</SelectItem>
                        <SelectItem value="reputation">Reputation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-40">
                    <Select value={filterOption} onValueChange={(value) => {
                      setFilterOption(value)
                      setTimeout(updateQueryParams, 0)
                    }}>
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filter" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                        <SelectItem value="botDev">Bot Developers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 py-1 px-3">
              {loading ? "Loading..." : `${users.length} Developers`}
            </Badge>
            {searchQuery && (
              <Badge variant="outline" className="bg-muted py-1 px-3 flex items-center gap-1">
                <span>Search: {searchQuery}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-1 hover:bg-transparent p-0" 
                  onClick={() => {
                    setSearchQuery("")
                    setTimeout(updateQueryParams, 0)
                  }}
                >
                  <span className="sr-only">Clear search</span>
                  ×
                </Button>
              </Badge>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <div className="grid grid-cols-2 gap-0.5 h-3 w-3">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
                <span className="ml-1.5">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-1">
                <div className="flex flex-col gap-0.5 h-3 w-3">
                  <div className="bg-current rounded-sm h-0.5 w-full"></div>
                  <div className="bg-current rounded-sm h-0.5 w-full"></div>
                  <div className="bg-current rounded-sm h-0.5 w-full"></div>
                </div>
                <span className="ml-1.5">List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} className="mb-12">
          <TabsContent value="grid">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-border/40 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-24 bg-gradient-to-r from-emerald-500/20 to-sky-500/20"></div>
                      <div className="px-6 pt-0 pb-6 -mt-12">
                        <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                        <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                        <div className="flex justify-center gap-2 mb-4">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={{
                      id: user.id,
                      discordId: user.discordId,
                      username: user.username,
                      avatar: user.avatar || "/placeholder.svg?height=80&width=80",
                      bio: user.bio,
                      website: user.website,
                      github: user.github,
                      linkedin: user.linkedin,
                      twitter: user.twitter,
                      isAdmin: user.isAdmin,
                      botCount: user.botCount,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-muted/50 inline-flex p-6 rounded-full mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No developers found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setSortOption("newest")
                    setFilterOption("all")
                    setTimeout(updateQueryParams, 0)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-border/40 shadow-sm overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-10 w-28 flex-shrink-0" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="border-border/40 shadow-sm overflow-hidden hover:bg-muted/30 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
                        <img 
                          src={user.avatar || "/placeholder.svg?height=80&width=80"} 
                          alt={user.username}
                          className="h-full w-full object-cover"
                        />
                        {user.isAdmin && (
                          <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-background">
                            <Shield className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{user.username}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {user.bio || "No bio provided"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center">
                            <Bot className="h-3 w-3 mr-1" />
                            {user.botCount} {user.botCount === 1 ? "Bot" : "Bots"}
                          </Badge>
                          {user.isAdmin && (
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-muted/50 inline-flex p-6 rounded-full mb-4">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No developers found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setSortOption("newest")
                    setFilterOption("all")
                    setTimeout(updateQueryParams, 0)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-bold">Featured Developers</h2>
            <Badge className="ml-2 bg-amber-500/20 text-amber-500 border-amber-500/20">
              Coming Soon
            </Badge>
          </div>
          
          <Card className="border-border/40 shadow-sm overflow-hidden bg-gradient-to-br from-amber-500/5 to-amber-500/20">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="bg-amber-500/10 p-4 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Featured Developers Program</h3>
              <p className="text-muted-foreground max-w-lg mb-6">
                We're currently selecting outstanding Discord bot developers to feature in this section.
                Check back soon to discover our handpicked talented developers!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                  Apply to be Featured
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
