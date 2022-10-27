import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { useContext, useEffect, useState } from "react"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Box from "@mui/system/Box"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { LocalizationProvider, DatePicker } from "@mui/lab"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { Autocomplete, Typography } from "@mui/material"
import {
  ContextTask,
  EditTasksScreenContext,
} from "../../contexts/EditTaskScreenContext"
import { styled } from "@mui/material/styles"
import frLocale from "date-fns/locale/en-CA"
import { ClearRounded } from "@mui/icons-material"

export interface NewTaskFormDialog2Props {
  open: boolean
  handleClose: () => void
  title: string
}

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(2),
  }
})

export default function NewTaskFormDialog2(props: NewTaskFormDialog2Props) {
  const { users, timeUnits, addNewTask, autofillTemplates } = useContext(
    EditTasksScreenContext
  )!

  const [assignedTo, setAssignedTo] = useState({ error: false, value: "" })
  const [taskName, setTaskName] = useState({ error: false, value: "" })
  const [estimatedTime, setEstimatedTime] = useState({
    error: false,
    value: "",
  })
  const [timeUnitId, setTimeUnitId] = useState({ error: false, value: "" })
  const [plannedStart, setPlannedStart] = useState<{
    error: boolean
    value: Date | null
  }>({
    error: false,
    value: null,
  })
  const [plannedEnd, setPlannedEnd] = useState<{
    error: boolean
    value: Date | null
  }>({ error: false, value: null })

  const [selectedAutofill, setSelectedAutofill] = useState("")

  const validate = () => {
    let valid = true
    if (taskName.value.length < 1) {
      setTaskName({ value: taskName.value, error: true })
      valid = false
    }

    if (estimatedTime.value.length < 1 || Number.isNaN(estimatedTime.value)) {
      setEstimatedTime({ value: estimatedTime.value, error: true })
      valid = false
    }

    if (timeUnitId.value.length < 1 || Number.isNaN(timeUnitId.value)) {
      setTimeUnitId({ value: timeUnitId.value, error: true })
      valid = false
    }

    return valid
  }

  const submit = () => {
    if (validate()) {
      let task: ContextTask = {
        children: [],
        id: -1,
        estimated_time: Number(estimatedTime.value),
        task_name: taskName.value,
        time_unit_id: Number(timeUnitId.value),
        planned_start_date: plannedStart.value?.getTime(),
        planned_end_date: plannedEnd.value?.getTime(),
        assigned_to_user_code: assignedTo.value,
        sort_order: 1,
      }
      addNewTask(task)
      props.handleClose()
      clear()
    }
  }

  const clear = () => {
    setAssignedTo({ error: false, value: "" })
    setTaskName({ error: false, value: "" })
    setEstimatedTime({
      error: false,
      value: "",
    })
    setTimeUnitId({ error: false, value: "" })
    setPlannedStart({
      error: false,
      value: null,
    })
    setPlannedEnd({ error: false, value: null })
  }

  useEffect(() => {
    if (plannedStart.value && timeUnitId.value && estimatedTime.value) {
      const timeUnit = timeUnits?.find((t) => t.id === Number(timeUnitId.value))

      if (timeUnit) {
        const mil =
          timeUnit.milliseconds *
          (Number(estimatedTime.value) === 0
            ? 0
            : Number(estimatedTime.value) - 1)
        setPlannedEnd({
          error: plannedEnd.error,
          value: new Date(Number(plannedStart.value) + mil),
        })
      }
    }
  }, [plannedStart.value, timeUnitId.value, estimatedTime.value])

  return (
    <Dialog
      open={props.open}
      onClose={() => {
        props.handleClose()
        clear()
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {props.title}
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          onChange={(e, newValue) => {
            setTaskName({
              error: taskName.error,
              value: newValue?.task_name ?? "",
            })
            setEstimatedTime({
              error: estimatedTime.error,
              value: newValue?.estimated_time?.toString() ?? "",
            })
            setTimeUnitId({
              error: timeUnitId.error,
              value: newValue?.time_unit_id?.toString() ?? "",
            })
            setAssignedTo({
              error: assignedTo.error,
              value: newValue?.default_assigned_to ?? "",
            })
          }}
          options={autofillTemplates}
          getOptionLabel={(e) => e.task_name}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Autofill Template" />
          )}
        />
      </DialogTitle>
      <DialogContent style={{ padding: "1rem" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
          <MainContainer>
            <Typography variant="h6">Assigned to: &nbsp;&nbsp;</Typography>
            <Box sx={{ minWidth: 160 }}>
              <FormControl fullWidth>
                <InputLabel id="assigned-label">Assigned</InputLabel>
                <Select
                  labelId="client-label"
                  id="client-select"
                  value={assignedTo.value}
                  error={assignedTo.error}
                  label="Client"
                  onChange={(e) =>
                    setAssignedTo({
                      error: assignedTo.error,
                      value: e.target.value,
                    })
                  }
                >
                  {users!.map((user) => (
                    <MenuItem key={user.user_code} value={user.user_code}>
                      {user.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6">Task name: &nbsp;&nbsp;</Typography>
            <TextField
              label="Task Name"
              value={taskName.value}
              type="text"
              error={taskName.error}
              onChange={(e) => {
                setTaskName({ error: taskName.error, value: e.target.value })
              }}
            />

            <Typography variant="h6">Estimated time: &nbsp;&nbsp;</Typography>
            <TextField
              type="number"
              label="Estimated Time"
              value={estimatedTime.value}
              error={estimatedTime.error}
              onChange={(e) => {
                setEstimatedTime({
                  error: estimatedTime.error,
                  value: Math.abs(Number(e.target.value)).toString(),
                })
              }}
            />

            <Typography variant="h6">Time unit: &nbsp;&nbsp;</Typography>
            <Box sx={{ minWidth: 160 }}>
              <FormControl fullWidth>
                <InputLabel id="assigned-label">Time Unit</InputLabel>
                <Select
                  labelId="time-unit-label"
                  id="time-unit-select"
                  value={timeUnitId.value}
                  error={timeUnitId.error}
                  label="Time unit"
                  onChange={(e) =>
                    setTimeUnitId({
                      error: timeUnitId.error,
                      value: e.target.value,
                    })
                  }
                >
                  {timeUnits?.map((tu) => (
                    <MenuItem key={tu.id} value={tu.id}>
                      {tu.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6">
              Planned start date: &nbsp;&nbsp;
            </Typography>
            <DatePicker
              label="Planned Start"
              openTo="month"
              views={["year", "month", "day"]}
              value={plannedStart.value}
              onChange={(newValue) => {
                setPlannedStart({
                  value: newValue,
                  error: plannedStart.error,
                })
              }}
              renderInput={(params) => <TextField {...params} />}
            />

            <Typography variant="h6">Planned end date: &nbsp;&nbsp;</Typography>
            <DatePicker
              label="Planned End"
              openTo="month"
              views={["year", "month", "day"]}
              value={plannedEnd.value}
              onChange={(newValue) => {
                setPlannedEnd({
                  value: newValue,
                  error: plannedEnd.error,
                })
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </MainContainer>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.handleClose()
            clear()
          }}
        >
          Cancel
        </Button>
        <Button onClick={submit}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}
