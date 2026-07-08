'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserPlus, Settings, Users, ShieldCheck } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Paramètres <span className="text-primary">Système</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Configurez les accès et la gestion des utilisateurs de votre application.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-3xl">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground">Gestion des Accès</h3>
                <p className="text-sm text-muted-foreground">Administration des utilisateurs</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              L'ajout d'un utilisateur permet de créer un nouvel accès sécurisé à la plateforme BudApp. 
              Chaque compte dispose de ses propres identifiants de connexion.
            </p>
            <Button asChild className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
              <Link href="/budget/settings/register">
                <UserPlus className="h-5 w-5" />
                Créer un compte utilisateur
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-3xl">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground">Sécurité</h3>
                <p className="text-sm text-muted-foreground">Protection des données</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
                <span className="text-sm font-bold text-foreground">Cryptage AES-256</span>
                <span className="text-[10px] font-black text-success bg-success/10 px-2 py-1 rounded-full uppercase">Actif</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
                <span className="text-sm font-bold text-foreground">Sessions JWT</span>
                <span className="text-[10px] font-black text-success bg-success/10 px-2 py-1 rounded-full uppercase">Actif</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
                <span className="text-sm font-bold text-foreground">Backup Automatique</span>
                <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-1 rounded-full uppercase">Désactivé</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
