import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function toPgSql(sql: string) {
  let i = 0
  return sql.replace(/\?/g, () => `$${++i}`)
}

interface DbResult {
  lastInsertRowid: number
  changes: number
}

interface Statement {
  get<T = Record<string, unknown>>(...params: unknown[]): Promise<T | undefined>
  all<T = Record<string, unknown>[]>(...params: unknown[]): Promise<T>
  run(...params: unknown[]): Promise<DbResult>
  free(): void
}

interface Db {
  prepare(sql: string): Statement
  exec(sql: string): Promise<number>
  run(sql: string): Promise<number>
  transaction(fn: (...args: unknown[]) => Promise<void>): (...args: unknown[]) => Promise<void>
}

export async function getDb(): Promise<Db> {
  return {
    prepare(sql: string): Statement {
      const pgSql = toPgSql(sql)
      const isInsert = sql.trim().toUpperCase().startsWith('INSERT')
      return {
        async get<T = Record<string, unknown>>(...params: unknown[]): Promise<T | undefined> {
          const rows: unknown[] = await prisma.$queryRawUnsafe(pgSql, ...params)
          return (rows as T[])[0] ?? undefined
        },
        async all<T = Record<string, unknown>[]>(...params: unknown[]): Promise<T> {
          const rows: unknown = await prisma.$queryRawUnsafe(pgSql, ...params)
          return rows as T
        },
        async run(...params: unknown[]): Promise<DbResult> {
          if (isInsert) {
            const rows: { id: number }[] = await prisma.$queryRawUnsafe(pgSql + ' RETURNING id', ...params) as { id: number }[]
            return { lastInsertRowid: Number(rows[0]?.id) || 0, changes: 1 }
          }
          const count = await prisma.$executeRawUnsafe(pgSql, ...params)
          return { lastInsertRowid: 0, changes: count }
        },
        free() {},
      }
    },
    async exec(sql: string) {
      return await prisma.$executeRawUnsafe(toPgSql(sql))
    },
    async run(sql: string) {
      return await prisma.$executeRawUnsafe(toPgSql(sql))
    },
    transaction(fn: (...args: unknown[]) => Promise<void>) {
      return (...args: unknown[]) => prisma.$transaction(() => fn(...args))
    },
  }
}

export async function initDb() {
  await prisma.$connect()
}
