'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Project {
  id: number
  name_project: string
  [key: string]: unknown
}

interface ProjectDeleteProps {
  project: Project
  onConfirm: () => Promise<void>
  onClose: () => void
}

export function ProjectDelete({ project, onConfirm, onClose }: ProjectDeleteProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le projet</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le projet &quot;{project?.name_project}&quot; ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
