import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api, HttpMethods } from "../api/ApiControllers"
import { checkIfFinishedProjectUrl } from "../api/AssignedTasksApi"
import { TaskStatusInterface } from "../api/ProjectApi"
import {
  AssignedTaskPreviewInterface,
  AssignedTaskPreviewPredInterface,
  getEndTaskUrl,
  getProjectPreviewInitUrl,
  getStartTaskUrl,
  ProjectPreviewInit,
  rescheduleUrl,
  updateCommentUrl,
  updateProgressUrl,
} from "../api/ProjectPreviewApi"
import { TimeUnit } from "../api/TaskTemplateApi"
import { AuthContext } from "./AuthContext"

export interface ProjectPreviewState {
  isLoading: boolean
  error: string | null
  timeUnits: TimeUnit[] | null
  taskStatus: TaskStatusInterface[] | null
  taskTree: AssignedTaskPreviewInterface | null
  clientDescription: string | undefined
  projectTitle: string | null
  getPredecessor(id: number | string): AssignedTaskPreviewPredInterface | null
  startTask: (id: number | string) => Promise<void>
  endTask: (id: number | string) => Promise<void>
  updateComment: (id: number | string, comment: string) => Promise<void>
  updateProgress: (id: number | string, progress: number) => Promise<void>
  rescheduleTask: (
    id: number | string,
    start: number | null,
    end: number | null
  ) => Promise<void>
}

export const ProjectPreviewContext = createContext<ProjectPreviewState | null>(
  null
)

export default function ProjectPreviewContextProvider(props: {
  children: JSX.Element
}) {
  const { id: projectId } = useParams()
  const { user } = useContext(AuthContext)!

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeUnits, setTimeUnits] = useState<TimeUnit[] | null>(null)
  const [taskStatus, setTaskStatus] = useState<TaskStatusInterface[] | null>(
    null
  )
  const [clientDescription, setClientDescription] = useState<
    string | undefined
  >()
  const [projectTitle, setProjectTitle] = useState<string | null>(null)
  const [taskTree, setTaskTree] = useState<AssignedTaskPreviewInterface | null>(
    null
  )

  useEffect(() => {
    setIsLoading(true)
    api<ProjectPreviewInit>(
      getProjectPreviewInitUrl(projectId!),
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setError(null)
        setTimeUnits(data!.time_units)
        setTaskStatus(data!.task_status)
        setClientDescription(data!.client_description)
        setProjectTitle(data!.project_title)
        setTaskTree(data!.tasks)
        setIsLoading(false)
      })
      .catch((error: any) => {
        setError(error.message)
        setIsLoading(false)
      })
  }, [])

  function getPredecessor(id: number | string) {
    const buildRecursively = (
      task: AssignedTaskPreviewInterface,
      tasks: AssignedTaskPreviewPredInterface[]
    ) => {
      tasks.push(task)
      task.children.forEach((t) => buildRecursively(t, tasks))
    }

    const list: AssignedTaskPreviewPredInterface[] = []
    taskTree?.children.forEach((element) => {
      buildRecursively(element, list)
    })

    return list.find((i) => i.id === id) ?? null
  }

  // callback
  async function apiCallback(url: string, method: HttpMethods, body: any) {
    try {
      setIsLoading(true)
      const data = await api<ProjectPreviewInit>(
        url,
        method,
        body,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )

      setError(null)
      setTimeUnits(data!.time_units)
      setTaskStatus(data!.task_status)
      setClientDescription(data!.client_description)
      setProjectTitle(data!.project_title)
      setTaskTree(data!.tasks)
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  // update callbacks
  const startTask = async (id: number | string) => {
    await apiCallback(getStartTaskUrl(projectId!, id), HttpMethods.Get, null)
  }
  const endTask = async (id: number | string) => {
    await apiCallback(getEndTaskUrl(projectId!, id), HttpMethods.Get, null)
  }
  const updateComment = async (id: number | string, comment: string) => {
    await apiCallback(updateCommentUrl(projectId!, id), HttpMethods.Post, {
      comment,
    })
  }
  const updateProgress = async (id: number | string, progress: number) => {
    await apiCallback(updateProgressUrl(projectId!, id), HttpMethods.Post, {
      progress,
    })
  
  }
  const rescheduleTask = async (
    id: number | string,
    start: number | null,
    end: number | null
  ) => {
    await apiCallback(rescheduleUrl(projectId!, id), HttpMethods.Post, {
      request_start: start,
      request_end: end,
    })
  }

  const value: ProjectPreviewState = {
    isLoading,
    error,
    timeUnits,
    taskStatus,
    taskTree,
    clientDescription,
    projectTitle,
    getPredecessor,
    startTask,
    endTask,
    updateComment,
    updateProgress,
    rescheduleTask,
  }

  return (
    <ProjectPreviewContext.Provider value={value}>
      {props.children}
    </ProjectPreviewContext.Provider>
  )
}
