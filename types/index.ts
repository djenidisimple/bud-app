export interface Project {
  id: number
  name_project: string
  description_project?: string
  user_id?: number
  active?: number
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface Resource {
  id: number
  project_id?: number
  origine_resource: string
  price_resource: number
  _new?: boolean
  _delete?: boolean
  remaining?: number
  used?: number
  [key: string]: unknown
}

export interface Spend {
  id: number
  project_id?: number
  name_spend: string
  _new?: boolean
  _delete?: boolean
  [key: string]: unknown
}

export interface Detail {
  id: number
  spend_id: number
  name_detail: string
  _new?: boolean
  _delete?: boolean
  [key: string]: unknown
}

export interface Make {
  id: number
  detail_id: number
  resource_id: number
  price_spend: number
  _new?: boolean
  _delete?: boolean
  [key: string]: unknown
}

export interface ChartItem {
  name: string
  resource: number
  spend: number
}

export interface DashboardStats {
  projectCount: number
  totalResource: number
  totalSpend: number
  remaining: number
  chartData: ChartItem[]
}
