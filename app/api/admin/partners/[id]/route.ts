import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"
import { ObjectId } from "mongodb"

async function isAdminOrFounder(userId: string) {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ discordId: userId })

  if (!user) return false

  
  const hasAccess =
    user.roles &&
    (user.roles.includes(UserRole.ADMIN) ||
      user.roles.includes(UserRole.BOT_FOUNDER))

  return hasAccess
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const canManagePartners = await isAdminOrFounder(session.user.discordId)

    if (!canManagePartners) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()

    if (!data.name || !data.image || !data.description || !data.url) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }
    
    try {
      new URL(data.url)
      new URL(data.image)
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid URL format" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const partner = {
      name: data.name,
      image: data.image,
      description: data.description,
      url: data.url,
      featured: data.featured || false,
      updatedAt: new Date(),
    }

    const result = await db.collection("partners").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: partner }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Partner updated successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating partner:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const canManagePartners = await isAdminOrFounder(session.user.discordId)

    if (!canManagePartners) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("partners").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Partner not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Partner deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error deleting partner:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
} 