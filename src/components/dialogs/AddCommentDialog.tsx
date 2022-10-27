import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { useState } from "react"
import { FormElementType } from "../form/FormModels"
import UpdatableInputFieldOG from "../form/UpdatableInputFieldOG"

export interface AddCommentDialogProps {
  isOpen: boolean
  onClose(): void
  title: string
  submit: (value: string) => Promise<void>
  comment: string
}

export default function AddCommentDialog(props: AddCommentDialogProps) {
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
        <DialogContentText id="alert-dialog-description">
          <UpdatableInputFieldOG
            editable
            label="Comment"
            type={FormElementType.TextArea}
            value={props.comment}
            maxLength={470}
            rows={5}
            variant="outlined"
            initialValue={props.comment}
            update={async (value) => props.submit(value)}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Dismiss</Button>
      </DialogActions>
    </Dialog>
  )
}
