import { connectToDatabase } from "@/lib/mongodb"

export async function getUserById(id: string) {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ discordId: id })
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
} 