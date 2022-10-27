import TextField from "@mui/material/TextField"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import {
  DynamicSelectElement,
  FormElementType,
  formVariants,
} from "./FormModels"
import { styled } from "@mui/material/styles"
import { green, red } from "@mui/material/colors"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"

// Styled
const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: theme.spacing(1),
    justifyContent: "flexs-start",
    flex: "1",
  }
})
const ButtonRow = styled("div")(() => {
  return {
    display: "flex",
    flexDirection: "row",
  }
})

export interface UpdatableInputFieldOGProps {
  value: string
  update: ((value: string) => Promise<void>) | ((value: string) => void)
  type: FormElementType
  editable: boolean
  label: string
  variant?: formVariants
  values?: DynamicSelectElement[]
  initialValue?: string
  maxLength?: number
  rows?: number
}

export default function UpdatableInputFieldOG(
  props: UpdatableInputFieldOGProps
) {
  const [state, setState] = useState(props.value)
  const [error, setError] = useState(false)
  const [didChange, setDidChange] = useState(false)

  // use effect
  useEffect(() => {
    setState(props.value)
    setDidChange(false)
    setError(false)
  }, [props])

  const updateState = (value: string) => {
    setDidChange(true)
    setState(value)
  }

  const submit = async () => {
    if (state.length < 1) {
      setError(true)
    } else {
      setError(false)
      await props.update(state)
      setDidChange(false)
    }
  }

  const cancel = () => {
    setState(props.value)
    setDidChange(false)
  }

  return (
    <MainContainer>
      {(props.type === FormElementType.Text ||
        props.type === FormElementType.Number ||
        props.type === FormElementType.TextArea) && (
        <TextField
          disabled={!props.editable}
          variant={props.variant ?? "outlined"}
          required={true}
          type={props.type === FormElementType.Number ? "number" : "text"}
          value={state}
          label={props.label}
          inputProps={{ maxLength: props.maxLength }}
          multiline={props.type === FormElementType.TextArea}
          rows={props.type === FormElementType.TextArea ? props.rows ?? 3 : 1}
          color="secondary"
          fullWidth
          error={error}
          onChange={(e) => updateState(e.target.value)}
          onInput={
            props.type === FormElementType.Number
              ? (e) => {
                  ;(e.target as HTMLInputElement).value = Math.max(
                    0,
                    parseInt((e.target as HTMLInputElement).value)
                  )
                    .toString()
                    .slice(0, props.maxLength ?? 120)
                }
              : undefined
          }
        />
      )}

      {props.type === FormElementType.Dropdown && (
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel id={props.label + "-label"}>{props.label}</InputLabel>
            <Select
              fullWidth
              disabled={!props.editable}
              error={error}
              labelId={props.label + "-label"}
              value={state}
              label={props.label}
              onChange={(e) => updateState(e.target.value)}
            >
              {props.values!.map((value) => {
                return (
                  <MenuItem key={value.id} value={value.id}>
                    {value.description}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>
      )}

      {didChange && (
        <ButtonRow>
          <Button style={{ color: red[500] }} onClick={cancel}>
            Cancel
          </Button>
          <Button style={{ color: green[500] }} onClick={submit}>
            Update
          </Button>
        </ButtonRow>
      )}
    </MainContainer>
  )
}
