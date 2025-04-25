"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Code, ArrowRight, Bot, Server, User, 
  CheckCircle, FileJson, Zap, Shield, Terminal, Copy, Check, Layers
} from "lucide-react"
import { useState } from "react"

export default function CodeExamplesPage() {
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
          <Layers className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Code Examples</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Sample code snippets to help you integrate with the AquaList API
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/40 shadow-sm sticky top-20">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-border/40">
              <CardTitle className="text-lg">Examples</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-2">
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#list-bots">
                      <Bot className="h-4 w-4 mr-2 text-primary" />
                      List Bots
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#get-bot">
                      <Bot className="h-4 w-4 mr-2 text-blue-500" />
                      Get Bot Details
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#user-bots">
                      <User className="h-4 w-4 mr-2 text-purple-500" />
                      User's Bots
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#search-bots">
                      <Server className="h-4 w-4 mr-2 text-amber-500" />
                      Search Bots
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm h-9" asChild>
                    <a href="#authentication">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      Authentication
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <Card className="border-border/40 shadow-sm" id="list-bots">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Bot className="h-5 w-5 mr-2 text-primary" />
                List Bots
              </CardTitle>
              <CardDescription>
                Retrieve a list of all approved bots
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
                      <code>{`async function listBots() {
  try {
    const response = await fetch('https://aqua-list.vercel.app/api/bots');
    const data = await response.json();
    
    console.log(\`Found \${data.bots.length} bots\`);
    console.log(\`Total pages: \${data.totalPages}\`);
    
    data.bots.forEach(bot => {
      console.log(\`\${bot.name}: \${bot.description}\`);
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching bots:', error);
  }
}

listBots();`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`async function listBots() {
  try {
    const response = await fetch('https://aqua-list.vercel.app/api/bots');
    const data = await response.json();
    
    console.log(\`Found \${data.bots.length} bots\`);
    console.log(\`Total pages: \${data.totalPages}\`);
    
    data.bots.forEach(bot => {
      console.log(\`\${bot.name}: \${bot.description}\`);
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching bots:', error);
  }
}

listBots();`, "js-list-bots")}
                    >
                      {copied === "js-list-bots" ? (
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
                      <code>{`import requests

def list_bots():
    try:
        response = requests.get('https://aqua-list.vercel.app/api/bots')
        data = response.json()
        
        print(f"Found {len(data['bots'])} bots")
        print(f"Total pages: {data['totalPages']}")
        
        for bot in data['bots']:
            print(f"{bot['name']}: {bot['description']}")
        
        return data
    except Exception as e:
        print(f"Error fetching bots: {e}")

list_bots()`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`import requests

def list_bots():
    try:
        response = requests.get('https://aqua-list.vercel.app/api/bots')
        data = response.json()
        
        print(f"Found {len(data['bots'])} bots")
        print(f"Total pages: {data['totalPages']}")
        
        for bot in data['bots']:
            print(f"{bot['name']}: {bot['description']}")
        
        return data
    except Exception as e:
        print(f"Error fetching bots: {e}")

list_bots()`, "python-list-bots")}
                    >
                      {copied === "python-list-bots" ? (
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
                      <code>{`curl -X GET https://aqua-list.vercel.app/api/bots

curl -X GET "https://aqua-list.vercel.app/api/bots?page=2&limit=50"

curl -X GET "https://aqua-list.vercel.app/api/bots?sort=popular&tag=utility"`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`curl -X GET https://aqua-list.vercel.app/api/bots

curl -X GET "https://aqua-list.vercel.app/api/bots?page=2&limit=50"

curl -X GET "https://aqua-list.vercel.app/api/bots?sort=popular&tag=utility"`, "curl-list-bots")}
                    >
                      {copied === "curl-list-bots" ? (
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

          <Card className="border-border/40 shadow-sm" id="get-bot">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-500" />
                Get Bot Details
              </CardTitle>
              <CardDescription>
                Retrieve detailed information about a specific bot
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
                      <code>{`async function getBot(clientId) {
  try {
    const response = await fetch(\`https://aqua-list.vercel.app/api/bots/\${clientId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const bot = await response.json();
    
    console.log(\`Bot: \${bot.name}\`);
    console.log(\`Description: \${bot.description}\`);
    console.log(\`Tags: \${bot.tags.join(', ')}\`);
    console.log(\`Votes: \${bot.votes}\`);
    console.log(\`Servers: \${bot.servers}\`);
    
    return bot;
  } catch (error) {
    console.error('Error fetching bot details:', error);
  }
}

getBot('123456789012345678');`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`async function getBot(clientId) {
  try {
    const response = await fetch(\`https://aqua-list.vercel.app/api/bots/\${clientId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const bot = await response.json();
    
    console.log(\`Bot: \${bot.name}\`);
    console.log(\`Description: \${bot.description}\`);
    console.log(\`Tags: \${bot.tags.join(', ')}\`);
    console.log(\`Votes: \${bot.votes}\`);
    console.log(\`Servers: \${bot.servers}\`);
    
    return bot;
  } catch (error) {
    console.error('Error fetching bot details:', error);
  }
}

getBot('123456789012345678');`, "js-get-bot")}
                    >
                      {copied === "js-get-bot" ? (
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
                      <code>{`import requests

def get_bot(client_id):
    try:
        response = requests.get(f'https://aqua-list.vercel.app/api/bots/{client_id}')
        response.raise_for_status()
        
        bot = response.json()
        
        print(f"Bot: {bot['name']}")
        print(f"Description: {bot['description']}")
        print(f"Tags: {', '.join(bot['tags'])}")
        print(f"Votes: {bot['votes']}")
        print(f"Servers: {bot['servers']}")
        
        return bot
    except requests.exceptions.RequestException as e:
        print(f"Error fetching bot details: {e}")

get_bot('123456789012345678')`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`import requests

def get_bot(client_id):
    try:
        response = requests.get(f'https://aqua-list.vercel.app/api/bots/{client_id}')
        response.raise_for_status()
        
        bot = response.json()
        
        print(f"Bot: {bot['name']}")
        print(f"Description: {bot['description']}")
        print(f"Tags: {', '.join(bot['tags'])}")
        print(f"Votes: {bot['votes']}")
        print(f"Servers: {bot['servers']}")
        
        return bot
    except requests.exceptions.RequestException as e:
        print(f"Error fetching bot details: {e}")

get_bot('123456789012345678')`, "python-get-bot")}
                    >
                      {copied === "python-get-bot" ? (
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
                      <code>{`curl -X GET https://aqua-list.vercel.app/api/bots/123456789012345678`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`curl -X GET https://aqua-list.vercel.app/api/bots/123456789012345678`, "curl-get-bot")}
                    >
                      {copied === "curl-get-bot" ? (
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

          <Card className="border-border/40 shadow-sm" id="user-bots">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-500" />
                User's Bots
              </CardTitle>
              <CardDescription>
                Retrieve all bots owned by a specific user
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
                      <code>{`async function getUserBots(userId) {
  try {
    const response = await fetch(\`https://aqua-list.vercel.app/api/users/\${userId}/bots\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    
    console.log(\`User has \${data.bots.length} bots\`);
    
    data.bots.forEach(bot => {
      console.log(\`\${bot.name}: \${bot.description}\`);
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching user bots:', error);
  }
}

getUserBots('123456789012345678');`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`async function getUserBots(userId) {
  try {
    const response = await fetch(\`https://aqua-list.vercel.app/api/users/\${userId}/bots\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    
    console.log(\`User has \${data.bots.length} bots\`);
    
    data.bots.forEach(bot => {
      console.log(\`\${bot.name}: \${bot.description}\`);
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching user bots:', error);
  }
}

getUserBots('123456789012345678');`, "js-user-bots")}
                    >
                      {copied === "js-user-bots" ? (
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
                      <code>{`import requests

def get_user_bots(user_id):
    try:
        response = requests.get(f'https://aqua-list.vercel.app/api/users/{user_id}/bots')
        response.raise_for_status()
        
        data = response.json()
        
        print(f"User has {len(data['bots'])} bots")
        
        for bot in data['bots']:
            print(f"{bot['name']}: {bot['description']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user bots: {e}")

get_user_bots('123456789012345678')`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`import requests

def get_user_bots(user_id):
    try:
        response = requests.get(f'https://aqua-list.vercel.app/api/users/{user_id}/bots')
        response.raise_for_status()
        
        data = response.json()
        
        print(f"User has {len(data['bots'])} bots")
        
        # Process the bots
        for bot in data['bots']:
            print(f"{bot['name']}: {bot['description']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user bots: {e}")

# Call the function with a user ID
get_user_bots('123456789012345678')`, "python-user-bots")}
                    >
                      {copied === "python-user-bots" ? (
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
                      <code>{`# Get all bots owned by a specific user
curl -X GET https://aqua-list.vercel.app/api/users/123456789012345678/bots`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`# Get all bots owned by a specific user
curl -X GET https://aqua-list.vercel.app/api/users/123456789012345678/bots`, "curl-user-bots")}
                    >
                      {copied === "curl-user-bots" ? (
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

          <Card className="border-border/40 shadow-sm" id="search-bots">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Server className="h-5 w-5 mr-2 text-amber-500" />
                Search Bots
              </CardTitle>
              <CardDescription>
                Search for bots with specific criteria
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
                      <code>{`// Using fetch to search for bots
async function searchBots(query, tags, sort = 'popular') {
  try {
    // Build query string
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (tags && tags.length) params.append('tags', tags.join(','));
    params.append('sort', sort);
    
    const response = await fetch(\`https://aqua-list.vercel.app/api/bots/search?\${params.toString()}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    
    console.log(\`Found \${data.bots.length} bots matching criteria\`);
    console.log(\`Total pages: \${data.totalPages}\`);
    
    // Process the bots
    data.bots.forEach(bot => {
      console.log(\`\${bot.name}: \${bot.description}\`);
    });
    
    return data;
  } catch (error) {
    console.error('Error searching bots:', error);
  }
}

// Call the function with search parameters
searchBots('music', ['utility', 'fun'], 'newest');`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`// Using fetch to search for bots
async function searchBots(query, tags, sort = 'popular') {
  try {
    // Build query string
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (tags && tags.length) params.append('tags', tags.join(','));
    params.append('sort', sort);
    
    const response = await fetch(\`https://aqua-list.vercel.app/api/bots/search?\${params.toString()}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    
    console.log(\`Found \${data.bots.length} bots matching criteria\`);
    console.log(\`Total pages: \${data.totalPages}\`);
    
    // Process the bots
    data.bots.forEach(bot => {
      console.log(\`\${bot.name}: \${bot.description}\`);
    });
    
    return data;
  } catch (error) {
    console.error('Error searching bots:', error);
  }
}

// Call the function with search parameters
searchBots('music', ['utility', 'fun'], 'newest');`, "js-search-bots")}
                    >
                      {copied === "js-search-bots" ? (
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
                      <code>{`# Using requests to search for bots
import requests

def search_bots(query=None, tags=None, sort='popular'):
    try:
        # Build parameters
        params = {}
        if query:
            params['q'] = query
        if tags:
            params['tags'] = ','.join(tags)
        params['sort'] = sort
        
        response = requests.get('https://aqua-list.vercel.app/api/bots/search', params=params)
        response.raise_for_status()
        
        data = response.json()
        
        print(f"Found {len(data['bots'])} bots matching criteria")
        print(f"Total pages: {data['totalPages']}")
        
        # Process the bots
        for bot in data['bots']:
            print(f"{bot['name']}: {bot['description']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error searching bots: {e}")

# Call the function with search parameters
search_bots('music', ['utility', 'fun'], 'newest')`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`# Using requests to search for bots
import requests

def search_bots(query=None, tags=None, sort='popular'):
    try:
        # Build parameters
        params = {}
        if query:
            params['q'] = query
        if tags:
            params['tags'] = ','.join(tags)
        params['sort'] = sort
        
        response = requests.get('https://aqua-list.vercel.app/api/bots/search', params=params)
        response.raise_for_status()
        
        data = response.json()
        
        print(f"Found {len(data['bots'])} bots matching criteria")
        print(f"Total pages: {data['totalPages']}")
        
        # Process the bots
        for bot in data['bots']:
            print(f"{bot['name']}: {bot['description']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error searching bots: {e}")

# Call the function with search parameters
search_bots('music', ['utility', 'fun'], 'newest')`, "python-search-bots")}
                    >
                      {copied === "python-search-bots" ? (
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
                      <code>{`# Search for bots with query parameters
curl -X GET "https://aqua-list.vercel.app/api/bots/search?q=music&tags=utility,fun&sort=newest"`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`# Search for bots with query parameters
curl -X GET "https://aqua-list.vercel.app/api/bots/search?q=music&tags=utility,fun&sort=newest"`, "curl-search-bots")}
                    >
                      {copied === "curl-search-bots" ? (
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

          <Card className="border-border/40 shadow-sm" id="authentication">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Authentication
              </CardTitle>
              <CardDescription>
                How to authenticate your API requests
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
                      <code>{`// Using fetch with authentication
const API_TOKEN = 'YOUR_API_TOKEN';

async function authenticatedRequest(endpoint, options = {}) {
  // Merge headers with authentication
  const headers = {
    'Authorization': \`Bearer \${API_TOKEN}\`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  try {
    const response = await fetch(\`https://aqua-list.vercel.app/api/\${endpoint}\`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Example: Get your own bots (requires authentication)
async function getMyBots() {
  const data = await authenticatedRequest('bots/me');
  console.log('My bots:', data.bots);
  return data;
}

getMyBots();`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`// Using fetch with authentication
const API_TOKEN = 'YOUR_API_TOKEN';

async function authenticatedRequest(endpoint, options = {}) {
  // Merge headers with authentication
  const headers = {
    'Authorization': \`Bearer \${API_TOKEN}\`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  
  try {
    const response = await fetch(\`https://aqua-list.vercel.app/api/\${endpoint}\`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Example: Get your own bots (requires authentication)
async function getMyBots() {
  const data = await authenticatedRequest('bots/me');
  console.log('My bots:', data.bots);
  return data;
}

getMyBots();`, "js-auth")}
                    >
                      {copied === "js-auth" ? (
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
                      <code>{`# Using requests with authentication
import requests

API_TOKEN = 'YOUR_API_TOKEN'

def authenticated_request(endpoint, method='GET', params=None, data=None):
    # Set up headers with authentication
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    url = f'https://aqua-list.vercel.app/api/{endpoint}'
    
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, params=params)
        elif method.upper() == 'POST':
            response = requests.post(url, headers=headers, json=data)
        elif method.upper() == 'PUT':
            response = requests.put(url, headers=headers, json=data)
        elif method.upper() == 'DELETE':
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        raise

# Example: Get your own bots (requires authentication)
def get_my_bots():
    data = authenticated_request('bots/me')
    print(f"My bots: {len(data['bots'])}")
    return data

get_my_bots()`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`# Using requests with authentication
import requests

API_TOKEN = 'YOUR_API_TOKEN'

def authenticated_request(endpoint, method='GET', params=None, data=None):
    # Set up headers with authentication
    headers = {
        'Authorization': f'Bearer {API_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    url = f'https://aqua-list.vercel.app/api/{endpoint}'
    
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, params=params)
        elif method.upper() == 'POST':
            response = requests.post(url, headers=headers, json=data)
        elif method.upper() == 'PUT':
            response = requests.put(url, headers=headers, json=data)
        elif method.upper() == 'DELETE':
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported HTTP method: {method}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        raise

# Example: Get your own bots (requires authentication)
def get_my_bots():
    data = authenticated_request('bots/me')
    print(f"My bots: {len(data['bots'])}")
    return data

get_my_bots()`, "python-auth")}
                    >
                      {copied === "python-auth" ? (
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
                      <code>{`# Authenticated request with Bearer token
curl -X GET \\
  https://aqua-list.vercel.app/api/bots/me \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json'`}</code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(`# Authenticated request with Bearer token
curl -X GET \\
  https://aqua-list.vercel.app/api/bots/me \\
  -H 'Authorization: Bearer YOUR_API_TOKEN' \\
  -H 'Content-Type: application/json'`, "curl-auth")}
                    >
                      {copied === "curl-auth" ? (
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
        </div>
      </div>
    </div>
  )
}