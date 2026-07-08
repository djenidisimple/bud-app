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
      const requests: Promise<any>[] = []

      // Resources
      resources.forEach(r => {
        if (r._delete && r.id) requests.push(axios.delete(`/api/projects/${projectId}/resources/${r.id}`))
        else if (r._new) requests.push(axios.post(`/api/projects/${projectId}/resources`, r))
        else if (r.id) requests.push(axios.patch(`/api/projects/${projectId}/resources/${r.id}`, r))
      })

      // Spends
      spends.forEach(s => {
        if (s._delete && s.id) requests.push(axios.delete(`/api/projects/${projectId}/spends/${s.id}`))
        else if (s._new) requests.push(axios.post(`/api/projects/${projectId}/spends`, s))
        else if (s.id) requests.push(axios.patch(`/api/projects/${projectId}/spends/${s.id}`, s))
      })

      // Details
      details.forEach(d => {
        if (d._delete && d.id) requests.push(axios.delete(`/api/projects/${projectId}/details/${d.id}`))
        else if (d._new) requests.push(axios.post(`/api/projects/${projectId}/details`, d))
        else if (d.id) requests.push(axios.patch(`/api/projects/${projectId}/details/${d.id}`, d))
      })

      // Makes
      makes.forEach(m => {
        if (m._delete && m.id) requests.push(axios.delete(`/api/projects/${projectId}/makes/${m.id}`))
        else if (m._new) requests.push(axios.post(`/api/projects/${projectId}/makes`, m))
        else if (m.id) requests.push(axios.patch(`/api/projects/${projectId}/makes/${m.id}`, m))
      })

      await Promise.all(requests)
      toast.success("✅ Toutes les modifications ont été sauvegardées !")
      fetchData()
    } catch (err: any) {
      const message = err.response?.data?.error || "Erreur lors de la sauvegarde d'un ou plusieurs éléments"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateResource = (id: number, field: string, value: any) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r))
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
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Chargement du projet...</p>
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
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-border/60">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest">
            <LayoutDashboard className="h-4 w-4" />
            <span>Gestion Budgétaire</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">{project.name_project}</h1>
          <p className="text-muted-foreground text-lg font-medium">{project.description_project}</p>
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
            className="h-12 px-8 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
            {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-3xl">
        <CardHeader className="pb-6 bg-muted/30 border-b border-border/60 px-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black text-foreground flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              Tableau d'Allocation
            </CardTitle>
            <div className="flex items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Ressources</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Dépenses</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
              <TableFooter className="bg-muted/50 border-t-2 border-border">
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-black text-foreground py-6 px-6 uppercase text-xs tracking-widest">
                    Total Ressources
                  </TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-black text-success text-lg py-6">
                      {formatNumber(r.price_resource)} <span className="text-[10px]">Ar</span>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-black text-success text-xl py-6 px-6">
                    {formatNumber(resourceTotal)} <span className="text-xs">Ar</span>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-black text-foreground py-6 px-6 uppercase text-xs tracking-widest">
                    Total Dépenses
                  </TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-black text-destructive text-lg py-6">
                      {formatNumber(r.used)} <span className="text-[10px]">Ar</span>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-black text-destructive text-xl py-6 px-6">
                    {formatNumber(spendTotal)} <span className="text-xs">Ar</span>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent bg-primary/5">
                  <TableCell className="font-black text-primary py-8 px-6 uppercase text-sm tracking-widest">
                    Solde Restant
                  </TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-black text-lg py-8">
                      <span className={`px-3 py-1 rounded-full ${r.remaining < 0 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                        {formatNumber(r.remaining)} <span className="text-[10px]">Ar</span>
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-black text-xl py-8 px-6">
                    <span className={`px-4 py-2 rounded-full ${remainingTotal < 0 ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success"}`}>
                      {formatNumber(remainingTotal)} <span className="text-xs">Ar</span>
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
