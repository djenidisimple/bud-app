import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseIntParam } from '@/lib/utils'

const detailSchema = z.object({
  spend_id: z.number(),
  name_detail: z.string().min(1, 'Le nom du détail est requis'),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await params
  const projectId = parseIntParam(id)

  try {
    const body = await request.json()
    const data = detailSchema.parse(body)

    // Vérifier que la dépense appartient bien au projet
    const spend = await prisma.spend.findFirst({
      where: { id: data.spend_id, project_id: projectId },
    })

    if (!spend) return NextResponse.json({ error: 'Dépense non trouvée dans ce projet' }, { status: 404 })

    const detail = await prisma.detail.create({
      data,
    })

    return NextResponse.json(detail)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
