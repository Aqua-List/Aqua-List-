import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { getServerCount } from "@/lib/discord-api"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VoteButton } from "@/components/vote-button"
import { BotStats } from "@/components/bot-stats"
import { Markdown } from "@/components/markdown"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserRole } from "@/lib/models/user"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ExternalLink, Share2, Flag, MessageSquare, Code, Shield, Zap, Bot, CheckCircle, Globe, Github, Edit, RefreshCw, Calendar, Plus, MessageCircle, Globe as GlobeIcon, Star, Terminal, FileText, User, Hash, ThumbsUp, Facebook, Twitter, Linkedin, Link2, LogIn } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ShareButton } from "@/components/share-button"
import { toast } from "sonner"
import { RefreshButton } from "@/components/refresh-button"
import ReactMarkdown from "react-markdown"
import { getBotById } from '@/lib/actions/bot'
import { SocialShare } from "@/components/social-share"

interface PageProps {
  params: {
    id: string
  }
}

interface Bot {
  _id: any
  clientId: string
  name: string
  description: string
  longDescription?: string
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
  rejectionReason?: string
  owner: {
    id: string
    username: string
    avatar: string
  }
  banner?: string
  shortDescription?: string
  commands?: any[]
  reviews?: any[]
  updates?: any[]
  shards?: number
  featured?: boolean
}

async function getBot(id: string): Promise<Bot | null> {
  const { db } = await connectToDatabase()

  const bot = await db.collection("bots").findOne({
    clientId: id,
  })

  if (!bot) {
    return null
  }

  const owner = await db.collection("users").findOne({
    discordId: bot.ownerId,
  })

  let serverCount = bot.servers || 0
  try {
    const count = await getServerCount(bot.clientId)
    if (count && count > 0) {
      await db.collection("bots").updateOne({ clientId: id }, { $set: { servers: count } })
      serverCount = count
    }
  } catch (error) {
    console.error("Failed to get server count:", error)
  }

  const typedBot: Bot = {
    _id: bot._id,
    clientId: bot.clientId,
    name: bot.name,
    description: bot.description,
    longDescription: bot.longDescription,
    avatar: bot.avatar,
    ownerId: bot.ownerId,
    ownerUsername: bot.ownerUsername,
    prefix: bot.prefix,
    tags: bot.tags || [],
    votes: bot.votes || 0,
    servers: serverCount,
    inviteUrl: bot.inviteUrl,
    website: bot.website,
    supportServer: bot.supportServer,
    githubRepo: bot.githubRepo,
    status: bot.status,
    isVerified: bot.isVerified || false,
    createdAt: bot.createdAt,
    rejectionReason: bot.rejectionReason,
    owner: owner
      ? {
          id: owner.discordId,
          username: owner.username,
          avatar: owner.avatar || "/placeholder.svg?height=50&width=50",
        }
      : {
          id: "unknown",
          username: "Unknown User",
          avatar: "/placeholder.svg?height=50&width=50",
        },
    banner: bot.banner,
    shortDescription: bot.shortDescription,
    commands: bot.commands,
    reviews: bot.reviews,
    updates: bot.updates,
    shards: bot.shards,
    featured: bot.featured,
  }

  return typedBot
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const bot = await getBotById(params.id)
  
  if (!bot) {
    return {
      title: 'Bot Not Found - AquaList',
      description: 'The requested Discord bot could not be found.',
    }
  }

  return {
    title: `${bot.name} - Discord Bot | AquaList`,
    description: bot.shortDescription || 'A Discord bot listed on AquaList',
    keywords: [...(bot.tags || []), 'discord bot', 'bot commands', 'discord automation'],
    openGraph: {
      title: `${bot.name} - Discord Bot`,
      description: bot.shortDescription,
      images: [
        {
          url: bot.avatarUrl || '/default-bot-avatar.png',
          width: 512,
          height: 512,
          alt: `${bot.name} Avatar`,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${bot.name} - Discord Bot`,
      description: bot.shortDescription,
      images: [bot.avatarUrl || '/default-bot-avatar.png'],
    },
  }
}

export default async function BotPage({ params }: PageProps) {
  const id = await Promise.resolve(params.id);
  
  const session = await getServerSession(authOptions)
  const bot = await getBot(id)

  if (!bot) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-sky-500"></div>
        
        <div className="relative z-10 flex items-center p-8 md:p-12">
          <div className="flex items-center">
            <div className="relative mr-6">
              <Image
                src={bot.avatar || "/placeholder-bot.png"}
                alt={bot.name}
                width={128}
                height={128}
                className="rounded-full border-4 border-white/20 w-24 h-24 md:w-32 md:h-32 object-cover"
              />
              {bot.isVerified && (
                <div className="absolute bottom-0 right-0 bg-white text-primary p-1 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{bot.name}</h1>
                {bot.status === "approved" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" /> Approved
                  </span>
                )}
                {bot.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-400/20 text-amber-400">
                    <Star className="w-3 h-3 mr-1 fill-amber-400" /> Featured
                  </span>
                )}
              </div>
              <p className="text-white/90 mb-6 max-w-2xl">{bot.description}</p>
              
              <div className="flex gap-3">
                <a
                  href={bot.inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white text-primary font-medium hover:bg-white/90 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add to Server
                </a>
                
                {bot.supportServer && (
                  <a
                    href={bot.supportServer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white/20 text-white border border-white/30 font-medium hover:bg-white/30 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Support Server
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex ml-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <div className="flex flex-col items-center px-4">
              <div className="text-3xl font-bold">{bot.votes || 0}</div>
              <div className="text-sm text-white/70">Votes</div>
            </div>
            <div className="flex flex-col items-center px-4 border-l border-white/20">
              <div className="text-3xl font-bold">{bot.servers || 0}</div>
              <div className="text-sm text-white/70">Servers</div>
            </div>
            <div className="flex flex-col items-center px-4 border-l border-white/20">
              <div className="text-3xl font-bold">{bot.shards || 1}</div>
              <div className="text-sm text-white/70">Shards</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" /> About
            </h2>
            <div className="prose prose-sm max-w-none">
              {bot.longDescription ? (
                <ReactMarkdown>{bot.longDescription}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">No detailed description provided.</p>
              )}
            </div>
          </div>
          
          {bot.commands && bot.commands.length > 0 && (
            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
              <h2 className="text-2xl font-bold mb-4 text-card-foreground flex items-center">
                <Terminal className="w-5 h-5 mr-2 text-primary" /> Commands
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bot.commands.slice(0, 6).map((command: any, index: number) => (
                  <div key={index} className="bg-muted p-4 rounded-lg">
                    <div className="font-mono text-sm bg-background px-2 py-1 rounded inline-block mb-2 text-primary">
                      {bot.prefix}{command.name}
                    </div>
                    <p className="text-sm text-muted-foreground">{command.description}</p>
                  </div>
                ))}
              </div>
              {bot.commands.length > 6 && (
                <div className="mt-4 text-center">
                  <button className="text-primary hover:text-primary/80 font-medium">
                    View all {bot.commands.length} commands
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <h2 className="text-2xl font-bold mb-4 text-card-foreground flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" /> Reviews
            </h2>
            
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-2" />
              <p className="text-muted-foreground">Reviews feature coming soon!</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                We're working on adding reviews to help you discover the best bots.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Bot Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-muted-foreground mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Owner</div>
                  <div className="font-medium">{bot.owner.username}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-muted-foreground mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Added on</div>
                  <div className="font-medium">
                    {bot.createdAt ? new Date(bot.createdAt).toLocaleDateString() : "Unknown"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Hash className="w-5 h-5 text-muted-foreground mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Prefix</div>
                  <div className="font-mono bg-muted px-2 py-0.5 rounded text-sm inline-block">
                    {bot.prefix}
                  </div>
                </div>
              </div>
              
              {bot.tags && bot.tags.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {bot.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-primary rounded-xl p-6 shadow-md text-white">
            <h2 className="text-xl font-bold mb-4">Support This Bot</h2>
            <p className="text-white/80 mb-4 text-sm">
              Voting helps this bot gain visibility and supports the developer.
            </p>
            
            <VoteButton 
              botId={bot.clientId} 
              botName={bot.name} 
              initialVotes={bot.votes || 0} 
            />
            
            <div className="mt-4 text-center text-white/80 text-sm">
              {bot.votes || 0} votes this month
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Share</h2>
            <SocialShare botId={bot.clientId} botName={bot.name} />
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">Report</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Found something inappropriate or incorrect about this bot?
            </p>
            <button 
              className="w-full border border-destructive/30 text-destructive font-medium py-2 rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center opacity-70 cursor-not-allowed"
              disabled
            >
              <Flag className="w-4 h-4 mr-2" /> Report Feature Coming Soon
            </button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              We're working on adding reporting functionality to keep our platform safe.
            </p>
          </div>
        </div>
      </div>
      
      {session?.user?.discordId === bot.ownerId && (
        <div className="fixed bottom-6 right-6 flex gap-2">
          <RefreshButton botId={id} />
          <Link 
            href={`/bots/${id}/edit`}
            className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
          >
            <Edit className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  )
}
