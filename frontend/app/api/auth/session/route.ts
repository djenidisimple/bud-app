import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { axiosInstance } from '@/lib/axios'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    const response = await axiosInstance('/api/validate', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.data.ok) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    const userData = await response.data.user
    return NextResponse.json({ authenticated: true, user: userData }, { status: 200 })

  } catch (error) {
      console.error('Session check failed:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
  }
}