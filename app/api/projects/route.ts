import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const projectSchema = z.object({
  name_project: z.string().min(1, 'Le nom du projet est requis'),
  description_project: z.string().optional().default(''),
})

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { user_id: session.id },
    orderBy: { created_at: 'desc' },
  })

  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name_project, description_project } = projectSchema.parse(body)

    const existing = await prisma.project.findUnique({
      where: { name_project },
    })

    if (existing) {
      return NextResponse.json({ error: 'Un projet avec ce nom existe déjà' }, { status: 409 })
    }

    const project = await prisma.project.create({
      data: {
        name_project,
        description_project,
        user_id: session.id,
      },
    })

    return NextResponse.json({ project, message: 'Projet créé avec succès' })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création du projet' }, { status: 500 })
  }
}
