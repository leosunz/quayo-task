import { domainName } from "../constants/Config"

export const getOrderStatusUrl = domainName + "/api/report/order-status"

export interface IOrderStatus {
  customer_account: string
  customer_name: string
  order_number: number
  order_title: string
  expected_ship_date: number
  expected_payment: string
  current_tasks: ICurrentTask[]
}

export interface ICurrentTask {
  task_name: string
  task_owner?: string
  due_date: number
}
