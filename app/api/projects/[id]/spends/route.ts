import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const spendSchema = z.object({
  name_spend: z.string().min(1, 'Le nom de la dépense est requis'),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await params
  const projectId = parseInt(id)

  try {
    const body = await request.json()
    const data = spendSchema.parse(body)

    const spend = await prisma.spend.create({
      data: {
        ...data,
        project_id: projectId,
      },
    })

    return NextResponse.json(spend)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
