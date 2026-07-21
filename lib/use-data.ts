'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useData<T = any>(url: string | null): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchCount, setRefetchCount] = useState(0)

  const refetch = () => setRefetchCount(c => c + 1)

  useEffect(() => {
    if (!url) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    axios.get<T>(url)
      .then(res => {
        if (!cancelled) setData(res.data)
      })
      .catch(err => {
        if (!cancelled) setError(err.response?.data?.error || err.message || "Erreur de chargement")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [url, refetchCount])

  return { data, loading, error, refetch }
}
