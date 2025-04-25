import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ExternalLink, CheckCircle2, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function DiscordSetupGuide() {
  const [copied, setCopied] = useState(false)
  const [callbackUrl, setCallbackUrl] = useState("")
  
 
  useEffect(() => {
   
    const baseUrl = process.env.NEXTAUTH_URL || window.location.origin
    setCallbackUrl(`${baseUrl}/api/auth/callback/discord`)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(callbackUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-base font-medium">Important Setup Required</AlertTitle>
        <AlertDescription className="mt-2 text-sm">
          To complete your Discord integration, you need to configure your Discord application's OAuth2 settings.
        </AlertDescription>
      </Alert>
      
      <Card className="border-border/40 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 p-6 border-b">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30">
                Step 1
              </Badge>
              Copy Your Callback URL
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Add this URL to your Discord application's OAuth2 redirect settings
            </p>
            
            <div className="mt-4 flex items-center">
              <div className="bg-background flex-1 p-3 rounded-l-md font-mono text-sm break-all border border-r-0">
                {callbackUrl || "Loading..."}
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-[42px] rounded-l-none"
                onClick={copyToClipboard}
                disabled={!callbackUrl}
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30">
                Step 2
              </Badge>
              Configure Discord Developer Portal
            </h3>
            
            <div className="rounded-md bg-muted/50 p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Environment Variable</p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Make sure your <code className="bg-muted px-1 py-0.5 rounded text-xs">NEXTAUTH_URL</code> environment variable is set to your website's base URL (e.g., https://your-domain.com)
                  </p>
                </div>
              </div>
            </div>
            
            <ol className="space-y-4 mb-6">
              <li className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Go to the Discord Developer Portal</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Sign in to your Discord account and navigate to the Developer Portal
                  </p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Select your application</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Choose the Discord application you want to integrate with this platform
                  </p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Navigate to OAuth2 settings</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    In the left sidebar, click on "OAuth2" → "General"
                  </p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">4</div>
                <div>
                  <p className="font-medium">Add the callback URL</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    In the "Redirects" section, click "Add Redirect" and paste the URL from Step 1
                  </p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">5</div>
                <div>
                  <p className="font-medium">Save your changes</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Click the "Save Changes" button at the bottom of the page
                  </p>
                </div>
              </li>
            </ol>
            
            <Separator className="my-6" />
            
            <div className="flex justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open Discord Developer Portal
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

