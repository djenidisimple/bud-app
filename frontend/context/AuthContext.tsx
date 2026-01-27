'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { axiosInstance } from '@/lib/axios'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (credentials: { name: string; password: string }) => Promise<void>
  register: (credentials: { name: string; password: string }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1]
        if (token) {
          const res = await axiosInstance.get('/api/user', {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(res.data)
        }
      } catch (error) {
        console.error('Failed to load user', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [])

  const login = async ({ name, password }: { name: string; password: string }) => {
    try {
      const res = await axiosInstance.post('/api/login', { name, password }, {
        withCredentials: true
      })
      const { access_token, user } = res.data
      
      document.cookie = `access_token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user)
      router.push('/') // ✅ Ajout de la redirection ici
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  const register = async ({ name, password }: { name: string; password: string; }) => {
    try {
      const res = await axiosInstance.post('/api/register', { 
        name, 
        password, 
      }, {
        withCredentials: true
      })
      
      const { access_token, user } = res.data
      
      document.cookie = `access_token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user)
      router.push('/')
    } catch (error) {
      console.error('Registration failed', error)
      throw error
    }
  }

  const logout = () => {
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      setUser(null)
      router.push('/login')
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}