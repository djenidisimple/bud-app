'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Plus, Pencil, Trash2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectForm } from "@/components/projet-forms"
import { ProjectDelete } from "@/components/project-delete"
import { toast } from "sonner"

interface Project {
  id: number
  name_project: string
  description_project?: string
  [key: string]: unknown
}

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes Projets</h1>
          <p className="text-muted-foreground">Gérez vos projets budgétaires</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Aucun projet</p>
            <p className="text-sm text-muted-foreground mb-4">Créez votre premier projet budgétaire</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un projet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/budget/transaction/${project.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{project.name_project}</CardTitle>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteProject(project)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {project.description_project || "Aucune description"}
                </CardDescription>
              </CardHeader>
            </Card>
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
