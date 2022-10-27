import { useEffect, useState } from "react"
import { api, HttpMethods } from "../api/ApiControllers"

function useFetch<T>(
  url: string,
  method: HttpMethods,
  body?: any,
  headers?: any
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<T>(url, method, body, headers)
      .then((resData) => {
        setData(resData!)
        setIsLoading(false)
        setError(null)
      })
      .catch((e) => {
        setIsLoading(false)
        setError(e.message)
      })
  }, [])

  return { data, isLoading, error }
}

export default useFetch
