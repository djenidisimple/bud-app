'use client'

import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { NumberInput } from "@/components/number-input"

import type { Resource, Spend, Detail, Make } from "@/types"

interface TableBodySpendProps {
  spends: Spend[]
  details: Detail[]
  makes: Make[]
  resources: Resource[]
  onAddSpend: () => void
  onDeleteSpend: (id: number) => void
  onAddDetail: (spendId: number) => void
  onDeleteDetail: (id: number) => void
  onMakeChange: (detailId: number, resourceId: number, value: number) => void
  onUpdateSpend: (id: number, field: string, value: string) => void
  onUpdateDetail: (id: number, field: string, value: string) => void
}

export function TableBodySpend({ spends, details, makes, resources, onAddSpend, onDeleteSpend, onAddDetail, onDeleteDetail, onMakeChange, onUpdateSpend, onUpdateDetail }: TableBodySpendProps) {
  const getResourceMake = (detailId: number, resourceId: number) => {
    return makes.find(m => m.detail_id === detailId && m.resource_id === resourceId)
  }

  const getDetailTotal = (detailId: number) => {
    return makes
      .filter(m => m.detail_id === detailId)
      .reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
  }

  return (
    <TableBody>
      {spends.map((spend) => (
        <Fragment key={`spend-group-${spend.id}`}>
          <TableRow className="bg-[#475569] hover:bg-[#475569]/90 transition-colors group">
            <TableCell className="font-bold py-4 px-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white/70 shrink-0" />
                <input
                  className="flex-1 bg-transparent border-b border-transparent hover:border-white/50 focus:border-white px-1 py-0.5 text-sm font-bold text-white placeholder:text-white/50 focus:outline-none transition-all min-w-0"
                  value={spend.name_spend}
                  placeholder="Catégorie de dépense"
                  onChange={(e) => onUpdateSpend(spend.id, 'name_spend', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-white hover:text-white/80"
                  onClick={() => onDeleteSpend(spend.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
            {resources.map((r) => (
              <TableCell key={r.id} className="text-center py-4">
                <div className="w-px h-4 bg-white/20 mx-auto" />
              </TableCell>
            ))}
            <TableCell className="text-right pr-6 font-black text-white/70">
              —
            </TableCell>
          </TableRow>
          {details
            .filter(d => d.spend_id === spend.id)
            .map((detail) => (
              <TableRow key={`detail-${detail.id}`} className="border-none hover:bg-muted/20 transition-colors group/detail">
                <TableCell className="pl-10 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                    <input
                      className="flex-1 bg-transparent border-b border-transparent hover:border-border focus:border-primary px-1 py-0.5 text-sm text-muted-foreground focus:outline-none transition-all min-w-0"
                      value={detail.name_detail}
                      placeholder="Motif de dépense"
                      onChange={(e) => onUpdateDetail(detail.id, 'name_detail', e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full opacity-0 group-hover/detail:opacity-100 transition-opacity shrink-0"
                      onClick={() => onDeleteDetail(detail.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
                {resources.map((r) => {
                  const make = getResourceMake(detail.id, r.id)
                  return (
                    <TableCell key={r.id} className="p-2">
                      <div className="relative group/input">
                        <NumberInput
                          value={make?.price_spend ?? 0}
                          onChange={(val) => onMakeChange(detail.id, r.id, val)}
                          className="bg-white border border-border/60 rounded-lg px-3 py-1.5 text-right focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                          placeholder="0"
                          autoShrink
                        />
                      </div>
                    </TableCell>
                  )
                })}
                <TableCell className="text-right pr-6 text-sm font-black text-foreground">
                  {formatNumber(getDetailTotal(detail.id))} <span className="text-[10px] font-bold text-muted-foreground/60">Ar</span>
                </TableCell>
              </TableRow>
            ))}
          <TableRow key={`add-detail-${spend.id}`} className="border-none bg-transparent">
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-xs font-medium text-muted-foreground hover:text-primary ml-10 transition-colors"
                onClick={() => onAddDetail(spend.id)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter un motif
              </Button>
            </TableCell>
            {resources.map((r) => <TableCell key={r.id} />)}
            <TableCell />
          </TableRow>
        </Fragment>
      ))}
      <TableRow className="bg-transparent">
        <TableCell className="py-6">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-4 border-dashed border-primary/50 text-primary hover:bg-primary/5 font-bold transition-all hover:scale-105"
            onClick={onAddSpend}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une catégorie
          </Button>
        </TableCell>
        {resources.map((r) => <TableCell key={r.id} />)}
        <TableCell />
      </TableRow>
    </TableBody>
  )
}
