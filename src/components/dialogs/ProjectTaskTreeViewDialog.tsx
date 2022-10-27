import * as React from "react"
import Dialog from "@mui/material/Dialog"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import CloseIcon from "@mui/icons-material/Close"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import SortableTree from "@nosferatu500/react-sortable-tree"
import { ProjectTaskInterface } from "../../api/ProjectApi"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface TreeElement {
  title: string
  children: TreeElement[]
}

export default function ProjectTaskTreeViewDialog(props: {
  isOpen: boolean
  handleClose: () => void
  tasks: ProjectTaskInterface[]
}) {
  const getTreeData: (tasks: ProjectTaskInterface[]) => TreeElement[] = (
    tasks: ProjectTaskInterface[]
  ) => {
    return tasks.map((element) => {
      return {
        title: element.task_name,
        children: getTreeData(element.children ?? []),
      }
    })
  }

  const [treeData, setTreeData] = React.useState(getTreeData(props.tasks))

  React.useEffect(() => {
    setTreeData(getTreeData(props.tasks))
  }, [props.tasks])

  return (
    <Dialog
      fullScreen
      open={props.isOpen}
      onClose={props.handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Tree View
          </Typography>
        </Toolbar>
      </AppBar>
      <SortableTree
        style={{ color: "black" }}
        canDrag={() => false}
        canDrop={() => false}
        onChange={(data) => {
          setTreeData(data)
        }}
        treeData={treeData}
      />
    </Dialog>
  )
}
