import { styled } from "@mui/material/styles"
import { blue, green, grey, orange, red } from "@mui/material/colors"
import { useContext } from "react"
import { HttpMethods } from "../api/ApiControllers"
import {
  getAllRequestsUrl,
  RequestsScreenInit,
  RescheduleRequest,
} from "../api/RequestsScreenApi"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import CustomPaginationTable, {
  CustomPaginationTableRow,
  CustomPaginationTableState,
} from "../components/reusable/CustomPaginationTable"
import { ScreenContainer } from "../components/StyledComponents"
import { AuthContext } from "../contexts/AuthContext"
import useFetch from "../hooks/useFetch"
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import { getDayFromDate } from "../utils/formatters"
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded"
import { IconButton } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"

const GridContainer = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gridTemplateRows: "1fr 1fr",
    height: "100%",
    gap: theme.spacing(1),
  }
})

export default function RescheduleRequestsScreen() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()
  const { data, isLoading, error } = useFetch<RequestsScreenInit>(
    getAllRequestsUrl(id!),
    HttpMethods.Get,
    null,
    { Authorization: `Bearer ${user?.tokenStr}` }
  )

  type NewType = CustomPaginationTableState

  function getTableState(state: RescheduleRequest[]): NewType {
    const headers: string[] = [
      "Task Name",
      "Requested By",
      "Requested Date",
      "Requested On",
      "Date Added",
      "Last Edited",
      "Status",
      "Actions",
    ]
    const rows: CustomPaginationTableRow[] = state!.map((value) => {
      return {
        id: value.id,
        cells: [
          value.task_name,
          value.user_code,
          getDayFromDate(new Date(value.requested_date)),
          value.type === "start" ? "Start Date" : "End Date",
          getDayFromDate(new Date(value.date_added)),
          getDayFromDate(new Date(value.last_edited)),
          value.is_confirmed === undefined ? (
            <WatchLaterRoundedIcon style={{ color: orange[700] }} />
          ) : value.is_confirmed === true ? (
            <CheckCircleRoundedIcon style={{ color: green[700] }} />
          ) : (
            <CancelRoundedIcon style={{ color: red[700] }} />
          ),
          <IconButton
            disabled={value.is_confirmed || value.is_confirmed === false}
            onClick={() =>
              navigate(
                `/projects/${value.project_id}/tasks/edit?req=${value.task_id}&${value.type}=${value.id}`
              )
            }
          >
            <InsertLinkRoundedIcon
              style={{
                color:
                  value.is_confirmed || value.is_confirmed === false
                    ? grey[500]
                    : blue[700],
              }}
            />
          </IconButton>,
        ],
      }
    })

    return {
      heads: headers,
      rows,
    }
  }

  function getAllRequests(): RescheduleRequest[] {
    const req: RescheduleRequest[] = []

    if (data?.start_requests) {
      const alt = data.start_requests
        .map((t) => {
          t.type = "start"
          return t
        })
        .sort((a, b) => b.date_added - a.date_added)

      req.push(...alt)
    }

    if (data?.end_requests) {
      const alt = data.end_requests
        .map((t) => {
          t.type = "end"
          return t
        })
        .sort((a, b) => b.date_added - a.date_added)

      req.push(...alt)
    }

    return req
  }

  return (
    <ScreenContainer isDataLoaded={!isLoading && !error}>
      {isLoading && <Loading text="Loading Requests.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && data && (
        // <GridContainer>
        <CustomPaginationTable
          table={getTableState(getAllRequests())}
          onRowClick={() => {}}
          cursor="default"
        />
      )}
    </ScreenContainer>
  )
}
