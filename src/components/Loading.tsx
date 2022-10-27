import { styled, useTheme } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import {
  BarLoader,
  BeatLoader,
  BounceLoader,
  ClimbingBoxLoader,
  ClipLoader,
  ClockLoader,
  DotLoader,
  FadeLoader,
  HashLoader,
  MoonLoader,
  PuffLoader,
  RingLoader,
  ScaleLoader,
  SyncLoader,
} from "react-spinners"

const MainContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    color: theme.palette.text.primary,
  }
})

export default function Loading({ text = "Loading.." }) {
  const theme = useTheme()

  const loaders = [
    <BounceLoader color={theme.palette.primary.dark} />,
    <ClimbingBoxLoader color={theme.palette.primary.dark} />,
    <BeatLoader color={theme.palette.primary.dark} />,
    <ClockLoader color={theme.palette.primary.dark} />,
    <DotLoader color={theme.palette.primary.dark} />,
    <HashLoader color={theme.palette.primary.dark} />,
    <PuffLoader color={theme.palette.primary.dark} />,
    <RingLoader color={theme.palette.primary.dark} />,
    <SyncLoader color={theme.palette.primary.dark} />,
    <ScaleLoader color={theme.palette.primary.dark} />,
    <FadeLoader color={theme.palette.primary.dark} />,
    <BarLoader color={theme.palette.primary.dark} />,
    <ClipLoader color={theme.palette.primary.dark} />,
    <MoonLoader color={theme.palette.primary.dark} />,
  ]

  const getRandomIndex = () => {
    return Math.floor(Math.random() * loaders.length)
  }

  return (
    <MainContainer>
      {loaders[getRandomIndex()]}
      <Typography style={{ marginTop: theme.spacing(1) }} variant="h6">
        {text}
      </Typography>
    </MainContainer>
  )
}
