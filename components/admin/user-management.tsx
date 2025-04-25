"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { RoleBadge } from "@/components/role-badge"
import { UserRole } from "@/lib/models/user"

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [savingUserId, setSavingUserId] = useState<string | null>(null)
  const { toast } = useToast()

  const [userRoles, setUserRoles] = useState<{ [key: string]: string[] }>({})

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter((user) => user.username.toLowerCase().includes(query) || user.discordId.includes(query)),
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)

        const initialRoles: { [key: string]: string[] } = {}
        data.users.forEach((user: any) => {
          initialRoles[user._id] = user.roles || []
        })
        setUserRoles(initialRoles)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleToggle = (userId: string, role: string) => {
    setUserRoles((prev) => {
      const currentRoles = [...(prev[userId] || [])]

      if (currentRoles.includes(role)) {
        return {
          ...prev,
          [userId]: currentRoles.filter((r) => r !== role),
        }
      } else {
        return {
          ...prev,
          [userId]: [...currentRoles, role],
        }
      }
    })
  }

  const handleSaveRoles = async (userId: string) => {
    setSavingUserId(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roles: userRoles[userId] || [],
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User roles updated successfully",
        })

        setUsers(
          users.map((user) => {
            if (user._id === userId) {
              return {
                ...user,
                roles: userRoles[userId] || [],
              }
            }
            return user
          }),
        )
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update user roles",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating user roles:", error)
      toast({
        title: "Error",
        description: "Failed to update user roles",
        variant: "destructive",
      })
    } finally {
      setSavingUserId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search users by username or Discord ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No users found.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-center gap-4">
                        <Image
                          src={user.avatar || "/placeholder.svg?height=80&width=80"}
                          alt={user.username}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-bold">{user.username}</h3>
                          <p className="text-sm text-muted-foreground">Discord ID: {user.discordId}</p>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="mb-2">
                          <p className="text-sm font-medium mb-1">Current Roles:</p>
                          <div className="flex flex-wrap gap-1">
                            {userRoles[user._id]?.length > 0 ? (
                              userRoles[user._id].map((role) => <RoleBadge key={role} role={role} showIcon={true} />)
                            ) : (
                              <span className="text-sm text-muted-foreground">No roles assigned</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                          {Object.values(UserRole).map((role) => (
                            <div key={role} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${user._id}-${role}`}
                                checked={userRoles[user._id]?.includes(role)}
                                onCheckedChange={() => handleRoleToggle(user._id, role)}
                              />
                              <Label htmlFor={`${user._id}-${role}`} className="text-sm font-normal">
                                {role}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-end">
                        <Button onClick={() => handleSaveRoles(user._id)} disabled={savingUserId === user._id}>
                          {savingUserId === user._id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Roles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

