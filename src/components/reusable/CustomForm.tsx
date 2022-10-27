import Button from "@mui/material/Button"
import { ChangeEvent, FormEvent, useState } from "react"
import { formVariants } from "../form/FormModels"
import CustomTextFormControl from "../form/CustomTextFormControl"

export interface CustomFormProps {
  elements: CustomFormElement[]
  submitForm(state: CustomFormContolState[]): Promise<void>
  buttonText: string
}

export interface CustomFormElement {
  id: string
  type: "text" | "password"
  required: boolean
  label: string
  fullWidth?: boolean
  variant?: formVariants
}

export interface CustomFormContolState {
  element: CustomFormElement
  value: string
  error: boolean
}

export default function CustomForm(props: CustomFormProps) {
  // state
  const [textFormControlsState, setTextForControlsState] = useState<
    CustomFormContolState[]
  >(() => {
    return props.elements
      .filter(
        (element) => element.type === "text" || element.type === "password"
      )
      .map((element) => {
        return { element: element, value: "", error: false }
      })
  })

  const changeTextControlValue = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const newValue = e.target.value
    const newState = [...textFormControlsState]
    const targetControl = newState.find((e) => e.element.id === id)
    targetControl!.value = newValue
    setTextForControlsState(newState)
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    textFormControlsState.forEach((state) => {
      const newState = [...textFormControlsState]
      const targetControl = newState.find(
        (e) => e.element.id === state.element.id
      )
      targetControl!.error = state.element.required && state.value.length < 1
      setTextForControlsState(newState)
    })

    if (!textFormControlsState.some((state) => state.error)) {
      await props.submitForm(textFormControlsState)
    }
  }

  return (
    <form
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
      noValidate
      autoComplete="off"
      onSubmit={(e) => submit(e)}
    >
      {textFormControlsState.map((state) => {
        return (
          <CustomTextFormControl
            error={state.error}
            id={state.element.id}
            fullWidth={state.element.fullWidth ?? true}
            label={state.element.label ?? "Input"}
            required={state.element.required ?? false}
            key={state.element.id}
            value={state.value}
            textType={state.element.type}
            variant={state.element?.variant ?? "outlined"}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              changeTextControlValue(e, state.element.id)
            }
          />
        )
      })}
      <Button variant="contained" type="submit">
        {props.buttonText}
      </Button>
    </form>
  )
}
