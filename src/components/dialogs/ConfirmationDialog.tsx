import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import { forwardRef } from "react"

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  content: string
  positiveText: string
  negativeText: string
  dismiss(): void
  positive: (() => void) | (() => Promise<void>)
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  return (
    <Dialog
      open={props.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.dismiss}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.dismiss}>{props.negativeText}</Button>
        <Button onClick={async () => await props.positive()}>
          {props.positiveText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
