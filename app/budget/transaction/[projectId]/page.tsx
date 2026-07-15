'use client'

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableFooter, TableRow, TableCell } from "@/components/ui/table"
import { TableHeaderComponent } from "@/components/table-header"
import { TableBodySpend } from "@/components/table-body-spend"
import { PDFExportButton } from "@/components/showPdf"
import { ExcelExportButton } from "@/components/ExcelExport"
import { addResource, addSpend, addDetail } from "@/components/addInput"
import { calculateRemainingResources, formatNumber } from "@/lib/utils"
import { Save, Loader2, LayoutDashboard, FileText } from "lucide-react"
import { toast } from "sonner"

import type { Project as ProjectType, Resource as ResourceType, Spend as SpendType, Detail as DetailType, Make as MakeType } from "@/types"

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState<ProjectType | null>(null)
  const [resources, setResources] = useState<ResourceType[]>([])
  const [spends, setSpends] = useState<SpendType[]>([])
  const [details, setDetails] = useState<DetailType[]>([])
  const [makes, setMakes] = useState<MakeType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/data`)
      const data = res.data
      setProject(data.project)
      setResources(data.resources || [])
      setSpends(data.spends || [])
      setDetails(data.details || [])
      setMakes(data.makes || [])
    } catch (err) {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: {
        resources?: ResourceType[]
        spends?: SpendType[]
        details?: DetailType[]
        makes?: MakeType[]
      } = {}

      const modifiedResources = resources.filter(r => r._delete || r._new || r.id)
      if (modifiedResources.length > 0) payload.resources = modifiedResources

      const modifiedSpends = spends.filter(s => s._delete || s._new || s.id)
      if (modifiedSpends.length > 0) payload.spends = modifiedSpends

      const modifiedDetails = details.filter(d => d._delete || d._new || d.id)
      if (modifiedDetails.length > 0) payload.details = modifiedDetails

      const modifiedMakes = makes.filter(m => m._delete || m._new || m.id)
      if (modifiedMakes.length > 0) payload.makes = modifiedMakes

      await axios.post(`/api/projects/${projectId}/data`, payload)
      toast.success("✅ Toutes les modifications ont été sauvegardées !")
      fetchData()
    } catch (err: any) {
      const message = err.response?.data?.error || "Erreur lors de la sauvegarde"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateResource = (id: number, field: string, value: any) => {
    const parsed = field === 'price_resource' ? Number(value) || 0 : value
    setResources(resources.map(r => r.id === id ? { ...r, [field]: parsed } : r))
  }

  const handleUpdateSpend = (id: number, field: string, value: string) => {
    setSpends(spends.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleUpdateDetail = (id: number, field: string, value: string) => {
    setDetails(details.map(d => d.id === id ? { ...d, [field]: value } : d))
  }

  const handleAddResource = () => addResource(resources, setResources)
  const handleAddSpend = () => addSpend(spends, setSpends)
  const handleAddDetail = (spendId: number) => addDetail(spendId, details, setDetails)

  const handleDeleteResource = (id: number) => {
    setResources(resources.map(r => r.id === id ? { ...r, _delete: true } : r))
  }

  const handleDeleteSpend = (id: number) => {
    setSpends(spends.map(s => s.id === id ? { ...s, _delete: true } : s))
  }

  const handleDeleteDetail = (id: number) => {
    setDetails(details.map(d => d.id === id ? { ...d, _delete: true } : d))
  }

  const handleMakeChange = (detailId: number, resourceId: number, value: number) => {
    setMakes(prev => {
      const existing = prev.find(m => m.detail_id === detailId && m.resource_id === resourceId)
      if (existing) {
        return prev.map(m =>
          m.detail_id === detailId && m.resource_id === resourceId
            ? { ...m, price_spend: value }
            : m
        )
      }
      return [...prev, {
        id: -Date.now(),
        _new: true,
        detail_id: detailId,
        resource_id: resourceId,
        price_spend: value,
      }]
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#dfe1e7]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4f5bd5]" />
          <p className="text-[#6b7078] animate-pulse font-medium">Chargement du projet...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return <div className="text-center py-20 text-muted-foreground font-medium">Projet non trouvé</div>
  }

  const remainingResources = calculateRemainingResources(resources.filter(r => !r._delete), makes.filter(m => !m._delete))
  const budgetTotal = resources.filter(r => !r._delete).reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const spendTotal = makes.filter(m => !m._delete).reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
  const resourceTotal = remainingResources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const remainingTotal = remainingResources.reduce((sum, r) => sum + (r.remaining || 0), 0)

  return (
    <div className="min-h-screen bg-[#dfe1e7] p-6 space-y-6 font-sans text-[#1f2229]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-[#e6e7eb]">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[#4f5bd5] font-bold text-xs uppercase tracking-wider">
            <LayoutDashboard className="h-4 w-4" />
            <span>Gestion Budgétaire</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1f2229]">{project.name_project}</h1>
          <p className="text-sm text-[#6b7078] font-medium">{project.description_project}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 mr-2">
            <PDFExportButton
              project={project}
              resources={resources.filter(r => !r._delete)}
              spends={spends.filter(s => !s._delete)}
              details={details.filter(d => !d._delete)}
              makes={makes.filter(m => !m._delete)}
            />
            <ExcelExportButton
              project={project}
              resources={resources.filter(r => !r._delete)}
              spends={spends.filter(s => !s._delete)}
              details={details.filter(d => !d._delete)}
              makes={makes.filter(m => !m._delete)}
            />
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="h-12 px-8 rounded-xl bg-[#4f5bd5] text-white font-bold hover:bg-[#3f4bb5] transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
            {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>

      <div className="bg-white border border-[#e6e7eb] shadow-sm rounded-2xl overflow-hidden">
        <div className="pb-6 bg-gray-50 border-b border-[#e6e7eb] px-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-[#1f2229] flex items-center gap-3">
              <FileText className="h-6 w-6 text-[#4f5bd5]" />
              Tableau d'Allocation
            </div>
            <div className="flex items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1a9e6f]" />
                <span className="text-[#6b7078]">Ressources</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d5504f]" />
                <span className="text-[#6b7078]">Dépenses</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeaderComponent
                resources={resources.filter(r => !r._delete)}
                onAddResource={handleAddResource}
                onDeleteResource={handleDeleteResource}
                onUpdateResource={handleUpdateResource}
              />
              <TableBodySpend
                spends={spends.filter(s => !s._delete)}
                details={details.filter(d => !d._delete)}
                makes={makes.filter(m => !m._delete)}
                resources={resources.filter(r => !r._delete)}
                onAddSpend={handleAddSpend}
                onDeleteSpend={handleDeleteSpend}
                onAddDetail={handleAddDetail}
                onDeleteDetail={handleDeleteDetail}
                onMakeChange={handleMakeChange}
                onUpdateSpend={handleUpdateSpend}
                onUpdateDetail={handleUpdateDetail}
              />
              <TableFooter className="bg-gray-50 border-t-2 border-[#e6e7eb]">
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold text-[#1f2229] py-6 px-6 uppercase text-xs tracking-wider">
                    Total Ressources
                  </TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-bold text-[#1a9e6f] text-lg py-6">
                      {formatNumber(r.price_resource)} <span className="text-[10px]">Ar</span>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-[#1a9e6f] text-xl py-6 px-6">
                    {formatNumber(resourceTotal)} <span className="text-xs">Ar</span>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold text-[#1f2229] py-6 px-6 uppercase text-xs tracking-wider">
                    Total Dépenses
                  </TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-bold text-[#d5504f] text-lg py-6">
                      {formatNumber(r.used)} <span className="text-[10px]">Ar</span>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-[#d5504f] text-xl py-6 px-6">
                    {formatNumber(spendTotal)} <span className="text-xs">Ar</span>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent bg-[#eef0fd]">
                  <TableCell className="font-bold text-[#4f5bd5] py-8 px-6 uppercase text-sm tracking-wider">
                    Solde Restant
                  </TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-bold text-lg py-8">
                      <span className={`px-3 py-1 rounded-full ${r.remaining < 0 ? "bg-[#d5504f]/10 text-[#d5504f]" : "bg-[#1a9e6f]/10 text-[#1a9e6f]"}`}>
                        {formatNumber(r.remaining)} <span className="text-[10px]">Ar</span>
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-xl py-8 px-6">
                    <span className={`px-4 py-2 rounded-full ${remainingTotal < 0 ? "bg-[#d5504f]/20 text-[#d5504f]" : "bg-[#1a9e6f]/20 text-[#1a9e6f]"}`}>
                      {formatNumber(remainingTotal)} <span className="text-xs">Ar</span>
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
