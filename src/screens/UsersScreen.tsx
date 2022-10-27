import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router"
import { getAllUsersUrl, MinifiedUser } from "../api/UsersApi"
import { CustomPaginationTableRow } from "../components/reusable/CustomPaginationTable"
import DisplayTemplate from "../components/templates/DisplayTemplate"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import green from "@mui/material/colors/green"
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"
import red from "@mui/material/colors/red"
import { Button, useTheme } from "@mui/material"
import { useContext, useState } from "react"
import { api, HttpMethods } from "../api/ApiControllers"
import { domainName } from "../constants/Config"
import { AuthContext } from "../contexts/AuthContext"
import AlertDialog from "../components/dialogs/AlertDialog"

const MainContainer = styled("div")(({ theme }) => {
  return {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  }
})

export default function UsersScreen() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useContext(AuthContext)!

  const [buttonEnable, setButtonEnable] = useState(true)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const getTableState = (data: MinifiedUser[]) => {
    const headers: string[] = [
      "Code",
      "Description",
      "Email",
      "Roles",
      "Status",
    ]
    const rows: CustomPaginationTableRow[] = data.map((user) => {
      return {
        id: user.user_code,
        cells: [
          user.user_code,
          user.description ?? "N/A",
          user.email ?? "N/A",
          user.roles.map((e) => e.role_name).join(","),
          user.is_active ? (
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
        loadingLabel="Loading Users.."
        url={getAllUsersUrl}
        newButtonText="New User"
        newEntityUrl="/users/new"
        tableState={(data) => getTableState(data as MinifiedUser[])}
        rowClicked={(id) => {
          navigate(`/users/${id}`)
        }}
        pageTitle="Users"
      />
      <Button
        disabled={!buttonEnable}
        style={{ alignSelf: "flex-start", margin: theme.spacing(1) }}
        onClick={async () => {
          try {
            setButtonEnable(false)
            await api(
              domainName + "/api/validation/refresh",
              HttpMethods.Get,
              null,
              { Authorization: `Bearer ${user?.tokenStr}` },
              "Something went wrong",
              false
            )
          } catch (e: any) {
            setError(e.message)
            setDialogOpen(true)
          }
          setButtonEnable(true)
        }}
      >
        Validate License
      </Button>
      <AlertDialog
        isOpen={dialogOpen}
        content={error}
        title="Validation Error"
        onClose={() => setDialogOpen(false)}
      />
    </MainContainer>
  )
}
