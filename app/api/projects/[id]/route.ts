import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const projectUpdateSchema = z.object({
  name_project: z.string().min(1, 'Le nom du projet est requis').optional(),
  description_project: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const project = await prisma.project.findFirst({
    where: { id: parseInt(id), user_id: session.id },
  })

  if (!project) {
    return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
  }

  return NextResponse.json({ project })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { name_project, description_project } = projectUpdateSchema.parse(body)

    const project = await prisma.project.findFirst({
      where: { id: parseInt(id), user_id: session.id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name_project: name_project ?? project.name_project,
        description_project: description_project ?? project.description_project,
      },
    })

    return NextResponse.json({ project: updatedProject, message: 'Projet mis à jour' })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const project = await prisma.project.findFirst({
    where: { id: parseInt(id), user_id: session.id },
  })

  if (!project) {
    return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
  }

  await prisma.project.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ message: 'Projet supprimé' })
}
