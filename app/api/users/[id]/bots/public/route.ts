import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paramsResolved = await params
    const id = paramsResolved.id

    const { db } = await connectToDatabase()
    
    const bots = await db
      .collection("bots")
      .find({ 
        ownerId: id,
        status: "approved" 
      })
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ bots })
  } catch (error) {
    console.error("Error fetching user bots:", error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
} 