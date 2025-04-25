import fs from "fs"
import path from "path"


let nextAuthSecret: string
let nextAuthUrl: string

try {
  const configPath = path.join(process.cwd(), "config.json")
  const configData = JSON.parse(fs.readFileSync(configPath, "utf8"))
  
  if (configData.nextAuth) {
    if (configData.nextAuth.secret) {
      nextAuthSecret = configData.nextAuth.secret
      process.env.NEXTAUTH_SECRET = configData.nextAuth.secret
    } else {
      throw new Error("NextAuth secret not found in config.json")
    }
    
    if (configData.nextAuth.url) {
      nextAuthUrl = configData.nextAuth.url
      process.env.NEXTAUTH_URL = configData.nextAuth.url
    } else {
      throw new Error("NextAuth URL not found in config.json")
    }
  } else {
    throw new Error("NextAuth configuration not found in config.json")
  }
} catch (error) {
  throw new Error("Failed to load NextAuth configuration from config.json: " + (error as Error).message)
}

export { nextAuthSecret, nextAuthUrl } 