import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { fetchBotData, isBotVerified } from "@/lib/discord-api"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to refresh bot information" },
        { status: 401 }
      )
    }
    
    const { db } = await connectToDatabase()
    const botId = params.id
    
    const bot = await db.collection("bots").findOne({ clientId: botId })
    
    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found" },
        { status: 404 }
      )
    }
    
    if (bot.ownerId !== session.user.discordId) {
      return NextResponse.json(
        { error: "You don't have permission to refresh this bot" },
        { status: 403 }
      )
    }
    
    const galaxyData = await fetchBotData(botId)
    
    if (!galaxyData) {
      return NextResponse.json(
        { error: "Failed to fetch bot data from Discord" },
        { status: 500 }
      )
    }
    
    const isVerified = await isBotVerified(botId)
    
    const updates: {
      name?: string;
      avatar?: string | null;
      servers?: number;
      isVerified?: boolean;
    } = {};

    if (galaxyData.bot.username !== bot.name) {
      updates.name = galaxyData.bot.username;
    }

    const newAvatar = galaxyData.bot.avatar ? 
      `https://cdn.discordapp.com/avatars/${botId}/${galaxyData.bot.avatar}.png` : 
      null;
    if (newAvatar !== bot.avatar) {
      updates.avatar = newAvatar;
    }

    if (galaxyData.bot.approximate_guild_count !== bot.servers) {
      updates.servers = galaxyData.bot.approximate_guild_count || 0;
    }
    
    if (isVerified !== bot.isVerified) {
      updates.isVerified = isVerified;
    }

    const updateData = {
      name: galaxyData.bot.username,
      discriminator: galaxyData.bot.discriminator,
      avatar: newAvatar,
      servers: galaxyData.bot.approximate_guild_count || bot.servers || 0,
      isVerified: isVerified,
      updatedAt: new Date()
    }
    
    await db.collection("bots").updateOne(
      { clientId: botId },
      { $set: updateData }
    )
    
    return NextResponse.json({ 
      success: true,
      message: "Bot information refreshed successfully",
      updates: Object.keys(updates).length > 0 ? updates : null,
      bot: {
        ...bot,
        ...updateData
      }
    })
  } catch (error) {
    console.error("Error refreshing bot:", error)
    return NextResponse.json(
      { error: "Failed to refresh bot information" },
      { status: 500 }
    )
  }
} 