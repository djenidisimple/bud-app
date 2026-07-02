import { Dispatch, SetStateAction } from "react"

interface ResourceInput {
  id: number
  _new?: boolean
  origine_resource: string
  price_resource: number
  [key: string]: unknown
}

interface SpendInput {
  id: number
  _new?: boolean
  name_spend: string
  [key: string]: unknown
}

interface DetailInput {
  id: number
  _new?: boolean
  spend_id: number
  name_detail: string
  [key: string]: unknown
}

interface MakeInput {
  id: number
  _new?: boolean
  detail_id: number
  resource_id: number
  price_spend: number
  [key: string]: unknown
}

export function addResource(resources: ResourceInput[], setResources: Dispatch<SetStateAction<ResourceInput[]>>) {
  const newId = -Date.now()
  setResources([...resources, {
    id: newId,
    _new: true,
    origine_resource: "",
    price_resource: 0,
  }])
}

export function addSpend(spends: SpendInput[], setSpends: Dispatch<SetStateAction<SpendInput[]>>) {
  const newId = -Date.now()
  setSpends([...spends, {
    id: newId,
    _new: true,
    name_spend: "",
  }])
}

export function addDetail(spendId: number, details: DetailInput[], setDetails: Dispatch<SetStateAction<DetailInput[]>>) {
  const newId = -Date.now()
  setDetails([...details, {
    id: newId,
    _new: true,
    spend_id: spendId,
    name_detail: "",
  }])
}

export function addMake(detailId: number, resourceId: number, makes: MakeInput[], setMakes: Dispatch<SetStateAction<MakeInput[]>>) {
  const newId = -Date.now()
  setMakes([...makes, {
    id: newId,
    _new: true,
    detail_id: detailId,
    resource_id: resourceId,
    price_spend: 0,
  }])
}
