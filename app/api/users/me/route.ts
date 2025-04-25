import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    let user = await db.collection("users").findOne({
      discordId: session.user.discordId,
    })

    if (!user) {
      const newUser = {
        username: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
        discordId: session.user.discordId,
        bio: "",
        website: "",
        github: "",
        linkedin: "",
        twitter: "",
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await db.collection("users").insertOne(newUser)
      user = {
        _id: result.insertedId,
        ...newUser,
      }
    }

    const { password, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const data = await request.json()

    const updateData: any = {
      bio: data.bio,
      website: data.website,
      github: data.github,
      linkedin: data.linkedin,
      twitter: data.twitter,
      updatedAt: new Date(),
    }

    await db.collection("users").updateOne({ discordId: session.user.discordId }, { $set: updateData })

    return NextResponse.json({
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
