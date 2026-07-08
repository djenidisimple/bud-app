import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const projectId = parseInt(id)

  const project = await prisma.project.findFirst({
    where: { id: projectId, user_id: session.id },
  })

  if (!project) {
    return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
  }

  const resources = await prisma.resource.findMany({ where: { project_id: projectId } })
  const makes = await prisma.make.findMany({
    where: {
      detail: { spend: { project_id: projectId } },
      resource: { project_id: projectId },
    },
    include: {
      resource: true,
    },
  })

  const totalResource = resources.reduce((sum, r) => sum + r.price_resource, 0)
  const totalSpend = makes.reduce((sum, m) => sum + m.price_spend, 0)

  const chartData = resources.map(r => {
    const used = makes
      .filter(m => m.resource_id === r.id)
      .reduce((sum, m) => sum + m.price_spend, 0)
    return {
      name: r.origine_resource,
      resource: r.price_resource,
      spend: used,
    }
  })

  return NextResponse.json({
    totalResource,
    totalSpend,
    remaining: totalResource - totalSpend,
    chartData,
  })
}
