# BUD App — Documentation Complète du Projet

> Généré le 2026-07-02 pour permettre à un modèle d'IA de comprendre exactement ce projet.

---

## 1. Vue d'Ensemble

**BUD App** est une application web de **gestion budgétaire** construite avec **Next.js 15** (App Router). Elle permet aux utilisateurs de créer des projets budgétaires contenant des ressources (revenus) et des dépenses (dépenses), chaque dépense pouvant avoir des détails, et chaque détail pouvant être affecté ("make") à une ou plusieurs ressources.

- **Langue de l'interface** : Français
- **Devise** : Ar (Ariary, Madagascar)
- **Licence** : MIT
- **Auteur** : djenidisimple
- **Dernier commit** : 2026-07-04

---

## 2. Stack Technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework Frontend | Next.js (App Router) | ^15.4.0 |
| UI | React | ^19.1.0 |
| Styling global | Tailwind CSS | ^3.4.17 |
| Composants UI | shadcn/ui (Radix primitives) | — |
| Graphiques | Recharts | ^2.15.0 |
| Export PDF | @react-pdf/renderer | ^4.3.0 |
| Authentification | JWT (jose) + bcryptjs | ^6.10.0 / ^2.4.3 |
| ORM | Prisma | ^7.8.0 |
| Base de données | PostgreSQL | — |
| Requêtes HTTP client | Axios | ^1.10.0 |
| Notifications | Sonner | ^2.0.1 |
| Icônes | Lucide React | ^0.525.0 |
| Dark mode | next-themes | ^0.4.6 |
| Utilitaires CSS | clsx + tailwind-merge + class-variance-authority | — |
| Linting | ESLint (next/core-web-vitals) | ^9.25.0 |
| PostCSS | Autoprefixer | ^10.4.21 |
| Langage | TypeScript | ^5.0.0 |

---

## 3. Structure du Projet

```
bud-app/
├── app/                          # Next.js App Router
│   ├── globals.css               # Styles globaux + variables CSS thème
│   ├── layout.tsx                # Layout racine (Providers wrapper)
│   ├── page.tsx                  # Page d'accueil (redirige vers /login)
│   ├── providers.tsx             # ThemeProvider + AuthProvider + Toaster
│   ├── api/
│   │   └── auth/                 # Endpoints d'authentification
│   │   │   ├── login/route.ts    # POST : connexion
│   │   │   ├── logout/route.ts   # POST : déconnexion
│   │   │   ├── register/route.ts # POST : inscription
│   │   │   └── session/route.ts  # GET : vérifier session
│   │   └── projects/             # Endpoints CRUD projets
│   │       ├── route.ts          # GET (liste), POST (créer)
│   │       └── [id]/
│   │           ├── route.ts      # GET, PUT, DELETE
│   │           ├── data/route.ts # GET (données complètes), POST (sauvegarde)
│   │           ├── filter/route.ts # POST : filtre par année
│   │           └── stats/route.ts  # GET : stats agrégées + graphique
│   └── budget/                   # Pages protégées (authentification requise)
│       ├── layout.tsx            # Layout avec sidebar
│       ├── dashboard/page.tsx    # Tableau de bord (KPI + graphique)
│       ├── profile/page.tsx      # Profil utilisateur
│       ├── transaction/page.tsx  # Liste des projets
│       ├── transaction/[projectId]/page.tsx  # Tableau budgétaire (page principale)
│       ├── settings/page.tsx     # Paramètres (gestion utilisateurs)
│       └── settings/register/page.tsx # Création d'utilisateur
├── components/
│   ├── ui/                       # Composants shadcn/ui (22 composants)
│   ├── addInput.ts               # Fonctions helper pour créer des entités
│   ├── app-sidebar.tsx           # Navigation latérale
│   ├── chart.tsx                 # Graphique area Recharts
│   ├── data-project.tsx          # Liste projets avec CRUD
│   ├── login-form.tsx            # Formulaire de connexion
│   ├── nav-main.tsx              # Éléments de navigation sidebar
│   ├── nav-user.tsx              # Menu utilisateur (dropdown)
│   ├── PDFPreview.tsx            # Document React-PDF
│   ├── project-delete.tsx        # Dialog de confirmation suppression
│   ├── projet-forms.tsx          # Dialog création/édition projet
│   ├── register-form.tsx         # Formulaire d'inscription
│   ├── showPdf.tsx               # Aperçu PDF + téléchargement
│   ├── table-body-spend.tsx      # Corps du tableau budgétaire principal
│   └── table-header.tsx          # En-tête du tableau (colonnes ressources)
├── context/
│   └── AuthContext.tsx            # Contexte React d'authentification (useAuth)
├── generated/prisma/             # Client Prisma généré
├── lib/
│   ├── auth-edge.ts              # JWT création/vérification (jose, compatible Edge)
│   ├── auth.ts                   # Auth serveur : hash, cookies, session
│   ├── db.ts                     # Adaptateur Prisma avec interface SQL "prepare/exec"
│   └── utils.ts                  # Utilitaires : cn, formatNumber, calculateBudget, etc.
├── prisma/
│   ├── schema.prisma             # Schéma de base de données (6 modèles)
│   ├── config.ts                 # Configuration Prisma
│   └── migrations/               # Migrations PostgreSQL
├── middleware.ts                 # Middleware Next.js (protection routes)
├── next.config.js                # Configuration Next.js
├── tailwind.config.js            # Configuration Tailwind (thème shadcn)
├── postcss.config.js             # PostCSS config
├── tsconfig.json                 # Configuration TypeScript + alias @/
├── package.json
├── .env.example                  # Variables d'environnement requises
├── .gitignore
├── Licence                       # Licence MIT
├── README.md
├── .excalidraw                   # Diagramme du modèle de données
├── cahier de charge.docx/pdf     # Spécifications fonctionnelles
└── cahier de recette.docx        # Tests de recette
```

---

## 4. Schéma de Base de Données (Prisma)

6 modèles, relations en cascade :

```
User (1) ──< Project (1) ──< Resource (1) ──< Make
                          └──< Spend (1) ──< Detail (1) ──< Make
```

### User
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | Int | PK, auto-increment |
| name | String | UNIQUE (nom d'utilisateur) |
| password | String | Hash bcrypt (salt rounds: 10) |
| created_at | DateTime | Default now() |
| updated_at | DateTime | @updatedAt |

### Project
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | Int | PK, auto-increment |
| name_project | String | UNIQUE |
| description_project | String | Default "" |
| user_id | Int | FK → User.id, RESTRICT on delete |
| active | Int | Default 1 (boolean-like) |
| created_at | DateTime | Default now() |
| updated_at | DateTime | @updatedAt |

### Resource
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | Int | PK, auto-increment |
| project_id | Int | FK → Project.id, CASCADE |
| origine_resource | String | Nom de la ressource (ex: "Salaire", "Vente") |
| price_resource | Int | Montant total de la ressource |
| created_at | DateTime | Default now() |
| updated_at | DateTime | @updatedAt |

### Spend
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | Int | PK, auto-increment |
| project_id | Int | FK → Project.id, CASCADE |
| name_spend | String | Nom de la dépense (ex: "Loyer", "Nourriture") |
| created_at | DateTime | Default now() |
| updated_at | DateTime | @updatedAt |

### Detail
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | Int | PK, auto-increment |
| spend_id | Int | FK → Spend.id, CASCADE |
| name_detail | String | Sous-catégorie (ex: "Électricité" sous "Loyer") |
| created_at | DateTime | Default now() |
| updated_at | DateTime | @updatedAt |

### Make
| Champ | Type | Contraintes |
|-------|------|-------------|
| id | Int | PK, auto-increment |
| detail_id | Int | FK → Detail.id, CASCADE |
| resource_id | Int | FK → Resource.id, CASCADE |
| price_spend | Int | Montant alloué de la ressource vers ce détail |
| created_at | DateTime | Default now() |
| updated_at | DateTime | @updatedAt |

---

## 5. Authentification

### Flux

```
Client                    Middleware                    Serveur                  DB
  │                          │                          │                       │
  │── POST /api/auth/login ──┘──────────────────────────>│── bcrypt.compare ───>│
  │<─────────────────────────────────────────────────────│ JWT cookie (7 jours) │
  │                          │                          │                       │
  │── GET /budget/* ────────>│── verify JWT cookie ───>│                        │
  │                          │<── redirect /login si invalide                    │
```

### Détails

- **Cookie** : `access_token`, httpOnly, secure en production, sameSite lax, 7 jours
- **JWT** : HS256, payload = `{ id, name, iat, exp }`
- **Middleware** : Protège `/budget/*` → redirige vers `/login` si pas de token valide. Redirige `/login` → `/budget/dashboard` si déjà connecté.
- **Hash** : bcryptjs, salt rounds = 10
- **Clé secrète** : `process.env.JWT_SECRET` (fallback: `bud-app-secret-key-change-in-production-123456789`)

### Endpoints Auth

| Route | Méthode | Corps | Retour |
|-------|---------|-------|--------|
| `/api/auth/login` | POST | `{ name, password }` | `{ success: true, user: { id, name } }` |
| `/api/auth/register` | POST | `{ name, password }` | `{ user: { id, name } }` |
| `/api/auth/logout` | POST | — | `{ success: true }` |
| `/api/auth/session` | GET | — | `{ user: { id, name } }` ou `null` |

### Contexte Client (`AuthContext.tsx`)

```jsx
const { user, loading, login, register, logout, checkSession } = useAuth()
```

- **login(name, password)** → POST /api/auth/login → met à jour `user`
- **register(name, password)** → POST /api/auth/register → met à jour `user`
- **logout()** → POST /api/auth/logout → `user = null`
- **checkSession()** → GET /api/auth/session → restaure `user` au montage

---

## 6. Flux de Données Budgétaires

### Page principale : `/budget/transaction/[projectId]`

```
                    ┌─────────────────────────────────────┐
                    │         Tableau Budgétaire          │
                    │                                     │
                    │   Ressource A  |  Ressource B  |  Σ │
                    │   ───────────────────────────────── │
                    │   Dépense 1                         │
                    │     Détail 1.1  |  [make]   |  Σ   │
                    │     Détail 1.2  |  [make]   |  Σ   │
                    │   Dépense 2                         │
                    │     Détail 2.1  |  [make]   |  Σ   │
                    │   ───────────────────────────────── │
                    │   Total Ress  |  Σ Res A    |  Σ   │
                    │   Total Dép   |  Σ Used A   |  Σ   │
                    │   Restant      |  Reste A    |  Σ   │
                    └─────────────────────────────────────┘
```

### Chargement des données (GET `/api/projects/[id]/data`)

Requêtes SQL exécutées :
1. `SELECT * FROM projects WHERE id = ? AND user_id = ?`
2. `SELECT * FROM resources WHERE project_id = ?`
3. `SELECT * FROM spends WHERE project_id = ?`
4. `SELECT d.*, s.name_spend FROM details d JOIN spends s ON d.spend_id = s.id WHERE s.project_id = ?`
5. `SELECT m.*, d.name_detail, r.origine_resource FROM makes m JOIN details d ON m.detail_id = d.id JOIN spends s ON d.spend_id = s.id JOIN resources r ON m.resource_id = r.id WHERE s.project_id = ? AND r.project_id = ?`

Calculs côté serveur :
- `totalResource` = sum de tous les `price_resource`
- `totalSpend` = sum de tous les `price_spend` des makes
- `detailSpend` : chaque détail avec son total des makes associés
- `stayResource` : chaque ressource avec le montant restant (price_resource - makes.sum)

**Format de réponse** :
```json
{
  "project": { ... },
  "resources": [ ... ],
  "spends": [ ... ],
  "details": [ ... ],
  "makes": [ ... ],
  "budget": { "totalResource": 0, "totalSpend": 0, "remaining": 0 },
  "detailSpend": [ ... ],
  "stayResource": [ ... ]
}
```

### Sauvegarde (POST `/api/projects/[id]/data`)

Les modifications sont faites localement (state React), puis envoyées en une seule requête avec des marqueurs spéciaux :

| Marqueur | Signification |
|----------|---------------|
| `_new: true` | Nouvelle entité → INSERT |
| `_delete: true` | Entité à supprimer → DELETE |
| (aucun) | Mise à jour → UPDATE |

Le tout dans une transaction Prisma (`$transaction`).

Cette approche évite les appels API multiples. L'interface utilisateur reste responsive, et la sauvegarde est déclenchée manuellement via le bouton "Enregistrer".

---

## 7. Composants Clés

### addInput.ts — Helpers de création d'entités

| Fonction | Crée | Propriétés |
|----------|------|------------|
| `addResource(resources, setResources)` | Resource | `{ id: -Date.now(), _new: true, origine_resource: "", price_resource: 0 }` |
| `addSpend(spends, setSpends)` | Spend | `{ id: -Date.now(), _new: true, name_spend: "" }` |
| `addDetail(spendId, details, setDetails)` | Detail | `{ id: -Date.now(), _new: true, spend_id: spendId, name_detail: "" }` |

Les IDs négatifs temporaires évitent les conflits avec les IDs réels de la base de données.

### utils.ts — Fonctions utilitaires

- **`cn(...inputs)`** : fusion de classes Tailwind (clsx + tailwind-merge)
- **`formatNumber(num)`** : formatage nombre en français (ex: `1 234 567`)
- **`calculateRemainingResources(resources, makes)`** : calcule le reste par ressource (= `price_resource - sum(makes.price_spend)`)
- **`calculateBudget(resources, makes)`** : calcule `{ totalResource, totalSpend, remaining }`
- **`MONTHS_FR`** : tableau des 12 mois en français

### PDFExport — Export PDF

Utilise `@react-pdf/renderer` pour générer un document A4 avec :
- En-tête : nom du projet, description, date
- Tableau des ressources
- Tableau des dépenses avec détails et montants alloués
- Totaux et restants

---

## 8. API Routes (Endpoints)

### Auth
| Route | Méthode | Auth | Description |
|-------|---------|------|-------------|
| `/api/auth/login` | POST | Non | Connexion |
| `/api/auth/register` | POST | Non | Inscription |
| `/api/auth/logout` | POST | Non | Déconnexion |
| `/api/auth/session` | GET | Cookie | Vérifier session |

### Projects
| Route | Méthode | Auth | Description |
|-------|---------|------|-------------|
| `/api/projects` | GET | Cookie | Liste des projets de l'utilisateur |
| `/api/projects` | POST | Cookie | Créer un projet |
| `/api/projects/[id]` | GET | Cookie | Détail d'un projet |
| `/api/projects/[id]` | PUT | Cookie | Modifier un projet |
| `/api/projects/[id]` | DELETE | Cookie | Supprimer un projet |
| `/api/projects/[id]/data` | GET | Cookie | Données complètes (calculs inclus) |
| `/api/projects/[id]/data` | POST | Cookie | Sauvegarder toutes les modifications |
| `/api/projects/[id]/filter` | POST | Cookie | Filtrer les makes par année |
| `/api/projects/[id]/stats` | GET | Cookie | Statistiques agrégées + données graphique |

---

## 9. Adaptateur Base de Données (`lib/db.ts`)

Une couche d'abstraction personnalisée au-dessus de Prisma :

```typescript
const db = await getDb()
// Requête avec paramètres (conversion automatique ? → $1, $2, ...)
db.prepare('SELECT * FROM resources WHERE project_id = ?').all(id)
db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(id, userId)
db.prepare('INSERT INTO resources (project_id, origine_resource, price_resource) VALUES (?, ?, ?)').run(projectId, name, price)
// Insert avec RETURNING id
db.prepare('INSERT INTO ... VALUES (?, ?)').run(...) // retourne { lastInsertRowid, changes }
// Transactions
db.transaction(async () => { ... })()
// Exec simple
db.exec('DELETE FROM ...')
```

Cette interface imite l'API `better-sqlite3` pour faciliter la migration depuis SQLite vers PostgreSQL.

---

## 10. Fichiers de Configuration

### `.env`
```
DATABASE_URL=postgresql://postgres:123@localhost:5432/bud-app
JWT_SECRET=bud-app-secret-key-change-in-production-123456789
```

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true }
module.exports = nextConfig
```

### `tailwind.config.js`
- Thème shadcn/ui complet avec variables CSS
- sidebar width: 16rem (collapsed: 3rem)
- chart colors (5 nuances)
- Dark mode: class-based

### `tsconfig.json`
```json
{ "compilerOptions": { "paths": { "@/*": ["./*"] } } }
```

---

## 11. Conventions du Code

### Nommage
- **Tables DB** : pluriel, snake_case (`projects`, `resources`, `spends`, `details`, `makes`)
- **Colonnes DB** : snake_case (`name_project`, `price_resource`, `origine_resource`)
- **Variables JS** : camelCase (`nameProject`, `priceResource`)
- **Fichiers React** : kebab-case pour pages, PascalCase pour composants
- **Fichiers JS** : kebab-case
- **Fonctions API** : fonctions nommées par méthode HTTP (`GET`, `POST`)

### Patterns React
- `'use client'` pour les composants interactifs
- `useState` + `useEffect` pour la gestion d'état (pas de librairie externe)
- `useCallback` pour les fonctions passées en props
- Pas de TypeScript (JS pur)
- Pas de tests unitaires

### Style de code
- Pas de points-virgules
- Guillemets doubles pour JSX, guillemets simples pour JS
- Export nommé pour les fonctions
- Pas de commentaires dans le code

---

## 12. Données et Statistiques du Projet

- **Fichiers** : ~70 fichiers
- **Taille du code source** : ~5000 lignes
- **Dépendances** : 44 (38 prod + 6 dev)
- **Commits** : 7
- **Période de développement** : 3 jours (27-30 janvier 2026)

---

## 13. État Actuel & Problèmes Connus

### README obsolète
Le README.md mentionne un backend Laravel qui n'existe pas dans ce dépôt. L'application est 100% Next.js. Le README semble être un template d'une version antérieure du projet.

### SQLite legacy
Le fichier `-- SQLite.sql` contient d'anciennes requêtes SQLite. L'application utilise maintenant PostgreSQL via Prisma.

### Pas de tests
Aucun framework de test configuré (pas de Jest, Vitest, Playwright).

### Hooks directory vide
Le dossier `hooks/` existe mais ne contient aucun fichier.

---

## 14. Pages et Navigation

| Route | Page | Description |
|-------|------|-------------|
| `/` | page.js | Redirige vers `/login` |
| `/login` | login/page.js | Page de connexion / inscription |
| `/budget/dashboard` | dashboard/page.js | Tableau de bord (KPI, graphique) |
| `/budget/transaction` | transaction/page.js | Liste des projets |
| `/budget/transaction/[projectId]` | transaction/[projectId]/page.js | Tableau budgétaire |
| `/budget/settings` | settings/page.js | Paramètres (gestion utilisateurs) |
| `/budget/settings/register` | settings/register/page.js | Création d'utilisateur |
| `/budget/profile` | profile/page.js | Profil utilisateur |

### Sidebar
- Dashboard (icône: LayoutDashboard)
- Transaction (icône: ArrowLeftRight)
- Paramètres (icône: Settings)
- Utilisateur : dropdown avec lien profil et déconnexion

---

## 15. Métadonnées pour l'IA

Ce fichier est conçu pour qu'une IA comprenne le projet sans avoir à lire l'intégralité du code source. Les points d'entrée principaux pour comprendre le flux sont :

1. **Point d'entrée utilisateur** : `app/page.js` → `/login`
2. **Authentification** : `middleware.js` → `lib/auth-edge.js` → `lib/auth.js` → `context/AuthContext.js`
3. **CRUD projet** : `app/budget/transaction/page.js` → `components/data-project.jsx` → `app/api/projects/`
4. **Tableau budgétaire** : `app/budget/transaction/[projectId]/page.js` → `components/table-header.jsx` + `components/table-body-spend.jsx` → `app/api/projects/[id]/data/route.js`
5. **Base de données** : `prisma/schema.prisma` → `lib/db.js`
