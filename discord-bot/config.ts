interface DiscordConfig {
  botToken: string;
  clientId: string;
  clientSecret: string;
  serverId: string;
  logChannelId: string;
}

interface MongoDBConfig {
  uri: string;
}

interface WebsiteConfig {
  baseUrl: string;
}

interface Config {
  discord: DiscordConfig;
  mongodb: MongoDBConfig;
  website: WebsiteConfig;
}

const config: Config = {
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN || "" ,
    clientId: process.env.DISCORD_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    serverId: process.env.DISCORD_SERVER_ID || "",
    logChannelId: process.env.DISCORD_LOG_CHANNEL_ID || "",
  },
  mongodb: {
    uri: process.env.MONGODB_URI || ""
  },
  website: {
    baseUrl: process.env.WEBSITE_BASE_URL || ""
  }
};

export default config; 