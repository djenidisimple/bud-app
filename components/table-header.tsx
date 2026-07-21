'use client'

import { Button } from "@/components/ui/button"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Wallet, Equal } from "lucide-react"
import { NumberInput } from "@/components/number-input"

import type { Resource } from "@/types"

interface TableHeaderComponentProps {
  resources: Resource[]
  onAddResource: () => void
  onDeleteResource: (id: number) => void
  onUpdateResource: (id: number, field: string, value: any) => void
}

export function TableHeaderComponent({ resources, onAddResource, onDeleteResource, onUpdateResource }: TableHeaderComponentProps) {
  return (
    <TableHeader className="bg-muted/20">
      <TableRow>
        <TableHead className="w-[250px] min-w-[220px] py-4 px-6 text-foreground font-bold text-base">
          Dépenses / Motifs
        </TableHead>
        {resources.map((r) => (
          <TableHead key={r.id} className="min-w-[180px] p-3">
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-white border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-primary min-w-0 flex-1">
                  <Wallet className="h-4 w-4 shrink-0" />
                  <input
                    className="w-full bg-transparent font-bold text-sm focus:outline-none focus:border-b border-primary transition-colors min-w-0"
                    value={r.origine_resource}
                    placeholder="Nom ressource"
                    onChange={(e) => onUpdateResource(r.id, 'origine_resource', e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => onDeleteResource(r.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter shrink-0">Budget</span>
                <NumberInput
                  value={Number(r.price_resource) || 0}
                  onChange={(val) => onUpdateResource(r.id, 'price_resource', val)}
                  className="text-success"
                  suffix="Ar"
                  autoShrink
                />
              </div>
            </div>
          </TableHead>
        ))}
        <TableHead className="min-w-[120px] p-3 text-center text-muted-foreground font-bold text-sm uppercase tracking-wider">
          <div className="flex items-center justify-center gap-2">
            <Equal className="h-4 w-4" />
            <span>Total</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg transition-transform hover:scale-110 shrink-0 ml-2"
              onClick={onAddResource}
              title="Ajouter une source de financement"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}
