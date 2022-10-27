import { domainName } from "../constants/Config"
import { MinifiedClient } from "./ClientsApi"
import { Currency } from "./ProjectApi"
import { MinifiedUser } from "./UsersApi"

export const getProjectHeaders = (id: string) =>
  domainName + `/api/project/${id}/headers`

export const updateProjectHeadersUrl = (id: string) =>
  domainName + `/api/project/${id}`

export interface ProjectHeadersInterface {
  user_code: string
  client_code: string
  total_price: number
  project_currency: string
  estimated_delivery_date: number
  title: string
  lost_sales: string;
  users: MinifiedUser[]
  currencies: Currency[]
  clients: MinifiedClient[]
}
