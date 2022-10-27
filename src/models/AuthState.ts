export interface IAuthUser {
  username: string
  token: Token
  tokenStr: string
}

export interface IAuthState {
  user: IAuthUser | null
  isAuthenticated(): boolean
  login(username: string, password: string, forceLogout: boolean): Promise<void>
  logout(): void
}

export interface Token {
  exp: number
  iss: string
  roles: string[]
  sub: string
}
