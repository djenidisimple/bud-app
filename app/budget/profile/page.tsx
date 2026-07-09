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
    <div className="min-h-screen bg-[#dfe1e7] p-6 space-y-6 font-sans text-[#1f2229]">
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold m-0">
          Mon <span className="text-[#4f5bd5]">Profil</span>
        </h1>
        <p className="text-sm text-[#6b7078] m-0">
          Gérez vos informations personnelles et vos préférences de compte.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 rounded-full border-4 border-white shadow-sm relative">
                <AvatarFallback className="text-3xl font-bold text-[#4f5bd5] bg-[#eef0fd]">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#1f2229]">{user.name}</h2>
              <p className="text-xs font-bold text-[#4f5bd5] uppercase tracking-wider">Membre Premium</p>
            </div>
            <div className="w-full pt-6 border-t border-[#e6e7eb]">
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#6b7078] uppercase">
                <Shield className="h-3 w-3" />
                Compte Vérifié
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-[#1f2229] mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-[#4f5bd5]" />
              Détails du compte
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 p-4 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6b7078] uppercase mb-1">
                  <User className="h-3 w-3" />
                  Nom d'utilisateur
                </div>
                <p className="text-base font-bold text-[#1f2229]">{user.name}</p>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6b7078] uppercase mb-1">
                  <Mail className="h-3 w-3" />
                  Email
                </div>
                <p className="text-base font-bold text-[#1f2229]">Non renseigné</p>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6b7078] uppercase mb-1">
                  <Calendar className="h-3 w-3" />
                  Date d'inscription
                </div>
                <p className="text-base font-bold text-[#1f2229]">Juillet 2026</p>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6b7078] uppercase mb-1">
                  <Shield className="h-3 w-3" />
                  Rôle
                </div>
                <p className="text-base font-bold text-[#1f2229]">Administrateur</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
