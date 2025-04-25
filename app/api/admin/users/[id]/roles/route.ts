import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { UserRole } from "@/lib/models/user"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) { 
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    const adminUser = await db.collection("users").findOne({ discordId: session.user.discordId })

    if (!adminUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const hasAccess =
      adminUser.roles && (adminUser.roles.includes(UserRole.ADMIN) || adminUser.roles.includes(UserRole.BOT_FOUNDER))

    if (!hasAccess) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { roles } = await request.json()

    if (!Array.isArray(roles)) {
      return NextResponse.json({ error: "Roles must be an array" }, { status: 400 })
    }

    const validRoles = Object.values(UserRole)
    const invalidRoles = roles.filter((role) => !validRoles.includes(role))

    if (invalidRoles.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid roles: ${invalidRoles.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const userToUpdate = await db.collection("users").findOne({
      _id: new ObjectId(params.id),
    })

    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!adminUser.roles.includes(UserRole.BOT_FOUNDER)) {
      if (roles.includes(UserRole.BOT_FOUNDER) && !userToUpdate.roles?.includes(UserRole.BOT_FOUNDER)) {
        return NextResponse.json(
          {
            error: "Only founders can assign the founder role",
          },
          { status: 403 },
        )
      }

      if (!roles.includes(UserRole.BOT_FOUNDER) && userToUpdate.roles?.includes(UserRole.BOT_FOUNDER)) {
        return NextResponse.json(
          {
            error: "Only founders can remove the founder role",
          },
          { status: 403 },
        )
      }
    }

    await db.collection("users").updateOne({ _id: new ObjectId(params.id) }, { $set: { roles: roles } })

    return NextResponse.json({
      message: "User roles updated successfully",
    })
  } catch (error) {
    console.error("Error updating user roles:", error)
    return NextResponse.json({ error: "Failed to update user roles" }, { status: 500 })
  }
}

