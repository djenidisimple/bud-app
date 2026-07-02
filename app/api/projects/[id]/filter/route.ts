import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  try {
    const { month, year } = await request.json()

    const resources = await db.prepare('SELECT * FROM "Resource" WHERE project_id = ?').all(id)
    const spends = await db.prepare('SELECT * FROM "Spend" WHERE project_id = ?').all(id)
    const details = await db.prepare(`
      SELECT d.*, s.name_spend 
      FROM "Detail" d 
      JOIN "Spend" s ON d.spend_id = s.id 
      WHERE s.project_id = ?
    `).all(id)

    let makesQuery = `
      SELECT m.*, d.name_detail, r.origine_resource 
      FROM "Make" m 
      JOIN "Detail" d ON m.detail_id = d.id 
      JOIN "Spend" s ON d.spend_id = s.id 
      JOIN "Resource" r ON m.resource_id = r.id 
      WHERE s.project_id = ? AND r.project_id = ?
    `
    const params = [id, id]

    if (year && year !== 'Tous') {
      makesQuery += ` AND EXTRACT(YEAR FROM m.created_at) = ?`
      params.push(year)
    }

    const makes = await db.prepare(makesQuery).all(...params)

    const totalResource = resources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
    const totalSpend = makes.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)

    return NextResponse.json({
      resources,
      spends,
      details,
      makes,
      budget: { totalResource, totalSpend, remaining: totalResource - totalSpend },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du filtrage' }, { status: 500 })
  }
}
