import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"

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

export async function POST(request: NextRequest) {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("partners").insertOne(partner)

    return NextResponse.json(
      { message: "Partner created successfully", id: result.insertedId },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating partner:", error)
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
} 