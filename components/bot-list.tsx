import Image from "next/image"
import Link from "next/link"
import { Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BotList() {
    
  const bots = [
    {
      id: "1",
      name: "MusicMaster",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "High quality music bot with support for Spotify, YouTube, and more.",
      tags: ["Music", "Entertainment"],
      servers: 12500,
      rating: 4.8,
      verified: true,
    },
    {
      id: "2",
      name: "ModeratorPro",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "Advanced moderation with auto-mod, logging, and customizable commands.",
      tags: ["Moderation", "Utility"],
      servers: 8700,
      rating: 4.6,
      verified: true,
    },
    {
      id: "3",
      name: "GameStats",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "Track game stats and leaderboards for popular games right in your server.",
      tags: ["Gaming", "Stats"],
      servers: 5300,
      rating: 4.5,
      verified: false,
    },
    {
      id: "4",
      name: "EventPlanner",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "Create and manage events with RSVPs, reminders, and scheduling.",
      tags: ["Utility", "Organization"],
      servers: 3200,
      rating: 4.3,
      verified: false,
    },
    {
      id: "5",
      name: "EconomySimulator",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "Full-featured economy system with currency, jobs, shops, and more.",
      tags: ["Economy", "Games"],
      servers: 7800,
      rating: 4.7,
      verified: true,
    },
    {
      id: "6",
      name: "WelcomeBot",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "Customizable welcome messages with images, roles, and more.",
      tags: ["Utility", "Moderation"],
      servers: 9500,
      rating: 4.4,
      verified: false,
    },
    {
      id: "7",
      name: "PollMaker",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "Create polls and surveys with multiple options and real-time results.",
      tags: ["Utility", "Interaction"],
      servers: 4100,
      rating: 4.2,
      verified: false,
    },
    {
      id: "8",
      name: "GiveawayBot",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "Host giveaways with customizable duration, requirements, and multiple winners.",
      tags: ["Giveaways", "Community"],
      servers: 6700,
      rating: 4.6,
      verified: true,
    },
    {
      id: "9",
      name: "LevelUp",
      avatar: "/placeholder.svg?height=80&width=80",
      description: "XP and leveling system with customizable rewards, leaderboards, and more.",
      tags: ["Levels", "Rewards"],
      servers: 5900,
      rating: 4.5,
      verified: false,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bots.map((bot) => (
        <Card key={bot.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Image
              src={bot.avatar || "/placeholder.svg"}
              alt={bot.name}
              width={60}
              height={60}
              className="rounded-full border"
            />
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{bot.name}</CardTitle>
                {bot.verified && (
                  <Badge variant="secondary" className="ml-2">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{bot.servers.toLocaleString()} servers</span>
                <span className="flex items-center gap-1 ml-2">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  {bot.rating}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm line-clamp-2 min-h-[40px]">{bot.description}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-3">
              {bot.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/bots/${bot.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Button size="sm">Add to Server</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

