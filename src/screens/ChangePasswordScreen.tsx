import { styled, useTheme } from "@mui/material/styles"
import { useContext, useState } from "react"
import AlertDialog from "../components/dialogs/AlertDialog"
import { AuthContext } from "../contexts/AuthContext"
import Loading from "../components/Loading"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import { api, HttpMethods } from "../api/ApiControllers"
import { domainName } from "../constants/Config"
import {
  checkPasswordValidation,
  passwordHint,
} from "../constants/MenuConstants"

const StyledCard = styled(Paper)(({ theme }) => {
  return {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    width: "600px",
    height: "400px",
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

export default function ChangePasswordScreen() {
  // context
  const { user } = useContext(AuthContext)!

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  const [isSuccessful, setIsSuccessful] = useState(false)

  const [oldPassword, setOldPassword] = useState("")

  const [password1, setPassword1] = useState("")

  const [password2, setPassword2] = useState("")

  const submitForm = async () => {
    if (isButtonActive()) {
      try {
        setIsLoading(true)
        await api(
          domainName + "/api/user/password",
          HttpMethods.Post,
          { old_password: oldPassword, new_password: password1 },
          { Authorization: `Bearer ${user?.tokenStr}` },
          undefined,
          false
        )

        setIsLoading(false)
        setIsSuccessful(true)
      } catch (error: any) {
        setIsLoading(false)
        setIsDialogOpen(true)
        setDialogContent(error.message)
        setDialogTitle("Oops, something went wrong!")
      }
    }
  }

  function isButtonActive() {
    return (
      oldPassword.length > 1 && checkPasswordValidation(password1, password2)
    )
  }

  const theme = useTheme()
  return (
    <MainContainer loaded={!isLoading}>
      {isLoading && <Loading text="Changing Password.." />}
      {!isLoading && isSuccessful && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleRoundedIcon
            style={{
              color: theme.palette.success.main,
              height: "100px",
              width: "100px",
            }}
          />
          <Typography>Password Changed Successfully</Typography>
        </div>
      )}
      {!isLoading && !isSuccessful && (
        <>
          <StyledCard>
            <Typography gutterBottom variant="h4">
              Change Password
            </Typography>
            <Typography gutterBottom variant="caption">
              {passwordHint}
            </Typography>
            <TextField
              label="Old Password"
              value={oldPassword}
              fullWidth
              required
              type="password"
              onChange={(e) => {
                setOldPassword(e.target.value)
              }}
            />
            <TextField
              required
              fullWidth
              label="New Password"
              value={password1}
              type="password"
              onChange={(e) => {
                setPassword1(e.target.value)
              }}
            />
            <TextField
              required
              fullWidth
              label="Re-enter Password"
              value={password2}
              type="password"
              onChange={(e) => {
                setPassword2(e.target.value)
              }}
              onSubmit={submitForm}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitForm()
                }
              }}
            />
            <StyledButton
              onClick={submitForm}
              variant="contained"
              color="success"
              disabled={!isButtonActive()}
            >
              Submit
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
    </MainContainer>
  )
}
