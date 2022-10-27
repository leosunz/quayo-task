import TextField from "@mui/material/TextField"
import { Box } from "@mui/system"
import {
  DynamicSelectElement,
  FormElementType,
  formVariants,
} from "./FormModels"
import { styled } from "@mui/material/styles"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import { Typography } from "@mui/material"

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

export interface TaskComponentUpdatableInputFieldProps {
  value?: string
  update: (value: string) => void
  type: FormElementType
  editable: boolean
  label: string
  variant?: formVariants
  values?: DynamicSelectElement[]
  initialValue?: string
  maxLength?: number
  isInput: boolean
  error: boolean
  width?: number
}

export default function TaskComponentUpdatableInputField(
  props: TaskComponentUpdatableInputFieldProps
) {
  return (
    <MainContainer>
      {props.isInput && (
        <>
          {(props.type === FormElementType.Text ||
            props.type === FormElementType.Number ||
            props.type === FormElementType.TextArea) && (
            <TextField
              disabled={!props.editable}
              variant={props.variant ?? "outlined"}
              required={true}
              type={props.type === FormElementType.Number ? "number" : "text"}
              value={props.value}
              label={props.label}
              inputProps={{ maxLength: props.maxLength }}
              multiline={props.type === FormElementType.TextArea}
              rows={props.type === FormElementType.TextArea ? 3 : 1}
              color="secondary"
              fullWidth
              error={props.error}
              onChange={(e) => props.update(e.target.value)}
            />
          )}

          {props.type === FormElementType.Dropdown && (
            <Box sx={{ minWidth: props.width ?? 200 }}>
              <FormControl fullWidth>
                <InputLabel id={props.label + "-label"}>
                  {props.label}
                </InputLabel>
                <Select
                  fullWidth
                  disabled={!props.editable}
                  error={props.error}
                  labelId={props.label + "-label"}
                  value={props.value}
                  label={props.label}
                  onChange={(e) => props.update(e.target.value)}
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
        </>
      )}

      {!props.isInput && (
        <MainContainer style={{ cursor: "pointer", userSelect: "none" }}>
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
              (props.value ?? "N/A")}
            {props.type === FormElementType.Dropdown &&
              (props.values?.find((i) => i.id === props.value)?.description ??
                "N/A")}
          </Typography>
        </MainContainer>
      )}
    </MainContainer>
  )
}
