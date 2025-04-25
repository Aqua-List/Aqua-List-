import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { sendDiscordNotification } from "@/lib/discord-api"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    
    const botId = await params.id
    
    const bot = await db.collection("bots").findOne({
      clientId: botId
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    return NextResponse.json(bot)
  } catch (error) {
    console.error("Error fetching bot:", error)
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    const botId = await params.id

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const data = await request.json()

    const bot = await db.collection("bots").findOne({
      clientId: botId
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    const userId = session.user?.id || session.user?.discordId || session.user?.email || session.user?.name
    if (userId !== bot.ownerId) {
      return NextResponse.json({ error: "You don't have permission to update this bot" }, { status: 403 })
    }

    const updateData = {
      prefix: data.prefix,
      description: data.description,
      longDescription: data.longDescription,
      tags: data.tags,
      website: data.website || "",
      supportServer: data.supportServer || "",
      githubRepo: data.githubRepo || "",
      updatedAt: new Date(),
    }

    await db.collection("bots").updateOne(
      { clientId: botId },
      { $set: updateData }
    )

    return NextResponse.json({ message: "Bot updated successfully" })
  } catch (error) {
    console.error("Error updating bot:", error)
    return NextResponse.json({ error: "Failed to update bot" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const bot = await db.collection("bots").findOne({
      clientId: params.id,
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    if (bot.ownerId !== session.user.discordId && !session.user.isAdmin) {
      return NextResponse.json({ error: "You don't have permission to delete this bot" }, { status: 403 })
    }

    await db.collection("bots").deleteOne({
      clientId: params.id
    })

    return NextResponse.json({
      message: "Bot deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting bot:", error)
    return NextResponse.json({ error: "Failed to delete bot" }, { status: 500 })
  }
}
