import { styled } from "@mui/material/styles"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import { useContext, useState } from "react"
import { TaskTemplateContext } from "../src/contexts/TaskTemplateContext"
import AlertDialog from "../src/components/dialogs/AlertDialog"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import { BlockedBy } from "../src/api/TaskTemplateApi"

const RowPaper = styled(Paper)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
    justifyContent: "space-between",
    alignItems: "center",
  }
})

const ColumnContainer = styled("div")(() => {
  return {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    alignItems: "stretch",
    overflowY: "hidden",
  }
})

const NewBlockByRow = styled(Paper)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
    flex: "0.5",
  }
})

const BlockedByScrollableArea = styled("div")(({ theme }) => {
  return {
    overflowY: "scroll",
    overflowX: "hidden",
    flex: "2",
  }
})

export interface BlockedByComponentProps {
  parentId: number
  blockedBy: BlockedBy[]
  isSubTask: boolean
  newBlockedBy: (
    id: number,
    blockedBy: number,
    isSubTask: boolean
  ) => Promise<void>
  deleteBlockedBy: (
    id: number,
    blockedBy: number,
    isSubTask: boolean
  ) => Promise<void>
  getNewBlockedByValues: () => BlockedBy[]
}

export default function BlockedByComponent(props: BlockedByComponentProps) {
  const [selectState, setSelectState] = useState<string | null>(null)
  const [error, setError] = useState(false)

  const submitNewBlockBy = async () => {
    if (selectState) {
      setError(false)
      await changeCb(props.parentId, Number(selectState), props.newBlockedBy)
    } else {
      setError(true)
    }
  }

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  async function changeCb(
    id: number,
    blockedBy: number,
    cb: (id: number, blockedBy: number, isSubTask: boolean) => Promise<void>
  ) {
    try {
      await cb(id, blockedBy, props.isSubTask)
    } catch (e: any) {
      setDialogTitle("Something went wrong")
      setDialogContent(e.message)
      setDialogOpen(true)
    }
  }

  return (
    <ColumnContainer>
      <Typography style={{ flex: "0.1", marginTop: "10px" }} variant="h6">
        Blocked by
      </Typography>

      <BlockedByScrollableArea>
        {props.blockedBy.map((item) => {
          return (
            <RowPaper key={item.id}>
              <Typography>{item.task_name}</Typography>
              <IconButton
                onClick={async () =>
                  await changeCb(props.parentId, item.id, props.deleteBlockedBy)
                }
              >
                <DeleteRoundedIcon color="error" />
              </IconButton>
            </RowPaper>
          )
        })}
      </BlockedByScrollableArea>
      <NewBlockByRow>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id="blocked-by-label">Blocked by</InputLabel>
            <Select
              fullWidth
              error={error}
              labelId="blocked-by-label"
              value={selectState ?? ""}
              label="Blocked by"
              onChange={(e) => setSelectState(e.target.value)}
            >
              {props.getNewBlockedByValues().map((value) => {
                return (
                  <MenuItem key={value.id} value={value.id}>
                    {value.task_name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>
        <Button onClick={submitNewBlockBy}>Add</Button>
      </NewBlockByRow>
      <AlertDialog
        content={dialogContent}
        isOpen={dialogOpen}
        title={dialogTitle}
        onClose={() => setDialogOpen(false)}
      />
    </ColumnContainer>
  )
}
