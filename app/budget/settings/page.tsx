'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import axios from 'axios'
import { toast } from "sonner"
import { UserPlus, Settings, Users, ShieldCheck, Edit3, Trash2, Loader2, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AppUser {
  id: number
  name: string
  created_at: string
}

export default function SettingsPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AppUser | null>(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users')
      setUsers(res.data.users || [])
    } catch {
      toast.error("Erreur lors du chargement des utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleEdit = (user: AppUser) => {
    setEditingUser(user)
    setEditName(user.name)
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser || !editName.trim()) return
    setSaving(true)
    try {
      await axios.patch(`/api/users/${editingUser.id}`, { name: editName.trim() })
      toast.success("Utilisateur mis à jour")
      setEditDialogOpen(false)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user: AppUser) => {
    if (!confirm(`Voulez-vous vraiment supprimer l'utilisateur "${user.name}" ?`)) return
    try {
      await axios.delete(`/api/users/${user.id}`)
      toast.success("Utilisateur supprimé")
      fetchUsers()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur")
    }
  }

  return (
    <div className="min-h-screen bg-[#dfe1e7] p-6 space-y-6 font-sans text-[#1f2229]">
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold m-0">
          Paramètres <span className="text-[#2563EB]">Système</span>
        </h1>
        <p className="text-sm text-[#6b7078] m-0">
          Configurez les accès et la gestion des utilisateurs de votre application.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#DBEAFE] text-[#2563EB]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1f2229]">Gestion des Accès</h3>
                <p className="text-xs text-[#6b7078]">Administration des utilisateurs</p>
              </div>
            </div>
            <p className="text-sm text-[#6b7078] mb-8 leading-relaxed">
              L&apos;ajout d&apos;un utilisateur permet de créer un nouvel accès sécurisé à la plateforme BudApp. 
              Chaque compte dispose de ses propres identifiants de connexion.
            </p>
            <Button asChild className="w-full h-12 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2">
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
                <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-full uppercase">Actif</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <span className="text-sm font-bold text-[#1f2229]">Sessions JWT</span>
                <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-full uppercase">Actif</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-[#e6e7eb]">
                <span className="text-sm font-bold text-[#1f2229]">Backup Automatique</span>
                <span className="text-[10px] font-bold text-[#6b7078] bg-gray-100 px-2 py-1 rounded-full uppercase">Désactivé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1f2229] flex items-center gap-2">
              <Users className="h-5 w-5 text-[#2563EB]" />
              Utilisateurs enregistrés
            </h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-[#2563EB]" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-[#6b7078] py-10">Aucun utilisateur trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="text-[#9498a0] font-medium text-xs border-b border-[#e6e7eb]">
                    <th className="pb-3 px-2">Nom</th>
                    <th className="pb-3 px-2">Date de création</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-[#e6e7eb] last:border-none hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-2 font-semibold text-[#1f2229]">{u.name}</td>
                      <td className="py-4 px-2 text-[#6b7078]">
                        {new Date(u.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-[#6b7078] hover:text-[#2563EB] transition-all"
                            title="Modifier"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-[#6b7078] hover:text-red-500 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-[#6b7078]">Nom</label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} className="mt-1" />
            </div>
            <div className="flex items-center gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={() => setEditDialogOpen(false)} className="text-sm">Annuler</Button>
              <Button onClick={handleSaveEdit} disabled={saving} className="bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] text-sm">
                {saving ? <Loader2 className="animate-spin h-4 w-4 mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}