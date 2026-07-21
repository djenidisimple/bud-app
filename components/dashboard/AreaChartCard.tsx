'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AreaChartCardProps {
  timelineData: any[]
  timelineLoading: boolean
  period: string
  onPeriodChange: (period: string) => void
}

const periods = [
  { id: 'day', label: 'Jour' },
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'year', label: 'Année' },
]

export function AreaChartCard({ timelineData, timelineLoading, period, onPeriodChange }: AreaChartCardProps) {
  return (
    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-sm">Analyse des Dépenses</h3>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => onPeriodChange(p.id)}
                className={cn(
                  "px-2 py-1 text-[10px] font-bold rounded-md transition-all",
                  period === p.id
                    ? "bg-white text-[#2563EB] shadow-sm"
                    : "text-[#6b7078] hover:text-black"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs font-semibold text-[#2563EB] cursor-pointer hover:underline">Voir tout</span>
      </div>
      <div className="h-[220px] w-full relative">
        {timelineLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-[#2563EB]" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
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
                cursor={{ stroke: '#2563EB', strokeWidth: 2 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#2563EB"
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
  )
}
