import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api, HttpMethods } from "../api/ApiControllers"
import {
  getProjectHeaders,
  ProjectHeadersInterface,
  updateProjectHeadersUrl,
} from "../api/EditProjectHeadersApi"
import { AuthContext } from "./AuthContext"

export interface EditProjectHeadersState {
  isLoading: boolean
  error: string | null
  headers: ProjectHeadersInterface | null
  setTitle: (newTitle: string) => void
  setProjectOwner: (newOwner: string) => void
  setTotalAmount: (newAmount: number) => void
  setEstimatedDelivery: (newValue: number) => void
  setLostSales: (newTitle: string) => void
  update: () => Promise<void>
}

export const EditProjectHeadersContext =
  createContext<EditProjectHeadersState | null>(null)

function EditProjectHeadersContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  // context
  const { user } = useContext(AuthContext)!

  // param
  const { id } = useParams()

  // navigate
  const navigate = useNavigate()

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [headers, setHeaders] = useState<ProjectHeadersInterface | null>(null)

  function refreshHeaders() {
    setHeaders(Object.assign({}, headers))
  }

  // calllbacks
  const setTitle = (newTitle: string) => {
    if (headers) {
      headers.title = newTitle
      refreshHeaders()
    }
  }
  const setProjectOwner = (newOwner: string) => {
    if (headers) {
      headers.user_code = newOwner
      refreshHeaders()
    }
  }
  const setTotalAmount = (totalAmount: number) => {
    if (headers) {
      headers.total_price = totalAmount
      refreshHeaders()
    }
  }
  const setEstimatedDelivery = (newValue: number) => {
    if (headers) {
      headers.estimated_delivery_date = newValue
      refreshHeaders()
    }
  }

  const setLostSales = (newValue: string) => {
    if (headers) {
      headers.lost_sales = newValue
      refreshHeaders()
    }
  }
  const update = async () => {
    if (headers) {
      try {
        setIsLoading(true)
        const body = {
          user_code: headers.user_code,
          client_code: headers.client_code,
          total_price: headers.total_price,
          estimated_delivery_date: headers.estimated_delivery_date,
          title: headers.title,
          lost_sales: headers.lost_sales
        }

        await api(
          updateProjectHeadersUrl(id!),
          HttpMethods.Patch,
          body,
          { Authorization: `Bearer ${user?.tokenStr}` },
          "Something went wrong",
          false
        )

        setError(null)
        setIsLoading(false)
        navigate(`/projects/${id}`)
      } catch (e: any) {
        setError(e.message)
        setIsLoading(false)
      }
    }
  }

  const value: EditProjectHeadersState = {
    isLoading,
    error,
    headers,
    setTitle,
    setEstimatedDelivery,
    setProjectOwner,
    setTotalAmount,
    setLostSales,
    update,
  }

  // useEffect
  useEffect(() => {
    setIsLoading(true)
    api<ProjectHeadersInterface>(
      getProjectHeaders(id!),
      HttpMethods.Get,
      null,
      {
        Authorization: `Bearer ${user?.tokenStr}`,
      }
    )
      .then((resData) => {
        console.log("HEADERS", resData)
        setHeaders(resData!)
        setIsLoading(false)
        setError(null)
      })
      .catch((e) => {
        setIsLoading(false)
        setError(e.message)
      })
  }, [])

  return (
    <EditProjectHeadersContext.Provider value={value}>
      {children}
    </EditProjectHeadersContext.Provider>
  )
}

export default EditProjectHeadersContextProvider
