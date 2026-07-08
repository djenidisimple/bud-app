'use client'

import { Button } from "@/components/ui/button"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Wallet } from "lucide-react"
import { formatNumber } from "@/lib/utils"

import type { Resource } from "@/types"

interface TableHeaderComponentProps {
  resources: Resource[]
  onAddResource: () => void
  onDeleteResource: (id: number) => void
  onUpdateResource: (id: number, field: string, value: string) => void
}

export function TableHeaderComponent({ resources, onAddResource, onDeleteResource, onUpdateResource }: TableHeaderComponentProps) {
  return (
    <TableHeader className="bg-muted/20">
      <TableRow>
        <TableHead className="w-[250px] min-w-[200px] py-4 px-6 text-foreground font-bold text-base">
          Dépenses / Motifs
        </TableHead>
        {resources.map((r) => (
          <TableHead key={r.id} className="min-w-[150px] p-4">
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-primary">
                  <Wallet className="h-4 w-4" />
                  <input
                    className="w-full bg-transparent font-bold text-sm focus:outline-none focus:border-b border-primary transition-colors"
                    value={r.origine_resource}
                    placeholder="Nom ressource"
                    onChange={(e) => onUpdateResource(r.id, 'origine_resource', e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onDeleteResource(r.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Budget</span>
                <input
                  type="number"
                  className="w-full bg-transparent text-right font-black text-sm text-success focus:outline-none"
                  value={r.price_resource}
                  onChange={(e) => onUpdateResource(r.id, 'price_resource', e.target.value)}
                />
                <span className="text-[10px] font-bold text-success">Ar</span>
              </div>
            </div>
          </TableHead>
        ))}
        <TableHead className="w-[60px] p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg transition-transform hover:scale-110" 
            onClick={onAddResource}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}
