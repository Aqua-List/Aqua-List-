declare module 'config' {
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

  const config: Config;
  export default config;
} 