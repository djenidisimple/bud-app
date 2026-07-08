'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
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
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Chargement de vos finances...</p>
        </div>
      </div>
    )
  }

  const kpis = [
    {
      title: "Projets Actifs",
      value: stats?.projectCount || 0,
      icon: Wallet,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      borderColor: "border-indigo-100",
    },
    {
      title: "Budget Global",
      value: `${(stats?.totalResource || 0).toLocaleString("fr-FR")} Ar`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      title: "Dépenses Totales",
      value: `${(stats?.totalSpend || 0).toLocaleString("fr-FR")} Ar`,
      icon: TrendingDown,
      color: "text-rose-600",
      bg: "bg-rose-50",
      borderColor: "border-rose-100",
    },
    {
      title: "Solde Disponible",
      value: `${(stats?.remaining || 0).toLocaleString("fr-FR")} Ar`,
      icon: PiggyBank,
      color: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-100",
    },
  ]

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Tableau de Bord <span className="text-primary">Bud</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Bienvenue ! Voici l'état actuel de vos finances.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card 
            key={kpi.title} 
            className={`overflow-hidden border-2 ${kpi.borderColor} transition-all hover:shadow-lg hover:-translate-y-1 duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                  Statistique
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted-foreground">{kpi.title}</p>
                <p className="text-3xl font-black text-foreground tracking-tight">
                  {kpi.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm">
          <div className="p-6 border-b border-border/50 bg-white/80">
            <h3 className="text-xl font-bold text-foreground">Analyse des Flux</h3>
            <p className="text-sm text-muted-foreground">Comparaison Budget vs Dépenses par ressource</p>
          </div>
          <CardContent className="p-6">
            <ChartAreaInteractive data={stats?.chartData || []} />
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center p-8 text-center border-none shadow-xl bg-gradient-to-br from-primary to-indigo-700 text-white">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <PiggyBank className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Conseil Budget</h3>
            <p className="text-indigo-100 leading-relaxed">
              {stats?.remaining && stats.remaining > 0 
                ? `Il vous reste ${stats.remaining.toLocaleString('fr-FR')} Ar. C'est le moment idéal pour épargner ou investir !` 
                : "Attention, votre budget global est épuisé. Pensez à ajuster vos ressources."}
            </p>
            <button className="mt-4 px-6 py-2 bg-white text-primary font-bold rounded-full hover:bg-indigo-50 transition-colors duration-200 shadow-lg">
              Optimiser mes comptes
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
