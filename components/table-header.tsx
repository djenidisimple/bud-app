'use client'

import { Button } from "@/components/ui/button"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

interface Resource {
  id: number
  origine_resource: string
  [key: string]: unknown
}

interface TableHeaderComponentProps {
  resources: Resource[]
  onAddResource: () => void
  onDeleteResource: (id: number) => void
}

export function TableHeaderComponent({ resources, onAddResource, onDeleteResource }: TableHeaderComponentProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px] min-w-[150px]">Dépenses / Ressources</TableHead>
        {resources.map((r) => (
          <TableHead key={r.id} className="min-w-[120px]">
            <div className="flex items-center gap-1">
              <input
                className="w-full bg-transparent border-b border-dashed border-muted-foreground/30 px-1 py-0.5 text-sm focus:outline-none focus:border-primary"
                value={r.origine_resource}
                placeholder="Nom ressource"
                onChange={(e) => {
                  r.origine_resource = e.target.value
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => onDeleteResource(r.id)}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          </TableHead>
        ))}
        <TableHead className="w-[50px]">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddResource}>
            <Plus className="h-4 w-4" />
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}
