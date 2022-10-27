import { domainName } from "../constants/Config"
import { Criteria, Property, Role } from "./ApiModels"

export interface MinifiedUser {
  user_code: string
  description?: string
  email?: string
  roles: Role[]
  is_active: boolean
}

export const getAllUsersUrl = domainName + "/api/user/all"

export interface InitUser {
  properties: Property[]
  criteria: Criteria[]
  roles: Role[]
}

export const getInitUserUrl = domainName + "/api/user/init"

export interface NewUserRequest {
  user_code: string
  description: string
  password: string
  email: string
  properties: {
    property_id: number
    description: string
  }[]
  criteria: {
    user_criteria_value_id: number
  }[]
  roles: number[]
}

export const newUserUrl = domainName + "/api/user/new"

export const getUserUrl = (id: string | number) =>
  domainName + `/api/user/${id}`

export interface UserWithTemplate {
  user: {
    user_code: string
    description: string
    email: string
    is_active: boolean
    criteria_values: {
      criteria_value_id: number
      criteria_id: number
      description: string
    }[]
    roles: {
      role_id: number
      role_name: string
    }[]
    properties: {
      property_id: number
      description: string
    }[]
  }
  template: InitUser
}

export interface UpdateUser {
  description: string
  email: string
  is_active: boolean
  properties: {
    property_id: number
    description: string
  }[]
  criteria: {
    user_criteria_value_id: number
  }[]
}
