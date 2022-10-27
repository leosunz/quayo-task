import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { ChangeEvent, HTMLAttributes, useState } from "react"
import { TimeUnit } from "../api/TaskTemplateApi"

export interface NewTaskFormInterface {
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  description?: string
}

export interface NewTaskFomProps {
  onSubmitTaskForm(task: NewTaskFormInterface): void
  timeUnits: TimeUnit[]
}

const FormContainer = styled(Paper)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "space-evenly",
  }
})

export default function NewTaskForm(props: NewTaskFomProps) {
  // state
  const [taskName, setTaskName] = useState({ error: false, value: "" })
  const [taskCode, setTaskCode] = useState({ error: false, value: "" })
  const [estTime, setEstTime] = useState({ error: false, value: "" })
  const [timeUnit, setTimeUnit] = useState({ error: false, value: "" })

  const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName({ value: e.target.value, error: taskName.error })
  }
  const handleTaskCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskCode({ value: e.target.value, error: taskCode.error })
  }
  const handleEstTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEstTime({ value: e.target.value, error: estTime.error })
  }
  const handleTimeUnitChange = (e: SelectChangeEvent<string>) => {
    setTimeUnit({ value: e.target.value, error: timeUnit.error })
  }

  const submit = () => {
    if (validate()) {
      const task: NewTaskFormInterface = {
        estimated_time: Number(estTime.value),
        task_name: taskName.value,
        task_code: taskCode.value.length < 1 ? undefined : taskCode.value,
        time_unit_id: Number(timeUnit.value),
      }

      props.onSubmitTaskForm(task)
      setTaskName({ error: false, value: "" })
      setTaskCode({ error: false, value: "" })
      setEstTime({ error: false, value: "" })
      setTimeUnit({ error: false, value: "" })
    }
  }

  const validate = () => {
    if (taskName.value.length < 1) {
      setTaskName({ value: taskName.value, error: true })
    }

    if (estTime.value.length < 1) {
      setEstTime({ value: estTime.value, error: true })
    }

    if (timeUnit.value.length < 1) {
      setTimeUnit({ value: timeUnit.value, error: true })
    }

    const values = [taskName, estTime, timeUnit]
    return !values.some((value) => value.error == true)
  }

  return (
    <FormContainer>
      <TextField
        color="secondary"
        required
        variant="outlined"
        label="Task Name"
        type="text"
        value={taskName.value}
        error={taskName.error}
        onChange={handleTaskNameChange}
      />
      <TextField
        color="secondary"
        required={false}
        variant="outlined"
        label="Task Code"
        type="text"
        value={taskCode.value}
        error={taskCode.error}
        onChange={handleTaskCodeChange}
      />
      <TextField
        color="secondary"
        required
        variant="outlined"
        label="Estimated Time"
        type="number"
        value={estTime.value}
        error={estTime.error}
        onChange={handleEstTimeChange}
      />
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel>Estimated Time</InputLabel>
          <Select
            value={timeUnit.value}
            error={timeUnit.error}
            label="Estimated Time"
            onChange={(e) => handleTimeUnitChange(e)}
          >
            {props.timeUnits.map((value) => {
              return (
                <MenuItem key={value.id} value={value.id}>
                  {value.description}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Box>
      <Button variant="contained" color="secondary" onClick={submit}>
        Add
      </Button>
    </FormContainer>
  )
}
