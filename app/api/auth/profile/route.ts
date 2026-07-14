import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession, hashPassword } from '@/lib/auth'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const data = profileSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (data.name) updateData.name = data.name
    if (data.password) updateData.password = await hashPassword(data.password)

    const user = await prisma.user.update({
      where: { id: session.id as number },
      data: updateData,
      select: { id: true, name: true },
    })

    return NextResponse.json({ user, message: 'Profil mis à jour avec succès' })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil' }, { status: 500 })
  }
}