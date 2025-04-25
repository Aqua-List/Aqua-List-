import { Bot, Shield, Star, Code, HeartHandshake, Crown, HelpCircle } from "lucide-react"

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  bio?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  discordId: string
  isAdmin: boolean
  roles: string[]
  discordRoles?: string[]
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  USER = "user",
  DEVELOPER = "developer",
  VERIFIED_BOT = "verified_bot",
  BOT_FOUNDER = "bot_founder",
  ADMIN = "admin",
  BOT_REVIEWER = "bot_reviewer",
  SUPPORT = "support",
}

export const RoleConfig = {
  [UserRole.USER]: {
    name: "User",
    color: "bg-gray-500",
    textColor: "text-gray-500",
    icon: Bot,
  },
  [UserRole.DEVELOPER]: {
    name: "Developer",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    icon: Code,
  },
  [UserRole.VERIFIED_BOT]: {
    name: "Verified Bot",
    color: "bg-green-500",
    textColor: "text-green-500",
    icon: Star,
  },
  [UserRole.BOT_FOUNDER]: {
    name: "Bot Founder",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    icon: Crown,
  },
  [UserRole.ADMIN]: {
    name: "Admin",
    color: "bg-red-500",
    textColor: "text-red-500",
    icon: Shield,
  },
  [UserRole.BOT_REVIEWER]: {
    name: "Bot Reviewer",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    icon: HeartHandshake,
  },
  [UserRole.SUPPORT]: {
    name: "Support",
    color: "bg-teal-500",
    textColor: "text-teal-500",
    icon: HelpCircle,
  },
}

