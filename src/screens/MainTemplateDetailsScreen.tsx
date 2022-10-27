import grey from "@mui/material/colors/grey"
import { useContext, useState } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import {
  ScreenContainer,
  StyledVerticalDivider,
} from "../components/StyledComponents"
import { styled } from "@mui/material/styles"
import { TaskTemplateContext } from "../contexts/TaskTemplateContext"
import TaskTempGrid from "../components/reusable/TaskTempGrid"
import Paper from "@mui/material/Paper"
import green from "@mui/material/colors/green"
import TextPillComponent from "../components/reusable/PillComponent"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import Button from "@mui/material/Button/Button"
import ConfirmationDialog from "../components/dialogs/ConfirmationDialog"

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  }
})

const TasksContainer = styled(Paper)(({ theme }) => {
  return {
    flex: "4",
    display: "flex",
    flexDirection: "column",
    backgroundColor:
      theme.palette.mode === "light"
        ? grey[300]
        : theme.palette.background.paper,
    height: "100%",
    overflow: "hidden",
  }
})
const HeaderContainer = styled("div")(({ theme }) => {
  return {
    width: "100%",
    // backgroundColor: grey[200],
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
})
export default function MainTemplateDetailsScreen() {
  const { isLoading, error, rootTask, deleteMainTask } =
    useContext(TaskTemplateContext)!

  // delete
  const [deleteDialog, setDeleteDialog] = useState(false)

  return (
    <ScreenContainer
      isDataLoaded={!isLoading && !error && rootTask !== null}
      style={{}}
    >
      {isLoading && <Loading text="Loading Template.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {rootTask && !isLoading && (
        <MainContainer>
          <HeaderContainer>
            <TextPillComponent
              title="Title"
              value={rootTask.task_name}
              lightColor={green[100]}
              darkColor={green[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />

            <Button
              color="error"
              endIcon={<DeleteRoundedIcon />}
              style={{
                borderRadius: "50px",
                padding: "1rem",
                marginLeft: "10px",
              }}
              variant="contained"
              onClick={() => setDeleteDialog(true)}
            >
              Delete Template
            </Button>
          </HeaderContainer>
          <TasksContainer>
            <TaskTempGrid />
          </TasksContainer>
        </MainContainer>
      )}
      <ConfirmationDialog
        content="Are you sure you want to delete this template?"
        negativeText="Cancel"
        positiveText="Delete"
        title="Delete Template"
        isOpen={deleteDialog}
        dismiss={() => setDeleteDialog(false)}
        positive={async () => {
          setDeleteDialog(false)
          await deleteMainTask()
        }}
      />
    </ScreenContainer>
  )
}
