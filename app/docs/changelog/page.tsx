"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Zap, ArrowRight, FileJson, AlertTriangle, 
  CheckCircle, Info, BookOpen, Calendar, Construction, Clock
} from "lucide-react"

export default function ApiChangelogPage() {
  return (
    <div className="container py-10 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">API Changelog</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Stay updated with the latest changes to the AquaList API
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/40 shadow-sm sticky top-20">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-2">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <Link href="/docs">
                      <FileJson className="h-4 w-4 mr-2 text-primary" />
                      API Reference
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <Link href="/docs/getting-started">
                      <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                      Getting Started
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <Link href="/docs/examples">
                      <FileJson className="h-4 w-4 mr-2 text-purple-500" />
                      Code Examples
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-8">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  <Construction className="h-5 w-5 mr-2 text-amber-500" />
                  In Development
                </CardTitle>
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                  Coming Soon
                </Badge>
              </div>
              <CardDescription>
                This page is currently under construction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-amber-500/10 p-6 rounded-full mb-6">
                  <Construction className="h-12 w-12 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">API Changelog Coming Soon</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  We're currently working on documenting all the changes to our API. 
                  This page will be updated with a complete changelog very soon.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                    <Link href="/docs">
                      Explore API Reference
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/docs/getting-started">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Getting Started Guide
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 border border-border/40">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 mt-0.5">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">What to expect</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      When completed, this page will include:
                    </p>
                    <ul className="space-y-2 text-sm pl-5 list-disc">
                      <li>A complete version history of the API</li>
                      <li>Detailed descriptions of new features and improvements</li>
                      <li>Important notices about breaking changes</li>
                      <li>Migration guides for major version updates</li>
                      <li>Deprecation schedules for older API versions</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground">
                      Want to be notified when our API changelog is available? Join our developer newsletter or follow us on Twitter for updates.
                    </p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="mr-3">
                        Join Newsletter
                      </Button>
                      <Button variant="outline" size="sm">
                        Follow @AquaListAPI
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Development Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative pl-8 pb-8 border-l-2 border-muted">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                <div className="mb-1 font-medium">API Documentation Launch</div>
                <div className="text-sm text-muted-foreground mb-2">June 2023</div>
                <p className="text-sm">Initial release of our API documentation portal with reference guides and examples.</p>
              </div>
              
              <div className="relative pl-8 pb-8 border-l-2 border-muted">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-500"></div>
                <div className="mb-1 font-medium">API Changelog</div>
                <div className="text-sm text-muted-foreground mb-2">July 2023 (In Progress)</div>
                <p className="text-sm">Complete version history and changelog documentation.</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-muted"></div>
                <div className="mb-1 font-medium">Developer SDK Release</div>
                <div className="text-sm text-muted-foreground mb-2">August 2023 (Planned)</div>
                <p className="text-sm">Official SDK libraries for JavaScript, Python, and more.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 