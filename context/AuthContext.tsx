'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface AuthContextType {
  user: { id: number; name: string } | null
  loading: boolean
  login: (name: string, password: string) => Promise<Record<string, unknown>>
  register: (name: string, password: string) => Promise<Record<string, unknown>>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkSession = useCallback(async () => {
    try {
      const res = await axios.get('/api/auth/session')
      if (res.data.user) {
        setUser(res.data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = async (name: string, password: string) => {
    const res = await axios.post('/api/auth/login', { name, password })
    setUser(res.data.user)
    router.push('/budget/dashboard')
    return res.data
  }

  const register = async (name: string, password: string) => {
    const res = await axios.post('/api/auth/register', { name, password })
    setUser(res.data.user)
    router.push('/budget/dashboard')
    return res.data
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
    } catch {
      // ignore
    }
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider')
  }
  return context
}
