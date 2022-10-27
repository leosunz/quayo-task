import { Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useTheme } from "@mui/system"

const Pill = styled(Paper)<{ color: string; text: string }>(
  ({ theme, color, text }) => {
    return {
      backgroundColor: color,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(8),
      borderRadius: 50,
      color: text,
    }
  }
)

export interface TextPillComponentProps {
  title: string
  value: string
  lightColor: string
  darkColor: string
}

export default function TextPillComponent(props: TextPillComponentProps) {
  const theme = useTheme()
  return (
    <Pill
      text={theme.palette.mode === "light" ? props.darkColor : props.lightColor}
      color={
        theme.palette.mode === "light" ? props.lightColor : props.darkColor
      }
    >
      <Typography variant="body2">{props.title}</Typography>
      <Typography variant="h5">{props.value}</Typography>
    </Pill>
  )
}
