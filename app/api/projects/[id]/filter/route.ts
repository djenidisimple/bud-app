import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const filterSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  try {
    const body = await request.json()
    const { year } = filterSchema.parse(body)

    const resources = await prisma.resource.findMany({ where: { project_id: projectId } })
    const spends = await prisma.spend.findMany({ where: { project_id: projectId } })
    const details = await prisma.detail.findMany({
      where: { spend: { project_id: projectId } },
      include: { spend: true },
    })

    let makesWhere: any = {
      detail: { spend: { project_id: projectId } },
      resource: { project_id: projectId },
    }

    if (year && year !== 'Tous') {
      const startOfYear = new Date(parseInt(year), 0, 1)
      const endOfYear = new Date(parseInt(year), 11, 31, 23, 59, 59)
      makesWhere.created_at = {
        gte: startOfYear,
        lte: endOfYear,
      }
    }

    const makes = await prisma.make.findMany({
      where: makesWhere,
      include: {
        detail: true,
        resource: true,
      },
    })

    const totalResource = resources.reduce((sum, r) => sum + r.price_resource, 0)
    const totalSpend = makes.reduce((sum, m) => sum + m.price_spend, 0)

    return NextResponse.json({
      resources,
      spends,
      details,
      makes,
      budget: { totalResource, totalSpend, remaining: totalResource - totalSpend },
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors du filtrage' }, { status: 500 })
  }
}
