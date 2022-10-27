import { domainName } from "../constants/Config"

export interface CurrencyWithRatioInterface {
  currency_code: string
  description: string
  symbol: string
  ratio: number
  is_main: boolean
}

export interface NewCurrencyReq {
  description: string
  currency_code: string
  ratio: number
  symbol: string
}

export const getAllCurrenciesUrl = domainName + "/api/currency/all"

export const newCurrenciesUrl = domainName + "/api/currency/new"

export const updateCurrenciesUrl = (currCode: string) =>
  domainName + `/api/currency/${currCode}`
