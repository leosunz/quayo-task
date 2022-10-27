import * as React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import grey from "@mui/material/colors/grey"

export const ThemeContext = React.createContext({ toggleColorMode: () => {} })

export function getDisabledIconButton(theme: "light" | "dark") {
  return theme === "light" ? grey[400] : grey[800]
}

export default function ThemeContextProvider(props: { children: JSX.Element }) {
  const [mode, setMode] = React.useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") ?? "light"
  )
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        localStorage.setItem("theme", mode === "light" ? "dark" : "light")
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
      },
    }),
    []
  )

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light" ? getLightPalette() : getDarkPalette()),
        },
        shape: {
          borderRadius: "4px",
        },
        typography: {
          fontFamily: "Poppins, sans-serif",
        },
      }),
    [mode]
  )

  function getLightPalette() {
    return {
      primary: {
        // indigo 300
        main: "#7986cb",
        light: "#aab6fe",
        dark: "#49599a",
      },
      secondary: {
        main: "#17516b",
        light: "#4b7d99",
        dark: "#002940",
      },
      background: {
        paper: "#f5f5f5",
      },
    }
  }
  function getDarkPalette() {
    return {
      // indigo 400
      primary: {
        main: "#5c6bc0",
        light: "#8e99f3",
        dark: "#26418f",
      },
      secondary: {
        main: "#17516b",
        light: "#4b7d99",
        dark: "#002940",
      },
    }
  }

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
