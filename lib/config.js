
const fs = require("fs");
const path = require("path");

const configPath = path.join(process.cwd(), "config.json");
const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));


if (configData.mongodb && configData.mongodb.uri) {
  process.env.MONGODB_URI = configData.mongodb.uri;
}

if (configData.discord) {
  if (configData.discord.clientId)
    process.env.DISCORD_CLIENT_ID = configData.discord.clientId;
  if (configData.discord.clientSecret)
    process.env.DISCORD_CLIENT_SECRET = configData.discord.clientSecret;
  if (configData.discord.botToken)
    process.env.DISCORD_BOT_TOKEN = configData.discord.botToken;
}

if (configData.nextAuth) {
  if (configData.nextAuth.secret)
    process.env.NEXTAUTH_SECRET = configData.nextAuth.secret;
  if (configData.nextAuth.url)
    process.env.NEXTAUTH_URL = configData.nextAuth.url;
}


function replaceEnvVars(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(replaceEnvVars);
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (
      typeof value === "string" &&
      (value.startsWith("DISCORD_") ||
        value.startsWith("MONGODB_") ||
        value.startsWith("NEXTAUTH_"))
    ) {
      result[key] = process.env[value] || value;
    } else if (typeof value === "object" && value !== null) {
      result[key] = replaceEnvVars(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

const config = replaceEnvVars(configData);

module.exports = config;
