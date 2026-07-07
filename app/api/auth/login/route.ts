import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { comparePassword, createToken, setTokenCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, password } = await request.json()

    if (!name || !password) {
      return NextResponse.json(
        { error: 'Nom et mot de passe requis' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const user = await db.prepare('SELECT * FROM "User" WHERE name = ?').get(name) as { id: number; name: string; password: string } | undefined

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
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
