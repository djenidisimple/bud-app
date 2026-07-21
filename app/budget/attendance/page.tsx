'use client'

import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { Search, Bell, Filter, Plus, ChevronLeft, ChevronRight, MoreHorizontal, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProjectResource {
  price_resource: number
  makes: { price_spend: number }[]
}

interface Project {
  id: number
  name_project: string
  description_project: string
  active: number
  created_at: string
  totalResource: number
  totalSpend: number
  remaining: number
}

const ITEMS_PER_PAGE = 10

export default function AttendancePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects')
      setProjects(response.data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      toast.error("Erreur lors du chargement des projets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects
    const q = search.toLowerCase()
    return projects.filter(p =>
      p.name_project.toLowerCase().includes(q) ||
      p.description_project.toLowerCase().includes(q)
    )
  }, [projects, search])

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE))
  const paginatedProjects = filteredProjects.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  useEffect(() => {
    if (page > totalPages) setPage(1)
  }, [totalPages, page])

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Le nom du projet est requis")
      return
    }
    setCreating(true)
    try {
      await axios.post('/api/projects', {
        name_project: newProjectName.trim(),
        description_project: newProjectDesc.trim(),
      })
      toast.success("Projet créé avec succès")
      setDialogOpen(false)
      setNewProjectName('')
      setNewProjectDesc('')
      fetchProjects()
    } catch (err: any) {
      const msg = err.response?.data?.error || "Erreur lors de la création"
      toast.error(msg)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#dfe2e8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB]"></div>
      </div>
    )
  }

  return (
    <div className="p-7 bg-[#dfe2e8] min-h-screen font-sans text-[#1f2430]">
      <div className="max-w-[1400px] mx-auto bg-[#eef0f4] rounded-[24px] overflow-hidden shadow-[0_30px_60px_rgba(20,20,40,0.15)] min-h-[640px] p-8">
        
        {/* Topbar */}
        <div className="flex justify-end items-center gap-3 mb-6">
          <button className="w-9 h-9 rounded-full bg-white border border-[#eceef2] flex items-center justify-center text-[#8a90a2] hover:bg-gray-50 transition-colors">
            <Bell size={18} />
          </button>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#eceef2]">
            <img src="https://i.pravatar.cc/64?img=12" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Projets" value={projects.length.toString()} delta="Tous les projets" deltaColor="text-[#1fbf75]" />
          <StatCard label="Projets Actifs" value={projects.filter(p => p.active === 1).length.toString()} delta="En cours" deltaColor="text-[#1fbf75]" />
          <StatCard label="Projets Inactifs" value={projects.filter(p => p.active === 0).length.toString()} delta="Archivés" deltaColor="text-[#f0483e]" />
          <StatCard label="Budget Total" value={`${projects.reduce((s, p) => s + (p.totalResource || 0), 0).toLocaleString('fr-FR')} Ar`} delta="Tous projets" deltaColor="text-[#2563EB]" />
        </div>

        {/* Main Panel */}
        <div className="bg-white rounded-[14px] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Suivi des Projets</h2>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-[#f4f5f8] rounded-xl px-3 py-2 text-[#8a90a2] text-sm min-w-[160px]">
                <Search size={13} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  className="bg-transparent border-none outline-none w-full text-[#1f2430] placeholder:text-[#8a90a2]"
                />
              </div>
              <button className="flex items-center gap-2 border border-[#eceef2] bg-white rounded-xl px-3 py-2 text-sm font-medium text-[#1f2430] hover:bg-gray-50">
                <Filter size={14} />
                Filtre
              </button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 bg-[#2563EB] text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-[#1D4ED8] transition-colors">
                    <Plus size={14} />
                    Nouveau Projet
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nouveau Projet</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-medium text-[#6b7078]">Nom du projet</label>
                      <Input
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                        placeholder="Ex: Construction bâtiment A"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#6b7078]">Description</label>
                      <Input
                        value={newProjectDesc}
                        onChange={e => setNewProjectDesc(e.target.value)}
                        placeholder="Description optionnelle"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleCreateProject}
                      disabled={creating}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold"
                    >
                      {creating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                      {creating ? "Création..." : "Créer le projet"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[#8a90a2] text-[12.5px] font-semibold border-b border-[#eceef2]">
                  <th className="py-2.5 px-2 w-10"><div className="w-4 h-4 border-[1.5px] border-[#d8dae0] rounded-[5px]"></div></th>
                  <th className="py-2.5 px-2">Nom du Projet</th>
                  <th className="py-2.5 px-2">Budget / État</th>
                  <th className="py-2.5 px-2">Créé le</th>
                  <th className="py-2.5 px-2">Reste</th>
                  <th className="py-2.5 px-2">Statut</th>
                  <th className="py-2.5 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map(p => (
                  <tr key={p.id} className="border-b border-[#eceef2] text-sm hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/budget/transaction/${p.id}`)}>
                    <td className="py-3 px-2" onClick={e => e.stopPropagation()}><div className="w-4 h-4 border-[1.5px] border-[#d8dae0] rounded-[5px]"></div></td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[#2563EB] font-bold text-xs">
                          {p.name_project.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{p.name_project}</div>
                          <div className="text-[#8a90a2] text-xs truncate max-w-[200px]">{p.description_project || 'Aucune description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[#1f2430] font-medium">{(p.totalResource || 0).toLocaleString('fr-FR')} Ar</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[#1f2430]">
                      {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`font-semibold ${(p.remaining || 0) < 0 ? 'text-[#f0483e]' : 'text-[#1f2430]'}`}>
                        {(p.remaining || 0).toLocaleString('fr-FR')} Ar
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-2 font-semibold text-sm ${p.active === 1 ? 'text-[#1fbf75]' : 'text-[#f0483e]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.active === 1 ? 'bg-[#1fbf75]' : 'bg-[#f0483e]'}`}></span>
                        {p.active === 1 ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button className="text-[#8a90a2] hover:text-[#1f2430] transition-colors" onClick={e => e.stopPropagation()}>
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedProjects.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-[#8a90a2]">
                      {search ? 'Aucun projet ne correspond à votre recherche.' : 'Aucun projet trouvé.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredProjects.length > ITEMS_PER_PAGE && (
            <div className="flex justify-between items-center py-4 text-sm text-[#8a90a2]">
              <div className="flex items-center gap-2">
                {filteredProjects.length} projet{(filteredProjects.length > 1) ? 's' : ''} trouvé{(filteredProjects.length > 1) ? 's' : ''}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-7 h-7 rounded-lg border border-[#eceef2] bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-semibold transition-colors ${
                      page === p
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'border-[#eceef2] bg-white hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="w-7 h-7 rounded-lg border border-[#eceef2] bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, delta, deltaColor }: { label: string, value: string, delta: string, deltaColor: string }) {
  return (
    <div className="bg-white rounded-[14px] p-5 shadow-sm border border-transparent hover:border-[#eceef2] transition-all">
      <div className="text-[#8a90a2] text-xs mb-2">{label}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className={`text-xs flex items-center gap-1 font-medium ${deltaColor}`}>
        {delta}
      </div>
    </div>
  )
}