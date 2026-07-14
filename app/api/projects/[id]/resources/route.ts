import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseIntParam } from '@/lib/utils'

const resourceSchema = z.object({
  origine_resource: z.string().min(1, 'L\'origine est requise'),
  price_resource: z.number().nonnegative('Le montant doit être positif'),
})

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { id } = await params
  const projectId = parseIntParam(id)

  try {
    const body = await request.json()
    const data = resourceSchema.parse(body)

    const resource = await prisma.resource.create({
      data: {
        ...data,
        project_id: projectId,
      },
    })

    return NextResponse.json(resource)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
