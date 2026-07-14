'use client'

import { PointsaleSidebar } from "@/components/PointsaleSidebar"

export default function BudgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#dfe1e7] overflow-hidden">
      <PointsaleSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

