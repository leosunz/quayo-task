import { domainName } from "../constants/Config"

export interface ITaskByEmployee {
  task_code?: string
  task_name: string
  start_date?: number
  due_date?: number
  order_number: number
  assigned_to: string
  project_title: string
}

export const getTaskByEmployeeInitUrl =
  domainName + "/api/report/tasks-by-employee/init"

export const getTaskByEmployeeUrl = (id: string) =>
  domainName + `/api/report/tasks-by-employee/${id}`
