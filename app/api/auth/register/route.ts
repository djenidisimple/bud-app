import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createToken, setTokenCookie } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, password } = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({
      where: { name },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur existe déjà' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, password: hashedPassword },
    })

    const token = await createToken({ id: user.id, name: user.name })

    const response = NextResponse.json({
      user: { id: user.id, name: user.name },
      message: 'Inscription réussie',
    })

    setTokenCookie(response, token)

    return response
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription', details: message },
      { status: 500 }
    )
  }
}
