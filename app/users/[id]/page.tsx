import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { Metadata } from 'next'
import { getUserById } from '@/lib/actions/user'

interface PageProps {
  params: {
    id: string
  }
}

async function getUserDiscordId(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      return id
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
    })

    if (!user) {
      return null
    }

    return user.discordId
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function UserProfileRedirect({ params }: PageProps) {
  const discordId = await getUserDiscordId(params.id)

  if (!discordId) {
    return redirect("/users")
  }

  return redirect(`/users/discord/${discordId}`)
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const user = await getUserById(params.id)
  
  if (!user) {
    return {
      title: 'Profile Not Found - AquaList',
      description: 'The requested user profile could not be found.',
    }
  }

  const botCount = user.bots?.length || 0
  const description = `${user.username}'s profile on AquaList. Developer of ${botCount} Discord ${botCount === 1 ? 'bot' : 'bots'}.`

  return {
    title: `${user.username} - Developer Profile | AquaList`,
    description,
    openGraph: {
      title: `${user.username} - Discord Bot Developer`,
      description,
      images: [
        {
          url: user.avatarUrl || '/default-avatar.png',
          width: 512,
          height: 512,
          alt: `${user.username}'s Profile Picture`,
        }
      ],
      type: 'profile',
      profile: {
        username: user.username,
      },
    },
    twitter: {
      card: 'summary',
      title: `${user.username} - Discord Bot Developer`,
      description,
      images: [user.avatarUrl || '/default-avatar.png'],
    },
  }
}
