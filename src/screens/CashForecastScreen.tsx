import { Typography, Divider, List, ListItem, useTheme } from "@mui/material"
import { error } from "console"
import React, { useContext, useEffect, useState } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import { ScreenContainer } from "../components/StyledComponents"
import { formatCurrency, getDayFromDate } from "../utils/formatters"
import { styled } from "@mui/material/styles"
import { AuthContext } from "../contexts/AuthContext"
import { getPipelineOrdersUrl, IPipelineOrder } from "../api/PipelineOrdersApi"
import {
  ReportsStyledPaper,
  ReportsStyledTypography,
} from "./TasksByEmployeeScreen"
import { api, HttpMethods } from "../api/ApiControllers"
import { domainName } from "../constants/Config"
import { Currency } from "../api/ProjectApi"

export interface ICashForecast {
  project_id: number
  title: string
  total_price: number
  paid_amount: number
  customer_name: string
  customer_account: string
  currency: Currency
}

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
  }
})

export default function CashForecastScreen() {
  const { user } = useContext(AuthContext)!
  const theme = useTheme()

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forecast, setForecast] = useState<ICashForecast[] | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api<ICashForecast[]>(
      domainName + "/api/report/cash-forecast",
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setForecast(data!)
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
      {!isLoading && !error && forecast && (
        <MainContainer>
          <ReportsStyledPaper margin={0.5} header>
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
              Total Price
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              Amount Paid
            </ReportsStyledTypography>
            <ReportsStyledTypography header>Remaining</ReportsStyledTypography>
          </ReportsStyledPaper>
          {forecast.map((item, index) => (
            <ReportsStyledPaper margin={0.5} key={index}>
              <ReportsStyledTypography>
                {item.project_id}
              </ReportsStyledTypography>
              <ReportsStyledTypography>{item.title}</ReportsStyledTypography>
              <ReportsStyledTypography>
                {item.customer_account}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {item.customer_name}
              </ReportsStyledTypography>
              <ReportsStyledTypography
                header
                color={theme.palette.warning.dark}
              >
                {formatCurrency(item.total_price, item.currency.currency_code)}
              </ReportsStyledTypography>
              <ReportsStyledTypography
                header
                color={theme.palette.success.dark}
              >
                {formatCurrency(item.paid_amount, item.currency.currency_code)}
              </ReportsStyledTypography>
              <ReportsStyledTypography header color={theme.palette.error.dark}>
                {formatCurrency(
                  item.total_price - item.paid_amount,
                  item.currency.currency_code
                )}
              </ReportsStyledTypography>
            </ReportsStyledPaper>
          ))}
        </MainContainer>
      )}
    </ScreenContainer>
  )
}
