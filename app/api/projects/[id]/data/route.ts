import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { z } from 'zod'
import { parseIntParam } from '@/lib/utils'

const resourceSchema = z.object({
  id: z.number().optional(),
  _new: z.boolean().optional(),
  _delete: z.boolean().optional(),
  origine_resource: z.string().min(1, 'L\'origine est requise'),
  price_resource: z.number().nonnegative('Le montant doit être positif').default(0),
})

const spendSchema = z.object({
  id: z.number().optional(),
  _new: z.boolean().optional(),
  _delete: z.boolean().optional(),
  name_spend: z.string().min(1, 'Le nom de la dépense est requis'),
})

const detailSchema = z.object({
  id: z.number().optional(),
  _new: z.boolean().optional(),
  _delete: z.boolean().optional(),
  spend_id: z.number(),
  name_detail: z.string().min(1, 'Le nom du détail est requis'),
})

const makeSchema = z.object({
  id: z.number().optional(),
  _new: z.boolean().optional(),
  _delete: z.boolean().optional(),
  detail_id: z.number(),
  resource_id: z.number(),
  price_spend: z.number().nonnegative('Le montant doit être positif').default(0),
})

const dataSchema = z.object({
  resources: z.array(resourceSchema).optional(),
  spends: z.array(spendSchema).optional(),
  details: z.array(detailSchema).optional(),
  makes: z.array(makeSchema).optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const projectId = parseIntParam(id)

    const project = await prisma.project.findFirst({
      where: { id: projectId, user_id: session.id as number },
    })

    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    const resources = await prisma.resource.findMany({ where: { project_id: projectId } })
    const spends = await prisma.spend.findMany({ where: { project_id: projectId } })
    const details = await prisma.detail.findMany({
      where: { spend: { project_id: projectId } },
      include: { spend: true },
    })

    const makes = await prisma.make.findMany({
      where: {
        detail: { spend: { project_id: projectId } },
        resource: { project_id: projectId },
      },
      include: {
        detail: true,
        resource: true,
      },
    })

    const totalResource = resources.reduce((sum, r) => sum + r.price_resource, 0)
    const totalSpend = makes.reduce((sum, m) => sum + m.price_spend, 0)

    const detailSpend = details.map(d => {
      const total = makes
        .filter(m => m.detail_id === d.id)
        .reduce((sum, m) => sum + m.price_spend, 0)
      return { ...d, name_spend: d.spend.name_spend, total }
    })

    const stayResource = resources.map(r => {
      const used = makes
        .filter(m => m.resource_id === r.id)
        .reduce((sum, m) => sum + m.price_spend, 0)
      return { ...r, stay: r.price_resource - used }
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la récupération des données' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params
  const projectId = parseIntParam(id)

  const project = await prisma.project.findFirst({
    where: { id: projectId, user_id: session.id as number },
  })

  if (!project) {
    return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { resources, spends, details, makes } = dataSchema.parse(body)

    await prisma.$transaction(async (tx) => {
      if (resources) {
        for (const r of resources) {
          if (r._delete && r.id) {
            await tx.resource.delete({ where: { id: r.id } })
          } else if (r._new) {
            await tx.resource.create({
              data: { project_id: projectId, origine_resource: r.origine_resource, price_resource: r.price_resource },
            })
          } else if (r.id) {
            await tx.resource.update({
              where: { id: r.id },
              data: { origine_resource: r.origine_resource, price_resource: r.price_resource },
            })
          }
        }
      }

      if (spends) {
        for (const s of spends) {
          if (s._delete && s.id) {
            await tx.spend.delete({ where: { id: s.id } })
          } else if (s._new) {
            await tx.spend.create({
              data: { project_id: projectId, name_spend: s.name_spend },
            })
          } else if (s.id) {
            await tx.spend.update({
              where: { id: s.id },
              data: { name_spend: s.name_spend },
            })
          }
        }
      }

      if (details) {
        for (const d of details) {
          if (d._delete && d.id) {
            await tx.detail.delete({ where: { id: d.id } })
          } else if (d._new) {
            await tx.detail.create({
              data: { spend_id: d.spend_id, name_detail: d.name_detail },
            })
          } else if (d.id) {
            await tx.detail.update({
              where: { id: d.id },
              data: { name_detail: d.name_detail },
            })
          }
        }
      }

      if (makes) {
        for (const m of makes) {
          if (m._delete && m.id) {
            await tx.make.delete({ where: { id: m.id } })
          } else if (m._new) {
            await tx.make.create({
              data: { detail_id: m.detail_id, resource_id: m.resource_id, price_spend: m.price_spend },
            })
          } else if (m.id) {
            await tx.make.update({
              where: { id: m.id },
              data: { price_spend: m.price_spend },
            })
          }
        }
      }

      // Validation budgétaire : Vérifier que aucune ressource n'est en dépassement
      const currentResources = await tx.resource.findMany({ where: { project_id: projectId } })
      for (const res of currentResources) {
        const totalAllocated = await tx.make.aggregate({
          _sum: { price_spend: true },
          where: { resource_id: res.id },
        })
        const spent = totalAllocated._sum.price_spend || 0
        if (spent > res.price_resource) {
          throw new Error(`Dépassement de budget pour la ressource ${res.origine_resource}: ${spent} alloué pour un montant de ${res.price_resource}`)
        }
      }
    })

    return NextResponse.json({ message: 'Données sauvegardées avec succès' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
  }
}
