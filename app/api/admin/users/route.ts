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

    const hasAccess = user.roles && (user.roles.includes(UserRole.ADMIN) || user.roles.includes(UserRole.BOT_FOUNDER))

    if (!hasAccess) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const users = await db.collection("users").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

