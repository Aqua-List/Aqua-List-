import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"
import { sendDiscordNotification } from "@/lib/discord-api"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ discordId: session.user.discordId })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const hasAccess =
      user.roles &&
      (user.roles.includes(UserRole.ADMIN) ||
        user.roles.includes(UserRole.BOT_REVIEWER) ||
        user.roles.includes(UserRole.BOT_FOUNDER))

    if (!hasAccess) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

       
    const id = params.id

    
    const bot = await db.collection("bots").findOne({
      clientId: id,
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    await db.collection("bots").updateOne(
      { clientId: id },
      {
        $set: {
          status: "approved",
          approvedAt: new Date(),
          approvedBy: session.user.discordId,
        },
      },
    )

    
    if (bot.ownerId) {
      await db.collection("users").updateOne(
        { discordId: bot.ownerId },
        {
          $addToSet: { roles: UserRole.DEVELOPER },
        },
      )
    }

    
    try {
      await sendDiscordNotification({
        type: "bot_approved",
        botId: bot.clientId,
        botName: bot.name,
        userId: bot.ownerId,
        username: bot.ownerUsername,
        approvedBy: session.user.name,
      })
    } catch (error) {
      console.error("Failed to send Discord notification:", error)
     
    }

    return NextResponse.json({
      message: "Bot approved successfully",
    })
  } catch (error) {
    console.error("Error approving bot:", error)
    return NextResponse.json({ error: "Failed to approve bot" }, { status: 500 })
  }
}

