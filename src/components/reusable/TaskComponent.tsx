import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import { MainTaskTemplate } from "../../api/TaskTemplateApi"
import { orange } from "@mui/material/colors"
import { ProjectTaskInterface } from "../../api/ProjectApi"

const StyledCard = styled(Card)<{
  selected: boolean
  color?: string
  indent: number | undefined
}>(({ theme, selected, color, indent }) => {
  return {
    margin: theme.spacing(1),
    cursor: "pointer",
    backgroundColor: selected ? orange[100] : color,
    marginLeft: theme.spacing(2 * (indent ?? 0)),
  }
})

export default function TaskComponent(props: {
  task: MainTaskTemplate | ProjectTaskInterface
  onTaskSelected: () => void
  isSelected: boolean
  color?: string
  indent?: number
}) {
  return (
    <div>
      <StyledCard
        selected={props.isSelected}
        color={props.color}
        onClick={() => props.onTaskSelected()}
        indent={props.indent}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.task.task_code}
          </Typography>
          <Typography variant="h5" component="div">
            {props.task.task_name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} overflow="clip" color="text.secondary">
            {props.task.description}
          </Typography>
        </CardContent>
      </StyledCard>
    </div>
  )
}
