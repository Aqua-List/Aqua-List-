import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { sendDiscordNotification } from "@/lib/discord-api"
import { NextRequest } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { db } = await connectToDatabase()
    const userId = session?.user?.id

    const botId = params.id

    const bot = await db.collection("bots").findOne({ clientId: botId })
    if (!bot) {
      return NextResponse.json({ canVote: false, error: "Bot not found" })
    }

    if (!session) {
      return NextResponse.json({ canVote: false, error: "Login required" })
    }

    if (bot.ownerId === userId) {
      return NextResponse.json({ canVote: false, error: "Cannot vote for your own bot" })
    }

    const existingVote = await db.collection("votes").findOne({
      botId,
      userId,
      timestamp: { $gt: new Date(Date.now() - 12 * 60 * 60 * 1000) }
    })

    if (existingVote) {
      const timeLeft = Math.ceil((existingVote.timestamp.getTime() + (12 * 60 * 60 * 1000) - Date.now()) / 1000)
      return NextResponse.json({
        canVote: false,
        timeLeft,
        nextVoteTime: new Date(existingVote.timestamp.getTime() + (12 * 60 * 60 * 1000))
      })
    }

    return NextResponse.json({ canVote: true })
  } catch (error) {
    console.error("Error checking vote status:", error)
    return NextResponse.json({ error: "Failed to check vote status" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in to vote" },
        { status: 401 }
      )
    }

    const { db } = await connectToDatabase()

    const bot = await db.collection("bots").findOne({
      clientId: params.id,
    })

    if (!bot) {
      return NextResponse.json(
        { message: "Bot not found" },
        { status: 404 }
      )
    }

    const existingVote = await db.collection("votes").findOne({
      botId: params.id,
      userId: session.user.discordId,
      timestamp: { $gt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    })

    if (existingVote) {
      const nextVoteTime = new Date(existingVote.timestamp.getTime() + 12 * 60 * 60 * 1000)
      
      return NextResponse.json(
        { 
          message: "You have already voted for this bot recently",
          nextVoteTime: nextVoteTime
        },
        { status: 429 }
      )
    }

    await db.collection("votes").insertOne({
      botId: params.id,
      userId: session.user.discordId,
      timestamp: new Date(),
    })

    await db.collection("bots").updateOne(
      { clientId: params.id },
      { $inc: { votes: 1 } }
    )

    const updatedBot = await db.collection("bots").findOne({
      clientId: params.id,
    })

    await sendDiscordNotification({
      type: "vote",
      botId: params.id,
      botName: bot.name,
      userId: session.user.discordId,
      username: session.user.name
    })

    return NextResponse.json(
      { 
        message: "Vote recorded successfully",
        totalVotes: updatedBot?.votes || 1
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error recording vote:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
