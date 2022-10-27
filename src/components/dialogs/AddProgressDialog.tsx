import { TextField, Typography } from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { useEffect, useState } from "react"

export interface AddPRogressDialogProps {
  isOpen: boolean
  onClose(): void
  title: string
  submit: (value: number) => Promise<void>
  progress: number
}

export default function AddPRogressDialog(props: AddPRogressDialogProps) {
  const [progress, setProgress] = useState(props.progress)
  const [error, setError] = useState(false)

  useEffect(() => {
    setProgress(props.progress)
  }, [props])

  const submit = async () => {
    if (validate()) {
      await props.submit(progress)
    }
  }

  function validate(): boolean {
    let valid = true

    if (progress === props.progress || (progress < 0 && progress > 100)) {
      valid = false
      setError(true)
    } else {
      setError(false)
    }

    return valid
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={props.isOpen}
      onClose={props.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          id="alert-dialog-description"
        >
          <TextField
            style={{ margin: "1rem" }}
            label="Progress"
            required
            error={error}
            type="number"
            value={progress.toString()}
            onChange={(value) => {
              const newProgress = Number(value.target.value)
              if (
                !Number.isNaN(newProgress) &&
                newProgress >= 0 &&
                newProgress <= 100
              ) {
                setProgress(Number(value.target.value))
              }
            }}
          />
          <Typography variant="h4">%</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="warning" onClick={props.onClose}>
          Dismiss
        </Button>
        <Button color="success" onClick={async () => await submit()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
