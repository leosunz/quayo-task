import { styled } from "@mui/material"
import { blue, green, grey, orange, red, teal } from "@mui/material/colors"
import { useContext } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import NewProjectPaymentForm from "../components/NewProjectPaymentForm"
import CustomPaginationTable, {
  CustomPaginationTableState,
  CustomPaginationTableRow,
} from "../components/reusable/CustomPaginationTable"
import TextPillComponent from "../components/reusable/PillComponent"
import {
  ScreenContainer,
  StyledVerticalDivider,
} from "../components/StyledComponents"
import { ProjectPaymentContext } from "../contexts/ProjectPaymentContext"
import { formatCurrency, getDayFromDate } from "../utils/formatters"

const HeaderContainer = styled("div")(({ theme }) => {
  return {
    width: "100%",
    // backgroundColor: grey[200],
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
})

const BodyGrid = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    height: "100%",
  }
})

export default function ProjectPaymentScreen() {
  const {
    payments,
    isLoading,
    error,
    paid,
    price,
    projectCurrency,
    clientCurrency,
  } = useContext(ProjectPaymentContext)!

  function getTableState(): CustomPaginationTableState {
    const headers: string[] = [
      "Amount",
      "Currency",
      "Collection Date",
      "Down Payment",
    ]
    const rows: CustomPaginationTableRow[] = payments.map((payment) => {
      return {
        id: payment.id,
        cells: [
          payment.payment_amount,
          payment.currency,
          getDayFromDate(new Date(payment.collection_date)),
          payment.is_down_payment ? "down" : "",
        ],
      }
    })

    return {
      heads: headers,
      rows,
    }
  }

  return (
    <ScreenContainer isDataLoaded={!isLoading && !error}>
      {isLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && !error && projectCurrency && (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <HeaderContainer>
            <TextPillComponent
              title="Price"
              value={formatCurrency(price, projectCurrency!)}
              lightColor={green[100]}
              darkColor={green[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Paid"
              value={formatCurrency(paid, projectCurrency!)}
              lightColor={blue[100]}
              darkColor={blue[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Amount Due"
              value={formatCurrency(price - paid, projectCurrency!)}
              lightColor={red[100]}
              darkColor={red[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Project Currency"
              value={projectCurrency!}
              lightColor={teal[100]}
              darkColor={teal[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Client Currency"
              value={clientCurrency!}
              lightColor={orange[100]}
              darkColor={orange[800]}
            />
          </HeaderContainer>
          <BodyGrid>
            <CustomPaginationTable
              table={getTableState()}
              onRowClick={() => {}}
              cursor="default"
            />
            <NewProjectPaymentForm />
          </BodyGrid>
        </div>
      )}
    </ScreenContainer>
  )
}
