import { Typography, Divider, List, ListItem, useTheme } from "@mui/material"
import { error } from "console"
import React, { useContext, useEffect, useState } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import { ScreenContainer } from "../components/StyledComponents"
import { getDayFromDate } from "../utils/formatters"
import { styled } from "@mui/material/styles"
import { AuthContext } from "../contexts/AuthContext"
import { getPipelineOrdersUrl, IPipelineOrder } from "../api/PipelineOrdersApi"
import {
  ReportsStyledPaper,
  ReportsStyledTypography,
} from "./TasksByEmployeeScreen"
import { api, HttpMethods } from "../api/ApiControllers"

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
  }
})

export default function PipelineOrdersScreen() {
  const { user } = useContext(AuthContext)!
  const theme = useTheme()

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<IPipelineOrder[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api<IPipelineOrder[]>(
      getPipelineOrdersUrl,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setOrders(data!)
        setIsLoading(false)
      })
      .catch((e: any) => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [])

  return (
    <ScreenContainer
      style={{ overflowY: "hidden" }}
      isDataLoaded={!isLoading && !error}
    >
      {isLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && !error && orders && (
        <MainContainer>
          <ReportsStyledPaper header>
            <ReportsStyledTypography header>
              Order Number
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              Project Title
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              Customer Account
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              Customer Name
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              Planned Date
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              Expected Date
            </ReportsStyledTypography>
          </ReportsStyledPaper>
          {orders.map((task, index) => (
            <ReportsStyledPaper
              warning={task.planned_date < task.expected_date}
              key={index}
            >
              <ReportsStyledTypography>
                {task.order_number}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.project_title}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.customer_account}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.customer_name}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.planned_date
                  ? getDayFromDate(new Date(task.planned_date))
                  : "N/A"}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.expected_date
                  ? getDayFromDate(new Date(task.expected_date))
                  : "N/A"}
              </ReportsStyledTypography>
            </ReportsStyledPaper>
          ))}
        </MainContainer>
      )}
    </ScreenContainer>
  )
}
