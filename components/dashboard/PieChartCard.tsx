'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ['#2563EB', '#059669', '#f0b34d', '#DC2626', '#8e44ad']

interface PieChartCardProps {
  chartData: { name: string; resource: number; spend: number }[]
  totalSpend: number
}

export function PieChartCard({ chartData, totalSpend }: PieChartCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#e6e7eb] shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm">Répartition par Ressource</h3>
      </div>
      <div className="h-[220px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={5}
              dataKey="spend"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-[11px] text-[#6b7078]">
              <div
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate font-medium" title={item.name}>{item.name}</span>
              <span className="ml-auto text-[#9498a0]">{((item.spend / (totalSpend || 1)) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
