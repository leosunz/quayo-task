import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Box from "@mui/system/Box"
import { formVariants } from "./FormModels"

export interface CustomSelectFormControlProps {
    variant: formVariants
    required: boolean
    value: { key: string; display: string }
    entries: { key: string; display: string }[]
    label: string
    fullWidth: boolean
    onChange(e: SelectChangeEvent<string>): void
    id: string
    error: boolean
}

export default function CustomSelectFormControl(
    props: CustomSelectFormControlProps
) {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id={props.id + "-label"}>{props.label}</InputLabel>
                <Select
                    labelId={props.id + "-label"}
                    id={props.id}
                    value={props.value.key}
                    label="Age"
                    onChange={props.onChange}
                >
                    {props.entries.map((entry) => (
                        <MenuItem key={entry.key} value={entry.key}>
                            {entry.display}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}
