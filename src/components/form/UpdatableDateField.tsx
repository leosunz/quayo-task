import TextField from "@mui/material/TextField"
import { useEffect, useState } from "react"
import { formVariants } from "./FormModels"
import { styled } from "@mui/material/styles"
import { green, red } from "@mui/material/colors"
import Button from "@mui/material/Button"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/lab"
import { DatePickerView } from "@mui/lab/DatePicker/shared"
import Typography from "@mui/material/Typography"
import { getDayFromDate } from "../../utils/formatters"

// Styled
const MainContainer = styled("div")<{ underline: boolean }>(
  ({ theme, underline }) => {
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      margin: theme.spacing(1),
      justifyContent: "flexs-start",
      flex: "1",
      border: underline ? `1px solid ${theme.palette.primary.light}` : "none",
      borderRadius: underline ? theme.shape.borderRadius : "none",
    }
  }
)
const ButtonRow = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
  }
})

export interface UpdatableDateFieldProps {
  value: number | null
  update: ((value: number) => Promise<void>) | ((value: number) => void)
  openTo: DatePickerView | undefined
  editable: boolean
  label: string
  disablePast: boolean
  shouldDisableDate?: ((day: Date | null) => boolean) | undefined
  variant?: formVariants
  underline?: boolean
}

export default function UpdatableDateField(props: UpdatableDateFieldProps) {
  const [state, setState] = useState<number | null>(props.value)
  const [error, setError] = useState(false)
  const [didChange, setDidChange] = useState(false)
  const [isInput, setIsInput] = useState(false)

  // use effect
  useEffect(() => {
    setState(props.value)
    setDidChange(false)
    setError(false)
  }, [props])

  const updateState = (value: Date | null) => {
    setDidChange(true)
    setState(value?.getTime() ?? null)
  }

  const submit = async () => {
    if (state === null) {
      setError(true)
    } else {
      setError(false)
      await props.update(state)
      setIsInput(false)
      setDidChange(false)
    }
  }

  const cancel = () => {
    setState(props.value)
    setDidChange(false)
    setIsInput(false)
  }

  return (
    <MainContainer underline={props.underline ?? true}>
      {isInput && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={props.label}
            openTo={props.openTo}
            disablePast={props.disablePast}
            views={["year", "month", "day"]}
            value={state ? new Date(state) : null}
            shouldDisableDate={props.shouldDisableDate}
            onChange={(newValue) => updateState(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />

          {didChange && (
            <ButtonRow>
              <Button style={{ color: red[500] }} onClick={cancel}>
                Cancel
              </Button>
              <Button style={{ color: green[500] }} onClick={submit}>
                Update
              </Button>
            </ButtonRow>
          )}
        </LocalizationProvider>
      )}

      {!isInput && (
        <MainContainer
          underline={false}
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            if (props.editable) {
              setIsInput(true)
            }
          }}
        >
          <Typography
            variant="caption"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            {props.label}
          </Typography>
          <Typography
            variant="body1"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            {props.value ? getDayFromDate(new Date(props.value)) : "N/A"}
          </Typography>
        </MainContainer>
      )}
    </MainContainer>
  )
}
