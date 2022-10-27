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
import { LocalizationProvider } from "@mui/lab"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { Autocomplete, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
//import frLocale from "date-fns/locale/fr"
import frLocale from "date-fns/locale/en-CA"

import {
  ContextTaskTemp,
  TaskTemplateContext,
} from "../../contexts/TaskTemplateContext"
import { api, HttpMethods } from "../../api/ApiControllers"
import { getAllMainTaskTempMinUrl, getMainTempUrl, MainTaskTemplateWithTimeUnits } from "../../api/TaskTemplateApi"
import AuthContext from "../../contexts/AuthContext"
import { EditTasksScreenContext } from "../../contexts/EditTaskScreenContext"



export interface NewTaskTempFormDialog2Props {
  open: boolean
  handleClose: () => void
  title: string
}

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(1),
  }
})

export default function NewTaskTempFormDialog2(
  props: NewTaskTempFormDialog2Props
) {
  const { timeUnits, addNewTask, users, autofillTemplates } = useContext(TaskTemplateContext)!
  //const {autofillTemplates} = useContext(EditTasksScreenContext)!
  

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
  const [taskCode, setTaskCode] = useState({ error: false, value: "" })
  const [defaultAssignedTo, setDefaultAssignedTo] = useState({
    error: false,
    value: "",
  })



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
      let task: ContextTaskTemp = {
        children: [],
        id: -1,
        estimated_time: Number(estimatedTime.value),
        task_name: taskName.value,
        time_unit_id: Number(timeUnitId.value),
        sort_order: 1,
        default_assigned_to:
          defaultAssignedTo.value.length === 0
            ? undefined
            : defaultAssignedTo.value,
        task_code: taskCode.value.length === 0 ? undefined : taskCode.value,
      }
      addNewTask(task)
      props.handleClose()
      clear()
    }
  }

  const clear = () => {
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
    setTaskCode({ error: false, value: "" })
    setDefaultAssignedTo({ error: false, value: "" })
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
      <DialogTitle>{props.title}
      
      <Autocomplete
          disablePortal
          id="combo-box-demo"
          onChange={(e, newValue) => {
            setTaskCode({
              error: taskCode.error,
              value: newValue?.task_code?? ""
            })
            
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
              value: newValue?.time_unit.id?.toString() ?? "",
            })
            setDefaultAssignedTo({
              error: defaultAssignedTo.error,
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
            <Typography variant="h6">
              Default Assigned To: &nbsp;&nbsp;
            </Typography>
            <Box sx={{ minWidth: 160 }}>
              <FormControl fullWidth>
                <InputLabel id="assigned-label">Default Assigned To</InputLabel>
                <Select
                  labelId="time-unit-label"
                  id="time-unit-select"
                  value={defaultAssignedTo.value}
                  error={defaultAssignedTo.error}
                  label="Default Assigned To"
                  onChange={(e) =>
                    setDefaultAssignedTo({
                      error: defaultAssignedTo.error,
                      value: e.target.value,
                    })
                  }
                >
                  {users?.map((tu) => (
                    <MenuItem key={tu.user_code} value={tu.user_code}>
                      {tu.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6">Task Code: &nbsp;&nbsp;</Typography>
            <TextField
              type="text"
              label="Task Code"
              value={taskCode.value}
              error={taskCode.error}
              onChange={(e) => {
                setTaskCode({
                  error: taskCode.error,
                  value: e.target.value,
                })
              }}
            />

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
