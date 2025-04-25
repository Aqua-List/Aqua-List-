"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, TrendingUp, Clock, Star, 
  ArrowUp, Users, Bot, Award
} from "lucide-react"

export default function TrendingBotsPage() {
  const [timeframe, setTimeframe] = useState("today")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl py-12 px-4">
       
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Trending Discord Bots
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the fastest-growing and most popular bots in our community
          </p>
        </div>

       
        <Card className="mb-8 border-border/40 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
            <CardTitle className="text-xl">Trending Timeframes</CardTitle>
            <CardDescription>
              View trending bots across different time periods
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="today" className="w-full" onValueChange={setTimeframe}>
              <TabsList className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <TabsTrigger value="today" className="w-full">Today</TabsTrigger>
                <TabsTrigger value="week" className="w-full">This Week</TabsTrigger>
                <TabsTrigger value="month" className="w-full">This Month</TabsTrigger>
                <TabsTrigger value="alltime" className="w-full">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        
        <Card className="border-border/40 shadow-sm overflow-hidden bg-gradient-to-br from-amber-500/5 to-amber-500/20">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-amber-500/10 p-4 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trending Bots Feature Coming Soon</h3>
            <p className="text-muted-foreground max-w-lg mb-6">
              We're currently working on bringing you real-time trending bot statistics.
              Soon you'll be able to discover the most popular and fastest-growing Discord bots!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-6">
              <Card className="bg-background/50">
                <CardContent className="p-4 text-center">
                  <Users className="h-5 w-5 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm font-medium">User Growth</p>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="p-4 text-center">
                  <Star className="h-5 w-5 mx-auto mb-2 text-sky-500" />
                  <p className="text-sm font-medium">Popularity</p>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="p-4 text-center">
                  <Award className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                  <p className="text-sm font-medium">Rankings</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                Get Notified
              </Button>
              <Button variant="outline">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 