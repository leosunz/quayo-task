import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography/Typography"

export interface InlinePillProps {
  title: string
  value: string
}

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

export default function InlinePill(props: InlinePillProps) {
  return (
    <MainContainer style={{ cursor: "pointer", userSelect: "none" }}>
      <Typography
        variant="caption"
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {props.title}
      </Typography>
      <Typography
        variant="body1"
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {props.value}
      </Typography>
    </MainContainer>
  )
}
