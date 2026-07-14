import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'week'

  const endDate = new Date()
  let startDate = new Date()

  if (period === 'day') {
    startDate.setDate(endDate.getDate() - 6)
  } else if (period === 'week') {
    startDate.setDate(endDate.getDate() - 29)
  } else if (period === 'month') {
    startDate.setFullYear(endDate.getFullYear() - 1)
  } else {
    startDate.setFullYear(endDate.getFullYear() - 5)
  }

  const spends = await prisma.spend.findMany({
    where: {
      project: { user_id: session.id as number },
      created_at: { gte: startDate }
    },
    include: {
      details: {
        include: { makes: true }
      }
    },
    orderBy: { created_at: 'asc' }
  })

  const timelineMap = new Map<string, number>()

  spends.forEach(spend => {
    const amount = spend.details.reduce(
      (sum, detail) => sum + detail.makes.reduce((s, m) => s + (Number(m.price_spend) || 0), 0), 
      0
    )
    
    const date = new Date(spend.created_at)
    let dateKey = ''
    if (period === 'day' || period === 'week') {
      dateKey = date.toISOString().split('T')[0]
    } else if (period === 'month') {
      dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    } else {
      dateKey = `${date.getFullYear()}`
    }
    
    timelineMap.set(dateKey, (timelineMap.get(dateKey) || 0) + amount)
  })

  const data = []
  if (period === 'day' || period === 'week') {
    const daysCount = period === 'day' ? 7 : 30
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      data.push({
        name: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        amount: timelineMap.get(key) || 0
      })
    }
  } else if (period === 'month') {
    for (let i = 0; i < 12; i++) {
      const d = new Date()
      d.setMonth(d.getMonth() - (11 - i))
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      data.push({
        name: d.toLocaleDateString('fr-FR', { month: 'short' }),
        amount: timelineMap.get(key) || 0
      })
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const d = new Date()
      d.setFullYear(d.getFullYear() - (4 - i))
      const key = `${d.getFullYear()}`
      data.push({
        name: d.getFullYear().toString(),
        amount: timelineMap.get(key) || 0
      })
    }
  }

  return NextResponse.json(data)
}
