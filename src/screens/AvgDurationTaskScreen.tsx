import { useTheme } from "@emotion/react"
import React, { useContext, useEffect, useState } from "react"
import { getPipelineOrdersUrl, IPipelineOrder } from "../api/PipelineOrdersApi"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import { ScreenContainer } from "../components/StyledComponents"
import { AuthContext } from "../contexts/AuthContext"
import { getDayFromDate } from "../utils/formatters"
import {
  ReportsStyledPaper,
  ReportsStyledTypography,
} from "./TasksByEmployeeScreen"
import { styled } from "@mui/material/styles"
import { api, HttpMethods } from "../api/ApiControllers"
import { useParams } from "react-router-dom"
import {
  getProjectsUrl,
  ProjectTaskPredecessor,
  ProjectWithMetaDataInterface,
  RescheduleInterface,
} from "../api/ProjectApi"
import { duration } from "moment"
import { MinifiedUser } from "../api/UsersApi"
import { domainName } from "../constants/Config"

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
  }
})

interface ProjectTaskInterface {
  id: number
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  description?: string
  sort_order: number
  task_status_id: number
  task_progress: number
  parent?: number
  children: ProjectTaskInterface[]
  planned_start_date?: number
  planned_end_date?: number
  actual_start_date?: number
  actual_end_date?: number
  comment?: string
  comment_last_updated?: number
  progress_last_updated?: number
  reschedule?: RescheduleInterface
  predecessor?: ProjectTaskPredecessor
  assigned_to_user_code?: string
  assigned_to?: MinifiedUser
}

export interface ITaskDuration {
  taskName: string
  taskCode?: string
  orderNumber: string
  assignedTo?: string
  duration: string
  actual: string
}

export default function AvgDurationTaskScreen() {
  const { user } = useContext(AuthContext)!
  const theme = useTheme()
  const { id } = useParams()

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<ProjectWithMetaDataInterface | null>(
    null
  )

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    api<ProjectWithMetaDataInterface>(
      domainName + `/api/report/task-duration/${id}`,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setProject(data!)
        setIsLoading(false)
      })
      .catch((e: any) => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [])

  function getTasks(): ProjectTaskInterface[] {
    const flattenTree = (
      task: ProjectTaskInterface,
      list: ProjectTaskInterface[]
    ) => {
      list.push(task)

      task.children.forEach((i) => flattenTree(i, list))
    }

    const flatTree: ProjectTaskInterface[] = []
    if (project) {
      flattenTree(project.project.task_tree, flatTree)
    }

    return flatTree.filter((i) => {
      return (
        i.parent &&
        i.children.length === 0 &&
        i.planned_start_date &&
        i.planned_end_date &&
        i.actual_start_date &&
        i.actual_end_date
      )
    })
  }

  function getTasksWithDuration() {
    return getTasks().map<ITaskDuration>((i) => {
      return {
        taskName: i.task_name,
        taskCode: i.task_code,
        assignedTo: i.assigned_to?.description,
        orderNumber: id!,
        duration: getDuration(i) + "d",
        actual: getActual(i) + "d",
      }
    })
  }

  function getDuration(task: ProjectTaskInterface): number {
    return Math.floor(
      (task.planned_end_date! - task.planned_end_date!) / 86400000 + 1
    )
  }

  function getActual(task: ProjectTaskInterface): number {
    return (
      Math.floor((task.actual_end_date! - task.actual_start_date!) / 86400000) +
      1
    )
  }

  function getAvgDuration() {
    const t = getTasks()

    return (
      t.reduce((prev, current) => {
        return prev + getDuration(current)
      }, 0) / t.length
    )
  }

  function getAvgActual() {
    const t = getTasks()

    return (
      t.reduce((prev, current) => {
        return prev + getActual(current)
      }, 0) / t.length
    )
  }

  return (
    <ScreenContainer
      style={{ overflowY: "hidden" }}
      isDataLoaded={!isLoading && !error}
    >
      {isLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && !error && project && (
        <MainContainer>
          <ReportsStyledPaper header>
            <ReportsStyledTypography header>Task Name</ReportsStyledTypography>
            <ReportsStyledTypography header>Task Code</ReportsStyledTypography>
            <ReportsStyledTypography header>
              Order Number
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              Assigned To
            </ReportsStyledTypography>
            <ReportsStyledTypography header>Duration</ReportsStyledTypography>
            <ReportsStyledTypography header>Actual</ReportsStyledTypography>
          </ReportsStyledPaper>
          {getTasksWithDuration().map((task, index) => (
            <ReportsStyledPaper key={index}>
              <ReportsStyledTypography>{task.taskName}</ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.taskCode ?? "N/A"}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.orderNumber}
              </ReportsStyledTypography>
              <ReportsStyledTypography>
                {task.assignedTo}
              </ReportsStyledTypography>
              <ReportsStyledTypography>{task.duration}</ReportsStyledTypography>
              <ReportsStyledTypography>{task.actual}</ReportsStyledTypography>
            </ReportsStyledPaper>
          ))}
          <ReportsStyledPaper header>
            <ReportsStyledTypography header>Average</ReportsStyledTypography>
            <ReportsStyledTypography header></ReportsStyledTypography>
            <ReportsStyledTypography header></ReportsStyledTypography>
            <ReportsStyledTypography header></ReportsStyledTypography>
            <ReportsStyledTypography header>
              {getAvgDuration().toFixed(2) + "d"}
            </ReportsStyledTypography>
            <ReportsStyledTypography header>
              {getAvgActual().toFixed(2) + "d"}
            </ReportsStyledTypography>
          </ReportsStyledPaper>
        </MainContainer>
      )}
    </ScreenContainer>
  )
}
