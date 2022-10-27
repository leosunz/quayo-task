import { useTheme, styled } from "@mui/material"
import { Typography, Divider, List, ListItem } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import {
  getProjectsUrl,
  MinifiedProject,
  ProjectTaskInterface,
  ProjectWithMetaDataInterface,
} from "../api/ProjectApi"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import {
  InputContainer,
  ScreenContainer,
  StyledInputContainer,
} from "../components/StyledComponents"
import { AuthContext } from "../contexts/AuthContext"
import { ReportsLeftPanel, ReportsRightPanel } from "./TasksByEmployeeScreen"
import noselected from "../images/no_task_selected.png"
import { getGanttInitUrl } from "../api/GanttApi"
import { api, HttpMethods } from "../api/ApiControllers"
import { Gantt, Task, ViewMode } from "../external_libs"
import InlinePill from "../components/InlinePill"
import { getDayFromDate } from "../utils/formatters"

const GanttGrid = styled("div")(({ theme }) => {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: theme.spacing(1),
    gridTemplateRows: "1fr 2fr",
  }
})

export default function GanttScreen() {
  const { user } = useContext(AuthContext)!

  const theme = useTheme()
  // users list state
  const [projects, setProjects] = useState<MinifiedProject[] | null>(null)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // tasks list state
  const [project, setProject] = useState<ProjectWithMetaDataInterface | null>(
    null
  )
  const [isProjectLoading, setProjectLoading] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  )
  const [projectError, setProjectError] = useState<string | null>(null)

  // use effect

  useEffect(() => {
    setError(null)
    setIsPageLoading(true)
    api<MinifiedProject[]>(
      getGanttInitUrl,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setProjects(data!)
        setError(null)
        setIsPageLoading(false)
      })
      .catch((e: any) => {
        setIsPageLoading(false)
        setError(e.message)
      })
  }, [])

  useEffect(() => {
    if (selectedProjectId) {
      setProjectError(null)
      setProjectLoading(true)
      api<ProjectWithMetaDataInterface>(
        getProjectsUrl(selectedProjectId),
        HttpMethods.Get,
        null,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
        .then((data) => {
          setProject(data!)
          setProjectLoading(false)
          console.log(data)
        })
        .catch((e: any) => {
          setProjectLoading(false)
          setProjectError(e.message)
        })
    }
  }, [selectedProjectId])

  let tasks: Task[] = [
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 1, 2),
      name: "Idea",
      id: "Task 0",
      type: "task", // TODO: Check Project types
      progress: 45,
      isDisabled: true,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" },
    },
  ]

  function getFlatTree() {
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

    return flatTree
  }

  function getTasks(): Task[] {
    function convertProjectTaskToTask(
      task: ProjectTaskInterface,
      dependencies?: string[]
    ): Task {
      return {
        type: "task",
        id: task.id.toString(),
        start: new Date(task.planned_start_date!),
        end: new Date(task.planned_end_date!),
        name: task.task_name,
        progress: task.task_progress,
        dependencies,
      }
    }

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

    const buildTasksRecusrively = (
      task: ProjectTaskInterface,
      tasks: Task[]
    ) => {
      if (task.children.length === 0) {
        if (task.parent) {
          const taskParent = flatTree.find((i) => i.parent === task.parent)

          if (taskParent) {
            const dep: string[] = []
            if (taskParent.parent) {
              // second node task
              if (task.sort_order !== 1) {
                // pred
                const predTask = flatTree.find(
                  (i) =>
                    i.parent === task.parent &&
                    i.sort_order === task.sort_order - 1
                )

                if (predTask) {
                  dep.push(predTask.id.toString())
                }
              }
            }

            // predecessor
            if (task.predecessor) {
              dep.push(task.predecessor.id.toString())
            }

            const t = convertProjectTaskToTask(task, dep)
            tasks.push(t)
          }
        }
      }
    }

    const newTasks: Task[] = []
    flatTree.forEach((i) => buildTasksRecusrively(i, newTasks))

    return newTasks
  }

  function getGanttHeight() {
    const mainHeight = document.getElementById("gantt-container")?.clientHeight

    if (mainHeight) {
      return mainHeight - 200
    }
  }

  return (
    <ScreenContainer
      style={{ overflowY: "hidden", width: "100%", height: "100%" }}
      isDataLoaded={!isPageLoading && !error}
    >
      {isPageLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isPageLoading && !error && projects && (
        <GanttGrid
          style={{ overflow: "hidden", width: "100%", height: "100%" }}
        >
          <ReportsLeftPanel delmarginright>
            <Typography
              style={{ margin: theme.spacing(1) }}
              variant="h5"
              gutterBottom
            >
              Projects
            </Typography>
            <Divider style={{ margin: theme.spacing(1) }} />
            <List>
              {projects.map((item) => (
                <ListItem
                  button
                  onClick={() => setSelectedProjectId(item.id)}
                  key={item.user_code}
                >
                  <Typography variant="h6">
                    {item.id}
                    {item.title.length > 0 && ` - ${item.title}`}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </ReportsLeftPanel>
          <ReportsRightPanel center={selectedProjectId === null} delmarginleft>
            {!selectedProjectId && (
              <>
                <img src={noselected} width={200} />
                <Typography
                  style={{ marginTop: theme.spacing(2) }}
                  variant="h5"
                >
                  No Selected Project
                </Typography>
              </>
            )}
            {isProjectLoading && <Loading text="Getting Project" />}
            {projectError && <ErrorComponent text={projectError} />}
            {!isProjectLoading && !projectError && project && (
              <>
                <Typography
                  style={{ margin: theme.spacing(1) }}
                  variant="h5"
                  gutterBottom
                >
                  Info
                </Typography>
                <Divider style={{ margin: theme.spacing(1) }} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                  }}
                >
                  <InlinePill title="Title" value={project.project.title} />
                  <InlinePill
                    title="Client"
                    value={project.project.client.description}
                  />
                  <InlinePill
                    title="Client"
                    value={project.project.client.description}
                  />
                  <InlinePill
                    title="Order Number"
                    value={project.project.id.toString()}
                  />

                  <InlinePill
                    title="Project Owner"
                    value={project.project.user.description ?? "N/A"}
                  />

                  <InlinePill
                    title="Expected Delivery"
                    value={getDayFromDate(
                      new Date(project.project.estimated_delivery!)
                    )}
                  />
                  <InlinePill
                    title="No. of Tasks"
                    value={getFlatTree()
                      .filter((i) => i.children.length === 0)
                      .length.toString()}
                  />
                </div>
              </>
            )}
          </ReportsRightPanel>
          <ReportsRightPanel
            delmarginleft
            id="gantt-container"
            style={{ gridColumn: "1 / span 2" }}
            center={selectedProjectId === null}
          >
            {!selectedProjectId && (
              <>
                <img src={noselected} width={260} />
                <Typography
                  style={{ marginTop: theme.spacing(2) }}
                  variant="h5"
                >
                  No Selected Project
                </Typography>
              </>
            )}
            {isProjectLoading && <Loading text="Getting Project" />}
            {projectError && <ErrorComponent text={projectError} />}
            {!isProjectLoading && !projectError && project && (
              <>
                <Typography style={{ margin: theme.spacing(1) }} variant="h5">
                  Gantt Chart For Project &nbsp;
                  <span style={{ color: theme.palette.success.main }}>
                    {projects.find((i) => i.id === selectedProjectId)?.title}
                  </span>
                </Typography>
                <Gantt
                  tasks={getTasks()}
                  viewMode={ViewMode.Day}
                  ganttHeight={getGanttHeight()}
                  barBackgroundColor={theme.palette.primary.main}
                />
              </>
            )}
          </ReportsRightPanel>
        </GanttGrid>
      )}
    </ScreenContainer>
  )
}
