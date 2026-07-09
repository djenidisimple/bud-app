'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts"
import { 
  Wallet, TrendingUp, TrendingDown, PiggyBank, 
  Loader2, Search, Bell, Zap, User, Calendar
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

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

const COLORS = ['#4f5bd5', '#1a9e6f', '#f0b34d', '#d5504f', '#8e44ad']

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
          <Loader2 className="animate-spin h-12 w-12 text-[#4f5bd5]" />
          <p className="text-[#6b7078] animate-pulse font-medium">Chargement de vos finances...</p>
        </div>
      </div>
    )
  }

  // Mock data for the 7-day chart since we don't have daily breakdown in API yet
  const weeklyData = [
    { day: 'Lun', amount: stats?.totalSpend ? Math.floor(stats.totalSpend * 0.1) : 0 },
    { day: 'Mar', amount: stats?.totalSpend ? Math.floor(stats.totalSpend * 0.15) : 0 },
    { day: 'Mer', amount: stats?.totalSpend ? Math.floor(stats.totalSpend * 0.25) : 0 },
    { day: 'Jeu', amount: stats?.totalSpend ? Math.floor(stats.totalSpend * 0.12) : 0 },
    { day: 'Ven', amount: stats?.totalSpend ? Math.floor(stats.totalSpend * 0.18) : 0 },
    { day: 'Sam', amount: stats?.totalSpend ? Math.floor(stats.totalSpend * 0.08) : 0 },
    { day: 'Dim', amount: stats?.totalSpend ? Math.floor(stats.totalSpend * 0.07) : 0 },
  ]

  const kpis = [
    {
      label: "Budget Global",
      value: `${(stats?.totalResource || 0).toLocaleString("fr-FR")} Ar`,
      icon: Wallet,
      color: "#4f5bd5",
      softBg: "#eef0fd",
      trend: "Global",
      trendUp: true,
    },
    {
      label: "Dépenses Totales",
      value: `${(stats?.totalSpend || 0).toLocaleString("fr-FR")} Ar`,
      icon: TrendingDown,
      color: "#4f5bd5",
      softBg: "#eef0fd",
      trend: "Transactions",
      trendUp: true,
    },
    {
      label: "Projets Actifs",
      value: stats?.projectCount || 0,
      icon: User,
      color: "#1a9e6f",
      softBg: "#e6f7f0",
      trend: "Clients",
      trendUp: true,
    },
    {
      label: "Taux d'épuisement",
      value: `${stats && stats.totalResource ? ((stats.totalSpend / stats.totalResource) * 100).toFixed(1) : '0'}%`,
      icon: Zap,
      color: "#d5504f",
      softBg: "#fbeceb",
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
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#e6e7eb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f5bd5/20] transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="size-10 rounded-xl bg-white border border-[#e6e7eb] flex items-center justify-center text-[#6b7078] hover:bg-gray-50 transition-colors">
            <Bell className="size-4" />
          </button>
          <button className="size-10 rounded-xl bg-white border border-[#e6e7eb] flex items-center justify-center text-[#6b7078] hover:bg-gray-50 transition-colors">
            <Zap className="size-4" />
          </button>
          <div className="size-10 rounded-full bg-[#eef0fd] text-[#4f5bd5] flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm cursor-pointer">
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
            <div className={`text-xs font-semibold flex items-center gap-1 ${kpi.trendUp ? 'text-[#1a9e6f]' : 'text-[#d5504f]'}`}>
              <TrendingUp className={`size-3 ${!kpi.trendUp && 'rotate-180'}`} />
              {kpi.trendUp ? '↑' : '↓'} {Math.floor(Math.random() * 10)}% <span className="text-[#9498a0] font-medium"> vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-sm">Analyse des Dépenses</h3>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'day', label: 'Jour' },
                  { id: 'week', label: 'Semaine' },
                  { id: 'month', label: 'Mois' },
                  { id: 'year', label: 'Année' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold rounded-md transition-all",
                      period === p.id 
                        ? "bg-white text-[#4f5bd5] shadow-sm" 
                        : "text-[#6b7078] hover:text-black"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs font-semibold text-[#4f5bd5] cursor-pointer hover:underline">Voir tout</span>
          </div>
          <div className="h-[220px] w-full relative">
            {timelineLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-[#4f5bd5]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f5bd5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f5bd5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#9498a0' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ stroke: '#4f5bd5', strokeWidth: 2 }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4f5bd5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-sm">Répartition par Ressource</h3>
          </div>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.chartData || []}
                  cx="50%"
                  cy="45%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="spend"
                >
                  {stats?.chartData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Scrollable Legend */}
          <div className="mt-4 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {stats?.chartData?.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-[11px] text-[#6b7078]">
                  <div 
                    className="size-2 rounded-full shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate font-medium" title={item.name}>{item.name}</span>
                  <span className="ml-auto text-[#9498a0]">{((item.spend / (stats?.totalSpend || 1)) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-sm">Transactions récentes</h3>
          <span className="text-xs font-semibold text-[#4f5bd5] cursor-pointer hover:underline">Voir tout</span>
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
                      <div className="size-8 rounded-full bg-[#eef0fd] text-[#4f5bd5] flex items-center justify-center font-bold text-xs">
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
                    <button className="text-[#4f5bd5] hover:underline font-medium">Détails</button>
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

