"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { UserRole } from "@/lib/models/user"
import PendingBots from "@/components/admin/pending-bots"
import UserManagement from "@/components/admin/user-management"
import AdminStats from "@/components/admin/stats"

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("pending-bots")

  const userRoles = session?.user?.roles || []

  const isAdmin = userRoles.includes(UserRole.ADMIN)
  const isFounder = userRoles.includes(UserRole.BOT_FOUNDER)
  const isReviewer = userRoles.includes(UserRole.BOT_REVIEWER)

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending-bots">Pending Bots</TabsTrigger>
          {(isAdmin || isFounder) && <TabsTrigger value="user-management">User Management</TabsTrigger>}
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending-bots">
          <PendingBots />
        </TabsContent>

        {(isAdmin || isFounder) && (
          <TabsContent value="user-management">
            <UserManagement />
          </TabsContent>
        )}

        <TabsContent value="stats">
          <AdminStats />
        </TabsContent>
      </Tabs>
    </div>
  )
}

