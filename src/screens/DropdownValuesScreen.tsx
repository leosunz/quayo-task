import { grey } from "@mui/material/colors"
import { useContext } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import { ScreenContainer } from "../components/StyledComponents"
import { DropdownContext } from "../contexts/DropdownContext"
import { styled } from "@mui/material/styles"
import DropdownFormTemplate from "../components/DropdownFormTemplate"
import { CriteriaValueType } from "../api/DropdownApi"

const GridContainer = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    height: "100%",
    gap: theme.spacing(1),
    overflowY: "hidden",
  }
})

export default function DropdownValuesScreen() {
  const {
    isLoading,
    error,
    paymentModes,
    paymentTerms,
    positions,
    positionsId,
    paymentTermsId,
    paymentModesId,
  } = useContext(DropdownContext)!

  return (
    <ScreenContainer isDataLoaded={!isLoading && !error}>
      {isLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && paymentModes && paymentTerms && positions && (
        <GridContainer>
          <DropdownFormTemplate
            title="Payment Modes"
            type={CriteriaValueType.Client}
            values={paymentModes}
            criteriaId={paymentModesId!}
          />
          <DropdownFormTemplate
            title="Payment Terms"
            type={CriteriaValueType.Client}
            values={paymentTerms}
            criteriaId={paymentTermsId!}
          />
          <DropdownFormTemplate
            title="Positions"
            type={CriteriaValueType.User}
            values={positions}
            criteriaId={positionsId!}
          />
        </GridContainer>
      )}
    </ScreenContainer>
  )
}
