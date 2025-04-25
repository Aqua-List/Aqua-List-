import { Metadata } from "next"
import Link from "next/link"
import { BotCard } from "@/components/bot-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { connectToDatabase } from "@/lib/mongodb"
import { Search, Filter, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Search Results | Discord Bot List",
  description: "Find the perfect Discord bots for your server",
}

async function searchBots(query: string) {
  const { db } = await connectToDatabase()
  
  const searchPattern = new RegExp(query, "i")
  
  try {
    return await db.collection("bots")
      .find({
        status: "approved",
        $or: [
          { name: { $regex: searchPattern } },
          { description: { $regex: searchPattern } },
          { shortDescription: { $regex: searchPattern } },
          { tags: { $regex: searchPattern } }
        ]
      })
      .limit(24)
      .toArray()
  } catch (error) {
    console.error("Search error:", error)
    return []
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query?: string }
}) {
  const query = searchParams?.query || ""
  
  const results = query ? await searchBots(query) : []
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-muted-foreground mt-1">
            {query ? (
              results.length > 0 
                ? `Found ${results.length} results for "${query}"`
                : `No results found for "${query}"`
            ) : (
              "Enter a search term to find bots"
            )}
          </p>
        </div>
        
        <div className="w-full md:w-auto">
          <form action="/search" className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              name="query"
              defaultValue={query}
              placeholder="Search for bots..." 
              className="pl-10 pr-20 py-6 h-12 w-full md:w-[300px]"
            />
            <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-10">
              Search
            </Button>
          </form>
        </div>
      </div>
      
      {query && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.length > 0 ? (
            results.map((bot) => (
              <BotCard
                key={bot._id.toString()}
                bot={{
                  id: bot._id.toString(),
                  name: bot.name,
                  avatar: bot.avatar || "/placeholder.svg",
                  description: bot.shortDescription || bot.description,
                  tags: bot.tags || [],
                  votes: bot.votes || 0,
                  servers: bot.servers || 0,
                  isVerified: bot.isVerified || false,
                  featured: bot.featured || false,
                  createdAt: bot.createdAt,
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No bots found matching your search criteria.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 