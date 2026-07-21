'use client'

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import axios from "axios"
import { 
  Wallet, TrendingUp, TrendingDown, 
  Loader2, Search, Bell, Zap, User
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const AreaChartCard = dynamic(() => import("@/components/dashboard/AreaChartCard").then(m => m.AreaChartCard), { ssr: false })
const PieChartCard = dynamic(() => import("@/components/dashboard/PieChartCard").then(m => m.PieChartCard), { ssr: false })

interface ChartItem {
  name: string
  resource: number
  spend: number
}

interface Transaction {
  id: number
  project: string
  amount: number
  date: string
  name: string
}

interface StatsType {
  projectCount: number
  totalResource: number
  totalSpend: number
  remaining: number
  chartData: ChartItem[]
  transactions: Transaction[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StatsType | null>(null)
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const [timelineLoading, setTimelineLoading] = useState(true)

  const userName = user?.name || 'Utilisateur'
  const userInitial = userName.charAt(0).toUpperCase()

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

  useEffect(() => {
    const fetchTimeline = async () => {
      setTimelineLoading(true)
      try {
        const res = await axios.get(`/api/projects/timeline?period=${period}`)
        setTimelineData(res.data)
      } catch (err) {
        console.error("Error fetching timeline:", err)
      } finally {
        setTimelineLoading(false)
      }
    }
    fetchTimeline()
  }, [period])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#dfe1e7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin h-12 w-12 text-[#2563EB]" />
          <p className="text-[#6b7078] animate-pulse font-medium">Chargement de vos finances...</p>
        </div>
      </div>
    )
  }

  const kpis = [
    {
      label: "Budget Global",
      value: `${(stats?.totalResource || 0).toLocaleString("fr-FR")} Ar`,
      icon: Wallet,
      color: "#2563EB",
      softBg: "#DBEAFE",
      trend: "Global",
      trendUp: true,
    },
    {
      label: "Dépenses Totales",
      value: `${(stats?.totalSpend || 0).toLocaleString("fr-FR")} Ar`,
      icon: TrendingDown,
      color: "#2563EB",
      softBg: "#DBEAFE",
      trend: "Transactions",
      trendUp: true,
    },
    {
      label: "Projets Actifs",
      value: stats?.projectCount || 0,
      icon: User,
      color: "#059669",
      softBg: "#ECFDF5",
      trend: "Clients",
      trendUp: true,
    },
    {
      label: "Taux d'épuisement",
      value: `${stats && stats.totalResource ? ((stats.totalSpend / stats.totalResource) * 100).toFixed(1) : '0'}%`,
      icon: Zap,
      color: "#DC2626",
      softBg: "#FEF2F2",
      trend: "Efficacité",
      trendUp: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[#dfe1e7] p-6 space-y-6 font-sans text-[#1f2229]">
      {/* Topbar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold m-0">Dashboard</h1>
          <p className="text-sm text-[#6b7078] m-0">Bienvenue ! Voici l'état actuel de vos finances.</p>
        </div>
        
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9498a0]" />
          <input 
            type="text" 
            placeholder="Rechercher une transaction..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#e6e7eb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB/20] transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="size-10 rounded-xl bg-white border border-[#e6e7eb] flex items-center justify-center text-[#6b7078] hover:bg-gray-50 transition-colors">
            <Bell className="size-4" />
          </button>
          <button className="size-10 rounded-xl bg-white border border-[#e6e7eb] flex items-center justify-center text-[#6b7078] hover:bg-gray-50 transition-colors">
            <Zap className="size-4" />
          </button>
          <div className="size-10 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm cursor-pointer">
            {userInitial}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-[#e6e7eb] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#6b7078]">{kpi.label}</span>
              <div className="size-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.softBg, color: kpi.color }}>
                <kpi.icon className="size-4" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-2">{kpi.value}</p>
            <div className={`text-xs font-semibold flex items-center gap-1 ${kpi.trendUp ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
              <TrendingUp className={`size-3 ${!kpi.trendUp && 'rotate-180'}`} />
              {kpi.trendUp ? '↑' : '↓'} {Math.floor(Math.random() * 10)}% <span className="text-[#9498a0] font-medium"> vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Suspense fallback={<div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm flex items-center justify-center h-[300px]"><Loader2 className="size-6 animate-spin text-[#2563EB]" /></div>}>
          <AreaChartCard
            timelineData={timelineData}
            timelineLoading={timelineLoading}
            period={period}
            onPeriodChange={setPeriod}
          />
        </Suspense>
        <Suspense fallback={<div className="bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm flex items-center justify-center h-[300px]"><Loader2 className="size-6 animate-spin text-[#2563EB]" /></div>}>
          <PieChartCard
            chartData={stats?.chartData || []}
            totalSpend={stats?.totalSpend || 0}
          />
        </Suspense>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-sm">Transactions récentes</h3>
          <span className="text-xs font-semibold text-[#2563EB] cursor-pointer hover:underline">Voir tout</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="text-[#9498a0] font-medium text-xs border-b border-[#e6e7eb]">
                <th className="pb-3 px-2">Projet / Dépense</th>
                <th className="pb-3 px-2">Montant</th>
                <th className="pb-3 px-2">Date</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-[#e6e7eb] last:border-none hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                        {tx.project.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#1f2229]">{tx.project}</span>
                        <span className="text-xs text-[#6b7078]">{tx.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-semibold">{tx.amount.toLocaleString("fr-FR")} Ar</td>
                  <td className="py-4 px-2 text-[#6b7078]">{new Date(tx.date).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="py-4 px-2 text-right">
                    <button className="text-[#2563EB] hover:underline font-medium">Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

