import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/lab"
import { useEffect, useState } from "react"
import { TextField } from "@mui/material"
//import frLocale from "date-fns/locale/fr"
import frLocale from "date-fns/locale/en-CA"

export interface ScheduleTaskDialogProps {
  isOpen: boolean
  onClose(): void
  title: string
  submit: (start: number | null, end: number | null) => Promise<void>
  start: number
  end: number
  isStartEditable: boolean
  isEndEditable: boolean
}

export default function ScheduleTaskDialog(props: ScheduleTaskDialogProps) {
  const [presetStart, setPresetStart] = useState<number>(props.start)
  const [presetEnd, setPresetEnd] = useState<number>(props.end)

  const [start, setStart] = useState<number | null>(null)
  const [end, setEnd] = useState<number | null>(null)

  useEffect(() => {
    setPresetStart(props.start)
    setPresetEnd(props.end)
  }, [props.start, props.end])

  function getStartInputValue() {
    if (start) {
      return new Date(start)
    } else {
      return new Date(presetStart)
    }
  }

  function getEndInputValue() {
    if (end) {
      return new Date(end)
    } else {
      return new Date(presetEnd)
    }
  }

  function clear() {
    setStart(null)
    setEnd(null)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={props.isOpen}
      onClose={() => {
        props.onClose()
        clear()
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{
            padding: "1rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
            <DatePicker
              label="Planned Start Date"
              disabled={!props.isStartEditable}
              openTo="day"
              views={["year", "month", "day"]}
              value={getStartInputValue()}
              onChange={(newValue) => {
                if (newValue) {
                  setStart(newValue.getTime())
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />

            <DatePicker
              label="Planned End Date"
              openTo="day"
              disabled={!props.isEndEditable}
              views={["year", "month", "day"]}
              value={getEndInputValue()}
              onChange={(newValue) => {
                if (newValue) {
                  setEnd(newValue.getTime())
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose()
            clear()
          }}
          color="warning"
        >
          Dismiss
        </Button>
        <Button
          disabled={!start && !end}
          onClick={async () => {
            await props.submit(start, end)
          }}
          color="success"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
