import fs from "fs"
import path from "path"

const configPath = path.join(process.cwd(), "config.json")
const configData = JSON.parse(fs.readFileSync(configPath, "utf8"))
const DISCORD_BOT_TOKEN = configData.discord.botToken
const DISCORD_USER_TOKEN = configData.discord.userToken || process.env.DISCORD_TOKEN
const DISCORD_SUPER_PROPERTIES = configData.discord.superProperties || process.env.DISCORD_SUPER_PROPERTIES || ''

export async function getServerCount(clientId: string): Promise<number | null> {
  try {
    const DISCORD_USER_TOKEN = process.env.DISCORD_TOKEN;
    
    if (!DISCORD_USER_TOKEN) {
      console.warn("DISCORD_TOKEN not set, cannot fetch server count");
      return null;
    }

    const response = await fetch(`https://discord.com/api/v10/oauth2/authorize?client_id=${clientId}&scope=bot%20applications.commands&integration_type=0`, {
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US',
        'authorization': DISCORD_USER_TOKEN,
        'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not.A.Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-discord-locale': 'en-US',
        'x-discord-timezone': 'Europe/Istanbul',
        'x-super-properties': process.env.DISCORD_SUPER_PROPERTIES || '',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      console.warn(`Discord API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data && data.bot) {
      return data.bot.approximate_guild_count || 0;
    }
    
    return 0;
  } catch (error) {
    console.error("Error fetching server count:", error);
    return null;
  }
}

export async function getUserInfo(userId: string) {
  try {
    if (!DISCORD_BOT_TOKEN) {
      throw new Error("DISCORD_BOT_TOKEN not set, cannot fetch user info")
    }

    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      username: data.username,
      discriminator: data.discriminator,
      avatar: data.avatar,
      global_name: data.global_name,
      display_name: data.global_name || data.username,
      avatarUrl: data.avatar 
        ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=256`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator) % 5}.png`
    }
  } catch (error) {
    console.error("Error fetching user info from Discord:", error)
    return null
  }
}

export async function getBotInfo(botId: string) {
  try {
    if (!DISCORD_BOT_TOKEN) {
      throw new Error("DISCORD_BOT_TOKEN not set, cannot fetch bot info")
    }

    const response = await fetch(`https://discord.com/api/v10/users/${botId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return {
      id: data.id,
      username: data.username,
      discriminator: data.discriminator,
      avatar: data.avatar,
      bot: data.bot,
      avatarUrl: data.avatar 
        ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=256`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator) % 5}.png`,
      verified: Boolean(data.public_flags & 0x10000),
    }
  } catch (error) {
    console.error("Error fetching bot info from Discord:", error)
    return null
  }
}

export async function getUserDiscordRoles(userId: string, guildId: string) {
  try {
    if (!DISCORD_BOT_TOKEN) {
      console.warn("DISCORD_BOT_TOKEN not set, cannot fetch user roles")
      return null
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      throw new Error(`Discord API error: ${response.status} ${response.statusText}`)
    }

    const memberData = await response.json()
    return memberData.roles
  } catch (error) {
    console.error("Error fetching user Discord roles:", error)
    return null
  }
}

export async function sendDiscordNotification(data: {
  type: string
  botId?: string
  botName?: string
  userId?: string
  username?: string
  reason?: string
  approvedBy?: string
}) {
  try {
    if (!configData.discord.serverId || !configData.discord.logChannelId) {
      console.error("Discord server ID or log channel ID not set")
      return
    }

    const webhookUrl = `https://discord.com/api/v10/channels/${configData.discord.logChannelId}/messages`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'
    
    let userInfo = null
    if (data.userId) {
      userInfo = await getUserInfo(data.userId)
    }

    let botInfo = null
    if (data.botId) {
      botInfo = await getBotInfo(data.botId)
    }
    
    let embed: any = {
      title: "",
      description: "",
      color: 0x5865F2,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Discord Bot List",
        icon_url: botInfo?.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png"
      },
      thumbnail: {
        url: botInfo?.avatarUrl || null
      },
      fields: []
    }
    
    let components: any[] = []
    
    switch (data.type) {
      case "bot_submit":
        embed.title = "New Bot Submission"
        embed.description = `A new bot has been submitted for review\n<@${data.botId}>`
        embed.color = 0x3498DB
        embed.fields = [
          { name: "Bot", value: `<@${data.botId}>`, inline: true },
          { name: "Bot Name", value: botInfo?.username || "Unknown Bot", inline: true },
          { name: "Submitted By", value: userInfo ? `<@${data.userId}> (${userInfo.display_name})` : "Unknown User", inline: true }
        ]
        
        components = [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "Review Bot",
                url: `${baseUrl}/admin/bots/pending`
              },
              {
                type: 2,
                style: 5,
                label: "Bot Profile",
                url: `${baseUrl}/bots/${data.botId}`
              }
            ]
          }
        ]
        break
        
      case "bot_approved":
        embed.title = "Bot Approved"
        embed.description = `A bot has been approved and is now listed on the bot list.\n<@${data.botId}>`
        embed.color = 0x27AE60
        embed.fields = [
          { name: "Bot", value: `<@${data.botId}>`, inline: true },
          { name: "Bot Name", value: botInfo?.username || "Unknown Bot", inline: true },
          { name: "Approved By", value: data.approvedBy ? `<@${data.approvedBy}>` : "Unknown Admin", inline: true }
        ]
        
        components = [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "View Bot",
                url: `${baseUrl}/bots/${data.botId}`
              },
              {
                type: 2,
                style: 5,
                label: "Invite Bot",
                url: `https://discord.com/oauth2/authorize?client_id=${data.botId}&scope=bot%20applications.commands&permissions=0`
              }
            ]
          }
        ]
        break
        
      case "bot_rejected":
        embed.title = "Bot Rejected"
        embed.description = `A bot submission has been rejected.\n<@${data.botId}>`
        embed.color = 0xE74C3C
        embed.fields = [
          { name: "Bot", value: `<@${data.botId}>`, inline: true },
          { name: "Bot ID", value: data.botId || "Unknown", inline: true },
          { name: "Rejected By", value: data.approvedBy ? `<@${data.approvedBy}>` : "Unknown Admin", inline: true },
          { name: "Reason", value: data.reason || "No reason provided", inline: false }
        ]
        break
        
      case "vote":
        embed.title = "New Vote"
        embed.description = `A user has voted for a bot.\n<@${data.botId}>`
        embed.color = 0x2ECC71
        embed.fields = [
          { name: "Bot", value: `<@${data.botId}>`, inline: true },
          { name: "Bot Name", value: botInfo?.username || "Unknown Bot", inline: true },
          { name: "Voted By", value: userInfo ? `<@${data.userId}> (${userInfo.display_name})` : "Unknown User", inline: true }
        ]
        
        components = [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "View Bot",
                url: `${baseUrl}/bots/${data.botId}`
              }
            ]
          }
        ]
        break
        
      default:
        embed.title = "Notification"
        embed.description = `Type: ${data.type}`
        embed.color = 0x95A5A6
        embed.fields = [
          { name: "Details", value: `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``, inline: false }
        ]
    }
    
    if (data.botId) {
      embed.url = `${baseUrl}/bots/${data.botId}`
    }

    const requestBody: any = { embeds: [embed] }
    
    if (components.length > 0) {
      requestBody.components = components
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status} ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error("Error sending Discord notification:", error)
    return false
  }
}

export async function getBotStatus(botId: string): Promise<boolean> {
  try {
    if (!process.env.DISCORD_BOT_TOKEN) {
      console.error("DISCORD_BOT_TOKEN is not set");
      return false;
    }

    const response = await fetch(`https://discord.com/api/v10/users/${botId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching bot status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    
    return data.status !== undefined && data.status !== 3;
  } catch (error) {
    console.error("Error checking bot status:", error);
    return false;
  }
}

export async function getBotDetailedStatus(botId: string): Promise<string> {
  try {
    if (!process.env.DISCORD_BOT_TOKEN) {
      console.error("DISCORD_BOT_TOKEN is not set");
      return "unknown";
    }

    const response = await fetch(`https://discord.com/api/v10/users/${botId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching bot status: ${response.status}`);
      return "unknown";
    }

    const data = await response.json();
    
    const statusMap: Record<number, string> = {
      0: "online",
      1: "idle",
      2: "dnd",
      3: "offline"
    };
    
    return statusMap[data.status] || "unknown";
  } catch (error) {
    console.error("Error checking bot status:", error);
    return "unknown";
  }
}

export async function fetchBotData(botId: string) {
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

export async function isBotVerified(botId: string): Promise<boolean> {
  try {
    if (!DISCORD_BOT_TOKEN) {
      console.error("DISCORD_BOT_TOKEN is not set");
      return false;
    }

    const response = await fetch(`https://discord.com/api/v10/users/${botId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching bot verification status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    
    return data.public_flags !== undefined && (data.public_flags & 0x10000) !== 0;
  } catch (error) {
    console.error("Error checking bot verification status:", error);
    return false;
  }
}
