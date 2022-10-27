import { domainName } from "../constants/Config"
import { TaskStatusInterface } from "./ProjectApi"
import { TimeUnit } from "./TaskTemplateApi"

export const getAssignedTasksUrl = domainName + "/api/project/task/assigned"
export const getStartTaskUrl = (id: number | string) =>
  domainName + `/api/project/task/${id}/start`
export const getEndTaskUrl = (id: number | string) =>
  domainName + `/api/project/task/${id}/end`
export const updateCommentUrl = (id: number | string) =>
  domainName + `/api/project/task/${id}/comment`
export const updateProgressUrl = (id: number | string) =>
  domainName + `/api/project/task/${id}/progress`

  export const checkIfFinishedProjectUrl = (id: number | string) =>
  domainName + `/api/project/${id}/checkIfFinished`

export const rescheduleUrl = (id: number | string) =>
  domainName + `/api/project/task/${id}/reschedule`
 export const getDownloadAssignedURL = (ids: number[]) => {
  let domain = domainName + "/api/project/task/assigned/xlsx?"
  ids.forEach((i) => {
    domain = domain + `id=${i}&`
  })

  return domain
}

export interface AssignedTaskResponseInterface {
  tasks: AssignedTaskinterface[]
  time_units: TimeUnit[]
  task_status: TaskStatusInterface[]
}

export interface AssignedTaskinterface {
  id: number
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  parent?: number
  planned_start_date?: number
  planned_end_date?: number
  actual_start_date?: number
  actual_end_date?: number
  task_status_id: number
  sort_order: number
  task_progress: number
  description?: string
  comment?: string
  can_start: boolean
  can_reschedule: boolean
  can_update_progress: boolean
  client_description?: string
  project_title: string
  project_id: number
}
