import { Button, IconButton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useContext, useState } from "react"
import empty from "../../images/empty_temp_1.png"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import grey from "@mui/material/colors/grey"
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded"
import ConfirmationDialog from "../dialogs/ConfirmationDialog"
import FastRewindRoundedIcon from "@mui/icons-material/FastRewindRounded"
import { TaskTemplateContext } from "../../contexts/TaskTemplateContext"
import TaskTempComponent from "./TaskTempComponent"
import NewProjectTaskTempFormDialog2 from "../dialogs/NewProjectTaskTempFormDialog2"

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

export default function TaskTempGrid() {
  const { rootTask, saveTemplate } = useContext(TaskTemplateContext)!

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
        loaded={rootTask?.children !== null && rootTask?.children?.length !== 0}
      >
        {!rootTask ||
          !rootTask.children ||
          (rootTask?.children && rootTask?.children?.length === 0 && (
            <>
              <img src={empty} />
              <Typography>You currently have no taskTree.</Typography>
            </>
          ))}
        {rootTask?.children && rootTask?.children?.length > 0 && (
          <>
            {rootTask?.children?.map((child) => {
              return (
                <TaskTempComponent
                  indent={0}
                  isRoot={true}
                  key={child.fake_id ?? child.id}
                  task={child}
                  parent={rootTask}
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

        <Button
          endIcon={<PlayArrowRoundedIcon />}
          variant="contained"
          color="success"
          onClick={() => setIsConfirmOpen(true)}
        >
          Submit Changes
        </Button>
      </div>
      <NewProjectTaskTempFormDialog2
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)}
        title="New Task"
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        title="Submit changes?"
        content="Are you sure you want to submit the changes?"
        dismiss={() => setIsConfirmOpen(false)}
        positive={async () => await saveTemplate()}
        negativeText="Cancel"
        positiveText="Submit"
      />
    </div>
  )
}
