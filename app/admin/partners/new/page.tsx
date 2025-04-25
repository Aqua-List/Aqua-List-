import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"
import { PartnerForm } from "@/components/admin/partner-form"

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

export default async function NewPartnerPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect("/login?callbackUrl=/admin/partners/new")
  }

  const canManagePartners = await isAdminOrFounder(session.user.discordId)

  if (!canManagePartners) {
    return redirect("/admin")
  }

  return (
    <div className="container max-w-4xl py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Partner</h1>
        <p className="text-muted-foreground">Create a new partnership for AquaList</p>
      </div>

      <PartnerForm />
    </div>
  )
} 