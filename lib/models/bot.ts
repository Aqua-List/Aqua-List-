export interface Bot {
  id: string
  clientId: string
  name: string
  avatar: string
  description: string
  longDescription: string
  prefix: string
  tags: string[]
  votes: number
  servers: number
  website?: string
  supportServer?: string
  githubRepo?: string
  inviteUrl: string
  status: "pending" | "approved" | "rejected"
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface BotCommand {
  name: string
  description: string
}

