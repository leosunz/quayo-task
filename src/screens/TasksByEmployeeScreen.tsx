import { useContext, useEffect, useState } from "react"
import {
  getTaskByEmployeeInitUrl,
  getTaskByEmployeeUrl,
  ITaskByEmployee,
} from "../api/TasksByEmployeeApi"
import { MinifiedUser } from "../api/UsersApi"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import { ScreenContainer } from "../components/StyledComponents"
import { api, HttpMethods } from "../api/ApiControllers"
import { AuthContext } from "../contexts/AuthContext"
import { styled } from "@mui/material/styles"
import {
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
  useTheme,
} from "@mui/material"
import noselected from "../images/no_task_selected.png"
import { getDayFromDate } from "../utils/formatters"

export const ReportsMainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  }
})

export const ReportsLeftPanel = styled(Paper)<{ delmarginright?: boolean }>(
  ({ theme, delmarginright }) => {
    return {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      overflowY: "scroll",
      marginRight: !delmarginright ? theme.spacing(1) : undefined,
    }
  }
)

export const ReportsRightPanel = styled(Paper)<{
  center: boolean
  delmarginleft?: boolean
}>(({ theme, center, delmarginleft }) => {
  return {
    display: "flex",
    flexDirection: "column",
    flex: "4",
    marginLeft: !delmarginleft ? theme.spacing(1) : undefined,
    overflowY: "scroll",
    alignItems: center ? "center" : "stretch",
    justifyContent: center ? "center" : "flex-start",
  }
})

export const ReportsStyledTypography = styled(Typography)<{
  flexcount?: string
  insertpadding?: boolean
  header?: boolean
  color?: string
}>(({ theme, flexcount, insertpadding, header, color }) => {
  const styles: any = {
    flex: flexcount ?? "1",
    color: color,
  }

  if (insertpadding) {
    styles.padding = theme.spacing(1)
  }

  if (header) {
    styles.fontWeight = "bold"
  }

  return styles
})

export const ReportsStyledPaper = styled(Paper)<{
  header?: boolean
  warning?: boolean
  margin?: number
}>(({ theme, header, warning, margin }) => {
  const styles: any = {
    display: "flex",
    flexDirection: "row",
    margin: theme.spacing(margin ?? 1),
    padding: header ? theme.spacing(3) : theme.spacing(2),
  }

  if (warning) {
    styles.backgroundColor =
      theme.palette.mode === "light"
        ? theme.palette.error.light
        : theme.palette.error.dark
  } else {
    if (theme.palette.mode === "light") {
      styles.backgroundColor = header
        ? theme.palette.grey[400]
        : theme.palette.grey[300]
    }
  }

  return styles
})

export default function TasksByEmployeeScreen() {
  const { user } = useContext(AuthContext)!
  const theme = useTheme()
  // users list state
  const [users, setUsers] = useState<MinifiedUser[] | null>(null)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // tasks list state
  const [tasks, setTasks] = useState<ITaskByEmployee[] | null>(null)
  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [selectedUserCode, setSelectedUserCode] = useState<string | null>(null)
  const [taskError, setTaskError] = useState<string | null>(null)

  useEffect(() => {
    setError(null)
    setIsPageLoading(true)
    api<MinifiedUser[]>(
      getTaskByEmployeeInitUrl,
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setUsers(data!)
        setError(null)
        setIsPageLoading(false)
      })
      .catch((e: any) => {
        setIsPageLoading(false)
        setError(e.message)
      })
  }, [])

  useEffect(() => {
    if (selectedUserCode) {
      setTaskError(null)
      setIsTasksLoading(true)
      api<ITaskByEmployee[]>(
        getTaskByEmployeeUrl(selectedUserCode),
        HttpMethods.Get,
        null,
        { Authorization: `Bearer ${user?.tokenStr}` },
        "Something went wrong",
        true
      )
        .then((data) => {
          setTasks(data!)
          setIsTasksLoading(false)
        })
        .catch((e: any) => {
          setIsTasksLoading(false)
          setTaskError(e.message)
        })
    }
  }, [selectedUserCode])

  return (
    <ScreenContainer
      style={{ overflowY: "hidden" }}
      isDataLoaded={!isPageLoading && !error}
    >
      {isPageLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isPageLoading && !error && users && (
        <ReportsMainContainer>
          <ReportsLeftPanel>
            <Typography
              style={{ margin: theme.spacing(1) }}
              variant="h5"
              gutterBottom
            >
              Employees
            </Typography>
            <Divider style={{ margin: theme.spacing(1) }} />
            <List>
              {users.map((item) => (
                <ListItem
                  button
                  onClick={() => setSelectedUserCode(item.user_code)}
                  key={item.user_code}
                >
                  <Typography variant="h6">{item.description}</Typography>
                </ListItem>
              ))}
            </List>
          </ReportsLeftPanel>
          <ReportsRightPanel center={selectedUserCode === null}>
            {!selectedUserCode && (
              <>
                <img src={noselected} width={260} />
                <Typography
                  style={{ marginTop: theme.spacing(2) }}
                  variant="h5"
                >
                  No Selected Employee
                </Typography>
              </>
            )}
            {isTasksLoading && <Loading text="Getting Tasks" />}
            {taskError && <ErrorComponent text={taskError} />}
            {!isTasksLoading && !taskError && tasks && (
              <>
                <Typography style={{ margin: theme.spacing(1) }} variant="h5">
                  Assigned Tasks For{" "}
                  <span style={{ color: theme.palette.success.main }}>
                    {
                      users.find((i) => i.user_code === selectedUserCode)
                        ?.description
                    }
                  </span>
                </Typography>
                <ReportsStyledPaper header elevation={0}>
                  <ReportsStyledTypography header>
                    Task Name
                  </ReportsStyledTypography>
                  <ReportsStyledTypography header>
                    Task Code
                  </ReportsStyledTypography>
                  <ReportsStyledTypography header>
                    Start Date
                  </ReportsStyledTypography>
                  <ReportsStyledTypography header>
                    Due Date
                  </ReportsStyledTypography>
                  <ReportsStyledTypography header>
                    Order Number
                  </ReportsStyledTypography>
                  <ReportsStyledTypography header>
                    Project Title
                  </ReportsStyledTypography>
                  <ReportsStyledTypography header>
                    Assigned To
                  </ReportsStyledTypography>
                </ReportsStyledPaper>
                {tasks.map((task, index) => (
                  <ReportsStyledPaper key={index} elevation={0}>
                    <ReportsStyledTypography>
                      {task.task_name}
                    </ReportsStyledTypography>
                    <ReportsStyledTypography>
                      {task.task_code ?? "N/A"}
                    </ReportsStyledTypography>
                    <ReportsStyledTypography>
                      {task.start_date
                        ? getDayFromDate(new Date(task.start_date))
                        : "N/A"}
                    </ReportsStyledTypography>
                    <ReportsStyledTypography
                      style={{
                        color: task.due_date
                          ? new Date().getTime() > task.due_date
                            ? theme.palette.error.main
                            : theme.palette.text.primary
                          : theme.palette.text.primary,
                      }}
                    >
                      {task.due_date
                        ? getDayFromDate(new Date(task.due_date))
                        : "N/A"}
                    </ReportsStyledTypography>
                    <ReportsStyledTypography>
                      {task.order_number}
                    </ReportsStyledTypography>
                    <ReportsStyledTypography>
                      {task.project_title}
                    </ReportsStyledTypography>
                    <ReportsStyledTypography>
                      {task.assigned_to}
                    </ReportsStyledTypography>
                  </ReportsStyledPaper>
                ))}
              </>
            )}
          </ReportsRightPanel>
        </ReportsMainContainer>
      )}
    </ScreenContainer>
  )
}
