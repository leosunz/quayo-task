import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import Select from "@mui/material/Select"
import Typography from "@mui/material/Typography"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import {
  InputContainer,
  ScreenContainer,
  StyledVerticalDivider,
} from "../components/StyledComponents"
import { styled } from "@mui/material/styles"
import { blue, green, grey, orange, red, teal } from "@mui/material/colors"
import { useContext } from "react"
import { EditTasksScreenContext } from "../contexts/EditTaskScreenContext"
import TasksGrid from "../components/reusable/TasksGrid"
import TaskTemplatePreview from "../components/reusable/TaskTemplatePreview"
import TextPillComponent from "../components/reusable/PillComponent"
import { formatCurrency, getDayFromDate } from "../utils/formatters"

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

export default function ProjectTasksEditScreen() {
  const {
    isLoading,
    error,
    minifiedTemplates: templates,
    project,
    users,
    showingTemplate,
    selectTemplate,
    resetTempSelection,
    setSelectedTemplateId,
    selectedTemplateId,
  } = useContext(EditTasksScreenContext)!

  return (
    <ScreenContainer
      isDataLoaded={
        !isLoading && !error && templates !== null && users !== null
      }
    >
      {error && <ErrorComponent text={error} />}
      {isLoading && <Loading text="Loading.." />}
      {!isLoading && !error && templates !== null && users !== null && (
        <MainContainer>
          <HeaderContainer>
            <TextPillComponent
              title="Client"
              value={project?.client?.description ?? ""}
              lightColor={green[100]}
              darkColor={green[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Project Owner"
              value={project?.user?.description ?? ""}
              lightColor={blue[100]}
              darkColor={blue[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Price"
              value={formatCurrency(
                project?.total_price ?? 0,
                project?.currency_code ?? "USD"
              )}
              lightColor={teal[100]}
              darkColor={teal[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Paid"
              value={formatCurrency(
                project?.paid_amount ?? 0,
                project?.currency_code ?? "USD"
              )}
              lightColor={orange[100]}
              darkColor={orange[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <TextPillComponent
              title="Delivery Date"
              value={
                project?.estimated_delivery
                  ? getDayFromDate(new Date(project.estimated_delivery))
                  : "N/A"
              }
              lightColor={red[100]}
              darkColor={red[800]}
            />
            <StyledVerticalDivider flexItem orientation="vertical" />
            <InputContainer>
              <Typography variant="h6">Template: &nbsp;&nbsp;</Typography>
              <Box sx={{ minWidth: 160 }}>
                <FormControl fullWidth>
                  <InputLabel id="template-label">Template</InputLabel>
                  <Select
                    labelId="template-label"
                    id="template-select"
                    value={selectedTemplateId}
                    label="Template"
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                  >
                    {templates.map((temp) => (
                      <MenuItem key={temp.id} value={temp.id}>
                        {temp.task_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </InputContainer>
            <InputContainer>
              <Button
                color="warning"
                onClick={async () => await selectTemplate()}
              >
                Select
              </Button>
              {selectedTemplateId && (
                <Button color="error" onClick={resetTempSelection}>
                  Reset
                </Button>
              )}
            </InputContainer>
          </HeaderContainer>
          <TasksContainer>
            {!showingTemplate && <TasksGrid />}
            {showingTemplate && <TaskTemplatePreview />}
          </TasksContainer>
        </MainContainer>
      )}
    </ScreenContainer>
  )
}
