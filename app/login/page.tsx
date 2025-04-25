"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DiscIcon as Discord } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    const callbackUrl = `${window.location.origin}/api/auth/callback/discord`
    await signIn("discord", { callbackUrl: "/dashboard", redirect: true })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your bots and access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full max-w-xs bg-[#5865F2] hover:bg-[#4752c4]"
          >
            <Discord className="mr-2 h-5 w-5" />
            {isLoading ? "Connecting..." : "Sign in with Discord"}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground flex flex-col gap-2">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </CardFooter>
      </Card>
      
    </div>
  )
}

