'use client'

import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Shield, Mail, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const initials = user.name?.charAt(0).toUpperCase() || "U"

  return (
    <div className="space-y-10 max-w-4xl mx-auto p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Mon <span className="text-primary">Profil</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Gérez vos informations personnelles et vos préférences de compte.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1 overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-3xl">
          <div className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-indigo-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Avatar className="h-24 w-24 rounded-full border-4 border-white shadow-xl relative">
                <AvatarFallback className="text-3xl font-black text-primary bg-primary/10">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-foreground">{user.name}</h2>
              <p className="text-sm font-bold text-primary uppercase tracking-widest">Membre Premium</p>
            </div>
            <div className="w-full pt-6 border-t border-border/60">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                <Shield className="h-3 w-3" />
                Compte Vérifié
              </div>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-3xl">
          <div className="p-8">
            <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Détails du compte
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  <User className="h-3 w-3" />
                  Nom d'utilisateur
                </div>
                <p className="text-lg font-bold text-foreground">{user.name}</p>
              </div>
              <div className="space-y-1 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  <Mail className="h-3 w-3" />
                  Email
                </div>
                <p className="text-lg font-bold text-foreground">Non renseigné</p>
              </div>
              <div className="space-y-1 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  <Calendar className="h-3 w-3" />
                  Date d'inscription
                  <span className="ml-auto text-[10px] opacity-50">2026</span>
                </div>
                <p className="text-lg font-bold text-foreground">Juillet 2026</p>
              </div>
              <div className="space-y-1 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  <Shield className="h-3 w-3" />
                  Rôle
                </div>
                <p className="text-lg font-bold text-foreground">Administrateur</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
