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

  const resources = await db.prepare('SELECT * FROM "Resource" WHERE project_id = ?').all(id) as { id: number; price_resource: number; [key: string]: unknown }[]
  const spends = await db.prepare('SELECT * FROM "Spend" WHERE project_id = ?').all(id) as { id: number; [key: string]: unknown }[]
  const details = await db.prepare(`
    SELECT d.*, s.name_spend 
    FROM "Detail" d 
    JOIN "Spend" s ON d.spend_id = s.id 
    WHERE s.project_id = ?
  `).all(id) as { id: number; spend_id: number; [key: string]: unknown }[]
  const makes = await db.prepare(`
    SELECT m.*, d.name_detail, r.origine_resource 
    FROM "Make" m 
    JOIN "Detail" d ON m.detail_id = d.id 
    JOIN "Spend" s ON d.spend_id = s.id 
    JOIN "Resource" r ON m.resource_id = r.id 
    WHERE s.project_id = ? AND r.project_id = ?
  `).all(id, id) as { id: number; detail_id: number; resource_id: number; price_spend: number; [key: string]: unknown }[]

  const totalResource = resources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const totalSpend = makes.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)

  const detailSpend = details.map(d => {
    const make = makes.filter(m => m.detail_id === d.id)
    const total = make.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
    return { ...d, total }
  })

  const stayResource = resources.map(r => {
    const used = makes
      .filter(m => m.resource_id === r.id)
      .reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
    return { ...r, stay: Number(r.price_resource) - used }
  })

  return NextResponse.json({
    project,
    resources,
    spends,
    details,
    makes,
    budget: { totalResource, totalSpend, remaining: totalResource - totalSpend },
    detailSpend,
    stayResource,
  })
}

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
    const { resources, spends, details, makes } = await request.json()

    await db.transaction(async () => {
      if (resources) {
        for (const r of resources) {
          if (r._delete) {
            await db.prepare('DELETE FROM "Resource" WHERE id = ? AND project_id = ?').run(r.id, id)
          } else if (r._new) {
            await db.prepare('INSERT INTO "Resource" (project_id, origine_resource, price_resource) VALUES (?, ?, ?)').run(id, r.origine_resource, r.price_resource)
          } else if (r.id) {
            await db.prepare('UPDATE "Resource" SET origine_resource = ?, price_resource = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND project_id = ?').run(r.origine_resource, r.price_resource, r.id, id)
          }
        }
      }

      if (spends) {
        for (const s of spends) {
          if (s._delete) {
            await db.prepare('DELETE FROM "Spend" WHERE id = ? AND project_id = ?').run(s.id, id)
          } else if (s._new) {
            await db.prepare('INSERT INTO "Spend" (project_id, name_spend) VALUES (?, ?)').run(id, s.name_spend)
          } else if (s.id) {
            await db.prepare('UPDATE "Spend" SET name_spend = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND project_id = ?').run(s.name_spend, s.id, id)
          }
        }
      }

      if (details) {
        for (const d of details) {
          if (d._delete) {
            await db.prepare('DELETE FROM "Detail" WHERE id = ?').run(d.id)
          } else if (d._new) {
            await db.prepare('INSERT INTO "Detail" (spend_id, name_detail) VALUES (?, ?)').run(d.spend_id, d.name_detail)
          } else if (d.id) {
            await db.prepare('UPDATE "Detail" SET name_detail = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(d.name_detail, d.id)
          }
        }
      }

      if (makes) {
        for (const m of makes) {
          if (m._delete) {
            await db.prepare('DELETE FROM "Make" WHERE id = ?').run(m.id)
          } else if (m._new) {
            await db.prepare('INSERT INTO "Make" (detail_id, resource_id, price_spend) VALUES (?, ?, ?)').run(m.detail_id, m.resource_id, m.price_spend)
          } else if (m.id) {
            await db.prepare('UPDATE "Make" SET price_spend = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(m.price_spend, m.id)
          }
        }
      }
    })

    return NextResponse.json({ message: 'Données sauvegardées' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
  }
}
