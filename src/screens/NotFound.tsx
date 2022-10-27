import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const Main = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  }
})

export default function NotFound() {
  return (
    <Main>
      <Typography variant="h5">Not Found</Typography>
    </Main>
  )
}
