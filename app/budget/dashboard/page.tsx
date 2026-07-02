'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartAreaInteractive } from "@/components/chart"
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react"

interface StatsType {
  projectCount: number
  totalResource: number
  totalSpend: number
  remaining: number
  chartData: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projectsRes = await axios.get("/api/projects")
        const projects = projectsRes.data.projects || []

        let totalResource = 0
        let totalSpend = 0
        let allResources: any[] = []

        for (const project of projects) {
          const dataRes = await axios.get(`/api/projects/${project.id}/data`)
          const data = dataRes.data
          totalResource += data.budget?.totalResource || 0
          totalSpend += data.budget?.totalSpend || 0
          allResources = [...allResources, ...(data.resources || [])]
        }

        // Group resources by origina_resource for chart data
        const chartData = allResources.map(r => ({
          ...r,
          makes: [],
        }))

        setStats({
          projectCount: projects.length,
          totalResource,
          totalSpend,
          remaining: totalResource - totalSpend,
          chartData,
        })
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
      value: `${(stats?.totalResource || 0).toLocaleString()} Ar`,
      icon: TrendingUp,
    },
    {
      title: "Dépenses totales",
      value: `${(stats?.totalSpend || 0).toLocaleString()} Ar`,
      icon: TrendingDown,
    },
    {
      title: "Reste à dépenser",
      value: `${(stats?.remaining || 0).toLocaleString()} Ar`,
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
