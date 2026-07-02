'use client'

import { Button } from "@/components/ui/button"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

interface Resource {
  id: number
  [key: string]: unknown
}

interface Spend {
  id: number
  name_spend: string
  [key: string]: unknown
}

interface Detail {
  id: number
  spend_id: number
  name_detail: string
  [key: string]: unknown
}

interface Make {
  id: number
  detail_id: number
  resource_id: number
  price_spend: number
  [key: string]: unknown
}

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
}

export function TableBodySpend({ spends, details, makes, resources, onAddSpend, onDeleteSpend, onAddDetail, onDeleteDetail, onMakeChange }: TableBodySpendProps) {
  const getResourceMake = (detailId, resourceId) => {
    return makes.find(m => m.detail_id === detailId && m.resource_id === resourceId)
  }

  const getDetailTotal = (detailId) => {
    return makes
      .filter(m => m.detail_id === detailId)
      .reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
  }

  return (
    <TableBody>
      {spends.map((spend) => (
        <>
          <TableRow key={`spend-${spend.id}`} className="bg-muted/30">
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 bg-transparent border-b border-dashed border-muted-foreground/30 px-1 py-0.5 text-sm font-medium focus:outline-none focus:border-primary"
                  value={spend.name_spend}
                  placeholder="Catégorie de dépense"
                  onChange={(e) => {
                    spend.name_spend = e.target.value
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => onDeleteSpend(spend.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </TableCell>
            {resources.map((r) => (
              <TableCell key={r.id} className="text-center text-xs text-muted-foreground">
                —
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
          {details
            .filter(d => d.spend_id === spend.id)
            .map((detail) => (
              <TableRow key={`detail-${detail.id}`} className="border-none">
                <TableCell>
                  <div className="flex items-center gap-2 pl-4">
                    <input
                      className="flex-1 bg-transparent border-b border-dashed border-muted-foreground/20 px-1 py-0.5 text-sm focus:outline-none focus:border-primary"
                      value={detail.name_detail}
                      placeholder="Motif de dépense"
                      onChange={(e) => {
                        detail.name_detail = e.target.value
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0"
                      onClick={() => onDeleteDetail(detail.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
                {resources.map((r) => {
                  const make = getResourceMake(detail.id, r.id)
                  return (
                    <TableCell key={r.id} className="p-1">
                      <input
                        type="number"
                        className="w-full bg-muted/50 border border-border/50 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-primary"
                        value={make?.price_spend ?? ""}
                        placeholder="0"
                        onChange={(e) => onMakeChange(detail.id, r.id, Number(e.target.value) || 0)}
                      />
                    </TableCell>
                  )
                })}
                <TableCell className="text-right text-sm font-medium pr-4">
                  {getDetailTotal(detail.id).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          <TableRow key={`add-detail-${spend.id}`} className="border-none">
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground ml-4"
                onClick={() => onAddDetail(spend.id)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter un motif
              </Button>
            </TableCell>
            {resources.map((r) => <TableCell key={r.id} />)}
            <TableCell />
          </TableRow>
        </>
      ))}
      <TableRow>
        <TableCell>
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onAddSpend}>
            <Plus className="h-3 w-3 mr-1" />
            Ajouter une catégorie
          </Button>
        </TableCell>
        {resources.map((r) => <TableCell key={r.id} />)}
        <TableCell />
      </TableRow>
    </TableBody>
  )
}
