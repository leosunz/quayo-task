import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api, HttpMethods } from "../api/ApiControllers"
import { CurrencyInterface } from "../api/ProjectApi"

import {
  getProjectPayments,
  NewProjectPaymentReq,
  newProjectPaymentsUrl,
  ProjectPaymentInterface,
  ProjectPaymentRes,
} from "../api/ProjectPaymentApi"
import { AuthContext } from "./AuthContext"

export interface ProjectPaymentState {
  payments: ProjectPaymentInterface[]
  currencies: CurrencyInterface[]
  projectCurrency: string | undefined
  clientCurrency: string | undefined
  isLoading: boolean
  error: string | undefined
  paid: number
  price: number
  newProjectPayment(
    amount: number,
    date: number,
    currency: string
  ): Promise<void>
}

export const ProjectPaymentContext = createContext<ProjectPaymentState | null>(
  null
)

export default function ProjectPaymentContextProvider(props: {
  children: JSX.Element
}) {
  const { id } = useParams()
  const { user } = useContext(AuthContext)!

  useEffect(() => {
    setIsLaoding(true)
    api<ProjectPaymentRes>(
      getProjectPayments(id!),
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setError(undefined)
        setPayments(data!.payments)
        setCurrencies(data!.currencies)
        setProjectCurrency(data!.project_currency_code)
        setClientCurrency(data!.client_currency_code)
        setPaid(data!.paid)
        setPrice(data!.price)
        setIsLaoding(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLaoding(false)
      })
  }, [])

  const [price, setPrice] = useState(0)
  const [paid, setPaid] = useState(0)
  const [payments, setPayments] = useState<ProjectPaymentInterface[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLaoding] = useState(false)
  const [currencies, setCurrencies] = useState<CurrencyInterface[]>([])
  const [projectCurrency, setProjectCurrency] = useState<string | undefined>(
    undefined
  )
  const [clientCurrency, setClientCurrency] = useState<string | undefined>(
    undefined
  )

  const newProjectPayment = async (
    amount: number,
    date: number,
    currency: string
  ) => {
    try {
      setIsLaoding(true)
      const body: NewProjectPaymentReq = {
        collection_date: date,
        payment_amount: amount,
        currency_code: currency,
      }
      const data = await api<ProjectPaymentRes>(
        newProjectPaymentsUrl(id!),
        HttpMethods.Post,
        body,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      setError(undefined)
      setPayments(data!.payments)
      setCurrencies(data!.currencies)
      setProjectCurrency(data!.project_currency_code)
      setClientCurrency(data!.client_currency_code)
      setPaid(data!.paid)
      setPrice(data!.price)
      setIsLaoding(false)
    } catch (e: any) {
      setError(e.message)
      setIsLaoding(false)
    }
  }

  const value: ProjectPaymentState = {
    payments,
    error,
    isLoading,
    currencies,
    projectCurrency,
    clientCurrency,
    paid,
    price,
    newProjectPayment,
  }

  return (
    <ProjectPaymentContext.Provider value={value}>
      {props.children}
    </ProjectPaymentContext.Provider>
  )
}
