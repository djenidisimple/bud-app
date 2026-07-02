'use client'

import { useState } from "react"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface Detail {
  id: number
  spend_id: number
  name_detail: string
  [key: string]: unknown
}

interface Resource {
  id: number
  [key: string]: unknown
}

interface Make {
  id: number
  detail_id: number
  resource_id: number
  price_spend: number
  _new?: boolean
  _delete?: boolean
  [key: string]: unknown
}

interface TableBodyMakeProps {
  details: Detail[]
  makes: Make[]
  resources: Resource[]
}

export function TableBodyMake({ details, makes, resources }: TableBodyMakeProps) {
  const [localMakes, setLocalMakes] = useState<Make[]>(makes || [])

  const getMake = (detailId: number, resourceId: number) => {
    return localMakes.find(
      (m) => m.detail_id === detailId && m.resource_id === resourceId
    )
  }

  const updateMake = (detailId: number, resourceId: number, value: number) => {
    setLocalMakes((prev) => {
      const existing = prev.find(
        (m) => m.detail_id === detailId && m.resource_id === resourceId
      )
      if (existing) {
        return prev.map((m) =>
          m.detail_id === detailId && m.resource_id === resourceId
            ? { ...m, price_spend: value }
            : m
        )
      }
      return [
        ...prev,
        {
          id: -Date.now(),
          _new: true,
          detail_id: detailId,
          resource_id: resourceId,
          price_spend: value,
        } satisfies Make,
      ]
    })
  }

  const deleteMake = (detailId: number, resourceId: number) => {
    setLocalMakes((prev) =>
      prev.map((m) =>
        m.detail_id === detailId && m.resource_id === resourceId
          ? { ...m, _delete: true }
          : m
      )
    )
  }

  const getDetailTotal = (detailId: number) => {
    return localMakes
      .filter((m) => m.detail_id === detailId && !m._delete)
      .reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
  }

  return (
    <TableBody>
      {details.map((detail) => (
        <TableRow key={detail.id}>
          <TableCell className="font-medium pl-8">{detail.name_detail}</TableCell>
          {resources.map((resource) => {
            const make = getMake(detail.id, resource.id)
            return (
              <TableCell key={resource.id} className="p-1">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="w-full bg-muted/50 border border-border/50 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-primary"
                    value={make?.price_spend ?? ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateMake(detail.id, resource.id, Number(e.target.value) || 0)
                    }
                  />
                  {make && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => deleteMake(detail.id, resource.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            )
          })}
          <TableCell className="text-right font-medium">
            {getDetailTotal(detail.id).toLocaleString()}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export default TableBodyMake
