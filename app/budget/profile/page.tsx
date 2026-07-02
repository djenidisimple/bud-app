'use client'

import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const initials = user.name?.charAt(0).toUpperCase() || "U"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Informations de votre compte</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>Utilisateur</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
