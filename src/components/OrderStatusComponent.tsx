import { IOrderStatus } from "../api/OrdersApi"
import { styled } from "@mui/material/styles"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
  useTheme,
} from "@mui/material"
import { getDayFromDate } from "../utils/formatters"
import { useState } from "react"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

const MainContainer = styled(Paper)<{ header?: boolean }>(
  ({ theme, header }) => {
    const styles: any = {
      display: "flex",
      flexDirection: "row",
      margin: theme.spacing(1),
      padding: header ? theme.spacing(3) : theme.spacing(2),
    }

    if (theme.palette.mode === "light") {
      styles.backgroundColor = header
        ? theme.palette.grey[400]
        : theme.palette.grey[300]
    }

    return styles
  }
)

const StyledTypography = styled(Typography)<{
  flexcount?: string
  insertpadding?: boolean
  header?: boolean
}>(({ theme, flexcount, insertpadding, header }) => {
  const styles: any = {
    flex: flexcount ?? "1",
  }

  if (insertpadding) {
    styles.padding = theme.spacing(1)
  }

  if (header) {
    styles.fontWeight = "bold"
  }

  return styles
})

const StyledCurrentTask = styled("div")<{ index: number }>(
  ({ theme, index }) => {
    return {
      display: "flex",
      flexDirection: "row",
      backgroundColor:
        index === -1
          ? theme.palette.mode === "light"
            ? theme.palette.grey[300]
            : theme.palette.grey[800]
          : index % 2 === 0
          ? undefined
          : theme.palette.action.hover,
    }
  }
)

export interface OrderStatusComponentProps {
  orderStatus?: IOrderStatus
  isHeader: boolean
}

export default function OrderStatusComponent(props: OrderStatusComponentProps) {
  const theme = useTheme()
  // Accordion
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <MainContainer header={props.isHeader}>
      {props.isHeader && !props.orderStatus && (
        <>
          <StyledTypography header>Customer Account</StyledTypography>
          <StyledTypography header>Customer Name</StyledTypography>
          <StyledTypography header>Order Number</StyledTypography>
          <StyledTypography header>Expected Ship Date</StyledTypography>
          <StyledTypography header>Expected Payment</StyledTypography>
          <StyledTypography header flexcount="3">
            Current Tasks
          </StyledTypography>
        </>
      )}
      {props.orderStatus && (
        <>
          <StyledTypography>
            {props.orderStatus.customer_account}
          </StyledTypography>
          <StyledTypography>{props.orderStatus.customer_name}</StyledTypography>
          <StyledTypography>{props.orderStatus.order_number}</StyledTypography>
          <StyledTypography
            style={{
              color:
                new Date().getTime() > props.orderStatus.expected_ship_date
                  ? theme.palette.error.main
                  : theme.palette.text.primary,
            }}
          >
            {getDayFromDate(new Date(props.orderStatus.expected_ship_date))}
          </StyledTypography>
          <StyledTypography>
            {props.orderStatus.expected_payment ?? "N/A"}
          </StyledTypography>

          <StyledTypography flexcount="3">
            {props.orderStatus.current_tasks.length === 0 && (
              <Typography style={{ paddingLeft: theme.spacing(2) }}>
                No Tasks In Progress
              </Typography>
            )}
            {props.orderStatus.current_tasks.length > 0 && (
              <Accordion
                expanded={isExpanded}
                onChange={() => setIsExpanded(!isExpanded)}
                elevation={0}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    <span
                      style={{
                        color: theme.palette.success.light,
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      {props.orderStatus.current_tasks.length}
                    </span>
                    {props.orderStatus.current_tasks.length === 1
                      ? " Task "
                      : " Tasks "}
                    In Progress
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <>
                    <StyledCurrentTask index={-1}>
                      <StyledTypography insertpadding>
                        Task Name
                      </StyledTypography>
                      <StyledTypography insertpadding>
                        Task Owner
                      </StyledTypography>
                      <StyledTypography insertpadding>
                        Due Date
                      </StyledTypography>
                    </StyledCurrentTask>
                    {props.orderStatus.current_tasks.map((t, index) => {
                      return (
                        <StyledCurrentTask index={index} key={index}>
                          <StyledTypography insertpadding>
                            {t.task_name}
                          </StyledTypography>
                          <StyledTypography insertpadding>
                            {t.task_owner ?? "N/A"}
                          </StyledTypography>
                          <StyledTypography
                            insertpadding
                            style={{
                              color:
                                new Date().getTime() > t.due_date
                                  ? theme.palette.error.main
                                  : theme.palette.text.primary,
                            }}
                          >
                            {getDayFromDate(new Date(t.due_date))}
                          </StyledTypography>
                        </StyledCurrentTask>
                      )
                    })}
                  </>
                </AccordionDetails>
              </Accordion>
            )}
          </StyledTypography>
        </>
      )}
    </MainContainer>
  )
}
