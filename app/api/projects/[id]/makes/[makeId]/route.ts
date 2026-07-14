import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseIntParam } from '@/lib/utils'

const makeUpdateSchema = z.object({
  price_spend: z.number().nonnegative().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string, makeId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, makeId } = await params
  const projectId = parseIntParam(id)
  const mId = parseIntParam(makeId)

  try {
    const body = await request.json()
    const data = makeUpdateSchema.parse(body)

    const make = await prisma.make.findFirst({
      where: { id: mId, resource: { project_id: projectId } },
    })

    if (!make) return NextResponse.json({ error: 'Allocation non trouvée' }, { status: 404 })

    if (data.price_spend !== undefined) {
      const resource = await prisma.resource.findUnique({ where: { id: make.resource_id } })
      if (!resource) return NextResponse.json({ error: 'Ressource non trouvée' }, { status: 404 })

      const totalOtherMakes = await prisma.make.aggregate({
        _sum: { price_spend: true },
        where: { 
          resource_id: make.resource_id,
          NOT: { id: mId }
        },
      })
      const otherSpent = totalOtherMakes._sum.price_spend || 0
      if (otherSpent + data.price_spend > resource.price_resource) {
        return NextResponse.json({ 
          error: `Dépassement de budget pour ${resource.origine_resource}. Disponible: ${resource.price_resource - otherSpent} Ar.` 
        }, { status: 400 })
      }
    }

    const updated = await prisma.make.update({
      where: { id: mId },
      data,
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string, makeId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, makeId } = await params
  const projectId = parseIntParam(id)
  const mId = parseIntParam(makeId)

  try {
    const make = await prisma.make.findFirst({
      where: { id: mId, resource: { project_id: projectId } },
    })

    if (!make) return NextResponse.json({ error: 'Allocation non trouvée' }, { status: 404 })

    await prisma.make.delete({ where: { id: mId } })
    return NextResponse.json({ message: 'Allocation supprimée' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
