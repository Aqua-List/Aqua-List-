import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Handshake } from "lucide-react"
import Link from "next/link"
import { PartnerAdminCard } from "@/components/admin/partner-card"
import { BotAdminCard } from "@/components/admin/bot-admin-card"

async function hasAdminAccess(userId: string) {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ discordId: userId })

  if (!user) return false

  const hasAccess =
    user.roles &&
    (user.roles.includes(UserRole.ADMIN) ||
      user.roles.includes(UserRole.BOT_REVIEWER) ||
      user.roles.includes(UserRole.BOT_FOUNDER))

  return hasAccess
}

async function isAdminOrFounder(userId: string) {
  const { db } = await connectToDatabase()

  const user = await db.collection("users").findOne({ discordId: userId })

  if (!user) return false

  const hasAccess =
    user.roles &&
    (user.roles.includes(UserRole.ADMIN) ||
      user.roles.includes(UserRole.BOT_FOUNDER))

  return hasAccess
}

async function getAllBots() {
  const { db } = await connectToDatabase()
  return await db.collection("bots").find({}).sort({ createdAt: -1 }).toArray()
}

async function getPendingBots() {
  const { db } = await connectToDatabase()
  return await db.collection("bots").find({ status: "pending" }).sort({ createdAt: -1 }).toArray()
}

async function getAllPartners() {
  const { db } = await connectToDatabase()
  return await db.collection("partners").find({}).sort({ createdAt: -1 }).toArray()
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/login?callbackUrl=/admin")
  }

  const canAccess = await hasAdminAccess(session.user.discordId)
  const canManagePartners = await isAdminOrFounder(session.user.discordId)

  if (!canAccess) {
    return redirect("/")
  }

  const allBots = await getAllBots()
  const pendingBots = await getPendingBots()
  const partners = canManagePartners ? await getAllPartners() : []

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage bots and review submissions</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Pending Review ({pendingBots.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All Bots ({allBots.length})
          </TabsTrigger>
          {canManagePartners && (
            <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Partners ({partners.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingBots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingBots.map((bot) => (
                <BotAdminCard 
                  key={bot._id.toString()} 
                  bot={bot} 
                  isPending={true} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-primary/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No pending bots</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There are no bots waiting for review at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {allBots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBots.map((bot) => (
                <BotAdminCard 
                  key={bot._id.toString()} 
                  bot={bot} 
                  isPending={bot.status === "pending"} 
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-primary/50 mb-4" />
                <h3 className="text-xl font-medium mb-2">No bots found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There are no bots in the database.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {canManagePartners && (
          <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Partners</h2>
              <Link href="/admin/partners/new">
                <Button>
                  <Handshake className="h-4 w-4 mr-2" /> Add Partner
                </Button>
              </Link>
            </div>
            
            {partners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <PartnerAdminCard 
                    key={partner._id.toString()} 
                    partner={partner} 
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Handshake className="h-12 w-12 text-primary/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No partners yet</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    You haven't added any partners yet. Click the "Add Partner" button to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
