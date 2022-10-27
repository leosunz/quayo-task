import { domainName } from "../constants/Config"

export interface MinifiedClient {
  client_code: string
  description: string
  currency: string
  supervisor_code: string
  is_active: boolean
}

export const getAllClientsUrl = domainName + "/api/client/all"

export const getNewClientInitUrl = domainName + "/api/client/init"

export interface ClientProperty {
  id: number
  description: string
  type: number
  is_editable: boolean
  is_required: boolean
  input_type: number
  sort_order: number
}

export interface ClientCriteria {
  criteria_id: number
  description: string
  criteria_type: number
  is_editable: boolean
  is_required: boolean
  sort_order: number
  criteria_values: {
    criteria_value_id: number
    criteria_id: number
    description: string
  }[]
}

export interface ClientInit {
  properties: ClientProperty[]
  criteria: ClientCriteria[]
  addresses: {
    address_code: string
    description: string
  }[]
  currencies: {
    currency_code: string
    currency_description: string
    currency_symbol: string
  }[]
  sales_representatives: {
    user_code: string
    description: string
  }[]
}

export interface NewClientRequest {
  client_code: string
  description: string
  currency_code: string
  properties: {
    property_id: number
    description: string
  }[]
  criteria: {
    client_criteria_value_id: number
  }[]
  address_code: string
  sales_representative: string
}

export const newClientUrl = domainName + "/api/client/new"

export const getClientByCodeUrl = (id: string | number) =>
  domainName + `/api/client/${id}`

export interface ClientWithTemplate {
  template: ClientInit
  client: {
    client_code: string
    description: string
    currency_code: string
    barcode: string
    is_active: boolean
    default_user: string
    addresses: {
      address_code: string
      description: string
    }[]
    criteria_values: {
      criteria_value_id: number
      criteria_id: number
      description: string
    }[]
    properties: {
      property_id: number
      description: string
    }[]
  }
}

export interface UpdateClientRequest {
  description: string
  currency_code: string
  is_active: boolean
  properties: {
    property_id: number
    description: string
  }[]
  criteria: {
    client_criteria_value_id: number
  }[]
  address_code: string
  sales_representative: string
}
