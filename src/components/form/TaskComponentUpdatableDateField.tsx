import TextField from "@mui/material/TextField"
import { formVariants } from "./FormModels"
import { styled } from "@mui/material/styles"
import { deepOrange, indigo, teal } from "@mui/material/colors"
import Button from "@mui/material/Button"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/lab"
import { DatePickerView } from "@mui/lab/DatePicker/shared"
import Typography from "@mui/material/Typography"
import { getDayFromDate } from "../../utils/formatters"
//import frLocale from "date-fns/locale/fr"
import frLocale from "date-fns/locale/en-CA"

import { RequestedRescheduleInterface } from "../../api/ProjectApi"
import { Paper, useTheme } from "@mui/material"

// Styled
const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: theme.spacing(1),
    justifyContent: "flexs-start",
    flex: "1",
  }
})

export interface TaskComponentUpdatableDateFieldProps {
  value: number | null | undefined
  update: (value: number | undefined) => void
  openTo: DatePickerView | undefined
  editable: boolean
  label: string
  disablePast: boolean
  shouldDisableDate?: ((day: Date | null) => boolean) | undefined
  variant?: formVariants
  isInput: boolean
  reschedule?: RequestedRescheduleInterface
  acceptReschedule?: () => void
  declineReschedule?: () => void
}

export default function TaskComponentUpdatableDateField(
  props: TaskComponentUpdatableDateFieldProps
) {
  const theme = useTheme()
  return (
    <MainContainer>
      {props.isInput && (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
          <DatePicker
            disabled={!props.editable}
            label={props.label}
            openTo={props.openTo}
            disablePast={props.disablePast}
            views={["year", "month", "day"]}
            value={props.value ? new Date(props.value) : null}
            shouldDisableDate={props.shouldDisableDate}
            onChange={(newValue) => props.update(newValue?.getTime())}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      )}

      {!props.isInput && (
        <MainContainer style={{ cursor: "pointer", userSelect: "none" }}>
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

          {/* Reschedule */}

          {props.reschedule && props.reschedule.is_confirmed === undefined && (
            <Paper
              style={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? teal[100]
                    : theme.palette.grey[900],
                padding: "5px",
              }}
              elevation={0}
            >
              <Typography
                variant="body1"
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Reschedule?
              </Typography>
              <Typography
                variant="body2"
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  color: deepOrange[600],
                }}
              >
                <span style={{ color: theme.palette.text.primary }}>By: </span>
                {props.reschedule.requested_by}
              </Typography>

              <Typography
                variant="body2"
                style={{
                  cursor: "pointer",
                  userSelect: "none",
                  color: indigo[700],
                }}
              >
                <span style={{ color: theme.palette.text.primary }}>
                  Till:{" "}
                </span>
                {getDayFromDate(new Date(props.reschedule.requested_date))}
              </Typography>
              <Button
                color="success"
                onClick={() => {
                  if (props.acceptReschedule) {
                    props.acceptReschedule()
                  }
                }}
              >
                Accept
              </Button>
              <Button
                color="error"
                onClick={() => {
                  if (props.declineReschedule) {
                    props.declineReschedule()
                  }
                }}
              >
                Decline
              </Button>
            </Paper>
          )}
        </MainContainer>
      )}
    </MainContainer>
  )
}
