import { domainName } from "../constants/Config"

export interface IPipelineOrder {
  order_number: number
  customer_account: string
  customer_name: string
  planned_date: number
  expected_date: number
  project_title: string
}

export const getPipelineOrdersUrl = domainName + "/api/report/pipeline-orders"
