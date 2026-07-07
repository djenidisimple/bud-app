'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartAreaInteractive } from "@/components/chart"
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Loader2 } from "lucide-react"

interface ChartItem {
  name: string
  resource: number
  spend: number
}

interface StatsType {
  projectCount: number
  totalResource: number
  totalSpend: number
  remaining: number
  chartData: ChartItem[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/projects/stats")
        setStats(res.data)
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  const kpis = [
    {
      title: "Nombre de projets",
      value: stats?.projectCount || 0,
      icon: Wallet,
    },
    {
      title: "Budget total",
      value: `${(stats?.totalResource || 0).toLocaleString("fr-FR")} Ar`,
      icon: TrendingUp,
    },
    {
      title: "Dépenses totales",
      value: `${(stats?.totalSpend || 0).toLocaleString("fr-FR")} Ar`,
      icon: TrendingDown,
    },
    {
      title: "Reste à dépenser",
      value: `${(stats?.remaining || 0).toLocaleString("fr-FR")} Ar`,
      icon: PiggyBank,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos budgets</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ChartAreaInteractive data={stats?.chartData || []} />
    </div>
  )
}
