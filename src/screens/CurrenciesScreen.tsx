import { grey } from "@mui/material/colors"
import { useContext } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import NewCurrencyForm from "../components/NewCurrencyForm"
import NewProjectPaymentForm from "../components/NewProjectPaymentForm"
import CustomPaginationTable, {
  CustomPaginationTableRow,
  CustomPaginationTableState,
} from "../components/reusable/CustomPaginationTable"
import { ScreenContainer } from "../components/StyledComponents"
import { CurrrenciesContext } from "../contexts/CurrenciesContext"
import { getDayFromDate } from "../utils/formatters"

export default function CurrenciesScreen() {
  const {
    currencies,
    isLoading,
    error,
    setSelectedCurrencyCb,
    selectedCurrency,
  } = useContext(CurrrenciesContext)!

  function getTableState(): CustomPaginationTableState {
    const headers: string[] = [
      "Currency Code",
      "Description",
      "Symbol",
      "Ratio",
      "Main",
    ]
    const rows: CustomPaginationTableRow[] = currencies.map((curr) => {
      return {
        id: curr.currency_code,
        cells: [
          curr.currency_code,
          curr.description,
          curr.symbol,
          curr.ratio,
          curr.is_main ? "Main" : "",
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
      {!isLoading && !error && currencies.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
            height: "100%",
            gap: "1rem",
          }}
        >
          <CustomPaginationTable
            table={getTableState()}
            selectedRowId={selectedCurrency?.currency_code ?? undefined}
            onRowClick={(id) => {
              const newSelection = currencies.find(
                (i) => i.currency_code === id
              )
              if (newSelection && !newSelection.is_main) {
                setSelectedCurrencyCb(newSelection)
              }
            }}
            cursor="pointer"
          />
          <NewCurrencyForm />
        </div>
      )}
    </ScreenContainer>
  )
}
