import { useContext, createContext, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { v4 } from "uuid"
import { api, HttpMethods } from "../api/ApiControllers"
import {
  saveProjectAsDraftUrl,
  EditProjectTasksInitInterface,
  editProjectTasksUrl,
  ProjectInterfaceWithoutTree,
  saveProjectAsStartUrl,
  AutofillTemplate,
  InitQuery,
  RescheduleInterface,
  RequestedRescheduleInterface,
  ProjectTaskPredecessor,
  ProjectTaskChangeEvent,
} from "../api/ProjectApi"
import {
  getMainTempUrl,
  MainTaskTemplate,
  MainTaskTemplateMinified,
  MainTaskTemplateWithTimeUnits,
  TimeUnit,
} from "../api/TaskTemplateApi"
import { MinifiedUser } from "../api/UsersApi"
import {
  getLargestNum,
  getNextSortOrder,
  isTaskLastElement,
  sortProjectTasks,
  sortProjectTasksWithReturn,
} from "../utils/projectUtils"
import { AuthContext } from "./AuthContext"
import qs from "qs"

export interface ContextTask {
  id: number
  fake_id?: string
  task_name: string
  task_code?: string
  estimated_time: number
  time_unit_id: number
  description?: string
  assigned_to?: string
  assigned_to_user_code?: string
  sort_order: number
  task_status_id?: number
  task_progress_id?: number
  parent?: number
  children: ContextTask[]
  planned_start_date?: number
  planned_end_date?: number
  actual_start_date?: number
  actual_end_date?: number
  parent_fake_id?: string
  reschedule?: RescheduleInterface
  predecessor?: ProjectTaskPredecessor
}

export interface EditTasksScreenState {
  // interface data
  error: string | null
  isLoading: boolean

  // metadata
  users: MinifiedUser[] | null
  timeUnits: TimeUnit[] | null
  minifiedTemplates: MainTaskTemplateMinified[] | null

  // project data
  project: ProjectInterfaceWithoutTree | null
  taskTree: ContextTask | null

  // template
  template: MainTaskTemplate | null
  showingTemplate: boolean

  // autofill
  autofillTemplates: AutofillTemplate[]

  // utils
  sortOrder(oldIndex: number, newIndex: number, parent: ContextTask): void

  // updates
  selectTemplate: () => Promise<void>
  resetTempSelection: () => void
  selectedTemplateId: string | null
  setSelectedTemplateId: (value: string | null) => void
  selectedProjectTask: ContextTask | null
  setSelectedProjectTaskCb: (task: ContextTask | null) => void
  addNewTask: (task: ContextTask) => void
  updateTask: (
    task: ContextTask,
    parentTask: ContextTask,
    event: ProjectTaskChangeEvent
  ) => void
  // updateTaskTreeInit: (task: ContextTask, rerender: boolean) => void
  pickTemplate: () => void
  saveDraft: () => Promise<void>
  startProject: () => Promise<void>
  isProjectReadyToStart(): boolean
  canDeleteTask: (task: ContextTask) => boolean
  deleteTask(task: ContextTask, parent: ContextTask): void
  canOrderUp(task: ContextTask, parent: ContextTask): boolean
  canOrderDown(task: ContextTask, parent: ContextTask): boolean
  acceptRescheduleStart(
    task: ContextTask,
    parentTask: ContextTask,
    schedule: RequestedRescheduleInterface
  ): void
  declineRescheduleStart(schedule: RequestedRescheduleInterface): void
  acceptRescheduleEnd(
    task: ContextTask,
    parentTask: ContextTask,
    schedule: RequestedRescheduleInterface
  ): void
  declineRescheduleEnd(schedule: RequestedRescheduleInterface): void
  getAvailablePredecessors(
    task: ContextTask,
    parent: ContextTask
  ): ProjectTaskPredecessor[]
}

export const EditTasksScreenContext =
  createContext<EditTasksScreenState | null>(null)

export default function EditTasksScreenContextProvider({
  children,
}: {
  children: JSX.Element
}) {
  const { id } = useParams()
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()
  const query: InitQuery = qs.parse(window.location.search.replace("?", ""))

  useEffect(() => {
    setIsLoading(true)
    api<EditProjectTasksInitInterface>(
      editProjectTasksUrl(id!, query),
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` }
    )
      .then((data) => {
        setProject(data!.project)

        // task tree
        const tree = Object.assign({}, data!.project.task_tree)
        sortProjectTasks(tree.children)
        setTaskTree(Object.assign({}, tree))
        //updateTaskTreeInit(tree)

        setSelectedProjectTask(tree)
        setUsers(data!.users)
        setMinifiedTemplates(data!.templates)
        setTimeUnits(data!.time_units)
        setIsLoading(false)
        setError(null)
        setAutofillTemplates(data!.autofill_templates)
        console.log(data!.autofill_templates)
      })
      .catch((e) => {
        setError(e.message)
        setMinifiedTemplates(null)
        setProject(null)
        setIsLoading(false)
        setUsers(null)
      })
  }, [])

  // state
  const [showingTemplate, setShowingTemplate] = useState(false)
  const [taskTree, setTaskTree] = useState<ContextTask | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  )
  const [minifiedTemplates, setMinifiedTemplates] = useState<
    MainTaskTemplateMinified[] | null
  >(null)
  const [users, setUsers] = useState<MinifiedUser[] | null>(null)
  const [project, setProject] = useState<ProjectInterfaceWithoutTree | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeUnits, setTimeUnits] = useState<TimeUnit[] | null>(null)
  const [selectedProjectTask, setSelectedProjectTask] =
    useState<ContextTask | null>(null)
  const [template, setTemplate] = useState<MainTaskTemplate | null>(null)
  const [autofillTemplates, setAutofillTemplates] = useState<
    AutofillTemplate[]
  >([])
  // TODO: remove pred from flat tree to avoid loops
  // callbacks
  const resetTempSelection = () => {
    setSelectedTemplateId(null)
    setTemplate(null)
    setShowingTemplate(false)
  }
  const selectTemplate = async () => {
    if (selectedTemplateId) {
      try {
        setIsLoading(true)
        const res = await api<MainTaskTemplateWithTimeUnits>(
          getMainTempUrl(selectedTemplateId, false),
          HttpMethods.Get,
          null,
          { Authorization: `Bearer ${user?.tokenStr}` },
          undefined,
          true
        )

        setIsLoading(false)

        if (res) {
          setTemplate(res.task)
          setShowingTemplate(true)
        }
      } catch (e: any) {
        setIsLoading(false)
      }
    }
  }

  const addNewTask = (task: ContextTask) => {
    let projAdd: ContextTask

    if (selectedProjectTask) {
      projAdd = selectedProjectTask
    } else {
      projAdd = taskTree!
    }

    task.parent = projAdd.id
    task.sort_order = getNextSortOrder(
      projAdd.children.map((e) => e.sort_order) ?? []
    )
    task.fake_id = v4()

    projAdd.children.push(task)
    sortProjectTasksWithReturn(projAdd.children)

    setTaskTree(Object.assign({}, taskTree))
  }
  const updateTask = (
    task: ContextTask,
    parentTask: ContextTask,
    event: ProjectTaskChangeEvent
  ) => {
    switch (event) {
      case ProjectTaskChangeEvent.ChangeStart: {
        changeStartDateAndCascade(task, parentTask)
        break
      }

      case ProjectTaskChangeEvent.ChangeEnd: {
        changeEndDateAndCascade(task, parentTask)
        break
      }
      case ProjectTaskChangeEvent.ChangeTime: {
        changeStartDateAndCascade(task, parentTask)
        break
      }

      default: {
        break
      }
    }

    // TODO: Update all pred tasks
    const flatTree: ContextTask[] = []
    getFlatTaskTreeWithParents(taskTree!, flatTree)
    const depTasks: { task: ContextTask; parent: ContextTask }[] = flatTree
      .filter((i) => {
        if (i.predecessor) {
          if (i.predecessor.fake_id) {
            return i.predecessor.fake_id === task.fake_id
          } else {
            return i.predecessor.id === task.id
          }
        } else {
          return false
        }
      })
      .map((i) => {
        return {
          task: i,
          parent: flatTree.find((t) => {
            if (i.parent_fake_id) {
              return t.fake_id === i.parent_fake_id
            } else {
              return t.id === i.parent
            }
          })!,
        }
      })

    depTasks.forEach((i) => {
      i.task.planned_start_date = task.planned_end_date
      updateTask(i.task, i.parent, ProjectTaskChangeEvent.ChangeStart)
    })

    updateFirstNodeTasks()
    setTaskTree(Object.assign({}, taskTree))
  }
  const setSelectedProjectTaskCb = (task: ContextTask | null) => {
    if (
      selectedProjectTask?.id === task?.id &&
      selectedProjectTask?.fake_id === task?.fake_id
    ) {
      setSelectedProjectTask(taskTree)
    } else {
      setSelectedProjectTask(task)
    }
  }

  //! Rewriting the update task and cascading ////////////////////////////////////////////////////////////////////

  function getMillisecondsFromTimeUnitId(id: number) {
    return timeUnits!.find((i) => i.id === id)!.milliseconds
  }

  function updatePlannedEndFromPlannedStart(
    task: ContextTask,
    plannedStart: number
  ) {
    // getting the processing time needed minus one day
    const processingPeriod =
      getMillisecondsFromTimeUnitId(task.time_unit_id) * task.estimated_time // - (86400000/2)

    task.planned_start_date = plannedStart
    task.planned_end_date = plannedStart + processingPeriod
  }

  function updateFirstNodeTaskDatesWithNoChildren(task: ContextTask) {
    const pred = getPredecessorRef(task)
    if (pred && pred.planned_end_date) {
      //here paul
        if(pred.planned_end_date > task.planned_start_date! ){
        updatePlannedEndFromPlannedStart(task, pred.planned_end_date)

        }   
    } else {
      // Update end to start if there is no pred
      if (task.planned_start_date) {
       updatePlannedEndFromPlannedStart(task, task.planned_start_date)
      }
    }
  }

  function updateFirstNodeTaskDatesWithChildren(task: ContextTask) {
    // TODO: update estimated time
    // should update parent node to get the start from sort order 1 and end from sort order n
    const sortOrderOne = task.children.find((i) => i.sort_order === 1)

    // Getting the largest sort
    const largestSortOrder = getLargestNum(
      task.children.map((i) => i.sort_order)
    )
    const sortOrderLast = task.children.find(
      (i) => i.sort_order === largestSortOrder
    )

    if (sortOrderOne && sortOrderOne.planned_start_date) {
      task.planned_start_date = sortOrderOne.planned_start_date
    }

    if (sortOrderLast && sortOrderLast?.planned_end_date) {
      task.planned_end_date = sortOrderLast.planned_end_date
    }

    // TODO: Test
    // calc the diff
    const startDate = task.planned_start_date
    const endDate = task.planned_end_date

    if (startDate && endDate) {
      const diff = endDate - startDate

      if (diff > 0) {
        task.time_unit_id = 3
        task.estimated_time = Math.floor(diff / 86400000 + 1) // one day in mill
      }
    }

    // sort and reorder
    sortProjectTasksWithReturn(task.children)
  }

  const updateFirstNodeTasks = () => {
    // TODO: Update time unit and estimated time for task with children
    taskTree?.children?.forEach((nodeOneChild) => {
      if (nodeOneChild.children.length === 0) {
        updateFirstNodeTaskDatesWithNoChildren(nodeOneChild)
      } else {
        updateFirstNodeTaskDatesWithChildren(nodeOneChild)
      }
    })
  }

  function cascade(task: ContextTask, parentTask: ContextTask) {
    if (parentTask.parent) {
      // second node task
      // update tasks with sort order + 1
      let nextSort = task.sort_order + 1
      const sortOrderLimit = getLargestNum(
        parentTask.children.map((i) => i.sort_order)
      )

      while (nextSort <= sortOrderLimit) {
        const taskToUpdate = parentTask.children.find(
          (i) => i.sort_order === nextSort
        )

        if (taskToUpdate) {
          if (!taskToUpdate.predecessor) {
            const prev = parentTask.children.find(
              (i) => i.sort_order === nextSort - 1
            )
            if (prev && prev.planned_end_date) {
              taskToUpdate.planned_start_date = prev.planned_end_date
              updatePlannedEndFromPlannedStart(
                taskToUpdate,
                prev.planned_end_date
              )
            }
          } else {
            const pred = getPredecessorRef(taskToUpdate)

            if (pred && pred.planned_end_date) {
              updatePlannedEndFromPlannedStart(
                taskToUpdate,
                pred.planned_end_date
              )
            }
          }
        }
        nextSort++
      }

      // update the dates for the parent
      // updateFirstNodeTaskDatesWithChildren(parentTask)
    } else {
      // updateFirstNodeTaskDatesWithNoChildren(task)
    }
  }

  function getPredecessorRef(task: ContextTask) {
    const flatTree: ContextTask[] = []
    getFlatTaskTree(taskTree!, flatTree)

    let pred: ContextTask | undefined

    if (task.predecessor !== undefined) {
      if (task.predecessor.fake_id) {
        pred = flatTree.find((i) => i.fake_id === task.predecessor?.fake_id)
      } else {
        pred = flatTree.find((i) => i.id === task.predecessor?.id)
      }
    }

    return pred
  }

  function changeStartDateAndCascade(
    task: ContextTask,
    parentTask: ContextTask
  ) {
    if (task.planned_start_date) {
      
      updatePlannedEndFromPlannedStart(task, task.planned_start_date)
      cascade(task, parentTask)
    }
  }

  function changeEndDateAndCascade(task: ContextTask, parentTask: ContextTask) {
    // calc the diff
    const startDate = task.planned_start_date
    const endDate = task.planned_end_date

    if (startDate && endDate) {
      const diff = endDate - startDate

      if (diff > 0) {
        task.time_unit_id = 3
        task.estimated_time = Math.floor(diff / 86400000 + 1) // one day in mill
        cascade(task, parentTask)
      }
    }
  }

  //! End of the update task and cascading ////////////////////////////////////////////////////////////////////

  const pickTemplate = () => {
    function getContextTasks(
      tasks: MainTaskTemplate[],
      parent: string
    ): ContextTask[] {
      return tasks.map((task) => {
        const id = v4()
        return {
          id: -1,
          fake_id: id,
          task_name: task.task_name,
          task_code: task.task_code,
          estimated_time: task.estimated_time,
          time_unit_id: task.time_unit_id,
          description: task.description,
          parent: -1,
          parent_fake_id: parent,
          sort_order: task.sort_order,
          children: getContextTasks(task.children, id),
          assigned_to_user_code: task.default_assigned_to,
        }
      })
    }

    if (template) {
      const id = v4()
      const newTasks: ContextTask = {
        id: -1,
        estimated_time: template.estimated_time,
        task_name: template.task_name,
        task_code: template.task_code,
        time_unit_id: template.time_unit_id,
        fake_id: id,
        description: template.description,
        sort_order: template.sort_order,
        children: getContextTasks(template.children, id),
      }

      //updateTask(newTasks) // TODO: Task tree sorting
      setTaskTree(Object.assign({}, newTasks))
      setSelectedProjectTask(null)
      resetTempSelection()
    }
  }

  const sortOrder = (
    oldIndex: number,
    newIndex: number,
    parent: ContextTask
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

      setTaskTree(Object.assign({}, taskTree))
    }
  }

  const saveDraft = async () => {
    try {
      setIsLoading(true)
      await api<MainTaskTemplateWithTimeUnits>(
        saveProjectAsDraftUrl(id!),
        HttpMethods.Post,
        taskTree,
        { Authorization: `Bearer ${user?.tokenStr}` },
        undefined,
        false
      )

      setIsLoading(false)

      navigate("/projects")
    } catch (e: any) {
      setIsLoading(false)
    }
  }

  const startProject = async () => {
    try {
      setIsLoading(true)
      await api(
        saveProjectAsStartUrl(id!),
        HttpMethods.Post,
        taskTree,
        { Authorization: `Bearer ${user?.tokenStr}` },
        undefined,
        false
      )

      setIsLoading(false)

      navigate(`/projects/${id}`)
    } catch (e: any) {
      setIsLoading(false)
    }
  }

  function isProjectReadyToStart(): boolean {
    if (taskTree && taskTree.children && taskTree.children.length > 0) {
      const value = { value: true }
      taskTree.children.forEach((c) => checkTasksIfReadyRecursively(c, value))

      return value.value
    } else {
      return false
    }
  }

  function checkTasksIfReadyRecursively(
    task: ContextTask,
    value: { value: boolean }
  ) {
    if (task.children.length === 0) {
      if (
        task.assigned_to_user_code === undefined ||
        task.assigned_to_user_code === null ||
        task.planned_start_date === undefined ||
        task.planned_start_date === null ||
        task.planned_end_date === undefined ||
        task.planned_end_date === null
      ) {
        value.value = false
      }
    } else {
      if (
        task.planned_start_date === undefined ||
        task.planned_start_date === null ||
        task.planned_end_date === undefined ||
        task.planned_end_date === null
      ) {
        value.value = false
      }
    }

    task.children.forEach((child) => checkTasksIfReadyRecursively(child, value))
  }

  function canDeleteTask(task: ContextTask): boolean {
    if (project?.is_draft) {
      return true
    }

    if (task.actual_start_date) {
      return false
    }

    return true
  }

  function deleteTask(task: ContextTask, parent: ContextTask) {
    if (parent.children.includes(task)) {
      parent.children = parent.children.filter((i) => i !== task)
      setTaskTree(Object.assign({}, taskTree))
    }
  }

  const canOrderUp = (task: ContextTask, parent: ContextTask) => {
    if (task.actual_start_date) {
      return false
    }

    const prev = parent.children.find(
      (i) => i.sort_order === task.sort_order - 1
    )

    if (prev && prev.actual_start_date) {
      return false
    }

    return true
  }

  const canOrderDown = (task: ContextTask, parent: ContextTask) => {
    if (task.actual_start_date) {
      return false
    }

    const next = parent.children.find(
      (i) => i.sort_order === task.sort_order + 1
    )

    if (next && next.actual_start_date) {
      return false
    }

    return true
  }

  const acceptRescheduleStart = (
    task: ContextTask,
    parentTask: ContextTask,
    schedule: RequestedRescheduleInterface
  ) => {
    task.planned_start_date = schedule.requested_date
    schedule.is_confirmed = true
    updateTask(task, parentTask, ProjectTaskChangeEvent.ChangeStart)
  }

  const declineRescheduleStart = (schedule: RequestedRescheduleInterface) => {
    schedule.is_confirmed = false
    setTaskTree(Object.assign({}, taskTree))
  }

  const acceptRescheduleEnd = (
    task: ContextTask,
    parentTask: ContextTask,
    schedule: RequestedRescheduleInterface
  ) => {
    task.planned_end_date = schedule.requested_date
    schedule.is_confirmed = true
    //! in case of a negative diff the reschedule is accepted bu never updated
    updateTask(task, parentTask, ProjectTaskChangeEvent.ChangeEnd)
  }

  const declineRescheduleEnd = (schedule: RequestedRescheduleInterface) => {
    schedule.is_confirmed = false
    // updateTask(taskTree!)
    setTaskTree(Object.assign({}, taskTree))
  }

  function getFlatTaskTree(task: ContextTask, tasks: ContextTask[]) {
    if (task.children.length === 0) {
      tasks.push(task)
    } else {
      task.children.forEach((t) => getFlatTaskTree(t, tasks))
    }
  }

  function getFlatTaskTreeWithParents(task: ContextTask, tasks: ContextTask[]) {
    tasks.push(task)
    task.children.forEach((t) => getFlatTaskTreeWithParents(t, tasks))
  }

  function getAvailablePredecessors(
    task: ContextTask,
    parent: ContextTask
  ): ProjectTaskPredecessor[] {
    const tasksList: ContextTask[] = []
    taskTree?.children.forEach((t) => getFlatTaskTree(t, tasksList))

    const availableTasks: ProjectTaskPredecessor[] = tasksList.filter(
      (t) =>
        (!parent.parent || !parent.children.includes(t)) &&
        t !== task &&
        (t.predecessor?.fake_id ?? t.predecessor?.id) !==
          (task.fake_id ?? task.id)
    )

    if (availableTasks.length > 0) {
      availableTasks.unshift({
        id: -100,
        task_name: "None",
        time_unit_id: 1,
        estimated_time: 1,
        sort_order: 1,
      })
    }

    return availableTasks
  }

  const value: EditTasksScreenState = {
    users,
    error,
    isLoading,
    minifiedTemplates: minifiedTemplates,
    project,
    showingTemplate,
    selectTemplate,
    resetTempSelection,
    selectedTemplateId,
    setSelectedTemplateId,
    selectedProjectTask,
    setSelectedProjectTaskCb,
    timeUnits,
    addNewTask,
    updateTask,
    template,
    pickTemplate,
    taskTree,
    sortOrder,
    saveDraft,
    startProject,
    isProjectReadyToStart,
    canDeleteTask,
    deleteTask,
    canOrderUp,
    canOrderDown,
    autofillTemplates,
    acceptRescheduleStart,
    declineRescheduleStart,
    acceptRescheduleEnd,
    declineRescheduleEnd,
    getAvailablePredecessors,
  }

  return (
    <EditTasksScreenContext.Provider value={value}>
      {children}
    </EditTasksScreenContext.Provider>
  )
}
