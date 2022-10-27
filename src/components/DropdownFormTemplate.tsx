import { IconButton, Paper, TextField, Typography } from "@mui/material"
import { blue, green, red } from "@mui/material/colors"
import { styled } from "@mui/material/styles"
import { CriteriaValue, CriteriaValueType } from "../api/DropdownApi"
import CustomPaginationTable, {
  CustomPaginationTableRow,
  CustomPaginationTableState,
} from "./reusable/CustomPaginationTable"
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import { useContext, useState } from "react"
import { DropdownContext } from "../contexts/DropdownContext"
import ConfirmationDialog from "./dialogs/ConfirmationDialog"

export interface DropdownFormTemplateProps {
  type: CriteriaValueType
  values: CriteriaValue[]
  title: string
  criteriaId: number
}

const Container = styled("div")(() => {
  return {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
  }
})

const FormRow = styled(Paper)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing(1),
    justifyContent: "space-around",
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode == "light"
        ? blue[100]
        : theme.palette.background.paper,
    flex: 1,
  }
})

export default function DropdownFormTemplate(props: DropdownFormTemplateProps) {
  const { newCriteriaValue, deleteCriteriaValue } = useContext(DropdownContext)!

  const [newValue, setNewValue] = useState("")
  const [valueErr, setValueErr] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectToDelete, setSelectedToDelete] = useState<CriteriaValue | null>(
    null
  )

  const submitNewValue = async () => {
    if (validate()) {
      await newCriteriaValue(
        { criteria_id: props.criteriaId, description: newValue },
        props.type
      )
      setNewValue("")
      setValueErr(false)
    }
  }

  function validate(): boolean {
    let valid = true

    if (newValue.length < 1) {
      valid = false
      setValueErr(true)
    } else {
      setValueErr(false)
    }

    return valid
  }

  const deleteCriteriaVal = async () => {
    if (selectToDelete) {
      await deleteCriteriaValue(selectToDelete.criteria_value_id, props.type)
    }
  }

  function getTableState(): CustomPaginationTableState {
    const headers: string[] = ["Description", "Action"]
    const rows: CustomPaginationTableRow[] = props.values.map((value) => {
      return {
        id: value.criteria_value_id,
        cells: [
          value.description,

          <IconButton
            onClick={() => {
              setSelectedToDelete(value)
              setDialogOpen(true)
            }}
          >
            <DeleteForeverRoundedIcon
              style={{
                color: red[800],
              }}
            />
          </IconButton>,
        ],
      }
    })

    return {
      heads: headers,
      rows,
    }
  }

  return (
    <Container>
      <Typography gutterBottom variant="h5">
        {props.title}
      </Typography>
      <div style={{ flex: "8", flexGrow: 8, overflowY: "scroll" }}>
        <CustomPaginationTable
          table={getTableState()}
          onRowClick={() => {}}
          cursor="default"
        />
      </div>
      <FormRow>
        <Typography variant="h5">New Value:</Typography>
        <TextField
          label="Description"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          error={valueErr}
        />
        <IconButton onClick={async () => await submitNewValue()}>
          <CheckCircleRoundedIcon
            style={{
              color: green[800],
            }}
          />
        </IconButton>
      </FormRow>
      <ConfirmationDialog
        negativeText="Cancel"
        positiveText="Delete"
        positive={async () => await deleteCriteriaVal()}
        title={`Delete ${selectToDelete?.description}?`}
        content={`Are you sure you want to delete ${selectToDelete?.description}?`}
        dismiss={() => setDialogOpen(false)}
        isOpen={dialogOpen}
      />
    </Container>
  )
}
