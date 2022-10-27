import {
  BlockedBy,
  MainTaskTemplate,
  MainTaskTemplateWithoutChildren,
} from "../api/TaskTemplateApi"

export function getNewBlockedByValues(
  children: MainTaskTemplate[],
  selectedTaskId: number
): BlockedBy[] {
  function flattenTree(
    tasksParam: MainTaskTemplate[],
    flatTree: MainTaskTemplateWithoutChildren[]
  ) {
    tasksParam.forEach((element) => {
      flatTree.push({
        id: element.id,
        estimated_time: element.estimated_time,
        time_unit_id: element.time_unit_id,
        sort_order: element.sort_order,
        task_name: element.task_name,
        task_code: element.task_code,
        description: element.description,
        parent: element.parent,
        blocked_by: element.blocked_by ?? [],
      })
      flattenTree(element.children ?? [], flatTree)
    })
  } // TODO: remove children from task

  const flatTree: MainTaskTemplateWithoutChildren[] = []
  flattenTree(children, flatTree)

  const filtered = flatTree
    .filter((item) => item.id !== null || item.id !== undefined)
    .filter((item) => item.id !== selectedTaskId)
    .filter((item) => {
      return !item.blocked_by.map((i) => i.id).includes(selectedTaskId ?? -1)
    })
    .filter((item) => item.parent !== selectedTaskId)

  return filtered.map<BlockedBy>((item) => {
    return {
      id: item.id,
      task_name: item.task_name,
    }
  })
}
