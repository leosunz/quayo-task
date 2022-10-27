import { createContext, useContext, useEffect, useState } from "react"
import { api, HttpMethods } from "../api/ApiControllers"
import {
  CriteriaValue,
  CriteriaValueType,
  deleteCriteriavalueUrl,
  DropdownInitResponse,
  initDropdownUrl,
  NewCriteriaValueRequestBody,
  newCriteriavalueUrl,
} from "../api/DropdownApi"
import { AuthContext } from "./AuthContext"

export interface DropdownContextState {
  paymentModes: CriteriaValue[] | null
  paymentTerms: CriteriaValue[] | null
  positions: CriteriaValue[] | null

  // positions
  positionsId: number | null
  paymentModesId: number | null
  paymentTermsId: number | null

  isLoading: boolean
  error: string | null

  // callbacks
  newCriteriaValue(
    value: NewCriteriaValueRequestBody,
    criteriaType: CriteriaValueType
  ): Promise<void>

  deleteCriteriaValue(
    id: number,
    criteriaType: CriteriaValueType
  ): Promise<void>
}

export const DropdownContext = createContext<DropdownContextState | null>(null)

export default function DropdownContextProvider(props: {
  children: JSX.Element
}) {
  const { user } = useContext(AuthContext)!

  const [paymentModes, setPaymentModes] = useState<CriteriaValue[] | null>(null)
  const [paymentTerms, setPaymentTerms] = useState<CriteriaValue[] | null>(null)
  const [positions, setPositions] = useState<CriteriaValue[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [positionsId, setpPositionsId] = useState<number | null>(null)
  const [paymentModesId, setPaymentModesId] = useState<number | null>(null)
  const [paymentTermsId, setPaymentTermsId] = useState<number | null>(null)

  useEffect(() => {
    setIsLoading(true)
    api<DropdownInitResponse>(
      initDropdownUrl,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setPositions(data!.positions)
        setPaymentModes(data!.payment_modes)
        setPaymentTerms(data!.payment_terms)
        setpPositionsId(data!.positions_id)
        setPaymentModesId(data!.payment_modes_id)
        setPaymentTermsId(data!.payment_terms_id)
        setIsLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [])

  const newCriteriaValue = async (
    value: NewCriteriaValueRequestBody,
    criteriaType: CriteriaValueType
  ) => {
    try {
      setIsLoading(true)
      const data = await api<DropdownInitResponse>(
        newCriteriavalueUrl(criteriaType),
        HttpMethods.Post,
        value,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      setPositions(data!.positions)
      setPaymentModes(data!.payment_modes)
      setPaymentTerms(data!.payment_terms)
      setpPositionsId(data!.positions_id)
      setPaymentModesId(data!.payment_modes_id)
      setPaymentTermsId(data!.payment_terms_id)
      setIsLoading(false)
    } catch (e: any) {
      setError(e.message)
      setIsLoading(false)
    }
  }

  const deleteCriteriaValue = async (
    id: number,
    criteriaType: CriteriaValueType
  ) => {
    try {
      setIsLoading(true)
      const data = await api<DropdownInitResponse>(
        deleteCriteriavalueUrl(id, criteriaType),
        HttpMethods.Delete,
        value,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      setPositions(data!.positions)
      setPaymentModes(data!.payment_modes)
      setPaymentTerms(data!.payment_terms)
      setpPositionsId(data!.positions_id)
      setPaymentModesId(data!.payment_modes_id)
      setPaymentTermsId(data!.payment_terms_id)
      setIsLoading(false)
    } catch (e: any) {
      setError(e.message)
      setIsLoading(false)
    }
  }

  const value: DropdownContextState = {
    paymentModes,
    paymentTerms,
    positions,
    isLoading,
    error,
    newCriteriaValue,
    deleteCriteriaValue,
    paymentModesId,
    paymentTermsId,
    positionsId,
  }

  return (
    <DropdownContext.Provider value={value}>
      {props.children}
    </DropdownContext.Provider>
  )
}
