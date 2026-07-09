'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserPlus, Settings, Users, ShieldCheck } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#dfe1e7] p-6 space-y-6 font-sans text-[#1f2229]">
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold m-0">
          Paramètres <span className="text-[#4f5bd5]">Système</span>
        </h1>
        <p className="text-sm text-[#6b7078] m-0">
          Configurez les accès et la gestion des utilisateurs de votre application.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#eef0fd] text-[#4f5bd5]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1f2229]">Gestion des Accès</h3>
                <p className="text-xs text-[#6b7078]">Administration des utilisateurs</p>
              </div>
            </div>
            <p className="text-sm text-[#6b7078] mb-8 leading-relaxed">
              L'ajout d'un utilisateur permet de créer un nouvel accès sécurisé à la plateforme BudApp. 
              Chaque compte dispose de ses propres identifiants de connexion.
            </p>
            <Button asChild className="w-full h-12 rounded-xl bg-[#4f5bd5] text-white font-bold hover:bg-[#3f4bb5] transition-all flex items-center justify-center gap-2">
              <Link href="/budget/settings/register">
                <UserPlus className="h-5 w-5" />
                Créer un compte utilisateur
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1f2229]">Sécurité</h3>
                <p className="text-xs text-[#6b7078]">Protection des données</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <span className="text-sm font-bold text-[#1f2229]">Cryptage AES-256</span>
                <span className="text-[10px] font-bold text-[#1a9e6f] bg-[#e6f7f0] px-2 py-1 rounded-full uppercase">Actif</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <span className="text-sm font-bold text-[#1f2229]">Sessions JWT</span>
                <span className="text-[10px] font-bold text-[#1a9e6f] bg-[#e6f7f0] px-2 py-1 rounded-full uppercase">Actif</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <span className="text-sm font-bold text-[#1f2229]">Backup Automatique</span>
                <span className="text-[10px] font-bold text-[#6b7078] bg-gray-100 px-2 py-1 rounded-full uppercase">Désactivé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
