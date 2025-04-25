"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, Check, AlertTriangle, Sparkles, 
  Clock, Star, Zap, Award, ArrowRight
} from "lucide-react"

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-7xl py-12 px-4">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="h-4 w-4 mr-2" />
            Verification
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            Bot Certification Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your Discord bot certified and unlock exclusive features and visibility
          </p>
        </div>

        <Card className="mb-12 border-border/40 shadow-sm bg-gradient-to-r from-sky-500/5 to-sky-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-sky-500/10">
                <Zap className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Automatic Discord Verification</h3>
                <p className="text-muted-foreground mb-4">
                  Our system automatically checks your bot's metrics directly from Discord. No manual verification needed - if your bot meets the requirements, you'll be certified instantly!
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20">
                    Server Count Auto-Sync
                  </Badge>
                  <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20">
                    Uptime Monitoring
                  </Badge>
                  <Badge variant="outline" className="bg-sky-500/10 text-sky-500 border-sky-500/20">
                    Real-time Updates
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                Enhanced Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Certified bots appear at the top of search results and get featured on our homepage.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="h-5 w-5 mr-2 text-emerald-500" />
                Trust Badge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Display a verified badge that shows users your bot is trusted and reliable.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Zap className="h-5 w-5 mr-2 text-sky-500" />
                Priority Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get dedicated support and early access to new platform features.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12 border-border/40 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
            <CardTitle className="text-xl flex items-center">
              <Check className="h-5 w-5 mr-2 text-emerald-500" />
              Certification Requirements
            </CardTitle>
            <CardDescription>
              To be eligible for certification, your bot must meet the following criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Server Count</h3>
                  <p className="text-sm text-muted-foreground">
                    Must be in at least 100 servers with active users
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Uptime</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain 99.9% uptime over the last 30 days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide clear documentation and support resources
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Terms of Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow Discord's Terms of Service and Developer Policy
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to get certified?</h2>
                <p className="text-muted-foreground mb-4">
                  Connect your Discord bot and our system will automatically verify your eligibility.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                    Connect with Discord
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline">
                    View Documentation
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-6 rounded-full">
                  <Award className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 