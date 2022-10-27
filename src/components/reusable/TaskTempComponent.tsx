import { green, grey } from "@mui/material/colors"
import { styled } from "@mui/material/styles"
import { useContext, useEffect, useState } from "react"
import { FormElementType } from "../form/FormModels"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded"
import { Divider, IconButton } from "@mui/material"
import { isTaskFirstElement, isTaskLastElement } from "../../utils/projectUtils"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import TaskComponentUpdatableInputField from "../form/TaskComponentUpdatableInputField"
import CheckIcon from "@mui/icons-material/CheckCircleRounded"
import CancelIcon from "@mui/icons-material/CancelRounded"
import {
  ContextTaskTemp,
  TaskTemplateContext,
} from "../../contexts/TaskTemplateContext"
import EditRoundedIcon from "@mui/icons-material/EditRounded"

const StyledRow = styled("div")<{ indent: number }>(({ theme, indent }) => {
  return {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingLeft: theme.spacing(2 * indent),
  }
})

const SelectedDot = styled("div")<{ selected: boolean }>(
  ({ theme, selected }) => {
    return {
      width: "1rem",
      height: "1rem",
      background: selected ? green[800] : grey[700],
      borderRadius: "3rem",
      margin: theme.spacing(0.5),
      cursor: "pointer",
      alignSelf: "center",
      justifySelf: "center",
    }
  }
)

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  }
})

const ButtonRow = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    paddingRight: theme.spacing(4),
  }
})

const ColumnContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  }
})

export interface TaskTempComponentProps {
  task: ContextTaskTemp
  parent: ContextTaskTemp
  indent: number
  isRoot: boolean
}

// task code -  assign to - planned start date - planned end date
export default function TaskTempComponent(props: TaskTempComponentProps) {
  const {
    updateTask,
    timeUnits,
    sortOrder,
    selectedTask,
    rootTask,
    setSelectedProjectTaskCb,
    deleteTask,
    canOrderUp,
    users,
    canOrderDown,
  } = useContext(TaskTemplateContext)!

  // state
  const [taskName, setTaskName] = useState(props.task.task_name)
  const [taskNameErr, setTaskNameErr] = useState(false)

  const [taskCode, setTaskCode] = useState(props.task.task_code)
  const [taskCodeErr, setTaskCodeErr] = useState(false)

  const [defaultAssignedTo, setDefaultAssignedTo] = useState(
    props.task.default_assigned_to
  )

  const [estimatedTime, setEstimatedTime] = useState(props.task.estimated_time)
  const [estimatedTimeErr, setEstimatedTimeErr] = useState(false)

  const [timeUnitId, setTimeUnitId] = useState(props.task.time_unit_id)
  const [timeUnitIdErr, setTimeUnitIdErr] = useState(false)

  const [isInput, setIsInput] = useState(false)

  useEffect(() => {
    setTaskName(props.task.task_name)
    setEstimatedTime(props.task.estimated_time)
    setTimeUnitId(props.task.time_unit_id)
  }, [rootTask])

  const submit = () => {
    if (validate()) {
      props.task.task_name = taskName
      props.task.estimated_time = estimatedTime
      props.task.time_unit_id = timeUnitId
      props.task.task_code = taskCode
      props.task.default_assigned_to = defaultAssignedTo
      updateTask(rootTask!)
      setIsInput(false)
    }
  }

  const cancelChanges = () => {
    setTaskName(props.task.task_name)
    setTaskNameErr(false)

    setEstimatedTime(props.task.estimated_time)
    setEstimatedTimeErr(false)

    setTimeUnitId(props.task.time_unit_id)
    setTimeUnitIdErr(false)

    setIsInput(false)
  }

  const validate: () => boolean = () => {
    let valid = true
    if (taskName.length < 1) {
      setTaskNameErr(true)
      valid = false
    }

    if (Number.isNaN(timeUnitId)) {
      setTimeUnitIdErr(true)
      valid = false
    }

    if (Number.isNaN(estimatedTime)) {
      setEstimatedTimeErr(true)
      valid = false
    }

    return valid
  }

  return (
    <MainContainer>
      <ColumnContainer>
        <StyledRow indent={props.indent}>
          {!props.isRoot && (
            <>
              <IconButton
                disabled={
                  isTaskLastElement(props.task, props.parent) ||
                  !canOrderDown(props.task, props.parent)
                }
                onClick={() => {
                  sortOrder(
                    props.task.sort_order,
                    props.task.sort_order + 1,
                    props.parent
                  )
                }}
              >
                <KeyboardArrowDownRoundedIcon />
              </IconButton>
              <IconButton
                disabled={
                  isTaskFirstElement(props.task, props.parent) ||
                  !canOrderUp(props.task, props.parent)
                }
                onClick={() => {
                  sortOrder(
                    props.task.sort_order,
                    props.task.sort_order - 1,
                    props.parent
                  )
                }}
              >
                <KeyboardArrowUpRoundedIcon />
              </IconButton>
            </>
          )}
          {props.isRoot && (
            <SelectedDot
              selected={
                props.task.id === selectedTask?.id &&
                props.task.fake_id === selectedTask.fake_id
              }
              onClick={() => setSelectedProjectTaskCb(props.task)}
            />
          )}

          <TaskComponentUpdatableInputField
            variant="outlined"
            maxLength={40}
            value={taskCode}
            update={(value) => {
              setTaskCode(value)
            }}
            editable
            error={taskCodeErr}
            label="Task Code"
            type={FormElementType.Text}
            isInput={isInput}
            initialValue={taskCode}
          />

          <TaskComponentUpdatableInputField
            variant="outlined"
            maxLength={40}
            value={taskName}
            update={(value) => {
              setTaskName(value)
            }}
            editable
            error={taskNameErr}
            label="Task Name"
            type={FormElementType.Text}
            isInput={isInput}
            initialValue={taskName}
          />

          <TaskComponentUpdatableInputField
            variant="outlined"
            maxLength={40}
            error={estimatedTimeErr}
            value={estimatedTime.toString()}
            update={(value) => {
              setEstimatedTime(Math.abs(Number(value)))
            }}
            isInput={isInput}
            editable={props.task.children.length === 0}
            label="Estimated Time"
            type={FormElementType.Number}
            initialValue={estimatedTime.toString()}
          />
          <TaskComponentUpdatableInputField
            width={280}
            variant="outlined"
            error={timeUnitIdErr}
            maxLength={40}
            value={timeUnitId.toString()}
            update={(value) => {
              setTimeUnitId(Number(value))
            }}
            isInput={isInput}
            editable={props.task.children.length === 0}
            label="Time Unit"
            type={FormElementType.Dropdown}
            initialValue={timeUnitId.toString()}
            values={
              timeUnits?.map((tu) => {
                return {
                  id: tu.id.toString(),
                  description: tu.description,
                }
              }) ?? []
            }
          />
          <TaskComponentUpdatableInputField
            width={280}
            variant="outlined"
            error={false}
            maxLength={50}
            value={defaultAssignedTo}
            update={(value) => {
              setDefaultAssignedTo(value)
            }}
            isInput={isInput}
            editable
            label="Default Assgined To"
            type={FormElementType.Dropdown}
            initialValue={defaultAssignedTo}
            values={
              users?.map((tu) => {
                return {
                  id: tu.user_code,
                  description: tu.user_code,
                }
              }) ?? []
            }
          />

          <IconButton onClick={() => deleteTask(props.task, props.parent)}>
            <DeleteRoundedIcon color="error" />
          </IconButton>
          <IconButton onClick={() => setIsInput(true)}>
            <EditRoundedIcon color="info" />
          </IconButton>
        </StyledRow>
        {isInput && (
          <ButtonRow>
            <IconButton onClick={() => submit()}>
              <CheckIcon color="success" />
            </IconButton>
            <IconButton color="error" onClick={() => cancelChanges()}>
              <CancelIcon />
            </IconButton>
          </ButtonRow>
        )}
      </ColumnContainer>
      <Divider orientation="horizontal" />
      {props.task.children.map((item) => {
        return (
          <TaskTempComponent
            isRoot={false}
            indent={props.indent + 1}
            key={item.fake_id ?? item.id}
            task={item}
            parent={props.task}
          />
        )
      })}
    </MainContainer>
  )
}
