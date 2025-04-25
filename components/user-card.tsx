import Link from "next/link"
import Image from "next/image"
import { Bot, Github, Globe, Linkedin, Twitter } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UserCardProps {
  user: {
    id: string
    discordId: string
    username: string
    avatar: string
    bio?: string
    website?: string
    github?: string
    linkedin?: string
    twitter?: string
    isAdmin?: boolean
    botCount?: number
  }
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src={user.avatar || "/placeholder.svg?height=80&width=80"}
            alt={user.username}
            width={80}
            height={80}
            className="rounded-full mb-4"
          />
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-bold text-lg">{user.username}</h3>
              {user.isAdmin && <Badge variant="secondary">Admin</Badge>}
            </div>
            {user.bio && <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>}
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Bot className="h-3.5 w-3.5" />
              <span>{user.botCount || 0} bots</span>
            </div>
          </div>

          {/* Social Links */}
          {(user.website || user.github || user.linkedin || user.twitter) && (
            <div className="flex justify-center gap-3 mt-4">
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {user.twitter && (
                <a
                  href={user.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-center">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/users/discord/${user.discordId}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

