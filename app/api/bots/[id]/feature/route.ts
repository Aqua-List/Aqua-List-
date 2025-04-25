import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const botId = params.id
    
    const bot = await db.collection("bots").findOne({ 
      _id: new ObjectId(botId) 
    })
    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }
    
    const featured = !bot.featured
    
    await db.collection("bots").updateOne(
      { _id: new ObjectId(botId) },
      { $set: { featured, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ 
      success: true, 
      featured,
      message: featured ? "Bot is now featured" : "Bot is no longer featured"
    })
  } catch (error) {
    console.error("Error featuring bot:", error)
    return NextResponse.json({ error: "Failed to update featured status" }, { status: 500 })
  }
} 