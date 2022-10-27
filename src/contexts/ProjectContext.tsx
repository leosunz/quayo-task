import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { api, HttpMethods } from "../api/ApiControllers"
import {
  getProjectsUrl,
  ProjectTaskInterface,
  ProjectWithMetaDataInterface,
  ProjectWithoutTaskInterface,
  TaskStatusInterface,
} from "../api/ProjectApi"
import { TimeUnit } from "../api/TaskTemplateApi"
import { AuthContext } from "./AuthContext"

export interface ProjectState {
  isLoading: boolean
  error: string | null
  timeUnits: TimeUnit[] | null
  project: ProjectWithoutTaskInterface | null
  rootTask: ProjectTaskInterface | null
  status: TaskStatusInterface[] | null
  deleteProject(): Promise<void>
}

export const ProjectContext = createContext<ProjectState | null>(null)

export default function ProjectContextProvider(props: {
  children: JSX.Element
}) {
  const navigate = useNavigate()
  // state
  const { id } = useParams()
  const { user } = useContext(AuthContext)!
  const [rootTask, setRootTask] = useState<ProjectTaskInterface | null>(null)
  const [project, setProject] = useState<ProjectWithoutTaskInterface | null>(
    null
  )
  const [timeUnits, setTimeUnits] = useState<TimeUnit[] | null>(null)
  const [taskStatus, setTaskStatus] = useState<TaskStatusInterface[] | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteProject = async () => {
    try {
      setIsLoading(true)
      await api(
        getProjectsUrl(id!),
        HttpMethods.Delete,
        null,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        false
      )
      setIsLoading(false)
      navigate("/projects")
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  /// Init state
  useEffect(() => {
    api<ProjectWithMetaDataInterface>(
      getProjectsUrl(id!),
      HttpMethods.Get,
      null,
      {
        Authorization: `Bearer ${user?.tokenStr}`,
      }
    )
      .then((resData) => {
        const { project, time_units, status } = resData!
        setRootTask(project.task_tree)
        setProject(project)
        setTaskStatus(status)
        setTimeUnits(time_units)
        setIsLoading(false)
        setError(null)
      })
      .catch((e) => {
        setIsLoading(false)
        setError(e.message)
      })
  }, [])

  const stateValue: ProjectState = {
    error,
    rootTask,
    isLoading,
    timeUnits,
    project,
    deleteProject,
    status: taskStatus,
  }

  return (
    <ProjectContext.Provider value={stateValue}>
      {props.children}
    </ProjectContext.Provider>
  )
}
