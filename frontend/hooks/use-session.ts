// hooks/use-session.ts
'use client'

import { useEffect, useState } from 'react'

export function useSession() {
  const [session, setSession] = useState<{
    authenticated: boolean
    user?: any
    isLoading: boolean
  }>({ authenticated: false, isLoading: true })

  useEffect(() => {
    const checkSession = async () => {
      try {
            const res = await fetch('/api/auth/session', {
            credentials: 'include'
            })
            const data = await res.json()
            setSession({
                authenticated: data.authenticated,
                user: data.user,
                isLoading: false
            })
      } catch (error) {
        setSession({
          authenticated: false,
          isLoading: false
        })
      }
    }

    checkSession()
  }, [])

  return session
}