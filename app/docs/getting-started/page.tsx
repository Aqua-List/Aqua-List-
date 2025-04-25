"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  BookOpen, ArrowRight, Code, Bot, Key, Server, 
  CheckCircle, FileJson, Zap, Shield, Terminal, Copy, Check
} from "lucide-react"
import { useState } from "react"

export default function GettingStartedPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="container py-10 px-4 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Getting Started</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Learn how to integrate with the AquaList API and build amazing bot experiences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/40 shadow-sm sticky top-20">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
              <CardTitle className="text-lg">On This Page</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-2">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#introduction">
                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                      Introduction
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#authentication">
                      <Key className="h-4 w-4 mr-2 text-amber-500" />
                      Authentication
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#first-request">
                      <Server className="h-4 w-4 mr-2 text-blue-500" />
                      Your First Request
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#code-examples">
                      <Terminal className="h-4 w-4 mr-2 text-purple-500" />
                      Code Examples
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#next-steps">
                      <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                      Next Steps
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <Card className="border-border/40 shadow-sm" id="introduction">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Introduction
              </CardTitle>
              <CardDescription>
                Welcome to the AquaList API documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The AquaList API provides a powerful way to interact with our platform programmatically. 
                You can use it to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Retrieve information about bots</li>
                <li>Manage your bot listings</li>
                <li>Access user data (with proper permissions)</li>
                <li>Track statistics and analytics</li>
              </ul>
              <p>
                This guide will walk you through the basics of using our API, from authentication to making your first request.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm" id="authentication">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Key className="h-5 w-5 mr-2 text-amber-500" />
                Authentication
              </CardTitle>
              <CardDescription>
                Securing your API requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                All API requests require authentication using a Bearer token. You can obtain your API token from your dashboard.
              </p>
              <div className="bg-muted rounded-md p-4">
                <h3 className="font-medium mb-2">Authorization Header</h3>
                <div className="relative">
                  <pre className="font-mono text-sm overflow-x-auto">
                    <code>Authorization: Bearer YOUR_API_TOKEN</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-0 right-0 h-8 w-8 text-muted-foreground hover:text-foreground"
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
              <div className="flex justify-center mt-4">
                <Button asChild className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white hover:opacity-90">
                  <Link href="/dashboard">
                    Get Your API Key
                    <Key className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm" id="first-request">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Server className="h-5 w-5 mr-2 text-blue-500" />
                Your First Request
              </CardTitle>
              <CardDescription>
                Making a simple API call
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Let's start by making a simple request to get a list of bots. This endpoint doesn't require authentication.
              </p>
              <div className="bg-muted rounded-md p-4">
                <h3 className="font-medium mb-2">GET /api/bots</h3>
                <div className="relative">
                  <pre className="font-mono text-sm overflow-x-auto">
                    <code>curl https://aqualist.com/api/bots</code>
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-0 right-0 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => copyToClipboard("curl https://aqualist.com/api/bots", "curl-bots")}
                  >
                    {copied === "curl-bots" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="mt-4">
                This will return a JSON response with a list of bots:
              </p>
              <div className="bg-muted rounded-md p-4">
                <div className="relative">
                  <pre className="font-mono text-sm overflow-x-auto">
                    <code>{`{
  "bots": [
    {
      "clientId": "123456789012345678",
      "name": "Example Bot",
      "avatar": "https://cdn.discordapp.com/avatars/123456789012345678/abcdef.png",
      "description": "An example bot",
      "tags": ["utility", "moderation"],
      "votes": 42,
      "servers": 100
    },
    // More bots...
  ],
  "totalPages": 5,
  "currentPage": 1
}`}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm" id="code-examples">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-purple-500" />
                Code Examples
              </CardTitle>
              <CardDescription>
                Sample code in different languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript" className="bg-muted rounded-md p-4">
                  <div className="relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>{`// Using fetch
const API_TOKEN = 'YOUR_API_TOKEN';

async function getBots() {
  const response = await fetch('https://aqualist.com/api/bots', {
    headers: {
      'Authorization': \`Bearer \${API_TOKEN}\`
    }
  });
  
  const data = await response.json();
  console.log(data);
}

getBots();`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`// Using fetch
const API_TOKEN = 'YOUR_API_TOKEN';

async function getBots() {
  const response = await fetch('https://aqualist.com/api/bots', {
    headers: {
      'Authorization': \`Bearer \${API_TOKEN}\`
    }
  });
  
  const data = await response.json();
  console.log(data);
}

getBots();`, "js-example")}
                    >
                      {copied === "js-example" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="python" className="bg-muted rounded-md p-4">
                  <div className="relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>{`# Using requests
import requests

API_TOKEN = 'YOUR_API_TOKEN'

def get_bots():
    headers = {
        'Authorization': f'Bearer {API_TOKEN}'
    }
    
    response = requests.get('https://aqualist.com/api/bots', headers=headers)
    data = response.json()
    print(data)

get_bots()`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`# Using requests
import requests

API_TOKEN = 'YOUR_API_TOKEN'

def get_bots():
    headers = {
        'Authorization': f'Bearer {API_TOKEN}'
    }
    
    response = requests.get('https://aqualist.com/api/bots', headers=headers)
    data = response.json()
    print(data)

get_bots()`, "python-example")}
                    >
                      {copied === "python-example" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="curl" className="bg-muted rounded-md p-4">
                  <div className="relative">
                    <pre className="font-mono text-sm overflow-x-auto">
                      <code>{`curl -X GET \\
  https://aqualist.com/api/bots \\
  -H 'Authorization: Bearer YOUR_API_TOKEN'`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`curl -X GET \\
  https://aqualist.com/api/bots \\
  -H 'Authorization: Bearer YOUR_API_TOKEN'`, "curl-example")}
                    >
                      {copied === "curl-example" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm" id="next-steps">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-green-500" />
                Next Steps
              </CardTitle>
              <CardDescription>
                Where to go from here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Now that you've made your first API request, you can explore more endpoints and features:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Link href="/docs" className="block group">
                  <div className="border border-border/40 rounded-lg p-4 h-full hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FileJson className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">API Reference</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Explore all available endpoints and parameters
                    </p>
                  </div>
                </Link>
                <Link href="/docs/examples" className="block group">
                  <div className="border border-border/40 rounded-lg p-4 h-full hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-purple-500" />
                      <h3 className="font-medium">Code Examples</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      More detailed code samples in various languages
                    </p>
                  </div>
                </Link>
                <Link href="/docs/changelog" className="block group">
                  <div className="border border-border/40 rounded-lg p-4 h-full hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <h3 className="font-medium">API Changelog</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stay updated with the latest API changes
                    </p>
                  </div>
                </Link>
                <Link href="/dashboard" className="block group">
                  <div className="border border-border/40 rounded-lg p-4 h-full hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Manage Your Bots</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Go to your dashboard to manage your bots
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 