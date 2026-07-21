'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Plus, Pencil, Trash2, Wallet, Loader2 } from "lucide-react"
import { ProjectForm } from "@/components/projet-forms"
import { ProjectDelete } from "@/components/project-delete"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import type { Project } from "@/types"

export function DataProject() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const router = useRouter()

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects")
      setProjects(res.data.projects || [])
    } catch {
      toast.error("Erreur lors du chargement des projets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleSave = async (data: { name_project: string; description_project: string }) => {
    try {
      if (editProject) {
        await axios.put(`/api/projects/${editProject.id}`, data)
        toast.success("Projet mis à jour")
      } else {
        await axios.post("/api/projects", data)
        toast.success("Projet créé")
      }
      setEditProject(null)
      setShowCreate(false)
      fetchProjects()
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur")
    }
  }

  const handleDelete = async () => {
    if (!deleteProject) return
    try {
      await axios.delete(`/api/projects/${deleteProject.id}`)
      toast.success("Projet supprimé")
      setDeleteProject(null)
      fetchProjects()
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-[#2563EB]" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2229] m-0">Mes Projets</h1>
          <p className="text-sm text-[#6b7078] m-0">Gérez vos projets budgétaires</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-[#1D4ED8] transition-all shadow-sm"
        >
          <Plus className="size-4" />
          Nouveau projet
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e6e7eb] p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-4">
            <Wallet className="size-8" />
          </div>
          <p className="text-xl font-bold text-[#1f2229] mb-1">Aucun projet</p>
          <p className="text-sm text-[#6b7078] mb-6">Créez votre premier projet budgétaire pour commencer</p>
          <button 
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-[#1D4ED8] transition-all shadow-sm"
          >
            <Plus className="size-4" />
            Créer un projet
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/budget/transaction/${project.id}`)}
              className="bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-[#1f2229] text-lg truncate pr-8">{project.name_project}</h3>
                <div className="flex gap-1 absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditProject(project) }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7078] transition-colors"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteProject(project) }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#6b7078] line-clamp-2 mb-4">
                {project.description_project || "Aucune description fournie pour ce projet."}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Cliquez pour gérer</span>
                <div className="size-6 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
                  <Wallet className="size-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showCreate || editProject) && (
        <ProjectForm
          project={editProject}
          onSave={handleSave}
          onClose={() => { setEditProject(null); setShowCreate(false) }}
        />
      )}

      {deleteProject && (
        <ProjectDelete
          project={deleteProject}
          onConfirm={handleDelete}
          onClose={() => setDeleteProject(null)}
        />
      )}
    </div>
  )
}
