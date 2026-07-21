'use client'

import { useState } from 'react'
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Shield, Mail, Calendar, Edit3, Save, Loader2, X } from "lucide-react"
import axios from 'axios'
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, checkSession } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)

  if (!user) return null

  const initials = user.name?.charAt(0).toUpperCase() || "U"

  const handleEdit = () => {
    setName(user.name)
    setPassword('')
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setPassword('')
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Le nom ne peut pas être vide")
      return
    }
    setSaving(true)
    try {
      const payload: Record<string, string> = { name: name.trim() }
      if (password.trim()) payload.password = password.trim()

      await axios.patch('/api/auth/profile', payload)
      toast.success("Profil mis à jour avec succès")
      setEditing(false)
      setPassword('')
      await checkSession()
    } catch (err: any) {
      const msg = err.response?.data?.error || "Erreur lors de la mise à jour"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#dfe1e7] p-6 space-y-6 font-sans text-[#1f2229]">
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold m-0">
          Mon <span className="text-[#2563EB]">Profil</span>
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
                <AvatarFallback className="text-3xl font-bold text-[#2563EB] bg-[#DBEAFE]">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#1f2229]">{user.name}</h2>
              <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Membre Premium</p>
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#1f2229] flex items-center gap-2">
                <User className="h-5 w-5 text-[#2563EB]" />
                Détails du compte
              </h3>
              {editing ? (
                <div className="flex items-center gap-2">
                  <Button onClick={handleSave} disabled={saving} className="h-9 px-4 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] text-xs">
                    {saving ? <Loader2 className="animate-spin h-3 w-3 mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                    Sauvegarder
                  </Button>
                  <Button onClick={handleCancel} variant="ghost" className="h-9 px-4 rounded-xl text-xs">
                    <X className="h-3 w-3 mr-1" /> Annuler
                  </Button>
                </div>
              ) : (
                <Button onClick={handleEdit} className="h-9 px-4 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] text-xs">
                  <Edit3 className="h-3 w-3 mr-1" /> Modifier
                </Button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 p-4 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6b7078] uppercase mb-1">
                  <User className="h-3 w-3" />
                  Nom d&apos;utilisateur
                </div>
                {editing ? (
                  <Input value={name} onChange={e => setName(e.target.value)} className="text-base font-bold" />
                ) : (
                  <p className="text-base font-bold text-[#1f2229]">{user.name}</p>
                )}
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
                  Date d&apos;inscription
                </div>
                <p className="text-base font-bold text-[#1f2229]">Juillet 2026</p>
              </div>
              <div className="space-y-1 p-4 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6b7078] uppercase mb-1">
                  <Shield className="h-3 w-3" />
                  Mot de passe
                </div>
                {editing ? (
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Nouveau mot de passe (min. 6 car.)"
                    className="text-base"
                  />
                ) : (
                  <p className="text-base font-bold text-[#1f2229]">••••••••</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}