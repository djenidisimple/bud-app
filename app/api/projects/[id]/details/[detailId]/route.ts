import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseIntParam } from '@/lib/utils'

const detailUpdateSchema = z.object({
  name_detail: z.string().min(1).optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string, detailId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, detailId } = await params
  const projectId = parseIntParam(id)
  const dId = parseIntParam(detailId)

  try {
    const body = await request.json()
    const data = detailUpdateSchema.parse(body)

    const detail = await prisma.detail.findFirst({
      where: { id: dId, spend: { project_id: projectId } },
    })

    if (!detail) return NextResponse.json({ error: 'Détail non trouvé' }, { status: 404 })

    const updated = await prisma.detail.update({
      where: { id: dId },
      data,
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string, detailId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, detailId } = await params
  const projectId = parseIntParam(id)
  const dId = parseIntParam(detailId)

  try {
    const detail = await prisma.detail.findFirst({
      where: { id: dId, spend: { project_id: projectId } },
    })

    if (!detail) return NextResponse.json({ error: 'Détail non trouvé' }, { status: 404 })

    await prisma.detail.delete({ where: { id: dId } })
    return NextResponse.json({ message: 'Détail supprimé' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
