import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router"
import {
  getAllMainTaskTempMinUrl,
  MainTaskTemplateMinified,
} from "../api/TaskTemplateApi"
import { CustomPaginationTableRow } from "../components/reusable/CustomPaginationTable"
import DisplayTemplate from "../components/templates/DisplayTemplate"

const MainContainer = styled("div")(() => {
  return {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  }
})

export default function MainTemplatesScreen() {
  const navigate = useNavigate()

  const getTableState = (data: MainTaskTemplateMinified[]) => {
    const headers: string[] = ["Name", "Task Code", "No. of subtasks"]
    const rows: CustomPaginationTableRow[] = data.map((temp) => {
      return {
        id: temp.id,
        cells: [temp.task_name, temp.task_code, temp.children_count],
      }
    })

    return {
      heads: headers,
      rows,
    }
  }

  return (
    <MainContainer>
      <DisplayTemplate
        searchLabel="Search names.."
        loadingLabel="Loading Templates.."
        url={getAllMainTaskTempMinUrl}
        newButtonText="New Template"
        newEntityUrl="/tasks/templates/new"
        tableState={(data) => getTableState(data as MainTaskTemplateMinified[])}
        rowClicked={(id) => {
          navigate(`/tasks/templates/${id}`)
        }}
        pageTitle="Task Templates"
      />
    </MainContainer>
  )
}
