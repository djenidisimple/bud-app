'use client'

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

export function TableBodyMake2({ make, resources, details, onUpdate }) {
  const [value, setValue] = useState(make?.price_spend?.toString() || "")

  useEffect(() => {
    setValue(make?.price_spend?.toString() || "")
  }, [make?.price_spend])

  const resource = resources.find((r) => r.id === make?.resource_id)
  const detail = details.find((d) => d.id === make?.detail_id)

  if (!resource || !detail) return null

  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)
    onUpdate(make.detail_id, make.resource_id, Number(newValue) || 0)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-20 truncate">{resource.origine_resource}</span>
      <span className="text-xs text-muted-foreground w-20 truncate">{detail.name_detail}</span>
      <Input
        type="number"
        className="h-7 w-24 text-sm text-right"
        value={value}
        onChange={handleChange}
        placeholder="0"
      />
    </div>
  )
}
