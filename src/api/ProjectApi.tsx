import { domainName } from "../constants/Config"
import { MinifiedClient } from "./ClientsApi"
import {
  BlockedBy,
  MainTaskTemplateMinified,
  TimeUnit,
} from "./TaskTemplateApi"
import { MinifiedUser } from "./UsersApi"

export const getAllMinifiedProjectsUrl = domainName + "/api/project/all"
export const getProjectsUrl = (id: string | number) =>
  domainName + `/api/project/${id}`

export const initProjectUrl = domainName + "/api/project/init"
export const newProjectWithoutTempUrl = domainName + "/api/project/new"
export const newProjectFromTempUrl =
  domainName + "/api/project/new/from-template"

export const editProjectTasksUrl = (id: number | string, query?: InitQuery) => {
  let url = domainName + `/api/project/${id}/task/edit/init`

  if (query && query.req && (query.start || query.end)) {
    url += `?req=${query.req}`

    if (query.start) {
      url += `&start=${query.start}`
    }

    if (query.end) {
      url += `&end=${query.end}`
    }
  }

  return url
}

export const editTemplateTasksUrl = (id: number | string) =>
  domainName + `/api/project/${id}/getTasks`


export const saveProjectAsDraftUrl = (id: number | string) =>
  domainName + `/api/project/${id}/save-draft`

export const saveProjectAsStartUrl = (id: number | string) =>
  domainName + `/api/project/${id}/start`

export const getProjecTableView = (id: number | string) =>
  domainName + `/api/project/${id}/table-view`


export const getProjectStatus = (id: number | string)=>
domainName+`/api/project/${id}/status`

export interface MinifiedProject {
  id: number
  client_code: string
  total_price: number
  amount_paid: number
  is_draft: number
  due_date: string
  user_code: string
  title: string
  lost_sales: string
  estimated_delivery: string
  status: string
}

export interface CurrencyInterface {
  currency_code: string
  currency_description: string
  currency_symbol: string
}

export interface TaskStatusInterface {
  id: number
  description: string
  is_start: boolean
  is_final: boolean
}

export interface ProjectInterface<T = ProjectTaskInterface> {
  client: MinifiedClient
  user: MinifiedUser
  currency_code: string
  total_price: number
  paid_amount: number
  task_tree: T
  estimated_delivery?: number
  is_draft: number
  id: number
  title: string
}

export interface ProjectInterfaceWithoutTree {
  client: MinifiedClient
  user: MinifiedUser
  currency_code: string
  total_price: number
  paid_amount: number
  estimated_delivery?: number
  is_draft: number
  id: number
}

export interface ProjectWithoutTaskInterface {
  client: MinifiedClient
  user: MinifiedUser
  currency_code: string
  total_price: number
  paid_amount: number
  estimated_delivery?: number
  is_draft: number
  id: number
}

export interface ProjectTaskInterface {
  id: number
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  description?: string
  sort_order: number
  task_status_id: number
  task_progress: number
  parent?: number
  children: ProjectTaskInterface[]
  planned_start_date?: number
  planned_end_date?: number
  actual_start_date?: number
  actual_end_date?: number
  comment?: string
  comment_last_updated?: number
  progress_last_updated?: number
  reschedule?: RescheduleInterface
  predecessor?: ProjectTaskPredecessor
}

export interface RequestedRescheduleInterface {
  requested_by: string
  requested_date: number
  id: number
  is_confirmed?: boolean
}

export interface RescheduleInterface {
  end_request?: RequestedRescheduleInterface
  start_request?: RequestedRescheduleInterface
}

export interface ProjectTaskWithoutChildrenInterface {
  id: number
  parent?: number
  task_name: string
  task_code: string
  estimated_time: number
  time_unit_id: number
  due_date: number
  description?: string
  sort_order: number
  task_status_id: number
  task_progress: number
  blocked_by: BlockedBy[]
}

export interface ProjectWithMetaDataInterface {
  project: ProjectInterface
  time_units: TimeUnit[]
  status: TaskStatusInterface[]
}

export interface ProjectInit {
  clients: MinifiedClient[]
  users: MinifiedUser[]
  currencies: Currency[]
  templates: MainTaskTemplateMinified[]
  time_units: TimeUnit[]
}

export interface Currency {
  currency_code: string
  currency_description: string
  currency_symbol: string
}

export interface NewProjectRequest {
  user_code: string
  client_code: string
  total_price: number
  project_currency: string
  estimated_delivery_date: number
  down_payment?: number
  down_payment_currency?: string
  payment_collection_date?: number
  task_code?: string
  task_name?: string
  estimated_time?: number
  time_unit_id?: number
  description?: string
  template_id?: number
  title: string
  lost_sales?: string
}

export interface AutofillTemplate {
  id: number
  task_code: string
  task_name: string
  estimated_time: number
  time_unit_id: number
  time_unit: any
  default_assigned_to?: string
}

export interface EditProjectTasksInitInterface {
  templates: MainTaskTemplateMinified[]
  users: MinifiedUser[]
  project: ProjectInterface
  time_units: TimeUnit[]
  autofill_templates: AutofillTemplate[]
}

export interface ProjectTableView {
  id: number
  assigned_to?: string
  task_code?: string
  task_name: string
  estimated_time: number
  time_unit: string
  parent?: number
  planned_start_date?: number
  planned_end_date?: number
  comment?: string
  progress?: number
  progress_last_updated?: number
  comment_last_updated?: number
  actual_start_date?: number
  actual_end_date?: number
  status: string
}

export interface InitQuery {
  req?: string
  start?: string
  end?: string
}

export interface ProjectTaskPredecessor {
  id: number
  assigned_to?: string // MinifiedUser[]
  assigned_to_user_code?: string
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  parent?: number
  planned_start_date?: number
  planned_end_date?: number
  actual_start_date?: number
  actual_end_date?: number
  task_status_id?: number
  sort_order: number
  task_progress?: number
  description?: string
  fake_id?: string
}

export enum ProjectTaskChangeEvent {
  ChangeStart,
  ChangeEnd,
  ChangeTime,
  None,
}
