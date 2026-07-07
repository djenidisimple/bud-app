import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { user_id: session.id as number },
    include: {
      resources: {
        include: { makes: true },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  let totalResource = 0
  let totalSpend = 0
  const chartMap = new Map<string, { resource: number; spend: number }>()

  for (const project of projects) {
    for (const resource of project.resources) {
      const resourceAmount = Number(resource.price_resource) || 0
      totalResource += resourceAmount

      const used = resource.makes.reduce(
        (sum, m) => sum + (Number(m.price_spend) || 0), 0
      )
      totalSpend += used

      const key = resource.origine_resource
      const prev = chartMap.get(key) || { resource: 0, spend: 0 }
      chartMap.set(key, {
        resource: prev.resource + resourceAmount,
        spend: prev.spend + used,
      })
    }
  }

  const chartData = Array.from(chartMap.entries()).map(([name, value]) => ({
    name,
    ...value,
  }))

  return NextResponse.json({
    projectCount: projects.length,
    totalResource,
    totalSpend,
    remaining: totalResource - totalSpend,
    chartData,
  })
}
