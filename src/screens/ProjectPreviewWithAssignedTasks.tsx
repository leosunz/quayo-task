import { green, grey, purple } from "@mui/material/colors"
import { useContext } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import {
  ScreenContainer,
  StyledVerticalDivider,
} from "../components/StyledComponents"
import { ProjectPreviewContext } from "../contexts/ProjectPreviewContext"
import { styled } from "@mui/material/styles"
import TextPillComponent from "../components/reusable/PillComponent"
import ProjectPreviewTaskComponent from "../components/ProjectPreviewTaskComponent"
import { Paper, Typography, useTheme } from "@mui/material"

const HeaderContainer = styled("div")(({ theme }) => {
  return {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
})

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  }
})

const MainGridContainer = styled(Paper)(({ theme }) => {
  return {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : grey[300],
    overflowY: "hidden",
    height: "100%",
    paddingBottom: theme.spacing(12),
  }
})
const GridContainer = styled("div")(({ theme }) => {
  return {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.paper
        : grey[200],
    overflowY: "scroll",
    height: "100%",
  }
})

export default function ProjectPreviewWithAssignedTasks() {
  const {
    taskTree,
    isLoading,
    error,
    timeUnits,
    clientDescription,
    taskStatus,
    projectTitle,
  } = useContext(ProjectPreviewContext)!

  const theme = useTheme()

  return (
    <ScreenContainer isDataLoaded={!isLoading && !error}>
      {isLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && taskTree && (
        <MainContainer>
          <HeaderContainer>
            <TextPillComponent
              title="Project Title"
              value={projectTitle ?? ""}
              lightColor={green[100]}
              darkColor={green[800]}
            />

            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Client"
              value={clientDescription ?? ""}
              lightColor={purple[100]}
              darkColor={purple[800]}
            />
          </HeaderContainer>
          <MainGridContainer>
            <Typography style={{ padding: theme.spacing(2) }} variant="h5">
              Project Overview
            </Typography>
            <GridContainer>
              {taskTree.children.map((e) => (
                <ProjectPreviewTaskComponent
                  indent={0}
                  isRoot={true}
                  key={e.id}
                  task={e}
                  parent={taskTree}
                />
              ))}
            </GridContainer>
          </MainGridContainer>
        </MainContainer>
      )}
    </ScreenContainer>
  )
}
