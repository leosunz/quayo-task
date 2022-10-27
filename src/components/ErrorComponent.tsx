import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded"
import { yellow } from "@mui/material/colors"
import Typography from "@mui/material/Typography"

export interface IErrorProps {
  text: string
}

function ErrorComponent({ text = "Oops, something went wrong." }: IErrorProps) {
  return (
    <>
      <ErrorRoundedIcon style={{ color: yellow[800] }} fontSize="large" />
      <Typography>{text}</Typography>
    </>
  )
}

export default ErrorComponent
