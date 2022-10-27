import { domainName } from "../constants/Config"

export const loginUrl = domainName + "/api/user/login"

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string
}
