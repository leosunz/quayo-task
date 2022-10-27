import { styled } from "@mui/material/styles"
import { useContext, useState } from "react"
import { Divider, IconButton, useTheme } from "@mui/material"
import { AssignedTaskPreviewInterface } from "../api/ProjectPreviewApi"
import { ProjectPreviewContext } from "../contexts/ProjectPreviewContext"
import { getDayFromDate } from "../utils/formatters"
import InlinePill from "./InlinePill"
import CommentRoundedIcon from "@mui/icons-material/CommentRounded"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import StopRoundedIcon from "@mui/icons-material/StopRounded"
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded"
import {
  grey,
  green,
  red,
  purple,
  orange,
  cyan,
  deepOrange,
} from "@mui/material/colors"
import { isTaskInPending, isTaskCompleteOrPending } from "../utils/projectUtils"
import AddCommentDialog from "./dialogs/AddCommentDialog"
import AddPRogressDialog from "./dialogs/AddProgressDialog"
import ScheduleTaskDialog from "./dialogs/ScheduleTaskDialog"
import PercentRoundedIcon from "@mui/icons-material/PercentRounded"
import { StyledVerticalDivider } from "./StyledComponents"
import { getDisabledIconButton } from "../contexts/ThemeContext"

const StyledRow = styled("div")<{ indent: number }>(({ theme, indent }) => {
  return {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingLeft: theme.spacing(3 * indent),
  }
})

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
    flex: 1,
  }
})

const ColumnContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  }
})

export interface ProjectPreviewTaskComponentProps {
  task: AssignedTaskPreviewInterface
  parent: AssignedTaskPreviewInterface
  indent: number
  isRoot: boolean
}

export default function ProjectPreviewTaskComponent(
  props: ProjectPreviewTaskComponentProps
) {
  const theme = useTheme()
  const {
    timeUnits,
    getPredecessor,
    taskStatus,
    startTask,
    endTask,
    //hon
    updateProgress,
    updateComment,
    rescheduleTask,
  } = useContext(ProjectPreviewContext)!

  // dialog
  // comments func
  const [commentOpen, setCommentOpen] = useState(false)

  // progress
  const [progressOpen, setProgressOpen] = useState(false)

  // schedule
  const [scheduleOpen, setScheduleOpen] = useState(false)
  if (props.task.estimated_time === 23) {
    console.log(props.task)
  }

  return (
    <MainContainer>
      <ColumnContainer>
        <StyledRow indent={props.indent}>
          <InlinePill value={props.task.task_code ?? "N/A"} title="Task Code" />
          <InlinePill value={props.task.task_name} title="Task Name" />
          <InlinePill
            value={props.task.assigned_to ?? "N/A"}
            title="Assigned To"
          />
          <InlinePill
            value={props.task.estimated_time.toString()}
            title="Estimated Time"
          />
          <InlinePill
            value={
              timeUnits?.find((i) => i.id === props.task.time_unit_id)
                ?.description ?? ""
            }
            title="Time Unit"
          />
          <InlinePill
            value={
              props.task.predecessor_id
                ? getPredecessor(props.task.predecessor_id)?.task_name ?? "N/A"
                : "N/A"
            }
            title="Predecessor"
          />
          <InlinePill
            value={getDayFromDate(new Date(props.task.planned_start_date!))}
            title="Planned Start"
          />
          <InlinePill
            value={getDayFromDate(new Date(props.task.planned_end_date!))}
            title="Planned End"
          />
          <InlinePill
            value={props.task.task_progress.toString() + "%"}
            title="Progress"
          />

          <ButtonRow>
            {props.task.is_owner && props.task.children.length === 0 && (
              <>
                <StyledVerticalDivider flexItem orientation="vertical" />
                <IconButton
                  onClick={async () => await startTask(props.task.id)}
                  disabled={
                    !isTaskInPending(props.task, taskStatus!) ||
                    !props.task.can_start ||
                    props.task.children.length > 0
                  }
                >
                  <PlayArrowRoundedIcon
                    style={{
                      color:
                        !isTaskInPending(props.task, taskStatus!) ||
                        !props.task.can_start ||
                        props.task.children.length > 0
                          ? getDisabledIconButton(theme.palette.mode)
                          : green[700],
                    }}
                  />
                </IconButton>
                <IconButton
                  onClick={async () => await endTask(props.task.id)}
                  disabled={
                    isTaskCompleteOrPending(props.task, taskStatus!) ||
                    props.task.children.length > 0
                  }
                >
                  <StopRoundedIcon
                    style={{
                      color:
                        isTaskCompleteOrPending(props.task, taskStatus!) ||
                        props.task.children.length > 0
                          ? getDisabledIconButton(theme.palette.mode)
                          : red[700],
                    }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setScheduleOpen(true)
                  }}
                  disabled={!props.task.can_reschedule}
                >
                  <InsertInvitationRoundedIcon
                    style={{
                      color: props.task.can_reschedule
                        ? cyan[800]
                        : getDisabledIconButton(theme.palette.mode),
                    }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setCommentOpen(true)
                  }}
                >
                  <CommentRoundedIcon style={{ color: orange[700] }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setProgressOpen(true)
                  }}
                  disabled={!props.task.can_update_progress || getPredecessor(props.task.predecessor_id!)?.task_progress != 100}
                >
                  <PercentRoundedIcon
                    style={{
                      color: props.task.can_update_progress
                        ? deepOrange[800]
                        : getDisabledIconButton(theme.palette.mode),
                    }}
                  />
                </IconButton>
              </>
            )}
          </ButtonRow>
        </StyledRow>
      </ColumnContainer>
      <Divider orientation="horizontal" />
      {props.task.children.map((item) => {
        return (
          <ProjectPreviewTaskComponent
            isRoot={false}
            indent={props.indent + 1}
            key={item.id}
            task={item}
            parent={props.task}
          />
        )
      })}

      <AddCommentDialog
        isOpen={commentOpen}
        onClose={() => setCommentOpen(false)}
        title="Comment"
        comment={props.task.comment ?? ""}
        submit={async (value) => {
          setCommentOpen(false)
          await updateComment(props.task.id, value)
        }}
      />
      <AddPRogressDialog
        isOpen={progressOpen}
        onClose={() => setProgressOpen(false)}
        title="Progress"
        progress={props.task.task_progress ?? 0}
        submit={async (value) => {
          setProgressOpen(false)
          await updateProgress(props.task.id, value)
        }}
      />
      <ScheduleTaskDialog
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Reschedule Task"
        start={props.task.planned_start_date ?? new Date().getTime()}
        end={props.task.planned_end_date ?? new Date().getTime()}
        submit={async (start, end) => {
          setScheduleOpen(false)
          await rescheduleTask(props.task.id, start, end)
        }}
        isStartEditable={props.task.actual_start_date === undefined}
        isEndEditable={props.task.actual_end_date === undefined}
      />
    </MainContainer>
  )
}
