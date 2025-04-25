import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    
    const user = await db.collection("users").findOne(
      { discordId: params.id }
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error in GET /api/users/[id]/profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if ((session.user as any).id !== params.id) {
      return NextResponse.json({ 
        error: "Forbidden - You can only update your own profile" 
      }, { status: 403 })
    }

    const { db } = await connectToDatabase()
    const data = await request.json()

    const result = await db.collection("users").updateOne(
      { discordId: params.id },
      { 
        $set: {
          bio: data.bio,
          website: data.website,
          github: data.github,
          twitter: data.twitter,
          linkedin: data.linkedin,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    if (!result.acknowledged) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 400 })
    }

    return NextResponse.json({ 
      message: "Profile updated successfully",
      success: true 
    })

  } catch (error) {
    console.error("Error in PUT /api/users/[id]/profile:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 