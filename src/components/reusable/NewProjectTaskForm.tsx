import React, { useContext, useState } from "react"
import { styled } from "@mui/material/styles"
import { DatePicker, LocalizationProvider } from "@mui/lab"
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material"
import { InputContainer, StyledVerticalDivider } from "../StyledComponents"
import { EditTasksScreenContext } from "../../contexts/EditTaskScreenContext"
import AdapterDateFns from "@mui/lab/AdapterDateFns"

const RowContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
})

export default function NewProjectTaskForm() {
  const { users, timeUnits } = useContext(EditTasksScreenContext)!

  const [assignedTo, setAssignedTo] = useState({ error: false, value: "" })
  const [taskName, setTaskName] = useState({ error: false, value: "" })
  const [estimatedTime, setEstimatedTime] = useState({
    error: false,
    value: "",
  })
  const [timeUnitId, setTimeUnitId] = useState({ error: false, value: "" })
  const [plannedStart, setPlannedStart] = useState({
    error: false,
    value: null,
  })
  const [plannedEnd, setPlannedEnd] = useState({ error: false, value: null })

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <RowContainer>
        <InputContainer>
          {/* <Typography variant="h6">Assigne: &nbsp;&nbsp;</Typography> */}
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
        </InputContainer>
        <StyledVerticalDivider orientation="vertical" flexItem />
        <InputContainer>
          {/* <Typography variant="h6">Currency: &nbsp;&nbsp;</Typography> */}
          <TextField
            label="Task Name"
            value={taskName.value}
            type="text"
            error={taskName.error}
            onChange={(e) => {
              setTaskName({ error: taskName.error, value: e.target.value })
            }}
          />
        </InputContainer>
        <StyledVerticalDivider orientation="vertical" flexItem />
        <InputContainer>
          {/* <Typography variant="h6">Currency: &nbsp;&nbsp;</Typography> */}
          <TextField
            label="Estimated Time"
            value={estimatedTime.value}
            error={estimatedTime.error}
            onChange={(e) => {
              setEstimatedTime({
                error: estimatedTime.error,
                value: e.target.value,
              })
            }}
          />
        </InputContainer>
        <StyledVerticalDivider orientation="vertical" flexItem />

        <InputContainer>
          {/* <Typography variant="h6">Assigne: &nbsp;&nbsp;</Typography> */}
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
        </InputContainer>
        <StyledVerticalDivider orientation="vertical" flexItem />
        <InputContainer>
          {/* <Typography variant="h6">Delivery: &nbsp;&nbsp;</Typography> */}
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
        </InputContainer>
        <StyledVerticalDivider orientation="vertical" flexItem />
        <InputContainer>
          <Typography variant="h6">Delivery: &nbsp;&nbsp;</Typography>
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
        </InputContainer>
      </RowContainer>
    </LocalizationProvider>
  )
}
