import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"
import { ObjectId } from "mongodb"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

  
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ discordId: session.user.discordId })

    if (!user || !(
      user.roles?.includes(UserRole.ADMIN) || 
      user.roles?.includes(UserRole.BOT_REVIEWER) || 
      user.roles?.includes(UserRole.BOT_FOUNDER)
    )) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

  
    const botId = await params.id
    let query = {}
    
 
    if (/^[0-9a-fA-F]{24}$/.test(botId)) {
      query = { _id: new ObjectId(botId) }
    } else {
      
      query = { clientId: botId }
    }
    
    const bot = await db.collection("bots").findOne(query)

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    
    const featured = !bot.featured

    
    await db.collection("bots").updateOne(
      { _id: bot._id },
      { $set: { featured, updatedAt: new Date() } }
    )

   
    const url = new URL(request.url)
    const redirectUrl = url.searchParams.get('redirect')
    
    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    return NextResponse.json({ 
      success: true, 
      featured,
      message: featured ? "Bot has been featured" : "Bot has been unfeatured" 
    })
  } catch (error) {
    console.error("Error featuring/unfeaturing bot:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 