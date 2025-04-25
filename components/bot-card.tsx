"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, ExternalLink, Flame, Heart, Server, Star, ThumbsUp, Users, Zap } from "lucide-react"
import { cn, formatNumber } from "@/lib/utils"

interface Bot {
  id: string
  name: string
  avatar: string
  description: string
  tags?: string[]
  votes?: number
  servers?: number
  isVerified?: boolean
  featured?: boolean
  createdAt?: Date
}

interface BotCardProps {
  bot: Bot
  variant?: "default" | "featured" | "compact"
}

export function BotCard({ bot, variant = "default" }: BotCardProps) {
  const isNew = bot.createdAt && (new Date().getTime() - new Date(bot.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000)
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/bots/${bot.id}`}>
        <Card className={cn(
          "h-full overflow-hidden transition-all duration-300",
          "border-border/40 hover:border-primary/50 hover:shadow-lg",
          variant === "featured" && "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent",
          variant === "compact" && "max-w-sm"
        )}>
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Card header with avatar and badges */}
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className={cn(
                      "rounded-xl border-2 border-background shadow-md",
                      variant === "compact" ? "h-10 w-10" : "h-14 w-14"
                    )}>
                      <AvatarImage src={bot.avatar} alt={bot.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium rounded-xl">
                        {bot.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {bot.isVerified === true && (
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                        <Check className="h-4 w-4 text-primary fill-primary" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <CardTitle className={cn(
                      "font-semibold flex items-center gap-1.5",
                      variant === "compact" ? "text-sm" : "text-base"
                    )}>
                      {bot.name}
                      {bot.isVerified === true && (
                        <div className="inline-flex items-center">
                          <Check className="h-4 w-4 text-primary fill-primary" />
                        </div>
                      )}
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {bot.tags && bot.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                          {tag}
                        </Badge>
                      ))}
                      {bot.tags && bot.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                          +{bot.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  {bot.featured === true && (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 h-5 px-1.5">
                      <Flame className="h-3 w-3 mr-0.5" />
                      <span className="text-xs">Featured</span>
                    </Badge>
                  )}
                  
                  {isNew && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 h-5 px-1.5">
                      <Zap className="h-3 w-3 mr-0.5" />
                      <span className="text-xs">New</span>
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {/* Card content with description */}
            <CardContent className={cn(
              "p-4",
              variant === "compact" ? "pt-2 pb-3" : "pt-3 pb-4"
            )}>
              <CardDescription className={cn(
                "line-clamp-2",
                variant === "compact" ? "text-xs min-h-[32px]" : "min-h-[40px]"
              )}>
                {bot.description}
              </CardDescription>
            </CardContent>
            
            {/* Card footer with stats and view button */}
            <CardFooter className={cn(
              "px-4 py-3 bg-muted/30 border-t border-border/30 flex justify-between items-center",
              variant === "compact" && "py-2"
            )}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart className="h-3.5 w-3.5 text-red-400" />
                  <span>{formatNumber(bot.votes || 0)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-blue-400" />
                  <span>{formatNumber(bot.servers || 0)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {bot.createdAt && (
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(bot.createdAt), { addSuffix: true })}
                  </div>
                )}
                
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  View <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
