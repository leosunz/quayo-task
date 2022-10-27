import { useContext } from "react"
import { Navigate, useLocation } from "react-router"
import { AuthContext } from "../contexts/AuthContext"

export function EnsureAuthenticated({ children }: { children: JSX.Element }) {
  const authContext = useContext(AuthContext)
  const location = useLocation()

  if (!authContext?.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  return children
}

export function EnsureUnAuthenticated({ children }: { children: JSX.Element }) {
  const authContext = useContext(AuthContext)
  const location = useLocation()

  if (authContext?.isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} />
  }

  return children
}
