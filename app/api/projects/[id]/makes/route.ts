import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const makeSchema = z.object({
  detail_id: z.number(),
  resource_id: z.number(),
  price_spend: z.number().nonnegative('Le montant doit être positif'),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await params
  const projectId = parseInt(id)

  try {
    const body = await request.json()
    const data = makeSchema.parse(body)

    // Vérifier l'appartenance au projet pour le détail et la ressource
    const [detail, resource] = await Promise.all([
      prisma.detail.findFirst({ where: { id: data.detail_id, spend: { project_id: projectId } } }),
      prisma.resource.findFirst({ where: { id: data.resource_id, project_id: projectId } }),
    ])

    if (!detail || !resource) {
      return NextResponse.json({ error: 'Détail ou Ressource non trouvée dans ce projet' }, { status: 404 })
    }

    // Vérification budgétaire
    const totalAllocated = await prisma.make.aggregate({
      _sum: { price_spend: true },
      where: { resource_id: data.resource_id },
    })
    const currentSpent = totalAllocated._sum.price_spend || 0
    if (currentSpent + data.price_spend > resource.price_resource) {
      return NextResponse.json({ 
        error: `Dépassement de budget pour ${resource.origine_resource}. Disponible: ${resource.price_resource - currentSpent} Ar. Tentative: ${data.price_spend} Ar.` 
      }, { status: 400 })
    }

    const make = await prisma.make.create({
      data,
    })

    return NextResponse.json(make)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
