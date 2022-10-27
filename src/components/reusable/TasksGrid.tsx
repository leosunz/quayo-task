import { Button, IconButton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useContext, useState } from "react"
import { EditTasksScreenContext } from "../../contexts/EditTaskScreenContext"
import empty from "../../images/empty_temp_1.png"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import NewProjectTaskFormDialog2 from "../dialogs/NewProjectTaskFormDialog2"
import ProjectTaskComponent from "./ProjectTaskComponent"
import grey from "@mui/material/colors/grey"
import SaveRoundedIcon from "@mui/icons-material/SaveRounded"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import ConfirmationDialog from "../dialogs/ConfirmationDialog"
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded"

const MainContainer = styled("div")<{ loaded: boolean }>(
  ({ theme, loaded }) => {
    return {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: loaded ? "flex-start" : "center",
      alignItems: loaded ? "flex-start" : "center",
      overflowY: "scroll",
      backgroundColor:
        theme.palette.mode === "light"
          ? grey[100]
          : theme.palette.background.default,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    }
  }
)

export default function TasksGrid() {
  const { taskTree, saveDraft, project, startProject, isProjectReadyToStart } =
    useContext(EditTasksScreenContext)!

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <IconButton
        onClick={() => setIsDialogOpen(true)}
        style={{ alignSelf: "flex-end" }}
      >
        <AddRoundedIcon />
      </IconButton>
      <MainContainer
        loaded={taskTree?.children !== null && taskTree?.children?.length !== 0}
      >
        {!taskTree ||
          !taskTree.children ||
          (taskTree?.children && taskTree?.children?.length === 0 && (
            <>
              <img src={empty} />
              <Typography>You currently have no taskTree.</Typography>
            </>
          ))}
        {taskTree?.children && taskTree?.children?.length > 0 && (
          <>
            {taskTree?.children?.map((child) => {
              return (
                <ProjectTaskComponent
                  indent={0}
                  isRoot={true}
                  key={child.fake_id ?? child.id}
                  task={child}
                  parent={taskTree}
                />
              )
            })}
          </>
        )}
      </MainContainer>
      <div
        style={{
          padding: "0.5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Button
          endIcon={<FastRewindRoundedIcon />}
          variant="contained"
          color="error"
          onClick={() => window.location.reload()}
          style={{ marginRight: "2rem" }}
        >
          Reset Changes
        </Button>
        {project?.is_draft === 1 && (
          <>
            <Button
              endIcon={<SaveRoundedIcon />}
              variant="contained"
              color="warning"
              onClick={async () => await saveDraft()}
              style={{ marginRight: "2rem" }}
            >
              Save Draft
            </Button>
            <Button
              endIcon={<PlayArrowRoundedIcon />}
              variant="contained"
              color="success"
              disabled={!isProjectReadyToStart()}
              onClick={() => setIsConfirmOpen(true)}
            >
              Start Project
            </Button>
          </>
        )}
        {project?.is_draft != 1 && (
          <>
            <Button
              endIcon={<PlayArrowRoundedIcon />}
              variant="contained"
              color="success"
              disabled={!isProjectReadyToStart()}
              onClick={() => setIsConfirmOpen(true)}
            >
              Submit Changes
            </Button>
          </>
        )}
      </div>
      <NewProjectTaskFormDialog2
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        title="New Task"
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title={project?.is_draft === 1 ? "Start Project?" : "Submit changes?"}
        content={
          project?.is_draft ===1
            ? "Are you sure you want to start the project?"
            : "Are you sure you want to submit the changes?"
        }
        dismiss={() => setIsConfirmOpen(false)}
        positive={async () => await startProject()}
        negativeText="Cancel"
        positiveText={project?.is_draft ===1 ? "Start" : "Submit"}
      />
    </div>
  )
}
