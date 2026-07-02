import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { hashPassword, createToken, setTokenCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, password } = await request.json()

    if (!name || !password) {
      return NextResponse.json(
        { error: 'Nom et mot de passe requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    const db = await getDb()

    const existing = await db.prepare('SELECT id FROM "User" WHERE name = ?').get(name)
    if (existing) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur existe déjà' },
        { status: 409 }
      )
    }

    const hashedPassword = hashPassword(password)
    const result = await db.prepare('INSERT INTO "User" (name, password) VALUES (?, ?)').run(name, hashedPassword)

    const token = await createToken({ id: result.lastInsertRowid, name })

    const response = NextResponse.json({
      user: { id: result.lastInsertRowid, name },
      message: 'Inscription réussie',
    })

    setTokenCookie(response, token)

    return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription', details: message },
      { status: 500 }
    )
  }
}
