import { styled } from "@mui/material/styles"
import { CenterContainer } from "../components/StyledComponents"
import { useContext, useState } from "react"
import AlertDialog from "../components/dialogs/AlertDialog"
import { AuthContext } from "../contexts/AuthContext"
import Loading from "../components/Loading"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import LogoComponent from "../components/LogoComponent"
import { FormControlLabel, FormGroup, Switch } from "@mui/material"
import { ValidationError } from "../api/LoginErrors"
import ConfirmationDialog from "../components/dialogs/ConfirmationDialog"

const StyledCard = styled(Paper)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    width: "600px",
    height: "350px",
    justifyContent: "space-between",
  }
})

const MainContainer = styled("div")<{ loaded: boolean }>(
  ({ theme, loaded }) => {
    return {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      alignItems: "center",
      justifyContent: loaded ? "space-evenly" : "center",
      backgroundColor: theme.palette.background.default,
    }
  }
)

const StyledButton = styled(Button)(({ theme }) => {
  return {
    height: theme.spacing(6),
  }
})

export default function LoginScreen() {
  // context
  const authContext = useContext(AuthContext)!

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  const [username, setUsername] = useState("")
  const [usernameErr, setUsernameErr] = useState(false)

  const [password, setPassword] = useState("")
  const [passwordErr, setPasswordErr] = useState(false)
  const [forceLogout, setForceLogout] = useState(false)

  // force login dialog
  const [forceDialog, setForceDialog] = useState(false)

  const submitForm = async (login?: boolean) => {
    if (validate()) {
      try {
        setIsLoading(true)

        await authContext.login(username, password, login ?? forceLogout)
        window.location.reload()
      } catch (error: any) {
        if (error instanceof ValidationError) {
          setForceDialog(true)
        } else {
          setIsDialogOpen(true)
          setDialogContent(error.message)
          setDialogTitle("Oops, something went wrong!")
        }
        setIsLoading(false)
      }
    }
  }

  function validate(): boolean {
    let valid = true

    if (username.length < 1) {
      setUsernameErr(true)
      valid = false
    } else {
      setUsernameErr(false)
    }

    if (password.length < 1) {
      setPasswordErr(true)
      valid = false
    } else {
      setPasswordErr(false)
    }

    return valid
  }

  return (
    <MainContainer loaded={!isLoading}>
      {isLoading && <Loading text="Signing in.." />}
      {!isLoading && (
        <>
          <LogoComponent />
          <StyledCard>
            <Typography gutterBottom variant="h4">
              Login
            </Typography>
            <TextField
              label="Username"
              value={username}
              fullWidth
              required
              error={usernameErr}
              type="text"
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
            <TextField
              required
              fullWidth
              label="Password"
              value={password}
              error={passwordErr}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              onSubmit={async () => await submitForm()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitForm()
                }
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={forceLogout}
                  onChange={(e) => setForceLogout(e.target.checked)}
                />
              }
              label="Force Login"
            />
            <StyledButton
              onClick={async () => await submitForm()}
              variant="contained"
              color="success"
            >
              Login
            </StyledButton>
          </StyledCard>
        </>
      )}

      <AlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        content={dialogContent}
        title={dialogTitle}
      />
      <ConfirmationDialog
        title="Session found."
        content="Are you sure you want to terminate the other session?"
        negativeText="Cancel"
        positiveText="Force Login"
        positive={async () => {
          setForceLogout(true)
          setForceDialog(false)
          await submitForm(true)
        }}
        dismiss={() => setForceDialog(false)}
        isOpen={forceDialog}
      />
    </MainContainer>
  )
}
