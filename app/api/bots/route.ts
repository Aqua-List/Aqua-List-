import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { getUserInfo } from "@/lib/discord-api"
import { sendDiscordNotification } from "@/lib/discord-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const tag = searchParams.get("tag") || ""
    const sort = searchParams.get("sort") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const { db } = await connectToDatabase()

    const filter: any = { status: "approved" }
    if (query) {
      filter.$or = [{ name: { $regex: query, $options: "i" } }, { description: { $regex: query, $options: "i" } }]
    }
    if (tag) {
      filter.tags = tag
    }

    let sortOptions: any = {}
    switch (sort) {
      case "popular":
        sortOptions = { votes: -1 }
        break
      case "servers":
        sortOptions = { servers: -1 }
        break
      case "newest":
      default:
        sortOptions = { createdAt: -1 }
    }

    const bots = await db
      .collection("bots")
      .find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await db.collection("bots").countDocuments(filter)

    return NextResponse.json({
      bots,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching bots:", error)
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 })
  }
}


const galaxyApiCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000;


async function fetchGalaxyBotData(botId: string) {

  const cachedData = galaxyApiCache.get(botId);
  if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
    return cachedData.data;
  }
  
  try {
    const response = await fetch(`https://galaxy-api-gets.vercel.app/bot/${botId}`);
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    galaxyApiCache.set(botId, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error("Error fetching from Galaxy API:", error);
    return null;
  }
}

async function fetchBotData(botId: string) {
  try {
    const response = await fetch(`https://galaxy-api-gets.vercel.app/bot/${botId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch bot data')
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching from Galaxy API:", error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const data = await request.json()

    if (!data.clientId || !data.description || !data.longDescription || !data.prefix) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const apiData = await fetchBotData(data.clientId)
    
    const botInfo = apiData?.bot || {}
    const appInfo = apiData?.application || {}
    
    const bot = {
      _id: data.clientId,
      clientId: data.clientId,
      name: botInfo.username || appInfo.name || data.name || "Unnamed Bot",
      discriminator: botInfo.discriminator || "",
      avatar: (botInfo.avatar || appInfo.icon) 
        ? `https://cdn.discordapp.com/avatars/${data.clientId}/${botInfo.avatar || appInfo.icon}.png` 
        : null,
      description: data.description,
      longDescription: data.longDescription,
      prefix: data.prefix,
      tags: data.tags || [],
      votes: 0,
      servers: botInfo.approximate_guild_count || 0,
      website: data.website || null,
      supportServer: data.supportServer || null,
      githubRepo: data.githubRepo || null,
      inviteUrl: data.inviteUrl || `https://discord.com/oauth2/authorize?client_id=${data.clientId}&scope=bot%20applications.commands&permissions=0`,
      status: "pending",
      ownerId: session.user.discordId, 
      ownerUsername: session.user.name || "Unknown",
      isVerified: appInfo.is_verified || false,
      botPublic: appInfo.bot_public || botInfo.bot || true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("bots").insertOne(bot)
   
    try {
      await sendDiscordNotification({
        type: "bot_submit",
        botId: bot.clientId,
        botName: bot.name,
        userId: bot.ownerId,
        username: bot.ownerUsername,
      })
    } catch (error) {
      console.error("Failed to send Discord notification:", error)
    }

    return NextResponse.json({ success: true, bot }, { status: 201 })
  } catch (error) {
    console.error("Error submitting bot:", error)
    return NextResponse.json(
      { error: "Failed to submit bot" }, 
      { status: 500 }
    )
  }
}
