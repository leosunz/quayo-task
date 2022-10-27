import { domainName } from "../constants/Config"

export interface CriteriaValue {
  criteria_value_id: number
  criteria_id: number
  description: string
}

export interface DropdownInitResponse {
  payment_modes: CriteriaValue[]
  payment_terms: CriteriaValue[]
  positions: CriteriaValue[]
  positions_id: number
  payment_modes_id: number
  payment_terms_id: number
}

export const initDropdownUrl = domainName + "/api/settings/init"

export interface NewCriteriaValueRequestBody {
  criteria_id: number
  description: string
}

export enum CriteriaValueType {
  Client,
  User,
}

export const newCriteriavalueUrl = (type: CriteriaValueType) => {
  let variable = ""
  if (type === CriteriaValueType.Client) {
    variable = "client"
  } else {
    variable = "user"
  }

  return domainName + `/api/settings/${variable}/criteria/new`
}

export const deleteCriteriavalueUrl = (
  id: number | string,
  type: CriteriaValueType
) => {
  let variable = ""
  if (type === CriteriaValueType.Client) {
    variable = "client"
  } else {
    variable = "user"
  }

  return domainName + `/api/settings/${variable}/criteria/${id}`
}
