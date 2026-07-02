import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const db = await getDb()
  const project = await db.prepare('SELECT * FROM "Project" WHERE id = ? AND user_id = ?').get(id, session.id)

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
    const { name_project, description_project } = await request.json()
    const db = await getDb()

    const existing = await db.prepare('SELECT * FROM "Project" WHERE id = ? AND user_id = ?').get(id, session.id)
    if (!existing) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    await db.prepare(
      'UPDATE "Project" SET name_project = ?, description_project = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(name_project || existing.name_project, description_project ?? existing.description_project, id)

    const project = await db.prepare('SELECT * FROM "Project" WHERE id = ?').get(id)
    return NextResponse.json({ project, message: 'Projet mis à jour' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const db = await getDb()

  const project = await db.prepare('SELECT * FROM "Project" WHERE id = ? AND user_id = ?').get(id, session.id)
  if (!project) {
    return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
  }

  await db.prepare('DELETE FROM "Project" WHERE id = ?').run(id)
  return NextResponse.json({ message: 'Projet supprimé' })
}
