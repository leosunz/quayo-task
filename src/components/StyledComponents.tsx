import Paper from "@mui/material/Paper"
import grey from "@mui/material/colors/grey"
import Fab from "@mui/material/Fab"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Divider from "@mui/material/Divider"

export const CenterContainer = styled("div")(({ theme }) => {
  return {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }
})

export const StyledTextField = styled(TextField)(({ theme }) => {
  return {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "block",
  }
})

export const StyledFab = styled(Fab)(({ theme }) => {
  return {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  }
})

export const InputContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: theme.spacing(1),
  }
})

export const StyledInputContainer = styled(InputContainer)<{
  header: string
  bg: string
  elevation?: string
}>(({ theme, header, bg, elevation }) => {
  return {
    borderLeft: `20px solid ${header}`,
    backgroundColor: theme.palette.mode === "light" ? bg : header,
    padding: `${theme.spacing(1.5)} ${theme.spacing(2)} ${theme.spacing(
      1.5
    )} ${theme.spacing(1.5)}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: elevation ?? theme.shadows[1],
  }
})

export const StyledPaper = styled(Paper)(({ theme }) => {
  return {
    backgroundColor: grey[200],
    padding: theme.spacing(1),
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  }
})

export const TransparentStyledPaper = styled("div")(({ theme }) => {
  return {
    padding: theme.spacing(1),
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  }
})

export const ScreenContainer = styled("div")<{
  isDataLoaded: boolean
}>(({ theme, isDataLoaded }) => {
  return {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: isDataLoaded ? "flex-start" : "center",
    alignItems: isDataLoaded ? "stretch" : "center",
  }
})

export const StyledDivider = styled(Divider)(({ theme }) => {
  return {
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    backgroundColor: theme.palette.secondary.dark,
  }
})

export const StyledVerticalDivider = styled(Divider)(({ theme }) => {
  return {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.secondary.light,
  }
})
