import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { UserRole } from "@/lib/models/user"
import { PartnerForm } from "@/components/admin/partner-form"
import { ObjectId } from "mongodb"

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

async function getPartner(id: string) {
  try {
    const { db } = await connectToDatabase()
    return await db.collection("partners").findOne({ _id: new ObjectId(id) })
  } catch (error) {
    return null
  }
}

export default async function EditPartnerPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return redirect(`/login?callbackUrl=/admin/partners/${params.id}/edit`)
  }

  const canManagePartners = await isAdminOrFounder(session.user.discordId)

  if (!canManagePartners) {
    return redirect("/admin")
  }

  const partner = await getPartner(params.id)

  if (!partner) {
    return redirect("/admin?tab=partners")
  }

  return (
    <div className="container max-w-4xl py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Partner</h1>
        <p className="text-muted-foreground">Update partnership details for {partner.name}</p>
      </div>

      <PartnerForm partner={partner} />
    </div>
  )
} 