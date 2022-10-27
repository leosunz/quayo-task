import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import { SelectChangeEvent } from "@mui/material/Select/SelectInput"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { ChangeEvent, useState } from "react"
import { InputContainer, TransparentStyledPaper } from "../StyledComponents"
import {
  DynamicFormElement,
  DynamicFormState,
  FormElementType,
} from "./FormModels"

export interface CustomDynamicFormProps {
  formElements: DynamicFormElement[]
  submitForm(state: DynamicFormState[]): Promise<void>
  buttonText: string
  gridTempCol: string
}

const StyledForm = styled("form")<{ tempcol: string }>(({ theme, tempcol }) => {
  return {
    height: "100%",
    width: "100%",
    display: "grid",
    gridTemplateColumns: tempcol,
    gap: theme.spacing(1),
  }
})

export default function CustomDynamicForm(props: CustomDynamicFormProps) {
  // state
  const [formElementsState, setFormElementsState] = useState<
    DynamicFormState[]
  >(() => {
    return (
      props.formElements.map((element) => {
        return {
          element: element,
          value: element.initialValue ?? "",
          error: false,
        }
      }) ?? []
    )
  })

  const changeTextControlValue = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    let newValue = e.target.value
    const newState = [...formElementsState]
    const targetControl = newState.find((e) => e.element.id === id)
    if (targetControl?.element.removeWhiteSpaces) {
      newValue = newValue.replace(" ", "")
    }
    targetControl!.value = newValue
    setFormElementsState(newState)
  }

  const handleDropDownChange = (e: SelectChangeEvent<string>, id: string) => {
    const newValue = e.target.value
    const newState = [...formElementsState]
    const targetControl = newState.find((e) => e.element.id === id)
    targetControl!.value = newValue
    setFormElementsState(newState)
  }

  const submit = async () => {
    formElementsState.forEach((state) => {
      const newState = [...formElementsState]
      const targetControl = newState.find(
        (e) => e.element.id === state.element.id
      )
      targetControl!.error = state.element.required && state.value.length < 1
      setFormElementsState(newState)
    })

    if (!formElementsState.some((state) => state.error)) {
      await props.submitForm(formElementsState)
    }
  }

  const getElements = () => {
    return formElementsState.map((state) => {
      return (
        <InputContainer key={state.element.id}>
          <Typography style={{ flex: 1 }}>
            {state.element.label}:&nbsp;&nbsp;
          </Typography>

          <div style={{ flex: 4 }}>
            {state.element.type === FormElementType.Text && (
              <TextField
                disabled={!state.element.editable}
                id={state.element.id}
                variant={state.element.variant}
                required={state.element.required}
                type="text"
                value={state.value}
                label={state.element.label}
                color="secondary"
                fullWidth={state.element.fullWidth}
                error={state.error}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changeTextControlValue(e, state.element.id)
                }
              />
            )}
            {state.element.type === FormElementType.Password && (
              <TextField
                disabled={!state.element.editable}
                id={state.element.id}
                variant={state.element.variant}
                required={state.element.required}
                type="password"
                value={state.value}
                label={state.element.label}
                color="secondary"
                fullWidth={state.element.fullWidth}
                error={state.error}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changeTextControlValue(e, state.element.id)
                }
              />
            )}
            {state.element.type === FormElementType.TextArea && (
              <TextField
                multiline
                rows={2}
                disabled={!state.element.editable}
                id={state.element.id}
                variant={state.element.variant}
                required={state.element.required}
                type="text"
                value={state.value}
                label={state.element.label}
                color="secondary"
                fullWidth={state.element.fullWidth}
                error={state.error}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changeTextControlValue(e, state.element.id)
                }
              />
            )}
            {state.element.type === FormElementType.Number && (
              <TextField
                disabled={!state.element.editable}
                id={state.element.id}
                variant={state.element.variant}
                required={state.element.required}
                type="number"
                value={state.value}
                label={state.element.label}
                color="secondary"
                fullWidth={state.element.fullWidth}
                error={state.error}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changeTextControlValue(e, state.element.id)
                }
              />
            )}
            {state.element.type === FormElementType.Dropdown && (
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth={state.element.fullWidth}>
                  <InputLabel id={state.element.id + "-label"}>
                    {state.element.label}
                  </InputLabel>
                  <Select
                    disabled={!state.element.editable}
                    error={state.error}
                    labelId={state.element.id + "-label"}
                    id={state.element.id}
                    value={state.value}
                    label={state.element.label}
                    onChange={(e) => handleDropDownChange(e, state.element.id)}
                  >
                    {state.element.values!.map((value) => {
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
          </div>
        </InputContainer>
      )
    })
  }

  return (
    <TransparentStyledPaper>
      <StyledForm tempcol={props.gridTempCol} noValidate autoComplete="off">
        {getElements()}
      </StyledForm>
      <Button
        style={{
          height: "60px",
          width: "240px",
          justifySelf: "center",
          alignSelf: "center",
          marginTop: "1rem",
        }}
        variant="contained"
        type="submit"
        onClick={() => submit()}
      >
        {props.buttonText}
      </Button>
    </TransparentStyledPaper>
  )
}
