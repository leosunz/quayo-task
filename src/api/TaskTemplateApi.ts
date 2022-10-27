import { domainName } from "../constants/Config"
import { MinifiedUser } from "./UsersApi"

// URL
export const getAllMainTaskTempMinUrl = 
  domainName + "/api/task/template/main/all/min"

export const  testgetalltasks = ()=>
domainName + "/api/task/template/main/all/min"

export const getMainTempUrl = (id: number | string, isFlat: boolean) =>
  domainName + `/api/task/template/main/${id}?flat=${isFlat}`
export const getTimeUnitsUrl = domainName + "/api/task/template/time-units"
export const newMainTaskTemplateUrl = domainName + "/api/task/template/main/new"
export const updateTaskUrl = (id: string | number) =>
  domainName + `/api/task/template/${id}`

export const newBlockByUrl = (id: number, blockedBy: number) =>
  domainName + `/api/task/template/${id}/blocked-by/${blockedBy}`

export const saveTemplateUrl = (id: number | string) =>
  domainName + `/api/task/template/${id}/rewrite`

export const deleteTaskTempalteUrl = (id: number | string) =>
  domainName + `/api/task/template/main/${id}`

export const taskMoredetailsUrl = (projectId: number, taskId: number) =>
  domainName + `/api/project/task/item/getItems/${projectId}/${taskId}`

export const addTaskMoreDetailsUrl = () =>
domainName + `/api/project/task/item/newItem`

export const editProjectTaskItemUrl = () =>
domainName + `/api/project/task/item/updateItem`

export const deleteProjectTaskItemUrl = (id: number) =>
domainName + `/api/project/task/item/deleteItem/${id}`

export interface MainTaskTemplate {
  id: number
  task_code: string
  task_name: string
  sort_order: number
  description?: string
  blocked_by: BlockedBy[]
  parent?: number
  children: MainTaskTemplate[]
  estimated_time: number
  time_unit_id: number
  default_assigned_to?: string
}

export interface MainTaskTemplateWithoutChildren {
  id: number
  task_code: string
  task_name: string
  sort_order: number
  estimated_time: number
  time_unit_id: number
  description?: string
  parent?: number
  blocked_by: BlockedBy[]
}

export interface MainTaskTemplateWithTimeUnits {
  task: MainTaskTemplate
  tasks?: MainTaskTemplateWithoutChildren[]
  time_units: TimeUnit[]
  users: MinifiedUser[]
}

export interface MainTaskTemplateMinified {
  id: number
  task_code: string
  task_name: string
  children_count: number
}

export interface BlockedBy {
  id: number
  task_name: string
}

// time units
export interface TimeUnit {
  id: number
  description: string
  abbreviation: string
  milliseconds: number
}

export interface NewMainTaskRequest {
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  sort_order: number
  description?: string
}

export interface NewTaskRequest {
  task_name: string
  task_code?: string
  estimated_time: string
  time_unit_id: number
  sort_order: number
  parent?: number
  description?: string
}

export interface UpdateTaskRequest {
  task_name?: string
  task_code?: string
  estimated_time?: number
  time_unit_id?: number
  sort_order?: number
  description?: string
}
