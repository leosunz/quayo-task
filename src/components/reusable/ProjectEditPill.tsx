import deepOrange from "@mui/material/colors/deepOrange"
import { styled, useTheme } from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import { useContext, useState } from "react"
import TreeIcon from "@mui/icons-material/AccountTreeRounded"
import { ProjectContext } from "../../contexts/ProjectContext"
import ProjectTaskTreeViewDialog from "../dialogs/ProjectTaskTreeViewDialog"
import EditRoundedIcon from "@mui/icons-material/EditRounded"
import { useNavigate } from "react-router-dom"
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded"
import AssessmentIcon from "@mui/icons-material/AssessmentRounded"
import { AuthContext } from "../../contexts/AuthContext"
import AddTaskIcon from "@mui/icons-material/AddTask"
import HoverPopover from "./HoverPopover"

const LeftTaskHolder = styled(Paper)(({ theme }) => {
  return {
    backgroundColor:
      theme.palette.mode === "light" ? deepOrange[100] : deepOrange[800],
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    borderRadius: "50px",
  }
})

const HeaderContainer = styled("div")(() => {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }
})

export default function ProjectEditPill() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useContext(AuthContext)!
  // context
  const { rootTask, project } = useContext(ProjectContext)!

  const [treeDialogOpen, setTreeDialogOpen] = useState(false)

  return (
    <LeftTaskHolder>
      <HeaderContainer>
        <HoverPopover hoverText="TreeView">
          <IconButton
            onClick={() => setTreeDialogOpen(true)}
            style={{
              color:
                theme.palette.mode === "light"
                  ? deepOrange[800]
                  : deepOrange[100],
            }}
          >
            <TreeIcon />
          </IconButton>
        </HoverPopover>
        <HoverPopover hoverText="Edit Tasks">
          <IconButton
            onClick={() => navigate(`/projects/${project?.id}/tasks/edit`)}
          >
            <AddTaskIcon
              style={{
                color:
                  theme.palette.mode === "light"
                    ? deepOrange[800]
                    : deepOrange[100],
              }}
            />
          </IconButton>
        </HoverPopover>
        <HoverPopover hoverText="View Reschedule Requests">
          <IconButton
            onClick={() => navigate(`/projects/${project?.id}/reschedule`)}
          >
            <WatchLaterRoundedIcon
              style={{
                color:
                  theme.palette.mode === "light"
                    ? deepOrange[800]
                    : deepOrange[100],
              }}
            />
          </IconButton>
        </HoverPopover>
        {user?.token?.roles?.includes("ADMIN") && (
          <HoverPopover hoverText="Duration Report">
            <IconButton
              onClick={() =>
                navigate(`/projects/${project?.id}/tasks/duration/report`)
              }
            >
              <AssessmentIcon
                style={{
                  color:
                    theme.palette.mode === "light"
                      ? deepOrange[800]
                      : deepOrange[100],
                }}
              />
            </IconButton>
          </HoverPopover>
        )}
        {user?.token?.roles?.includes("ADMIN") && (
          <HoverPopover hoverText="Edit Project Details">
            <IconButton
              onClick={() => navigate(`/projects/${project?.id}/edit`)}
            >
              <EditRoundedIcon
                style={{
                  color:
                    theme.palette.mode === "light"
                      ? deepOrange[800]
                      : deepOrange[100],
                }}
              />
            </IconButton>
          </HoverPopover>
        )}
      </HeaderContainer>

      <ProjectTaskTreeViewDialog
        isOpen={treeDialogOpen}
        handleClose={() => {
          setTreeDialogOpen(false)
        }}
        tasks={rootTask?.children ?? []}
      />
    </LeftTaskHolder>
  )
}
