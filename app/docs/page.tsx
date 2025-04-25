"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Code, FileJson, Server, User, Key, Lock, Database, 
  Search, Filter, ArrowRight, ExternalLink, Copy, Check,
  BookOpen, Layers, Cpu, Zap, Sparkles, Bot, Shield
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function ApiDocsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-emerald-500/20 to-sky-500/20 border-b border-border/40">
          <div className="container py-16 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Code className="h-4 w-4 mr-2" />
                Developer Resources
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
                AquaList API Documentation
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Everything you need to integrate with the AquaList platform and build amazing bot experiences
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                  <a href="#api-reference">
                    Explore the API
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/dashboard">
                    Get API Key
                    <Key className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-16 px-4" id="api-reference">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
              <div className="flex items-center gap-2">
                <FileJson className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">API Reference</h2>
              </div>
              <p className="text-muted-foreground">
                Our RESTful API allows you to programmatically access and manage bots, users, and more.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div className="rounded-lg border border-border/40 overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 font-medium">
                    Quick Links
                  </div>
                  <div className="p-2">
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                        <a href="#bots">
                          <Bot className="h-4 w-4 mr-2 text-primary" />
                          Bots
                        </a>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                        <a href="#users">
                          <User className="h-4 w-4 mr-2 text-blue-500" />
                          Users
                        </a>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                        <a href="#auth">
                          <Shield className="h-4 w-4 mr-2 text-amber-500" />
                          Authentication
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/40 overflow-hidden">
                  <div className="bg-muted/50 px-4 py-3 font-medium">
                    Resources
                  </div>
                  <div className="p-2">
                    <div className="space-y-1">
                      <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                        <Link href="/docs/getting-started">
                          <BookOpen className="h-4 w-4 mr-2 text-green-500" />
                          Getting Started
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                        <Link href="/docs/examples">
                          <Layers className="h-4 w-4 mr-2 text-purple-500" />
                          Code Examples
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                        <Link href="/docs/changelog">
                          <Cpu className="h-4 w-4 mr-2 text-red-500" />
                          API Changelog
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <Tabs defaultValue="bots" className="space-y-8">
                  <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 rounded-lg">
                    <TabsTrigger 
                      value="bots" 
                      id="bots"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-sky-500 data-[state=active]:text-white"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Bots
                    </TabsTrigger>
                    <TabsTrigger 
                      value="users" 
                      id="users"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-sky-500 data-[state=active]:text-white"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Users
                    </TabsTrigger>
                    <TabsTrigger 
                      value="auth" 
                      id="auth"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-sky-500 data-[state=active]:text-white"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Authentication
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bots" className="space-y-6">
                    <Card className="border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono">GET</Badge>
                          <CardTitle>Get All Bots</CardTitle>
                        </div>
                        <CardDescription>Retrieve a list of all approved bots</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" />
                            Endpoint
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>GET /api/bots</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard("GET /api/bots", "get-bots")}
                            >
                              {copied === "get-bots" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Search className="h-4 w-4 text-primary" />
                            Query Parameters
                          </h3>
                          <div className="mt-2 overflow-hidden rounded-md border border-border/40">
                            <div className="grid grid-cols-3 gap-4 text-sm bg-muted/50 px-4 py-2.5">
                              <div className="font-medium">Parameter</div>
                              <div className="font-medium">Type</div>
                              <div className="font-medium">Description</div>
                            </div>
                            <Separator />
                            <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm items-center">
                              <div className="font-mono text-xs">page</div>
                              <div>number</div>
                              <div>Page number (default: 1)</div>
                            </div>
                            <Separator />
                            <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm items-center bg-muted/30">
                              <div className="font-mono text-xs">limit</div>
                              <div>number</div>
                              <div>Results per page (default: 20, max: 100)</div>
                            </div>
                            <Separator />
                            <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm items-center">
                              <div className="font-mono text-xs">sort</div>
                              <div>string</div>
                              <div>Sort by: newest, popular, servers</div>
                            </div>
                            <Separator />
                            <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm items-center bg-muted/30">
                              <div className="font-mono text-xs">tag</div>
                              <div>string</div>
                              <div>Filter by tag</div>
                            </div>
                            <Separator />
                            <div className="px-4 py-3 grid grid-cols-3 gap-4 text-sm items-center">
                              <div className="font-mono text-xs">search</div>
                              <div>string</div>
                              <div>Search by name or description</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            Response
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>{`{
  "bots": [
    {
      "clientId": "string",
      "name": "string",
      "avatar": "string",
      "description": "string",
      "tags": ["string"],
      "votes": number,
      "servers": number,
      "createdAt": "string"
    }
  ],
  "totalPages": number,
  "currentPage": number
}`}</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(`{
  "bots": [
    {
      "clientId": "string",
      "name": "string",
      "avatar": "string",
      "description": "string",
      "tags": ["string"],
      "votes": number,
      "servers": number,
      "createdAt": "string"
    }
  ],
  "totalPages": number,
  "currentPage": number
}`, "get-bots-response")}
                            >
                              {copied === "get-bots-response" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono">GET</Badge>
                          <CardTitle>Get Bot</CardTitle>
                        </div>
                        <CardDescription>Retrieve detailed information about a specific bot</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" />
                            Endpoint
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>GET /api/bots/{`{clientId}`}</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard("GET /api/bots/{clientId}", "get-bot")}
                            >
                              {copied === "get-bot" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            Response
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>{`{
  "clientId": "string",
  "name": "string",
  "avatar": "string",
  "description": "string",
  "longDescription": "string",
  "prefix": "string",
  "tags": ["string"],
  "website": "string",
  "supportServer": "string",
  "githubRepo": "string",
  "votes": number,
  "servers": number,
  "ownerId": "string",
  "createdAt": "string",
  "updatedAt": "string"
}`}</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(`{
  "clientId": "string",
  "name": "string",
  "avatar": "string",
  "description": "string",
  "longDescription": "string",
  "prefix": "string",
  "tags": ["string"],
  "website": "string",
  "supportServer": "string",
  "githubRepo": "string",
  "votes": number,
  "servers": number,
  "ownerId": "string",
  "createdAt": "string",
  "updatedAt": "string"
}`, "get-bot-response")}
                            >
                              {copied === "get-bot-response" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="users" className="space-y-6">
                    <Card className="border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono">GET</Badge>
                          <CardTitle>Get User</CardTitle>
                        </div>
                        <CardDescription>Retrieve public information about a user</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" />
                            Endpoint
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>GET /api/users/{`{userId}`}</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard("GET /api/users/{userId}", "get-user")}
                            >
                              {copied === "get-user" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            Response
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>{`{
  "id": "string",
  "username": "string",
  "avatar": "string",
  "bots": [
    {
      "clientId": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "createdAt": "string"
}`}</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(`{
  "id": "string",
  "username": "string",
  "avatar": "string",
  "bots": [
    {
      "clientId": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "createdAt": "string"
}`, "get-user-response")}
                            >
                              {copied === "get-user-response" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono">GET</Badge>
                          <CardTitle>Get User's Bots</CardTitle>
                        </div>
                        <CardDescription>Retrieve all public bots owned by a user</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" />
                            Endpoint
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>GET /api/users/{`{userId}`}/bots</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard("GET /api/users/{userId}/bots", "get-user-bots")}
                            >
                              {copied === "get-user-bots" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            Response
                          </h3>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>{`{
  "bots": [
    {
      "clientId": "string",
      "name": "string",
      "description": "string",
      "tags": ["string"],
      "votes": number,
      "servers": number
    }
  ]
}`}</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(`{
  "bots": [
    {
      "clientId": "string",
      "name": "string",
      "description": "string",
      "tags": ["string"],
      "votes": number,
      "servers": number
    }
  ]
}`, "get-user-bots-response")}
                            >
                              {copied === "get-user-bots-response" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="auth" className="space-y-6">
                    <Card className="border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono">AUTH</Badge>
                          <CardTitle>Authentication</CardTitle>
                        </div>
                        <CardDescription>Learn how to authenticate with the API</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Key className="h-4 w-4 text-amber-500" />
                            Bearer Token
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Include your API token in the Authorization header:
                          </p>
                          <div className="mt-2 relative">
                            <pre className="p-4 bg-muted rounded-md overflow-x-auto font-mono text-sm">
                              <code>Authorization: Bearer YOUR_API_TOKEN</code>
                            </pre>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_TOKEN", "auth-header")}
                            >
                              {copied === "auth-header" ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            Rate Limits
                          </h3>
                          <div className="mt-2 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                            <p className="text-sm">
                              The API has a rate limit of 100 requests per minute per IP address. Authenticated requests have a higher limit of 1000 requests per minute.
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium flex items-center gap-2">
                            <Lock className="h-4 w-4 text-amber-500" />
                            Getting an API Key
                          </h3>
                          <div className="mt-2 space-y-4">
                            <p className="text-sm text-muted-foreground">
                              To get an API key, you need to:
                            </p>
                            <ol className="space-y-2 text-sm pl-5 list-decimal">
                              <li>Create an account on AquaList</li>
                              <li>Go to your dashboard settings</li>
                              <li>Navigate to the "API" tab</li>
                              <li>Generate a new API key</li>
                            </ol>
                            <div className="pt-2">
                              <Button asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                                <Link href="/dashboard">
                                  Go to Dashboard
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

