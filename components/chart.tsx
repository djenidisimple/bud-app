'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"

interface ChartItem {
  name: string
  resource: number
  spend: number
}

interface ChartAreaInteractiveProps {
  data?: ChartItem[]
}

export function ChartAreaInteractive({ data = [] }: ChartAreaInteractiveProps) {
  const chartData = data.map(d => ({
    name: d.name,
    resource: Number(d.resource) || 0,
    spend: Number(d.spend) || 0,
  })).sort((a, b) => b.resource - a.resource)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aperçu Budget</CardTitle>
        <CardDescription>Répartition des ressources et dépenses par source de financement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData.length > 0 ? chartData : [{ name: "Aucune donnée", resource: 0, spend: 0 }]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
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
              <XAxis
                dataKey="name"
                className="text-xs text-muted-foreground"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis className="text-xs text-muted-foreground" tickFormatter={(v) => formatNumber(v)} />
              <Tooltip
                formatter={(value: number) => formatNumber(value)}
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
                name="Budget"
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
