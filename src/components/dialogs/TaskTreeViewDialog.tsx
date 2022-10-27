import * as React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import ListItemText from "@mui/material/ListItemText"
import ListItem from "@mui/material/ListItem"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import CloseIcon from "@mui/icons-material/Close"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions"
import { MainTaskTemplate } from "../../api/TaskTemplateApi"
import SortableTree from "@nosferatu500/react-sortable-tree"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export interface TreeElement {
  title: string
  children: TreeElement[]
}

export default function TaskTreeViewDialog(props: {
  isOpen: boolean
  handleClose: () => void
  tasks: MainTaskTemplate[]
}) {
  const getTreeData: (tasks: MainTaskTemplate[]) => TreeElement[] = (
    tasks: MainTaskTemplate[]
  ) => {
    return tasks.map((element) => {
      return {
        title: element.task_name,
        children: getTreeData(element.children ?? []),
      }
    })
  }

  const [treeData, setTreeData] = React.useState(getTreeData(props.tasks))

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
