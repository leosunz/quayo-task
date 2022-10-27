import { green, grey } from "@mui/material/colors"
import { styled } from "@mui/material/styles"
import { useContext, useEffect, useState } from "react"
import {
  ContextTask,
  EditTasksScreenContext,
} from "../../contexts/EditTaskScreenContext"
import { FormElementType } from "../form/FormModels"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded"
import { Divider, IconButton } from "@mui/material"
import { isTaskFirstElement, isTaskLastElement } from "../../utils/projectUtils"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import TaskComponentUpdatableInputField from "../form/TaskComponentUpdatableInputField"
import TaskComponentUpdatableDateField from "../form/TaskComponentUpdatableDateField"
import CheckIcon from "@mui/icons-material/CheckCircleRounded"
import CancelIcon from "@mui/icons-material/CancelRounded"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import {
  ProjectTaskChangeEvent,
  ProjectTaskPredecessor,
} from "../../api/ProjectApi"

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

export interface ProjectTaskComponentProps {
  task: ContextTask
  parent: ContextTask
  indent: number
  isRoot: boolean
}

// task code -  assign to - planned start date - planned end date
export default function ProjectTaskComponent(props: ProjectTaskComponentProps) {
  const {
    updateTask,
    timeUnits,
    users,
    sortOrder,
    selectedProjectTask,
    taskTree,
    canDeleteTask,
    setSelectedProjectTaskCb,
    deleteTask,
    canOrderUp,
    canOrderDown,
    acceptRescheduleStart,
    declineRescheduleStart,
    acceptRescheduleEnd,
    declineRescheduleEnd,
    getAvailablePredecessors,
  } = useContext(EditTasksScreenContext)!

  // state
  const [taskName, setTaskName] = useState(props.task.task_name)
  const [taskNameErr, setTaskNameErr] = useState(false)

  const [assignedTo, setAssignedTo] = useState(props.task.assigned_to_user_code)

  const [estimatedTime, setEstimatedTime] = useState(props.task.estimated_time)
  const [estimatedTimeErr, setEstimatedTimeErr] = useState(false)

  const [timeUnitId, setTimeUnitId] = useState(props.task.time_unit_id)
  const [timeUnitIdErr, setTimeUnitIdErr] = useState(false)

  const [plannedStart, setPlannedStart] = useState(
    props.task.planned_start_date
  )
  const [plannedEnd, setPlannedEnd] = useState(props.task.planned_start_date)
  const [predecessor, setPredecessor] = useState(props.task.predecessor)
  const [isInput, setIsInput] = useState(false)
  const [changeEvent, setChangeEvent] = useState(ProjectTaskChangeEvent.None)

  useEffect(() => {
    setTaskName(props.task.task_name)
    setAssignedTo(props.task.assigned_to_user_code)
    setEstimatedTime(props.task.estimated_time)
    setTimeUnitId(props.task.time_unit_id)
    setPlannedStart(props.task.planned_start_date)
    setPlannedEnd(props.task.planned_end_date)
  }, [taskTree])

  const submit = () => {
    console.log("PLANNED END FOM SUBMIT",plannedEnd )
    if (validate()) {
      props.task.task_name = taskName
      props.task.assigned_to_user_code = assignedTo
      props.task.estimated_time = estimatedTime
      props.task.time_unit_id = timeUnitId
      props.task.planned_start_date = plannedStart
      props.task.planned_end_date = plannedEnd
      props.task.predecessor = predecessor
      updateTask(props.task, props.parent, changeEvent)
      setIsInput(false)
      setChangeEvent(ProjectTaskChangeEvent.None)
    }
  }

  const cancelChanges = () => {
    setTaskName(props.task.task_name)
    setTaskNameErr(false)

    setAssignedTo(props.task.assigned_to_user_code)

    setEstimatedTime(props.task.estimated_time)
    setEstimatedTimeErr(false)

    setTimeUnitId(props.task.time_unit_id)
    setTimeUnitIdErr(false)

    setPlannedStart(props.task.planned_start_date)
    setPlannedEnd(props.task.planned_end_date)
    setIsInput(false)
    setChangeEvent(ProjectTaskChangeEvent.None)
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

  function isTaskEditable() {
    if (props.task.actual_start_date && props.task.actual_end_date) {
      return false
    } else {
      return true
    }
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
                props.task.id === selectedProjectTask?.id &&
                props.task.fake_id === selectedProjectTask.fake_id
              }
              onClick={() => setSelectedProjectTaskCb(props.task)}
            />
          )}

          <TaskComponentUpdatableInputField
            variant="outlined"
            maxLength={40}
            value={taskName}
            update={(value) => {
              setTaskName(value)
            }}
            error={taskNameErr}
            editable={isTaskEditable()}
            label="Task Name"
            type={FormElementType.Text}
            isInput={isInput}
            initialValue={taskName}
          />
          <TaskComponentUpdatableInputField
            variant="outlined"
            maxLength={40}
            value={assignedTo ?? ""}
            update={(value) => {
              // TODO: Test
              if (props.task.children.length > 0) {
                props.task.children.forEach((element) => {
                  element.assigned_to_user_code = value
                })
              }

              if (props.parent.parent) {
                props.parent.assigned_to_user_code = undefined
              }

              setAssignedTo(value)
            }}
            isInput={isInput}
            error={false}
            editable={
              isTaskEditable() &&
              (props.task.actual_start_date === null ||
                props.task.actual_start_date === undefined)
            }
            label="Assigned To"
            type={FormElementType.Dropdown}
            initialValue={assignedTo}
            values={
              users?.map((user) => {
                return {
                  id: user.user_code,
                  description: user.description ?? "",
                }
              }) ?? []
            }
          />
          <TaskComponentUpdatableInputField
            variant="outlined"
            maxLength={40}
            error={estimatedTimeErr}
            value={estimatedTime.toString()}
            update={(value) => {
              setEstimatedTime(Math.abs(Number(value)))
              setChangeEvent(ProjectTaskChangeEvent.ChangeTime)
    console.log("PLANNED END FOM ESTIMATED TIME",plannedEnd )

            }}
            isInput={isInput}
            editable={isTaskEditable() && props.task.children.length === 0}
            label="Estimated Time"
            type={FormElementType.Number}
            initialValue={estimatedTime.toString()}
          />
          <TaskComponentUpdatableInputField
            variant="outlined"
            error={timeUnitIdErr}
            maxLength={40}
            value={timeUnitId.toString()}
            update={(value) => {
              setTimeUnitId(Number(value))
    console.log("PLANNED END beforeeee",plannedEnd )

              setChangeEvent(ProjectTaskChangeEvent.ChangeTime)
    console.log("PLANNED ENdaftereererer",plannedEnd )

            }}
            isInput={isInput}
            editable={isTaskEditable() && props.task.children.length === 0}
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
            variant="outlined"
            error={false}
            maxLength={60}
            value={predecessor?.fake_id ?? predecessor?.id?.toString()}
            update={(value) => {
              if (value === "-100") {
                setPredecessor(undefined)
                return
              }

              let task: ProjectTaskPredecessor | undefined
              if (value.includes("-")) {
                task = getAvailablePredecessors(props.task, props.parent).find(
                  (i) => i.fake_id === value
                )
              } else {
                task = getAvailablePredecessors(props.task, props.parent).find(
                  (i) => i.id.toString() === value
                )
              }

              setPredecessor(task)
            }}
            isInput={isInput}
            editable={
              isTaskEditable() &&
              props.task.children.length === 0 &&
              getAvailablePredecessors(props.task, props.parent).length > 0
            }
            label="Predecessor"
            type={FormElementType.Dropdown}
            initialValue={predecessor?.fake_id ?? predecessor?.id?.toString()}
            values={
              getAvailablePredecessors(props.task, props.parent).map((tu) => {
                return {
                  id: tu.fake_id ?? tu.id.toString(),
                  description: tu.task_name,
                }
              }) ?? []
            }
          />
          <TaskComponentUpdatableDateField
            variant="outlined"
            value={plannedStart}
            update={(value) => {
              setPlannedStart(value)

              setChangeEvent(ProjectTaskChangeEvent.ChangeStart)
    

            }}
            editable={
              isTaskEditable() &&
              props.task.children.length === 0 &&
               (props.task.actual_start_date === null ||
                 props.task.actual_start_date === undefined)
            }
            disablePast={true}
            label="Planned Start"
            openTo="day"
            shouldDisableDate={() => {
              return false
            }}
            isInput={isInput}
            reschedule={props.task.reschedule?.start_request}
            acceptReschedule={
              props.task.reschedule?.start_request !== undefined
                ? () =>
                    acceptRescheduleStart(
                      props.task,
                      props.parent,
                      props.task.reschedule!.start_request!
                    )
                : undefined
            }
            declineReschedule={
              props.task.reschedule?.start_request !== undefined
                ? () =>
                    declineRescheduleStart(
                      props.task.reschedule!.start_request!
                    )
                : undefined
            }
          />
          <TaskComponentUpdatableDateField
            variant="outlined"
            disablePast={true}
            value={plannedEnd}
            isInput={isInput}
            update={(value) => {
              setPlannedEnd(value)
              setChangeEvent(ProjectTaskChangeEvent.ChangeEnd)
            }}
            editable={isTaskEditable() && props.task.children.length === 0}
            shouldDisableDate={() => {
              return false
            }}
            label="Planned End"
            openTo="day"
            reschedule={props.task.reschedule?.end_request}
            acceptReschedule={
              props.task.reschedule?.end_request !== undefined
                ? () =>
                    acceptRescheduleEnd(
                      props.task,
                      props.parent,
                      props.task.reschedule!.end_request!
                    )
                : undefined
            }
            declineReschedule={
              props.task.reschedule?.end_request !== undefined
                ? () =>
                    declineRescheduleEnd(props.task.reschedule!.end_request!)
                : undefined
            }
          />

          <IconButton
            onClick={() => deleteTask(props.task, props.parent)}
            disabled={!canDeleteTask(props.task)}
          >
            <DeleteRoundedIcon
              color={canDeleteTask(props.task) ? "error" : "disabled"}
            />
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
          <ProjectTaskComponent
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
