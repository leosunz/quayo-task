import logo from "../images/logo.png"
import { projectName } from "../constants/Config"
import Typography from "@mui/material/Typography/Typography"
import { styled, useTheme } from "@mui/material/styles"

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.text.primary,
  }
})

export default function LogoComponent() {
  const theme = useTheme()
  return (
    <MainContainer>
      <img
        style={{ marginBottom: theme.spacing(3) }}
        src={logo}
        width={180}
        height={180}
      />
      <Typography variant="h5">{projectName}</Typography>
    </MainContainer>
  )
}
