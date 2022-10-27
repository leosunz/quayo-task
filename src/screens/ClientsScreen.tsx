import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router"
import { getAllClientsUrl, MinifiedClient } from "../api/ClientsApi"
import { CustomPaginationTableRow } from "../components/reusable/CustomPaginationTable"
import DisplayTemplate from "../components/templates/DisplayTemplate"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import green from "@mui/material/colors/green"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import red from "@mui/material/colors/red"

const MainContainer = styled("div")(() => {
  return {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  }
})

export default function ClientsScreen() {
  const navigate = useNavigate()

  const getTableState = (data: MinifiedClient[]) => {
    const headers: string[] = [
      "Code",
      "Description",
      "Currency",
      "Supervisor",
      "Status",
    ]
    const rows: CustomPaginationTableRow[] = data.map((client) => {
      return {
        id: client.client_code,
        cells: [
          client.client_code,
          client.description,
          client.currency,
          client.supervisor_code,
          client.is_active ? (
            <CheckCircleRoundedIcon style={{ color: green[700] }} />
          ) : (
            <CancelRoundedIcon style={{ color: red[700] }} />
          ),
        ],
      }
    })

    return {
      heads: headers,
      rows,
    }
  }

  return (
    <MainContainer>
      <DisplayTemplate
        searchLabel="Search descriptions.."
        loadingLabel="Loading Clients.."
        url={getAllClientsUrl}
        newButtonText="New Client"
        newEntityUrl="/clients/new"
        tableState={(data) => getTableState(data as MinifiedClient[])}
        rowClicked={(id) => {
          navigate(`/clients/${id}`)
        }}
        pageTitle="Clients"
      />
    </MainContainer>
  )
}
