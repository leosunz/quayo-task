import { createContext, useState } from "react"
import { api, HttpMethods } from "../api/ApiControllers"
import { LoginResponse, loginUrl } from "../api/AuthApi"
import { IAuthState, IAuthUser, Token } from "../models/AuthState"
import jwtDecode from "jwt-decode"
import { domainName } from "../constants/Config"

export const AuthContext = createContext<IAuthState | null>(null)

function AuthContextProvider({ children }: { children: JSX.Element }) {
  const [authUser, setAuthUser] = useState<IAuthUser | null>(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decoded: Token | undefined = jwtDecode(token)
      const now = Date.now() / 1000

      if (decoded && decoded.exp > now) {
        return { token: decoded, username: decoded.sub, tokenStr: token }
      }
    }

    return null
  })

  function refreshState() {
    let state: IAuthUser | null = null
    const token = localStorage.getItem("token")
    if (token) {
      const decoded: Token | undefined = jwtDecode(token)
      const now = Date.now() / 1000

      if (decoded && decoded.exp > now) {
        return { token: decoded, username: decoded.sub, tokenStr: token }
      }
    }

    setAuthUser(state)
  }

  async function login(
    username: string,
    password: string,
    forceLogout: boolean
  ) {
    const token = await api<LoginResponse>(
      loginUrl,
      HttpMethods.Post,
      {
        username,
        password,
        force_logout: forceLogout,
      },
      {},
      "Incorrect username/password."
    )
    if (token) {
      localStorage.setItem("token", token.access_token )      
    }
    refreshState()
  }

  async function logout() {
    try {
      await api(
        domainName + "/api/user/logout",
        HttpMethods.Get,
        null,
        { Authorization: `Bearer ${authUser?.tokenStr}` },
        "Something went wrong.",
        false
      )
      localStorage.removeItem("token")
      refreshState()
    } catch (e) {
      localStorage.removeItem("token")
      refreshState()
    }
  }

  function isAuthenticated(): boolean {
    return authUser !== null
  }

  return (
    <AuthContext.Provider
      value={{ login, isAuthenticated, user: authUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
