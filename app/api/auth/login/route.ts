import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { comparePassword, createToken, setTokenCookie } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { name },
    })

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    const token = await createToken({ id: user.id, name: user.name })

    const response = NextResponse.json({
      user: { id: user.id, name: user.name },
      message: 'Connexion réussie',
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
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
