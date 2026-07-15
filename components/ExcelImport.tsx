'use client'

import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/api-client"
import type { Resource } from "@/types"

interface ExcelImportButtonProps {
  projectId: string
  onImportSuccess: () => void
}

export function ExcelImportButton({ projectId, onImportSuccess }: ExcelImportButtonProps) {
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'array' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        if (!Array.isArray(data) || data.length === 0) {
          toast.error("Le fichier est vide ou invalide")
          return
        }

        // Simple import of resources: Expects columns "Source" and "Montant"
        const resources: Partial<Resource>[] = (data as Record<string, unknown>[]).map(row => ({
          origine_resource: String(row["Source"] || row["origine_resource"] || "Inconnu"),
          price_resource: Number(row["Montant"] || row["price_resource"] || 0),
        }))

        await apiClient.post(`/projects/${projectId}/data`, { resources })
        toast.success("Ressources importées avec succès")
        onImportSuccess()
      } catch (err) {
        toast.error("Erreur lors de l'importation du fichier")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleImport}
        className="hidden"
        id="excel-import"
      />
      <Button 
        variant="outline" 
        onClick={() => document.getElementById('excel-import')?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Importer Excel
      </Button>
    </div>
  )
}
