import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"

export async function GET(request: Request) {
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
        user.roles.includes(UserRole.BOT_FOUNDER) ||
        user.roles.includes(UserRole.SUPPORT))

    if (!hasAccess) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const usersCount = await db.collection("users").countDocuments()
    const botsCount = await db.collection("bots").countDocuments({ status: "approved" })
    const pendingBotsCount = await db.collection("bots").countDocuments({ status: "pending" })
    const votesCount = await db.collection("votes").countDocuments()

    const botCategories = await db
      .collection("bots")
      .aggregate([
        { $match: { status: "approved" } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, name: "$_id", count: 1 } },
      ])
      .toArray()

    const recentActivity = [
      {
        type: "Bot Approved",
        description: "Bot 'MusicMaster' was approved",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        type: "Bot Submitted",
        description: "New bot 'ModeratorPro' was submitted",
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        type: "User Joined",
        description: "New user 'DiscordFan123' joined",
        timestamp: new Date(Date.now() - 86400000),
      },
    ]

    return NextResponse.json({
      users: usersCount,
      bots: botsCount,
      pendingBots: pendingBotsCount,
      votes: votesCount,
      botCategories,
      recentActivity,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}

