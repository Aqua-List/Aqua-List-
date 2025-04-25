import { ObjectId } from "mongodb"

export interface Partner {
  _id?: ObjectId
  name: string
  image: string
  description: string
  url: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export const PartnerSchema = {
  name: "partners",
  fields: {
    name: { type: "string", required: true },
    image: { type: "string", required: true },
    description: { type: "string", required: true },
    url: { type: "string", required: true },
    featured: { type: "boolean", default: false },
    createdAt: { type: "date", default: () => new Date() },
    updatedAt: { type: "date", default: () => new Date() }
  }
} 