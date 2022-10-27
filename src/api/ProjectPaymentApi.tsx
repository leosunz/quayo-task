import { domainName } from "../constants/Config"
import { CurrencyInterface } from "./ProjectApi"

export interface ProjectPaymentRes {
  payments: ProjectPaymentInterface[]
  currencies: CurrencyInterface[]
  project_currency_code: string
  client_currency_code: string
  paid: number
  price: number
}

export interface ProjectPaymentInterface {
  id: number
  is_down_payment: boolean
  payment_amount: number
  collection_date: number
  currency: string
}

export const getProjectPayments = (id: number | string) =>
  domainName + `/api/project/${id}/payment/all`

export const newProjectPaymentsUrl = (id: number | string) =>
  domainName + `/api/project/${id}/payment/new`

export interface NewProjectPaymentReq {
  payment_amount: number
  collection_date: number
  currency_code: string
}
