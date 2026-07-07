const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

function hashPassword(password) {
  return bcrypt.hashSync(password, 10)
}

async function run(sql, ...params) {
  const res = await pool.query(sql, params)
  return res
}

async function get(sql, ...params) {
  const res = await pool.query(sql, params)
  return res.rows[0]
}

async function main() {
  console.log('Seeding database...')

  let user = await get('SELECT id FROM "User" WHERE name = $1', 'demo')
  let userId

  if (user) {
    userId = user.id
    console.log('Demo user already exists')
  } else {
    const hashed = hashPassword('demo123')
    const res = await run(
      'INSERT INTO "User" (name, password) VALUES ($1, $2) RETURNING id',
      'demo', hashed
    )
    userId = res.rows[0].id
    console.log('Demo user created')
  }

  const projects = [
    {
      name: 'Construction École Primaire',
      description: "Projet de construction d'une école primaire dans la région d'Analamanga",
      resources: [
        { origine: 'Budget État', price: 150000000 },
        { origine: 'Subvention UNESCO', price: 80000000 },
        { origine: 'Fonds Commune', price: 30000000 },
        { origine: 'Donateurs privés', price: 20000000 },
      ],
      spends: [
        {
          name: 'Travaux de construction',
          details: [
            { name: 'Fondations', makes: [8000000, 5000000, 2000000, 1000000] },
            { name: 'Murs et toiture', makes: [25000000, 12000000, 5000000, 3000000] },
            { name: 'Finition intérieure', makes: [15000000, 8000000, 3000000, 2000000] },
            { name: 'Plomberie et électricité', makes: [10000000, 5000000, 2000000, 1000000] },
          ],
        },
        {
          name: 'Équipement',
          details: [
            { name: 'Mobilier scolaire', makes: [8000000, 4000000, 2000000, 1000000] },
            { name: 'Matériel informatique', makes: [5000000, 6000000, 1000000, 2000000] },
            { name: 'Bibliothèque', makes: [3000000, 2000000, 1000000, 500000] },
          ],
        },
        {
          name: 'Personnel et études',
          details: [
            { name: "Étude d'impact", makes: [3000000, 2000000, 1000000, 500000] },
            { name: 'Architecte et ingénieurs', makes: [8000000, 5000000, 2000000, 1000000] },
            { name: 'Main d\'œuvre', makes: [12000000, 6000000, 3000000, 2000000] },
          ],
        },
      ],
    },
    {
      name: 'Marché Municipal - Antananarivo',
      description: "Rénovation et modernisation du marché municipal d'Antananarivo",
      resources: [
        { origine: 'Budget Municipal', price: 60000000 },
        { origine: 'Aide Internationale', price: 90000000 },
        { origine: 'Partenariat Privé', price: 40000000 },
      ],
      spends: [
        {
          name: 'Infrastructure',
          details: [
            { name: 'Réfection des sols', makes: [5000000, 8000000, 3000000] },
            { name: 'Toiture et charpente', makes: [8000000, 12000000, 5000000] },
            { name: "Système d'évacuation", makes: [4000000, 6000000, 2000000] },
            { name: 'Clôture et portails', makes: [3000000, 5000000, 2000000] },
          ],
        },
        {
          name: 'Aménagement',
          details: [
            { name: 'Étalages et comptoirs', makes: [5000000, 7000000, 3000000] },
            { name: 'Chambre froide', makes: [4000000, 8000000, 2000000] },
            { name: 'Zone de stationnement', makes: [3000000, 5000000, 2000000] },
            { name: 'Éclairage public', makes: [2000000, 3000000, 1000000] },
          ],
        },
        {
          name: 'Services',
          details: [
            { name: "Point d'eau et sanitaires", makes: [3000000, 4000000, 2000000] },
            { name: 'Bureau de gestion', makes: [2000000, 3000000, 1000000] },
            { name: 'Poulailler et stockage', makes: [2000000, 4000000, 1000000] },
          ],
        },
      ],
    },
    {
      name: 'Projet Agricole - Itasy',
      description: "Soutien aux agriculteurs de la région Itasy avec irrigation et formation",
      resources: [
        { origine: 'Ministère Agriculture', price: 45000000 },
        { origine: 'FAO', price: 35000000 },
        { origine: 'Coopérative locale', price: 15000000 },
        { origine: 'Micro-crédit', price: 10000000 },
      ],
      spends: [
        {
          name: 'Irrigation',
          details: [
            { name: "Canaux d'irrigation", makes: [8000000, 5000000, 2000000, 1000000] },
            { name: 'Système goutte-à-goutte', makes: [6000000, 4000000, 2000000, 1000000] },
            { name: 'Pompes solaires', makes: [5000000, 3000000, 1000000, 500000] },
            { name: "Réservoirs d'eau", makes: [4000000, 3000000, 1000000, 500000] },
          ],
        },
        {
          name: 'Formation',
          details: [
            { name: 'Techniques agricoles modernes', makes: [3000000, 2000000, 1000000, 500000] },
            { name: 'Gestion des récoltes', makes: [2000000, 2000000, 1000000, 500000] },
            { name: 'Transformation locale', makes: [2000000, 1500000, 1000000, 500000] },
          ],
        },
        {
          name: 'Équipement agricole',
          details: [
            { name: 'Tracteurs et motoculteurs', makes: [6000000, 5000000, 2000000, 1000000] },
            { name: 'Semences et intrants', makes: [4000000, 3000000, 1000000, 1000000] },
            { name: 'Outils aratoires', makes: [2000000, 1500000, 1000000, 500000] },
          ],
        },
      ],
    },
    {
      name: 'Centre de Santé - Ambohimanga',
      description: "Construction et équipement d'un centre de santé de base à Ambohimanga",
      resources: [
        { origine: 'Ministère Santé', price: 70000000 },
        { origine: 'OMS', price: 50000000 },
        { origine: 'ONG Médicale', price: 30000000 },
      ],
      spends: [
        {
          name: 'Bâtiment',
          details: [
            { name: 'Construction du bâtiment', makes: [15000000, 10000000, 5000000] },
            { name: 'Toiture et isolation', makes: [5000000, 4000000, 2000000] },
            { name: 'Système électrique', makes: [4000000, 3000000, 2000000] },
            { name: "Adduction d'eau", makes: [3000000, 2000000, 1000000] },
          ],
        },
        {
          name: 'Équipement médical',
          details: [
            { name: 'Mobilier médical', makes: [5000000, 4000000, 2000000] },
            { name: 'Appareils de diagnostic', makes: [8000000, 6000000, 3000000] },
            { name: 'Pharmacie et stocks', makes: [4000000, 3000000, 2000000] },
            { name: 'Ambulance', makes: [6000000, 5000000, 2000000] },
          ],
        },
        {
          name: 'Personnel',
          details: [
            { name: 'Médecins et infirmiers', makes: [8000000, 5000000, 3000000] },
            { name: 'Personnel administratif', makes: [3000000, 2000000, 1000000] },
            { name: 'Formation continue', makes: [2000000, 2000000, 1000000] },
          ],
        },
      ],
    },
    {
      name: 'Projet Numérique - Éducation',
      description: "Équipement numérique des écoles publiques avec tablettes et connexion internet",
      resources: [
        { origine: 'Ministère Éducation', price: 25000000 },
        { origine: 'Banque Mondiale', price: 60000000 },
        { origine: 'Sponsors technologiques', price: 20000000 },
        { origine: 'Fonds Innovation', price: 15000000 },
      ],
      spends: [
        {
          name: 'Matériel',
          details: [
            { name: 'Tablettes éducatives', makes: [5000000, 12000000, 4000000, 3000000] },
            { name: 'Serveurs et stockage', makes: [3000000, 8000000, 2000000, 1000000] },
            { name: 'Routeurs et câblage', makes: [2000000, 5000000, 1000000, 1000000] },
            { name: 'Imprimantes et accessoires', makes: [1000000, 3000000, 1000000, 500000] },
          ],
        },
        {
          name: 'Installation',
          details: [
            { name: 'Installation réseau', makes: [2000000, 4000000, 1500000, 1000000] },
            { name: 'Configuration logicielle', makes: [1500000, 3000000, 1000000, 500000] },
            { name: 'Sécurisation des données', makes: [1000000, 2000000, 500000, 500000] },
          ],
        },
        {
          name: 'Formation',
          details: [
            { name: 'Formation enseignants', makes: [2000000, 4000000, 1500000, 1000000] },
            { name: 'Support technique', makes: [1500000, 3000000, 1000000, 1000000] },
            { name: 'Contenus pédagogiques', makes: [1000000, 3000000, 1000000, 500000] },
          ],
        },
      ],
    },
  ]

  for (const p of projects) {
    const existing = await get('SELECT id FROM "Project" WHERE name_project = $1', p.name)
    if (existing) {
      console.log(`Project "${p.name}" already exists, skipping...`)
      continue
    }

    const projectRes = await run(
      'INSERT INTO "Project" (name_project, description_project, user_id) VALUES ($1, $2, $3) RETURNING id',
      p.name, p.description, userId
    )
    const projectId = projectRes.rows[0].id

    const resourceIds = []
    for (const r of p.resources) {
      const res = await run(
        'INSERT INTO "Resource" (project_id, origine_resource, price_resource) VALUES ($1, $2, $3) RETURNING id',
        projectId, r.origine, r.price
      )
      resourceIds.push(res.rows[0].id)
    }

    for (const s of p.spends) {
      const spendRes = await run(
        'INSERT INTO "Spend" (project_id, name_spend) VALUES ($1, $2) RETURNING id',
        projectId, s.name
      )
      const spendId = spendRes.rows[0].id

      for (const d of s.details) {
        const detailRes = await run(
          'INSERT INTO "Detail" (spend_id, name_detail) VALUES ($1, $2) RETURNING id',
          spendId, d.name
        )
        const detailId = detailRes.rows[0].id

        for (let i = 0; i < d.makes.length; i++) {
          const price = d.makes[i]
          if (price > 0 && resourceIds[i]) {
            await run(
              'INSERT INTO "Make" (detail_id, resource_id, price_spend) VALUES ($1, $2, $3)',
              detailId, resourceIds[i], price
            )
          }
        }
      }
    }

    console.log(`Project "${p.name}" created`)
  }

  console.log('\nSeed completed!')
  console.log('Login: demo / demo123')

  await pool.end()
  process.exit(0)
}

main().catch((e) => {
  console.error('Seed failed:', e)
  process.exit(1)
})
