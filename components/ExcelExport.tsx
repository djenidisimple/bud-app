'use client'

import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet } from "lucide-react"

import type { Project, Resource, Spend, Detail, Make } from "@/types"

interface ExcelExportButtonProps {
  project: Project
  resources: Resource[]
  spends: Spend[]
  details: Detail[]
  makes: Make[]
}

export function ExcelExportButton({ project, resources, spends, details, makes }: ExcelExportButtonProps) {
  const handleExport = () => {
    const wb = XLSX.utils.book_new()

    const budgetData = resources.map(r => {
      const used = makes
        .filter(m => m.resource_id === r.id)
        .reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
      return {
        "Source": r.origine_resource,
        "Montant (Ar)": Number(r.price_resource),
        "Utilisé (Ar)": used,
        "Restant (Ar)": Number(r.price_resource) - used,
      }
    })

    const totalResource = resources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
    const totalSpend = makes.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)

    budgetData.push({
      "Source": "TOTAL",
      "Montant (Ar)": totalResource,
      "Utilisé (Ar)": totalSpend,
      "Restant (Ar)": totalResource - totalSpend,
    })

    const budgetSheet = XLSX.utils.json_to_sheet(budgetData)
    XLSX.utils.book_append_sheet(wb, budgetSheet, "Budget")

    const spendRows: Record<string, string | number>[] = []
    spends.forEach(spend => {
      const spendDetails = details.filter(d => d.spend_id === spend.id)
      spendDetails.forEach(detail => {
        const detailMakes = makes.filter(m => m.detail_id === detail.id)
        const total = detailMakes.reduce((s, m) => s + (Number(m.price_spend) || 0), 0)
        spendRows.push({
          "Catégorie": spend.name_spend,
          "Motif": detail.name_detail,
          "Montant (Ar)": total,
        })
      })
    })

    const spendSheet = XLSX.utils.json_to_sheet(spendRows)
    XLSX.utils.book_append_sheet(wb, spendSheet, "Dépenses")

    const detailRows: Record<string, string | number>[] = []
    spends.forEach(spend => {
      const spendDetails = details.filter(d => d.spend_id === spend.id)
      spendDetails.forEach(detail => {
        resources.forEach(resource => {
          const make = makes.find(m => m.detail_id === detail.id && m.resource_id === resource.id)
          if (make && Number(make.price_spend) > 0) {
            detailRows.push({
              "Catégorie": spend.name_spend,
              "Motif": detail.name_detail,
              "Source": resource.origine_resource,
              "Montant (Ar)": Number(make.price_spend),
            })
          }
        })
      })
    })

    const detailSheet = XLSX.utils.json_to_sheet(detailRows)
    XLSX.utils.book_append_sheet(wb, detailSheet, "Détail complet")

    XLSX.writeFile(wb, `rapport-${project?.name_project || "budget"}.xlsx`)
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <FileSpreadsheet className="mr-2 h-4 w-4" />
      Exporter Excel
    </Button>
  )
}
