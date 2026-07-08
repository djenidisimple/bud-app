import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const spendUpdateSchema = z.object({
  name_spend: z.string().min(1).optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string, spendId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, spendId } = await params
  const projectId = parseInt(id)
  const sId = parseInt(spendId)

  try {
    const body = await request.json()
    const data = spendUpdateSchema.parse(body)

    const spend = await prisma.spend.findFirst({
      where: { id: sId, project_id: projectId },
    })

    if (!spend) return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 })

    const updated = await prisma.spend.update({
      where: { id: sId },
      data,
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string, spendId: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id, spendId } = await params
  const projectId = parseInt(id)
  const sId = parseInt(spendId)

  try {
    const spend = await prisma.spend.findFirst({
      where: { id: sId, project_id: projectId },
    })

    if (!spend) return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 })

    await prisma.spend.delete({ where: { id: sId } })
    return NextResponse.json({ message: 'Dépense supprimée' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
