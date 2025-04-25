import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { getUserDiscordRoles } from "@/lib/discord-api"

export async function GET(request: Request, { params }: { params: { discordId: string } }) {
  try {
    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({
      discordId: params.discordId,
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let discordRoles = user.discordRoles || []

    if (process.env.DISCORD_SERVER_ID) {
      try {
        const roles = await getUserDiscordRoles(params.discordId, process.env.DISCORD_SERVER_ID)
        if (roles) {
          discordRoles = roles

          await db.collection("users").updateOne({ discordId: params.discordId }, { $set: { discordRoles: roles } })
        }
      } catch (error) {
        console.error("Error fetching Discord roles:", error)
      }
    }

    const { password, ...safeUser } = user

    return NextResponse.json({
      ...safeUser,
      discordRoles,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { discordId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({
      discordId: params.discordId,
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.discordId !== session.user.discordId && !session.user.roles?.includes("admin")) {
      return NextResponse.json({ error: "You don't have permission to update this user" }, { status: 403 })
    }

    const data = await request.json()

    const updateData: any = {
      bio: data.bio,
      website: data.website,
      github: data.github,
      linkedin: data.linkedin,
      twitter: data.twitter,
      updatedAt: new Date(),
    }

    if (session.user.roles?.includes("admin")) {
      if (data.isAdmin !== undefined) {
        updateData.isAdmin = data.isAdmin
      }

      if (data.roles !== undefined) {
        updateData.roles = data.roles
      }
    }

    await db.collection("users").updateOne({ discordId: params.discordId }, { $set: updateData })

    return NextResponse.json({
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
