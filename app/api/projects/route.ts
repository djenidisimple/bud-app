import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const db = await getDb()
  const projects = await db.prepare('SELECT * FROM "Project" WHERE user_id = ? ORDER BY created_at DESC').all(session.id)
  return NextResponse.json({ projects })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  try {
    const { name_project, description_project } = await request.json()

    if (!name_project) {
      return NextResponse.json({ error: 'Le nom du projet est requis' }, { status: 400 })
    }

    const db = await getDb()

    const existing = await db.prepare('SELECT id FROM "Project" WHERE name_project = ?').get(name_project)
    if (existing) {
      return NextResponse.json({ error: 'Un projet avec ce nom existe déjà' }, { status: 409 })
    }

    const result = await db.prepare(
      'INSERT INTO "Project" (name_project, description_project, user_id) VALUES (?, ?, ?)'
    ).run(name_project, description_project || '', session.id)

    const project = await db.prepare('SELECT * FROM "Project" WHERE id = ?').get(result.lastInsertRowid)
    return NextResponse.json({ project, message: 'Projet créé avec succès' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du projet' }, { status: 500 })
  }
}
