import { MetadataRoute } from 'next'
import { connectToDatabase } from '@/lib/mongodb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aqualist.com'
  const fixedDate = new Date('2025-04-02')
  
  const { db } = await connectToDatabase()
  const bots = await db.collection('bots')
    .find({ status: 'approved' })
    .project({ clientId: 1, updatedAt: 1 })
    .toArray()
  
  const users = await db.collection('users')
    .find({})
    .project({ discordId: 1, updatedAt: 1 })
    .limit(1000)
    .toArray()
  
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: fixedDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/bots`,
      lastModified: fixedDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/users`,
      lastModified: fixedDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: fixedDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: fixedDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: fixedDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: fixedDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: fixedDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]
  
  const botRoutes = bots.map((bot) => ({
    url: `${baseUrl}/bots/${bot.clientId}`,
    lastModified: fixedDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  const userRoutes = users.map((user) => ({
    url: `${baseUrl}/users/${user.discordId}`,
    lastModified: fixedDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
  
  return [...routes, ...botRoutes, ...userRoutes]
} 