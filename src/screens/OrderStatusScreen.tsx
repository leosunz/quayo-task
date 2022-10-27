import { useContext, useEffect, useState } from "react"
import { api, HttpMethods } from "../api/ApiControllers"
import { getOrderStatusUrl, IOrderStatus } from "../api/OrdersApi"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import OrderStatusComponent from "../components/OrderStatusComponent"
import { ScreenContainer } from "../components/StyledComponents"
import { AuthContext } from "../contexts/AuthContext"

export default function OrderStatusScreen() {
  // Context
  const { user } = useContext(AuthContext)!

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<IOrderStatus[] | null>(null)

  // Use Effect
  useEffect(() => {
    setIsLoading(true)
    api<IOrderStatus[]>(
      getOrderStatusUrl,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong.",
      true
    )
      .then((data) => {
        setOrderStatus(data!)
        setError(null)
        setIsLoading(false)
      })
      .catch((e: any) => {
        setIsLoading(false)
        setError(e.message)
      })
  }, [])

  return (
    <ScreenContainer isDataLoaded={!isLoading && !error}>
      {isLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && !error && orderStatus && (
        <div>
          <OrderStatusComponent isHeader />
          {orderStatus.map((order) => {
            return (
              <OrderStatusComponent
                isHeader={false}
                key={order.order_number}
                orderStatus={order}
              />
            )
          })}
        </div>
      )}
    </ScreenContainer>
  )
}
