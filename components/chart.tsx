'use client'

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MONTHS_FR } from "@/lib/utils"

interface ChartDataItem {
  created_at: string
  price_resource: number
  makes?: Array<{ price_spend: number }>
  [key: string]: unknown
}

interface ChartAreaInteractiveProps {
  data?: ChartDataItem[]
}

export function ChartAreaInteractive({ data = [] }: ChartAreaInteractiveProps) {
  const [month, setMonth] = useState("Tous")
  const [year, setYear] = useState("Tous")

  const years = [...new Set(data.map(d => new Date(d.created_at).getFullYear().toString()))]

  const filteredData = data.filter(d => {
    const date = new Date(d.created_at)
    const m = date.getMonth()
    const y = date.getFullYear().toString()
    if (month !== "Tous" && MONTHS_FR[m] !== month) return false
    if (year !== "Tous" && y !== year) return false
    return true
  })

  const chartData = filteredData.map(d => ({
    month: MONTHS_FR[new Date(d.created_at).getMonth()].slice(0, 3),
    resource: Number(d.price_resource) || 0,
    spend: d.makes?.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0) || 0,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Aperçu Budget</CardTitle>
          <CardDescription>Évolution des ressources et dépenses</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les mois</SelectItem>
              {MONTHS_FR.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Toutes</SelectItem>
              {years.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.length > 0 ? chartData : [{ month: "Aucune donnée", resource: 0, spend: 0 }]}>
              <defs>
                <linearGradient id="resourceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs text-muted-foreground" />
              <YAxis className="text-xs text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="resource"
                stroke="hsl(var(--chart-1))"
                fill="url(#resourceGrad)"
                name="Ressources"
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="hsl(var(--chart-2))"
                fill="url(#spendGrad)"
                name="Dépenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
