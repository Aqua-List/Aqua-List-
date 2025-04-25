import { connectToDatabase } from "@/lib/mongodb"

export async function getBotById(id: string) {
  try {
    const { db } = await connectToDatabase()
    const bot = await db.collection("bots").findOne({ clientId: id })
    return bot
  } catch (error) {
    console.error("Error fetching bot:", error)
    return null
  }
} 