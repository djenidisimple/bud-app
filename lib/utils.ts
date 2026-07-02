import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | string) {
  return new Intl.NumberFormat('fr-FR').format(Number(num) || 0)
}

interface ResourceBase {
  id: number | string
  price_resource: number | string
  [key: string]: unknown
}

interface MakeBase {
  resource_id: number | string
  price_spend: number | string
  [key: string]: unknown
}

export function calculateRemainingResources(resources: ResourceBase[], makes: MakeBase[]) {
  const resourceTotals: Record<string, ResourceBase & { used: number }> = {}
  resources.forEach(r => {
    resourceTotals[String(r.id)] = { ...r, used: 0 } as ResourceBase & { used: number }
  })
  makes.forEach(m => {
    if (resourceTotals[String(m.resource_id)]) {
      resourceTotals[String(m.resource_id)].used += Number(m.price_spend) || 0
    }
  })
  return Object.values(resourceTotals).map(r => ({
    ...r,
    remaining: Number(r.price_resource) - r.used,
  }))
}

export function calculateBudget(resources: ResourceBase[], makes: MakeBase[]) {
  const totalResource = resources.reduce((sum, r) => sum + (Number(r.price_resource) || 0), 0)
  const totalSpend = makes.reduce((sum, m) => sum + (Number(m.price_spend) || 0), 0)
  return {
    totalResource,
    totalSpend,
    remaining: totalResource - totalSpend,
  }
}

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

export { MONTHS_FR }
