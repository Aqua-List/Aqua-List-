import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const response = await fetch(`http://localhost:${process.env.BOT_PORT || 3001}/api/discord-bot/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Discord bot API error: ${response.status} ${response.statusText}`)
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent to Discord bot",
    })
  } catch (error) {
    console.error("Error sending notification to Discord bot:", error)
    return NextResponse.json({ error: "Failed to send notification to Discord bot" }, { status: 500 })
  }
}
