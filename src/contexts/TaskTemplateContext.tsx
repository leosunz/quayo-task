import qs from "qs"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { v4 } from "uuid"
import { api, HttpMethods } from "../api/ApiControllers"
import { AutofillTemplate, EditProjectTasksInitInterface, editProjectTasksUrl, editTemplateTasksUrl, InitQuery } from "../api/ProjectApi"
import {
  MainTaskTemplateWithTimeUnits,
  getMainTempUrl,
  TimeUnit,
  saveTemplateUrl,
  deleteTaskTempalteUrl,
  getAllMainTaskTempMinUrl,
  testgetalltasks,
} from "../api/TaskTemplateApi"
import { MinifiedUser } from "../api/UsersApi"
import {
  getNextSortOrder,
  sortProjectTasksWithReturn,
} from "../utils/projectUtils"
import { AuthContext } from "./AuthContext"

export interface ContextTaskTemp {
  id: number
  fake_id?: string
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  description?: string
  sort_order: number
  parent?: number
  children: ContextTaskTemp[]
  parent_fake_id?: string
  default_assigned_to?: string
}

export interface TaskTemplateState {
  // interface data
  error: string | null
  isLoading: boolean

  // metadata
  timeUnits: TimeUnit[] | null

  selectedTask: ContextTaskTemp | null

  // project data
  rootTask: ContextTaskTemp | null
  //autoFillTemplates
  autofillTemplates: AutofillTemplate[]
  // users
  users: MinifiedUser[]

  // utils
  sortOrder(oldIndex: number, newIndex: number, parent: ContextTaskTemp): void

  // updates
  setSelectedProjectTaskCb: (task: ContextTaskTemp | null) => void
  addNewTask: (task: ContextTaskTemp) => void
  updateTask: (task: ContextTaskTemp) => void
  saveTemplate: () => Promise<void>
  deleteTask(task: ContextTaskTemp, parent: ContextTaskTemp): void
  canOrderUp(task: ContextTaskTemp, parent: ContextTaskTemp): boolean
  canOrderDown(task: ContextTaskTemp, parent: ContextTaskTemp): boolean
  deleteMainTask(): Promise<void>
}

export const TaskTemplateContext = createContext<TaskTemplateState | null>(null)

export default function TaskTemplateContextProvider(props: {
  children: JSX.Element
}) {
  // state
  const { id } = useParams()
  const { user } = useContext(AuthContext)!
  const [rootTask, setRootTask] = useState<ContextTaskTemp | null>(null)
  const [timeUnits, setTimeUnits] = useState<TimeUnit[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<ContextTaskTemp | null>(null)
  const [users, setUsers] = useState<MinifiedUser[]>([])
  const [autofillTemplates, setAutofillTemplates] = useState<
  any[]
>([])

const query: InitQuery = qs.parse(window.location.search.replace("?", ""))
  const navigate = useNavigate()

  /// Init state
  useEffect(() => {
    setIsLoading(true)
    api<MainTaskTemplateWithTimeUnits>(
      getMainTempUrl(id!, false),
      HttpMethods.Get,
      null,
      {
        Authorization: `Bearer ${user?.tokenStr}`,
      }
    )
      .then((resData) => {
        const { task: apiTask, time_units, users } = resData!
        // setRootTask(apiTask)
        setTimeUnits(time_units)
        setIsLoading(false)
        setError(null)
        updateTask(apiTask)
        setUsers(users)
      })
      .catch((e) => {
        setIsLoading(false)
        setError(e.message)
      })
  }, [])

    //todo: Paul Added this for autofilling task
    useEffect(() => {
      console.log("API CALLEDD SUCC")
      api<any[]>(
        editTemplateTasksUrl(id!),
        HttpMethods.Get,
        null,
        { Authorization: `Bearer ${user?.tokenStr}` }
      )
        .then((data) => {

          console.log(data)
  
          setAutofillTemplates(data!)
        })
        .catch((e) => {
           console.log(e)
        })
    }, [])

      /// Init state
      // useEffect(() => {
      
      //   api<any>(
      //     testgetalltasks(),
      //     HttpMethods.Post,
      //     null,
      //     {
      //       Authorization: `Bearer ${user?.tokenStr}`,
      //     }
      //   )
      //     .then((resData) => {
      //        console.log("ALL TASKS:", resData)
            
      //     })
      //     .catch((e) => {
            
      //     })
      // }, [])

  // callbacks
  const addNewTask = (task: ContextTaskTemp) => {
    let projAdd: ContextTaskTemp

    if (selectedTask) {
      projAdd = selectedTask
    } else {
      projAdd = rootTask!
    }

    task.parent = projAdd.id
    task.sort_order = getNextSortOrder(
      projAdd.children.map((e) => e.sort_order) ?? []
    )
    task.fake_id = v4()

    projAdd.children.push(task)
    sortProjectTasksWithReturn(projAdd.children)

    setRootTask(Object.assign({}, rootTask))
  }

  const updateTask = (newTree: ContextTaskTemp) => {
    function getEstimatedTime(task: ContextTaskTemp): number {
      const map = task.children.map((t) => {
        return (
          t.estimated_time *
          (timeUnits?.find((i) => i.id === t.time_unit_id)?.milliseconds ?? 0)
        )
      })

      return map.reduce((prev, curr) => prev + curr)
    }

    function updateEstimatedTimes(task: ContextTaskTemp) {
      if (task.children.length > 0) {
        task.time_unit_id = 3
        const newTime = getEstimatedTime(task)
        task.estimated_time = newTime / 86400000 // one day in mill
        //task.children.forEach((t) => updateEstimatedTimes(t))
      }
    }

    if (newTree) {
      // skipping first node
      newTree.children.forEach((task) => {
        updateEstimatedTimes(task)
        sortProjectTasksWithReturn(task.children)
      })
    }

    setRootTask(Object.assign({}, newTree))
  }
  const setSelectedProjectTaskCb = (task: ContextTaskTemp | null) => {
    if (
      selectedTask?.id === task?.id &&
      selectedTask?.fake_id === task?.fake_id
    ) {
      setSelectedTask(rootTask)
    } else {
      setSelectedTask(task)
    }
  }

  const sortOrder = (
    oldIndex: number,
    newIndex: number,
    parent: ContextTaskTemp
  ) => {
    const activeTask = parent.children.find((i) => i.sort_order === oldIndex)
    if (activeTask) {
      activeTask.sort_order = newIndex

      if (newIndex < oldIndex) {
        parent.children.forEach((element) => {
          if (element.sort_order >= newIndex && element !== activeTask) {
            element.sort_order++
          }
        })
      } else if (newIndex > oldIndex) {
        parent.children.forEach((element) => {
          if (element.sort_order <= newIndex && element !== activeTask) {
            element.sort_order--
          }
        })
      }

      // parent.children = arrayMove(parent.children, oldIndex, newIndex)
      sortProjectTasksWithReturn(parent.children)

      setRootTask(Object.assign({}, rootTask))
    }
  }

  const saveTemplate = async () => {
    try {
      setIsLoading(true)
      await api<MainTaskTemplateWithTimeUnits>(
        saveTemplateUrl(id!),
        HttpMethods.Post,
        rootTask,
        { Authorization: `Bearer ${user?.tokenStr}` },
        undefined,
        false
      )
      setIsLoading(false)
      navigate("/tasks/templates")
    } catch (e: any) {
      setIsLoading(false)
    }
  }

  function deleteTask(task: ContextTaskTemp, parent: ContextTaskTemp) {
    if (parent.children.includes(task)) {
      parent.children = parent.children.filter((i) => i !== task)
      setRootTask(Object.assign({}, rootTask))
    }
  }

  const canOrderUp = (task: ContextTaskTemp, parent: ContextTaskTemp) => {
    const prev = parent.children.find(
      (i) => i.sort_order === task.sort_order - 1
    )

    return true
  }

  const canOrderDown = (task: ContextTaskTemp, parent: ContextTaskTemp) => {
    const next = parent.children.find(
      (i) => i.sort_order === task.sort_order + 1
    )

    return true
  }

  const deleteMainTask = async () => {
    try {
      setIsLoading(true)
      await api(
        deleteTaskTempalteUrl(id!),
        HttpMethods.Delete,
        null,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        false
      )

      setIsLoading(false)
      navigate("/tasks/templates")
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  const stateValue: TaskTemplateState = {
    error,
    isLoading,
    timeUnits,
    rootTask,
    sortOrder,
    selectedTask,
    setSelectedProjectTaskCb,
    addNewTask,
    updateTask,
    saveTemplate,
    deleteTask,
    canOrderUp,
    canOrderDown,
    users,
    autofillTemplates,
    deleteMainTask,
  }

  return (
    <TaskTemplateContext.Provider value={stateValue}>
      {props.children}
    </TaskTemplateContext.Provider>
  )
}
