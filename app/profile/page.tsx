"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProfileRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.discordId) {
      router.push(`/profile/${session.user.discordId}`)
    }
  }, [session, status, router])

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}

