import { AssignedTaskinterface } from "../api/AssignedTasksApi"
import { ProjectTaskInterface, TaskStatusInterface } from "../api/ProjectApi"
import { AssignedTaskPreviewInterface } from "../api/ProjectPreviewApi"
import { ContextTask } from "../contexts/EditTaskScreenContext"

export function getLargestNum(arr: number[]) {
  if (arr.length === 0) return 0
  let largest = arr[0]

  for (let i = 0; i < arr.length; i++) {
    if (largest < arr[i]) {
      largest = arr[i]
    }
  }
  return largest
}

export function getNextSortOrder(arr: number[]) {
  return getLargestNum(arr) + 1
}

export function sortProjectTasks(tasks: ContextTask[]) {
  tasks = tasks.sort((a, b) => a.sort_order - b.sort_order)
  tasks.forEach((t) => sortProjectTasks(t.children))
}

export function sortProjectTasksWithReturn(tasks: ContextTask[]) {
  tasks = tasks.sort((a, b) => a.sort_order - b.sort_order)
}

export function isTaskFirstElement(task: ContextTask, parent: ContextTask) {
  let isFirst = true
  if (parent.children.includes(task)) {
    for (let e of parent.children) {
      if (e.sort_order < task.sort_order) {
        isFirst = false
        break
      }
    }
  } else {
    isFirst = false
  }
  return isFirst
}

export function isTaskLastElement(task: ContextTask, parent: ContextTask) {
  let isLast = true
  if (parent.children.includes(task)) {
    for (let e of parent.children) {
      if (e.sort_order > task.sort_order) {
        isLast = false
        break
      }
    }
  } else {
    isLast = false
  }
  return isLast
}

export function isTaskInProgress(
  task: AssignedTaskinterface | AssignedTaskPreviewInterface,
  status: TaskStatusInterface[]
) {
  const start = status.find((e) => e.is_start)
  const end = status.find((e) => e.is_final)

  if (start && end) {
    return task.task_status_id !== start.id || task.task_status_id !== end.id
  }

  return false
}

export function isTaskInPending(
  task: AssignedTaskinterface | AssignedTaskPreviewInterface,
  status: TaskStatusInterface[]
) {
  const start = status.find((e) => e.is_start)

  if (start) {
    return task.task_status_id === start.id
  }

  return false
}

export function isTaskComplete(
  task: AssignedTaskinterface | AssignedTaskPreviewInterface,
  status: TaskStatusInterface[]
) {
  const end = status.find((e) => e.is_final)

  if (end) {
    return task.task_status_id === end.id
  }

  return false
}

export function isTaskCompleteOrPending(
  task: AssignedTaskinterface | AssignedTaskPreviewInterface,
  status: TaskStatusInterface[]
) {
  return isTaskInPending(task, status) || isTaskComplete(task, status)
}
