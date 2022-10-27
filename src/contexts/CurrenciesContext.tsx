import { createContext, useContext, useEffect, useState } from "react"
import { api, HttpMethods } from "../api/ApiControllers"
import {
  CurrencyWithRatioInterface,
  getAllCurrenciesUrl,
  newCurrenciesUrl,
  NewCurrencyReq,
  updateCurrenciesUrl,
} from "../api/CurrenciesApi"
import { AuthContext } from "./AuthContext"

export interface CurrenciesState {
  isLoading: boolean
  error: string | null
  currencies: CurrencyWithRatioInterface[]
  newCurrency(req: NewCurrencyReq): Promise<void>
  selectedCurrency: CurrencyWithRatioInterface | null
  setSelectedCurrencyCb: (currency: CurrencyWithRatioInterface) => void
  updateCurrency: (currencyCode: string, newRatio: number) => Promise<void>
}

export const CurrrenciesContext = createContext<CurrenciesState | null>(null)

export default function CurrenciesContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const { user } = useContext(AuthContext)!

  const [currencies, setCurrencies] = useState<CurrencyWithRatioInterface[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCurrency, setSelectedCurrency] =
    useState<CurrencyWithRatioInterface | null>(null)

  useEffect(() => {
    setIsLoading(true)
    api<CurrencyWithRatioInterface[]>(
      getAllCurrenciesUrl,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setCurrencies(data!)
        setError(null)
        setIsLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [])

  const newCurrency = async (req: NewCurrencyReq) => {
    try {
      setIsLoading(true)
      const res = await api<CurrencyWithRatioInterface[]>(
        newCurrenciesUrl,
        HttpMethods.Post,
        req,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      if (res) {
        setCurrencies(res)
      }
      setIsLoading(false)
    } catch (e: any) {
      setError(e.message)
      setIsLoading(false)
    }
  }

  const updateCurrency = async (currencyCode: string, newRatio: number) => {
    try {
      setIsLoading(true)
      const res = await api<CurrencyWithRatioInterface[]>(
        updateCurrenciesUrl(currencyCode),
        HttpMethods.Patch,
        { ratio: newRatio },
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      if (res) {
        setCurrencies(res)
      }
      setIsLoading(false)
      setSelectedCurrency(null)
    } catch (e: any) {
      setError(e.message)
      setIsLoading(false)
    }
  }

  const setSelectedCurrencyCb = (currency: CurrencyWithRatioInterface) => {
    if (currency === selectedCurrency) {
      setSelectedCurrency(null)
    } else {
      setSelectedCurrency(currency)
    }
  }

  const value: CurrenciesState = {
    isLoading,
    error,
    currencies,
    selectedCurrency,
    updateCurrency,
    newCurrency,
    setSelectedCurrencyCb,
  }

  return (
    <CurrrenciesContext.Provider value={value}>
      {children}
    </CurrrenciesContext.Provider>
  )
}
