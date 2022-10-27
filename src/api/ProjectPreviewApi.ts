import { domainName } from "../constants/Config"
import { TaskStatusInterface } from "./ProjectApi"
import { TimeUnit } from "./TaskTemplateApi"

export const getProjectPreviewInitUrl = (id: number | string) =>
  domainName + `/api/project/${id}/preview`

export interface ProjectPreviewInit {
  time_units: TimeUnit[]
  task_status: TaskStatusInterface[]
  tasks: AssignedTaskPreviewInterface
  client_description?: string
  project_title: string
}

// callbacks
export const getStartTaskUrl = (
  projectId: number | string,
  id: number | string
) => domainName + `/api/project/${projectId}/preview/${id}/start`
export const getEndTaskUrl = (
  projectId: number | string,
  id: number | string
) => domainName + `/api/project/${projectId}/preview/${id}/end`
export const updateCommentUrl = (
  projectId: number | string,
  id: number | string
) => domainName + `/api/project/${projectId}/preview/${id}/comment`
export const updateProgressUrl = (
  projectId: number | string,
  id: number | string
) => domainName + `/api/project/${projectId}/preview/${id}/progress`

export const rescheduleUrl = (
  projectId: number | string,
  id: number | string
) => domainName + `/api/project/${projectId}/preview/${id}/reschedule`

export interface AssignedTaskPreviewInterface {
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

  // actions
  can_start: boolean
  can_reschedule: boolean
  can_update_progress: boolean
  is_owner: boolean

  // new
  assigned_to: string

  predecessor_id?: number

  children: AssignedTaskPreviewInterface[]
}

export interface AssignedTaskPreviewPredInterface {
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

  // actions
  can_start: boolean
  can_reschedule: boolean
  can_update_progress: boolean
  is_owner: boolean

  // new
  assigned_to: string
}
