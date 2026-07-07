import type { Dispatch, SetStateAction } from "react"
import type { Resource, Spend, Detail, Make } from "@/types"

export function addResource(resources: Resource[], setResources: Dispatch<SetStateAction<Resource[]>>) {
  const newId = -Date.now()
  setResources([...resources, {
    id: newId,
    _new: true,
    origine_resource: "",
    price_resource: 0,
  }])
}

export function addSpend(spends: Spend[], setSpends: Dispatch<SetStateAction<Spend[]>>) {
  const newId = -Date.now()
  setSpends([...spends, {
    id: newId,
    _new: true,
    name_spend: "",
  }])
}

export function addDetail(spendId: number, details: Detail[], setDetails: Dispatch<SetStateAction<Detail[]>>) {
  const newId = -Date.now()
  setDetails([...details, {
    id: newId,
    _new: true,
    spend_id: spendId,
    name_detail: "",
  }])
}

export function addMake(detailId: number, resourceId: number, makes: Make[], setMakes: Dispatch<SetStateAction<Make[]>>) {
  const newId = -Date.now()
  setMakes([...makes, {
    id: newId,
    _new: true,
    detail_id: detailId,
    resource_id: resourceId,
    price_spend: 0,
  }])
}
