import { domainName } from "../constants/Config"

export interface RequestsScreenInit {
  start_requests: RescheduleRequest[]
  end_requests: RescheduleRequest[]
}

export interface RescheduleRequest {
  id: number
  task_name: string
  task_id: number
  is_confirmed: boolean
  requested_date: number
  user_code: string
  project_id: number
  date_added: number
  last_edited: number
  type?: "start" | "end"
}

export const getAllRequestsUrl = (id: number | string) =>
  domainName + `/api/project/${id}/requests`
