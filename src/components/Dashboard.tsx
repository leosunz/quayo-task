import { styled } from "@mui/material/styles"
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material"
import { blueGrey, grey } from "@mui/material/colors"
import { useNavigate } from "react-router-dom"
import { adminlMenuItems, globalMenuItems } from "../constants/MenuConstants"
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react"
import AssignedTasksDashboard from "./AssignedTasksDashboard"
import { useTheme } from "@mui/material"

const StyledPaper = styled(Paper)<{ color?: string }>(({ theme, color }) => {
  return {
    backgroundColor: color ?? grey[100],
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    cursor: "pointer",
  }
})

const Item = styled("div")(({ theme }) => ({
  ...theme.typography.body2,

  textAlign: "start",
  color: theme.palette.text.secondary,
  boxShadow: "none",
  margin: theme.spacing(1),
  overflowY: "scroll",
}))

const MainContainer = styled("div")(({ theme }) => {
  return {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 4fr",
    width: "100%",
  }
})

const MenuHolder = styled(Paper)(({ theme }) => {
  return {
    padding: theme.spacing(1),
  }
})

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)!
  const theme = useTheme()

  const getCardMenu = () => {
    return globalMenuItems(theme.palette.mode)
      .filter((e) => e.route !== "/")
      .map((m) => {
        return (
          <StyledPaper
            color={m.cardColor}
            key={m.route}
            onClick={() => navigate(m.route)}
          >
            <Typography gutterBottom variant="h4">
              {m.title}
            </Typography>
            <Typography component="p" variant="subtitle1">
              {m.desc}
            </Typography>
          </StyledPaper>
        )
      })
  }

  const getAdminMenu = () => {
    return adminlMenuItems(user!.token, theme.palette.mode)
      .filter((e) => e.route !== "/")
      .map((m) => {
        return (
          <StyledPaper
            color={m.cardColor}
            key={m.route}
            onClick={() => navigate(m.route)}
          >
            <Typography gutterBottom variant="h4">
              {m.title}
            </Typography>
            <Typography component="p" variant="subtitle1">
              {m.desc}
            </Typography>
          </StyledPaper>
        )
      })
  }

  return (
    <MainContainer>
      <Item>
        <MenuHolder>
          <Typography variant="h6">Quick Menu</Typography>
          <>{getCardMenu()}</>

          <>{getAdminMenu()}</>
        </MenuHolder>
      </Item>

      <Item style={{ flex: "1" }}>
        <AssignedTasksDashboard />
      </Item>
    </MainContainer>
  )
}
