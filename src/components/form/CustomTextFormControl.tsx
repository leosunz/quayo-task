import TextField from "@mui/material/TextField"
import { ChangeEvent } from "react"
import { formVariants } from "./FormModels"


export interface CustomTextFormControlProps {
    variant: formVariants
    required: boolean
    value: string
    label: string
    fullWidth: boolean
    onChange(e: ChangeEvent<HTMLInputElement>): void
    id: string
    error: boolean
    textType: "text" | "password" | any
}

export default function CustomTextFormControl(
    props: CustomTextFormControlProps
) {


    return (
        <TextField
            id={props.id}
            variant={props.variant}
            required={props.required}
            type={props.textType}
            value={props.value}
            label={props.label}
            color="secondary"
            fullWidth={props.fullWidth}
            onChange={props.onChange}
            error={props.error}
        />
    )
}
