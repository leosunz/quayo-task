import { styled } from "@mui/material/styles"
import { useContext, useEffect, useState } from "react"
import { api, HttpMethods } from "../api/ApiControllers"
import {
  AssignedTaskinterface,
  AssignedTaskResponseInterface,
  checkIfFinishedProjectUrl,
  getAssignedTasksUrl,
  getDownloadAssignedURL,
  getEndTaskUrl,
  getStartTaskUrl,
  rescheduleUrl,
  updateCommentUrl,
  updateProgressUrl,
} from "../api/AssignedTasksApi"
import { TaskStatusInterface } from "../api/ProjectApi"
import { TimeUnit } from "../api/TaskTemplateApi"
import { AuthContext } from "../contexts/AuthContext"
import ErrorComponent from "./ErrorComponent"
import Loading from "./Loading"
import CustomPaginationTable, {
  CustomPaginationTableRow,
  CustomPaginationTableState,
} from "./reusable/CustomPaginationTable"
import empty from "../images/empty_temp_1.png"
import { Icon, IconButton, Typography, useTheme } from "@mui/material"
import { getDayFromDate } from "../utils/formatters"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import StopRoundedIcon from "@mui/icons-material/StopRounded"
import InsertInvitationRoundedIcon from "@mui/icons-material/InsertInvitationRounded"
import {
  blue,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  orange,
  purple,
  red,
} from "@mui/material/colors"
import { isTaskCompleteOrPending, isTaskInPending } from "../utils/projectUtils"
import CommentRoundedIcon from "@mui/icons-material/CommentRounded"
import AddCommentDialog from "./dialogs/AddCommentDialog"
import AddPRogressDialog from "./dialogs/AddProgressDialog"
import ScheduleTaskDialog from "./dialogs/ScheduleTaskDialog"
import { useNavigate } from "react-router-dom"
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded"
import PercentRoundedIcon from "@mui/icons-material/PercentRounded"
import { getDisabledIconButton } from "../contexts/ThemeContext"
import Checkbox from "@mui/material/Checkbox"
import PrintIcon from "@mui/icons-material/Print"
import HoverPopover from "./reusable/HoverPopover"
import DoneIcon from '@mui/icons-material/Done';

const MainContainer = styled("div")<{ loaded: boolean }>(
  ({ theme, loaded }) => {
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: loaded ? "flex-start" : "center",
      justifyContent: loaded ? "flex-start" : "center",
      height: "100%",
    }
  }
)

export default function AssignedTasksDashboard() {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()
  const theme = useTheme()

  const [tasks, setTasks] = useState<AssignedTaskinterface[]>([])
  const [status, setStatus] = useState<TaskStatusInterface[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkedTasks, setCheckedTasks] = useState<number[]>([])


  useEffect(() => {
    console.log("Request To", getAssignedTasksUrl)
    setIsLoading(true)
    api<AssignedTaskResponseInterface>(
      getAssignedTasksUrl,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        console.log("response",data! )
        setIsLoading(false)
        setTasks(data!.tasks)
      
        console.log("response",data!.tasks )
        setStatus(data!.task_status)
      })
      .catch((err: any) => {
        console.log("err", err)
        setIsLoading(false)
        setError(err.message)
      })
  }, [])

  const startTask = async (id: any) => {
    try {
      setIsLoading(true)
      const res = await api<AssignedTaskResponseInterface>(
        getStartTaskUrl(id),
        HttpMethods.Get,
        null,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )

      setIsLoading(false)
      setTasks(res!.tasks)
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  const endTask = async (id: any) => {
    try {
      setIsLoading(true)
      const res = await api<AssignedTaskResponseInterface>(
        getEndTaskUrl(id),
        HttpMethods.Get,
        null,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      setIsLoading(false)
      setTasks(res!.tasks)
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  function getTableState(): CustomPaginationTableState {
    const headers: { id: string; title: any }[] = [
      {
        id: "Select",
        title: (
          <Checkbox
            checked={
              checkedTasks.length === 0
                ? false
                : tasks.map((i) => i.id).every((i) => checkedTasks.includes(i))
            }
            onChange={() => {
              const allSelected =
                checkedTasks.length === 0
                  ? false
                  : tasks
                      .map((i) => i.id)
                      .every((i) => checkedTasks.includes(i))

              if (allSelected) {
                setCheckedTasks([])
              } else {
                setCheckedTasks([...tasks.map((i) => i.id)])
              }
            }}
          />
        ),
      },
      { id: "Project", title: "Project" },
      { id: "Client", title: "Client" },
      { id: "Code", title: "Code" },
      { id: "Name", title: "Name" },
      { id: "Planned Start", title: "Planned Start" },
      { id: "Planned End", title: "Planned End" },
      { id: "Actual Start", title: "Actual Start" },
      { id: "Actual End", title: "Actual End" },
      { id: "Progress", title: "Progress" },
      { id: "Status", title: "Status" },
      { id: "Actions", title: "Actions" },
    ]
    console.log("TASKS USERS", tasks)
    const rows: CustomPaginationTableRow[] = tasks!.map((task) => {
      return {
        id: task.id,
        cells: [
          <Checkbox
            checked={checkedTasks.indexOf(task.id) !== -1}
            onChange={() => {
              const index = checkedTasks.indexOf(task.id)

              if (index !== -1) {
                checkedTasks.splice(index, 1)
                setCheckedTasks([...checkedTasks])
              } else {
                checkedTasks.push(task.id)
                setCheckedTasks([...checkedTasks])
              }
            }}
          />,
          task.project_title,
          task.client_description ?? "-",
          task.task_code ?? "-",
          task.task_name,
          task.planned_start_date
            ? getDayFromDate(new Date(task.planned_start_date))
            : "-",
          task.planned_end_date
            ? getDayFromDate(new Date(task.planned_end_date))
            : "-",

          task.actual_start_date
            ? getDayFromDate(new Date(task.actual_start_date))
            : "-",
          task.actual_end_date
            ? getDayFromDate(new Date(task.actual_end_date))
            : "-",
          task.task_progress + "%",
          status.find((i) => i.id === task.task_status_id)?.description ?? "-",

          <div style={{ display: "flex", flexDirection: "row" }}>
            <IconButton
              onClick={async () => await startTask(task.id)}
              disabled={!isTaskInPending(task, status) || !task.can_start}
            >
              <PlayArrowRoundedIcon
                style={{
                  color:
                    !isTaskInPending(task, status) || !task.can_start
                      ? getDisabledIconButton(theme.palette.mode)
                      : green[700],
                }}
              />
            </IconButton>
            <IconButton
              onClick={async () => await endTask(task.id)}
              disabled={isTaskCompleteOrPending(task, status)}
            >
              <StopRoundedIcon
                style={{
                  color: isTaskCompleteOrPending(task, status)
                    ? getDisabledIconButton(theme.palette.mode)
                    : red[700],
                }}
              />
            </IconButton>
            <IconButton
              onClick={async ()=>{
                await updateProgress(100)
              }}
              disabled={!task.can_reschedule}
            >
              <InsertInvitationRoundedIcon
                style={{
                  color: task.can_reschedule
                    ? cyan[800]
                    : getDisabledIconButton(theme.palette.mode),
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                setCommentId(task.id)
                setComment(task.comment ?? "")
                setCommentOpen(true)
              }}
            >
              <CommentRoundedIcon style={{ color: orange[700] }} />
            </IconButton>
            <IconButton
              onClick={() => {
                setProgressId(task.id)
                setProgress(task.task_progress)
                setProgressOpen(true)
              }}
              disabled={!task.can_update_progress}
            >
              <PercentRoundedIcon
                style={{
                  color: task.can_update_progress
                    ? deepOrange[800]
                    : getDisabledIconButton(theme.palette.mode),
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                setProgressId(task.id)
                setProgressProjectId(task.project_id)
                setProgress(100)
                setProgressOpen(true)
              }}
              disabled={!task.can_update_progress}
            >
              <DoneIcon
                style={{
                  color: task.can_update_progress
                    ? green[800]
                    : getDisabledIconButton(theme.palette.mode),
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => navigate(`projects/${task.project_id}/preview`)}
            >
              <OpenInFullRoundedIcon style={{ color: blue[700] }} />
            </IconButton>
          </div>,
        ],
      }
    })

    return {
      heads: [],
      customHeaders: headers,
      rows,
    }
  }

  const updateComment = async (value: string) => {
    try {
      setCommentOpen(false)
      setIsLoading(true)
      const res = await api<AssignedTaskResponseInterface>(
        updateCommentUrl(commentId!),
        HttpMethods.Post,
        { comment: value },
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      setIsLoading(false)
      setTasks(res!.tasks)
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  const updateProgress = async (value: number) => {
    try {
      setProgressOpen(false)
      setIsLoading(true)
      const res = await api<AssignedTaskResponseInterface>(
        updateProgressUrl(progressId!),
        HttpMethods.Post,
        { progress: value },
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      //paul obeid
     // if(value == 100){
      // const isProjectFinishedRes = await api<any>(
      //   checkIfFinishedProjectUrl(projectId!),
      //   HttpMethods.Get,
      //   null,
      //   { Authorization: `Bearer ${user?.tokenStr}` },
      
      // )
      // console.log("PROJECT ID", projectId!)
      // api<any>(
      //   checkIfFinishedProjectUrl(projectId!),
      //   HttpMethods.Get,
      //   null,
      //   { Authorization: `Bearer ${user?.tokenStr}` },
      //   "Something went wrong",
      //   true
      // ).then((data)=>{
      //   console.log("PROJECT STATUS AFTER PROGRESS", data)
      // })

      // const isProjectFinishedRes = await fetch(checkIfFinishedProjectUrl(projectId!), {
      //   method: HttpMethods.Get,
      //   headers: {
      //     Authorization: `Bearer ${user?.tokenStr}`,
      //     "Content-Type": "application/json",
      //   },
      // })
      
   // }
    
      setIsLoading(false)
      setTasks(res!.tasks)
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  const rescheduleCallback = async (
    start: number | null,
    end: number | null
  ) => {
    try {
      setScheduleOpen(false)
      setIsLoading(true)
      const res = await api<AssignedTaskResponseInterface>(
        rescheduleUrl(scheduleId!),
        HttpMethods.Post,
        { request_start: start, request_end: end },
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
      setIsLoading(false)
      setTasks(res!.tasks)
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  // comments func
  const [commentId, setCommentId] = useState<string | number | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [commentOpen, setCommentOpen] = useState(false)

  // progress

  const [progressId, setProgressId] = useState<string | number | null>(null)
  const [progressProjectId,setProgressProjectId] = useState<number | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [progressOpen, setProgressOpen] = useState(false)

  // schedule
  const [scheduleId, setScheduleId] = useState<string | number | null>(null)
  const [scheduleStart, setScheduleStart] = useState<number | null>(null)
  const [scheduleEnd, setScheduleEnd] = useState<number | null>(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  // button
  const [isPrintDisabled, setIsPrintDisabled] = useState(false)

  const downloadAssigned = async () => {
    try {
      setIsPrintDisabled(true)

      const response = await fetch(getDownloadAssignedURL(checkedTasks), {
        method: HttpMethods.Get,
        headers: {
          Authorization: `Bearer ${user?.tokenStr}`,
          "Content-Type": "application/json",
        },
      })

      if (response) {
        const filename = response.headers.get("File-Name")

        const type = response.headers.get("Content-Type")
        const buffer = await response.blob()
        const blob = new Blob([buffer], { type: type!! })

        const link = document.createElement("a")
        link.download = filename!!
        link.href = window.URL.createObjectURL(blob)
        link.click()
        link.remove()
      }

      setIsPrintDisabled(false)
    } catch (e: any) {
      setIsPrintDisabled(false)
    }
  }

  return (
    <MainContainer loaded={!isLoading && !error}>
      {isLoading && <Loading text="Loading assigned tasks.." />}
      {error && <ErrorComponent text={error} />}
      {!isLoading && !error && tasks.length === 0 && (
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <img src={empty} />
          <Typography variant="h6">No assigned tasks</Typography>
        </div>
      )}
      {!isLoading && !error && tasks.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography style={{ paddingLeft: theme.spacing(1) }} variant="h6">
              Assigned Tasks
            </Typography>
            <HoverPopover hoverText="Print Selected Tasks">
              <IconButton
                style={{ marginLeft: theme.spacing(1) }}
                onClick={async () => await downloadAssigned()}
                disabled={checkedTasks.length === 0 || isPrintDisabled}
              >
                <PrintIcon
                  style={{
                    color:
                      checkedTasks.length === 0
                        ? getDisabledIconButton(theme.palette.mode)
                        : theme.palette.warning.main,
                  }}
                />
              </IconButton>
            </HoverPopover>
          </div>

          <CustomPaginationTable
            table={getTableState()}
            onRowClick={() => {}}
            cursor="default"
          />
          <AddCommentDialog
            isOpen={commentOpen}
            onClose={() => setCommentOpen(false)}
            title="Comment"
            comment={comment!}
            submit={async (value) => await updateComment(value)}
          />
          <AddPRogressDialog
            isOpen={progressOpen}
            onClose={() => setProgressOpen(false)}
            title="Progress"
            progress={progress ?? 0}
            submit={async (value) => await updateProgress(value)}
          />
         
          <ScheduleTaskDialog
            isOpen={scheduleOpen}
            onClose={() => setScheduleOpen(false)}
            title="Reschedule Task"
            start={scheduleStart ?? new Date().getTime()}
            end={scheduleEnd ?? new Date().getTime()}
            submit={async (start, end) => await rescheduleCallback(start, end)}
            isStartEditable={(function () {
              const t = tasks.find((i) => i.id === scheduleId)

              return t?.actual_start_date === undefined
            })()}
            isEndEditable={(function () {
              const t = tasks.find((i) => i.id === scheduleId)

              return t?.actual_end_date === undefined
            })()}
          />
        </div>
      )}
    </MainContainer>
  )
}
