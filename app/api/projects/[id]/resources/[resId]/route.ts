import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseIntParam } from '@/lib/utils'

const resourceUpdateSchema = z.object({
  origine_resource: z.string().min(1).optional(),
  price_resource: z.number().nonnegative().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string, resId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, resId } = await params
  const projectId = parseIntParam(id)
  const resourceId = parseIntParam(resId)

  try {
    const body = await request.json()
    const data = resourceUpdateSchema.parse(body)

    const resource = await prisma.resource.findFirst({
      where: { id: resourceId, project_id: projectId },
    })

    if (!resource) return NextResponse.json({ error: 'Ressource non trouvée' }, { status: 404 })

    // Si on diminue le prix, on vérifie si ça ne crée pas un dépassement de budget
    if (data.price_resource !== undefined && data.price_resource < resource.price_resource) {
      const totalAllocated = await prisma.make.aggregate({
        _sum: { price_spend: true },
        where: { resource_id: resourceId },
      })
      const spent = totalAllocated._sum.price_spend || 0
      if (spent > data.price_resource) {
        return NextResponse.json({ error: `Impossible de réduire le budget à ${data.price_resource} Ar car ${spent} Ar sont déjà alloués.` }, { status: 400 })
      }
    }

    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data,
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string, resId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, resId } = await params
  const projectId = parseIntParam(id)
  const resourceId = parseIntParam(resId)

  try {
    const resource = await prisma.resource.findFirst({
      where: { id: resourceId, project_id: projectId },
    })

    if (!resource) return NextResponse.json({ error: 'Ressource non trouvée' }, { status: 404 })

    await prisma.resource.delete({ where: { id: resourceId } })
    return NextResponse.json({ message: 'Ressource supprimée' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
