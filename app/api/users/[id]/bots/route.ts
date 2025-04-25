import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const paramsResolved = await params
    const id = paramsResolved.id
    
    if (!session || session.user.discordId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { db } = await connectToDatabase()
    
    const bots = await db
      .collection("bots")
      .find({ ownerId: id })
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ bots })
  } catch (error) {
    console.error("Error fetching user bots:", error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
} 