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

  const resources = await db.prepare('SELECT * FROM "Resource" WHERE project_id = ?').all(id)
  const makes = await db.prepare(`
    SELECT m.*, d.name_detail, r.origine_resource 
    FROM "Make" m 
    JOIN "Detail" d ON m.detail_id = d.id 
    JOIN "Spend" s ON d.spend_id = s.id 
    JOIN "Resource" r ON m.resource_id = r.id 
    WHERE s.project_id = ? AND r.project_id = ?
  `).all(id, id)

  const totalResource = resources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const totalSpend = makes.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)

  const chartData = resources.map(r => {
    const resourceMakes = makes.filter(m => m.resource_id === r.id)
    const used = resourceMakes.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
    return {
      name: r.origine_resource,
      resource: Number(r.price_resource),
      spend: used,
    }
  })

  return NextResponse.json({
    totalResource,
    totalSpend,
    remaining: totalResource - totalSpend,
    chartData,
  })
}
