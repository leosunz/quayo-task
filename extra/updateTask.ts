    // // TODO: task to follow pred dates
    // function getEstimatedTime(task: ContextTask): number {
    //     const map = task.children.map((t) => {
    //       return (
    //         t.estimated_time *
    //         timeUnits!.find((i) => i.id === t.time_unit_id)!.milliseconds
    //       )
    //     })
  
    //     return map.reduce((prev, curr) => prev + curr)
    //   }
  
    //   function updateEstimatedTimes(task: ContextTask) {
    //     if (task.children.length > 0) {
    //       task.time_unit_id = 3
    //       const newTime = getEstimatedTime(task)
    //       task.estimated_time = newTime / 86400000 // one day in mill
    //       //task.children.forEach((t) => updateEstimatedTimes(t))
    //     }
    //   }
  
    //   function updateStartToEndSortLastNode(task1: ContextTask) {
    //     const flatTree: ContextTask[] = []
    //     getFlatTaskTree(taskTree!, flatTree)
  
    //     task1.children.forEach((child) => {
    //       if (child.sort_order === 1) {
    //         if (child.predecessor) {
    //           let pred: ContextTask | undefined
  
    //           if (child.predecessor.fake_id) {
    //             pred = flatTree.find(
    //               (i) => i.fake_id === child.predecessor?.fake_id
    //             )
    //           } else {
    //             pred = flatTree.find((i) => i.id === child.id)
    //           }
  
    //           if (pred && pred.planned_end_date) {
    //             const newStart = pred.planned_end_date + 86400000
    //             child.planned_start_date = newStart
    //           }
    //         }
    //         if (child.planned_start_date) {
    //           const timeUnit = timeUnits?.find((t) => t.id === child.time_unit_id)
  
    //           if (timeUnit) {
    //             const mil =
    //               timeUnit.milliseconds *
    //               (child.estimated_time === 0
    //                 ? child.estimated_time
    //                 : child.estimated_time - 1)
    //             const estimatedEnd = child.planned_start_date + mil
  
    //             child.planned_end_date = estimatedEnd
    //           }
    //         }
    //       } else {
    //         const prev = task1.children.find(
    //           (i) => i.sort_order === child.sort_order - 1
    //         )
    //         if (prev && prev.planned_end_date) {
    //           let newStart = 0
  
    //           if (child.predecessor) {
    //             let pred: ContextTask | undefined
  
    //             if (child.predecessor.fake_id) {
    //               pred = flatTree.find(
    //                 (i) => i.fake_id === child.predecessor?.fake_id
    //               )
    //             } else {
    //               pred = flatTree.find((i) => i.id === child.predecessor?.id)
    //             }
  
    //             if (pred && pred.planned_end_date) {
    //               newStart = pred.planned_end_date + 86400000
    //             }
    //           } else {
    //             newStart = prev.planned_end_date + 86400000
    //           }
  
    //           child.planned_start_date = newStart
  
    //           const timeUnit = timeUnits?.find((t) => t.id === child.time_unit_id)
  
    //           if (timeUnit) {
    //             const mil =
    //               timeUnit.milliseconds *
    //               (child.estimated_time === 0
    //                 ? child.estimated_time
    //                 : child.estimated_time - 1)
    //             const estimatedEnd = child.planned_start_date + mil
  
    //             child.planned_end_date = estimatedEnd
    //           }
    //         }
    //       }
    //     })
  
    //     // if no children
    //     if (task1.children.length === 0) {
    //       if (task1.predecessor) {
    //         let pred: ContextTask | undefined
  
    //         if (task1.predecessor.fake_id) {
    //           pred = flatTree.find(
    //             (i) => i.fake_id === task1.predecessor?.fake_id
    //           )
    //         } else {
    //           pred = flatTree.find((i) => i.id === task1.id)
    //         }
  
    //         if (pred && pred.planned_end_date) {
    //           const newStart = pred.planned_end_date + 86400000
    //           task1.planned_start_date = newStart
    //         }
    //       }
  
    //       if (task1.planned_start_date) {
    //         const timeUnit = timeUnits?.find((t) => t.id === task1.time_unit_id)
  
    //         if (timeUnit) {
    //           const mil =
    //             timeUnit.milliseconds *
    //             (task1.estimated_time === 0
    //               ? task1.estimated_time
    //               : task1.estimated_time - 1)
    //           const estimatedEnd = task1.planned_start_date + mil
  
    //           task1.planned_end_date = estimatedEnd
    //         }
    //       }
    //     }
    //   }
  
    //   function updateSecondTreeStartEnd(t: ContextTask) {
    //     // get the child's start
    //     const start = t.children.find(
    //       (i) => i.sort_order === 1
    //     )?.planned_start_date
  
    //     // get the end
    //     let end: ContextTask | undefined
    //     for (let forTask of t.children) {
    //       if (isTaskLastElement(forTask, t)) {
    //         end = forTask
    //         break
    //       }
    //     }
  
    //     if (start && end) {
    //       t.planned_start_date = start
    //       t.planned_end_date = end.planned_end_date
    //     }
    //   }
  
    //   if (newTree) {
    //     // skipping first node
    //     newTree.children.forEach((task) => {
    //       updateEstimatedTimes(task)
    //     })
  
    //     newTree.children.forEach((task) => {
    //       updateStartToEndSortLastNode(task)
    //     })
  
    //     newTree.children.forEach((task) => {
    //       updateSecondTreeStartEnd(task)
    //     })
    //   }
  
    //   setTaskTree(Object.assign({}, newTree))