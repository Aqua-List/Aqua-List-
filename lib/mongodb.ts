import { MongoClient } from "mongodb"
import fs from "fs"
import path from "path"

let uri: string
try {
  const configPath = path.join(process.cwd(), "config.json")
  const configData = JSON.parse(fs.readFileSync(configPath, "utf8"))
  
  if (configData.mongodb && configData.mongodb.uri) {
    uri = configData.mongodb.uri
  } else {
    throw new Error("MongoDB URI not found in config.json")
  }
} catch (error) {
  throw new Error("Failed to load MongoDB URI from config.json: " + (error as Error).message)
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("AquaList")
  return { client, db }
}

export default clientPromise
