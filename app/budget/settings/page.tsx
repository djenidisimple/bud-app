'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserPlus } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gestion des utilisateurs</p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <CardDescription>
            Créez de nouveaux comptes utilisateurs pour accéder à l&apos;application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/budget/settings/register">
              <UserPlus className="mr-2 h-4 w-4" />
              Créer un compte
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
