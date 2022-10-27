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
import { Typography } from "@mui/material"

// Styled
const MainContainer = styled("div")<{ underline: boolean }>(
  ({ theme, underline }) => {
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      margin: theme.spacing(1),
      justifyContent: "flexs-start",
      flex: "1",
      border: underline ? `1px solid ${theme.palette.primary.light}` : "none",
      borderRadius: underline ? theme.shape.borderRadius : "none",
    }
  }
)
const ButtonRow = styled("div")(() => {
  return {
    display: "flex",
    flexDirection: "row",
  }
})

export interface UpdatableInputFieldProps {
  value: string
  update: ((value: string) => Promise<void>) | ((value: string) => void)
  type: FormElementType
  editable: boolean
  label: string
  variant?: formVariants
  values?: DynamicSelectElement[]
  initialValue?: string
  maxLength?: number
  underline?: boolean
}

export default function UpdatableInputField(props: UpdatableInputFieldProps) {
  const [state, setState] = useState(props.value)
  const [error, setError] = useState(false)
  const [didChange, setDidChange] = useState(false)
  const [isInput, setIsInput] = useState(false)

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
      setIsInput(false)
      setDidChange(false)
    }
  }

  const cancel = () => {
    setState(props.value)
    setDidChange(false)
    setIsInput(false)
  }

  return (
    <MainContainer underline={props.underline ?? true}>
      {isInput && (
        <>
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
              rows={props.type === FormElementType.TextArea ? 3 : 1}
              color="secondary"
              fullWidth
              error={error}
              onChange={(e) => updateState(e.target.value)}
            />
          )}

          {props.type === FormElementType.Dropdown && (
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id={props.label + "-label"}>
                  {props.label}
                </InputLabel>
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

          {(didChange || isInput) && (
            <ButtonRow>
              <Button style={{ color: red[500] }} onClick={cancel}>
                Cancel
              </Button>
              <Button style={{ color: green[500] }} onClick={submit}>
                Update
              </Button>
            </ButtonRow>
          )}
        </>
      )}

      {!isInput && (
        <MainContainer
          underline={false}
          style={{ cursor: "pointer", userSelect: "none" }}
          onClick={() => {
            if (props.editable) {
              setIsInput(true)
            }
          }}
        >
          <Typography
            variant="caption"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            {props.label}
          </Typography>
          <Typography
            variant="body1"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            {(props.type === FormElementType.Text ||
              props.type === FormElementType.Number ||
              props.type === FormElementType.TextArea) &&
              props.value}
            {props.type === FormElementType.Dropdown &&
              (props.values?.find((i) => i.id === props.value)?.description ??
                "N/A")}
          </Typography>
        </MainContainer>
      )}
    </MainContainer>
  )
}
