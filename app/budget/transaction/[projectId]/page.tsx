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
import { addResource, addSpend, addDetail } from "@/components/addInput"
import { calculateRemainingResources, formatNumber } from "@/lib/utils"
import { Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ProjectType {
  id: number
  name_project: string
  description_project: string
  [key: string]: unknown
}

interface ResourceType {
  id: number
  project_id?: number
  origine_resource: string
  price_resource: number
  _new?: boolean
  _delete?: boolean
  remaining?: number
  used?: number
  [key: string]: unknown
}

interface SpendType {
  id: number
  project_id?: number
  name_spend: string
  _new?: boolean
  _delete?: boolean
  [key: string]: unknown
}

interface DetailType {
  id: number
  spend_id: number
  name_detail: string
  _new?: boolean
  _delete?: boolean
  [key: string]: unknown
}

interface MakeType {
  id: number
  detail_id: number
  resource_id: number
  price_spend: number
  _new?: boolean
  _delete?: boolean
  [key: string]: unknown
}

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
      await axios.post(`/api/projects/${projectId}/data`, {
        resources,
        spends,
        details,
        makes,
      })
      toast.success("Données sauvegardées")
      fetchData()
    } catch {
      toast.error("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!project) {
    return <div className="text-center text-muted-foreground">Projet non trouvé</div>
  }

  const remainingResources = calculateRemainingResources(resources.filter(r => !r._delete), makes.filter(m => !m._delete))
  const budgetTotal = resources.filter(r => !r._delete).reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const spendTotal = makes.filter(m => !m._delete).reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
  const resourceTotal = remainingResources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const remainingTotal = remainingResources.reduce((sum, r) => sum + (r.remaining || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.name_project}</h1>
          <p className="text-muted-foreground">{project.description_project}</p>
        </div>
        <div className="flex gap-2">
          <PDFExportButton
            project={project}
            resources={resources.filter(r => !r._delete)}
            spends={spends.filter(s => !s._delete)}
            details={details.filter(d => !d._delete)}
            makes={makes.filter(m => !m._delete)}
          />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tableau Budgétaire</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeaderComponent
                resources={resources.filter(r => !r._delete)}
                onAddResource={handleAddResource}
                onDeleteResource={handleDeleteResource}
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
              />
              <TableFooter>
                <TableRow>
                  <TableCell className="font-bold">Total Ressources</TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-bold text-green-500">
                      {formatNumber(r.price_resource)} Ar
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-green-500">
                    {formatNumber(resourceTotal)} Ar
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Total Dépenses</TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-bold text-red-500">
                      {formatNumber(r.used)} Ar
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold text-red-500">
                    {formatNumber(spendTotal)} Ar
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Restant</TableCell>
                  {remainingResources.map((r) => (
                    <TableCell key={r.id} className="text-right font-bold">
                      <span className={r.remaining < 0 ? "text-destructive" : "text-green-500"}>
                        {formatNumber(r.remaining)} Ar
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold">
                    <span className={remainingTotal < 0 ? "text-destructive" : "text-green-500"}>
                      {formatNumber(remainingTotal)} Ar
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
