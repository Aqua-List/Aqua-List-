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

export async function POST(
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

    const url = new URL(request.url)
    const redirectUrl = url.searchParams.get("redirect")

    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl, url.origin))
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