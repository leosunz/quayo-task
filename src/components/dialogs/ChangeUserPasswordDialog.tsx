import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import { forwardRef, useContext, useState } from "react"
import { styled, useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import {
  checkPasswordValidation,
  passwordHint,
} from "../../constants/MenuConstants"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import Loading from "../Loading"
import Typography from "@mui/material/Typography"
import { api, HttpMethods } from "../../api/ApiControllers"
import { domainName } from "../../constants/Config"
import { AuthContext } from "../../contexts/AuthContext"

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const StyledTypo = styled(TextField)(({ theme }) => {
  return {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
})

export interface ChangeUserPasswordDialogProps {
  isOpen: boolean
  dismiss(): void
  userCode: string
}

export default function ChangeUserPasswordDialog(
  props: ChangeUserPasswordDialogProps
) {
  // context
  const { user } = useContext(AuthContext)!

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)

  const [password1, setPassword1] = useState("")

  const [password2, setPassword2] = useState("")

  const theme = useTheme()

  const submitForm = async () => {
    if (isButtonActive()) {
      try {
        setIsLoading(true)
        await api(
          domainName + `/api/user/${props.userCode}/change-password`,
          HttpMethods.Post,
          { new_password: password1 },
          { Authorization: `Bearer ${user?.tokenStr}` },
          undefined,
          false
        )
        setIsLoading(false)
        setIsSuccessful(true)
        setTimeout(() => clear(), 200)
      } catch (error: any) {
        setIsLoading(false)
        setIsSuccessful(false)
      }
    }
  }

  function isButtonActive() {
    return checkPasswordValidation(password1, password2)
  }

  function clear() {
    props.dismiss()
    setPassword1("")
    setPassword2("")
  }

  return (
    <Dialog
      open={props.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={clear}
      aria-describedby="alert-dialog-slide-description"
    >
      {!isLoading && !isSuccessful && (
        <>
          <DialogTitle>Change Password</DialogTitle>
          <Typography
            style={{
              marginLeft: theme.spacing(3),
              marginRight: theme.spacing(3),
            }}
            gutterBottom
            variant="caption"
          >
            {passwordHint}
          </Typography>
        </>
      )}
      <DialogContent>
        {isLoading && <Loading text="Changing Password" />}
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
            <StyledTypo
              required
              fullWidth
              label="New Password"
              value={password1}
              type="password"
              onChange={(e) => {
                setPassword1(e.target.value)
              }}
            />
            <StyledTypo
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
          </>
        )}
      </DialogContent>
      {!isLoading && !isSuccessful && (
        <DialogActions>
          <Button color="warning" onClick={clear}>
            Cancel
          </Button>
          <Button
            color="success"
            disabled={!isButtonActive()}
            onClick={async () => await submitForm()}
          >
            Submit
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
