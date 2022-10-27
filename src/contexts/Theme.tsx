import { createTheme } from "@mui/material/styles"

export const AppTheme = createTheme({
  palette: {
    primary: {
      main: "#7986cb",
      light: "#aab6fe",
      dark: "#49599a",
    },
    secondary: {
      main: "#17516b",
      light: "#4b7d99",
      dark: "#002940",
    },
    text: {
      primary: "#000000",
      secondary: "#000000",
    },
  },
  shape: { borderRadius: 6 },
})
