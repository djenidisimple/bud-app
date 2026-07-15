import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import apiClient from "@/lib/api-client"
import { addResource, addSpend, addDetail } from "@/components/addInput"
import type { Project, Resource, Spend, Detail, Make } from "@/types"

export function useProjectBudget(projectId: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [spends, setSpends] = useState<Spend[]>([])
  const [details, setDetails] = useState<Detail[]>([])
  const [makes, setMakes] = useState<Make[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient.get(`/projects/${projectId}/data`)
      const data = res.data
      setProject(data.project)
      setResources(data.resources || [])
      setSpends(data.spends || [])
      setDetails(data.details || [])
      setMakes(data.makes || [])
    } catch (err) {
      toast.error("Erreur lors du chargement des données du projet")
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
        if (r._delete && r.id) requests.push(apiClient.delete(`/projects/${projectId}/resources/${r.id}`))
        else if (r._new) requests.push(apiClient.post(`/projects/${projectId}/resources`, r))
        else if (r.id) requests.push(apiClient.patch(`/projects/${projectId}/resources/${r.id}`, r))
      })

      // Spends
      spends.forEach(s => {
        if (s._delete && s.id) requests.push(apiClient.delete(`/projects/${projectId}/spends/${s.id}`))
        else if (s._new) requests.push(apiClient.post(`/projects/${projectId}/spends`, s))
        else if (s.id) requests.push(apiClient.patch(`/projects/${projectId}/spends/${s.id}`, s))
      })

      // Details
      details.forEach(d => {
        if (d._delete && d.id) requests.push(apiClient.delete(`/projects/${projectId}/details/${d.id}`))
        else if (d._new) requests.push(apiClient.post(`/projects/${projectId}/details`, d))
        else if (d.id) requests.push(apiClient.patch(`/projects/${projectId}/details/${d.id}`, d))
      })

      // Makes
      makes.forEach(m => {
        if (m._delete && m.id) requests.push(apiClient.delete(`/projects/${projectId}/makes/${m.id}`))
        else if (m._new) requests.push(apiClient.post(`/projects/${projectId}/makes`, m))
        else if (m.id) requests.push(apiClient.patch(`/projects/${projectId}/makes/${m.id}`, m))
      })

      await Promise.all(requests)
      toast.success("✅ Toutes les modifications ont été sauvegardées !")
      fetchData()
    } catch (err: any) {
      // toast handled by apiClient interceptor
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

  return {
    project,
    resources,
    spends,
    details,
    makes,
    loading,
    saving,
    fetchData,
    handleSave,
    handleUpdateResource,
    handleUpdateSpend,
    handleUpdateDetail,
    handleAddResource,
    handleAddSpend,
    handleAddDetail,
    handleDeleteResource,
    handleDeleteSpend,
    handleDeleteDetail,
    handleMakeChange,
    setResources,
    setSpends,
    setDetails,
    setMakes,
  }
}
