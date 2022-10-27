import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import MuiDrawer from "@mui/material/Drawer"
import CssBaseline from "@mui/material/CssBaseline"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Outlet, useLocation, useNavigate } from "react-router"
import Dashboard from "../components/Dashboard"
import {
  adminlMenuItems,
  adminReportsMenuItems,
  globalMenuItems,
} from "../constants/MenuConstants"
import { useContext, useState } from "react"
import { LogoutRounded } from "@mui/icons-material"
import { AuthContext } from "../contexts/AuthContext"
import { projectName } from "../constants/Config"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import { ThemeContext } from "../contexts/ThemeContext"
import { blue, deepOrange } from "@mui/material/colors"
import logo from "../images/logo.png"
import PasswordRoundedIcon from "@mui/icons-material/PasswordRounded"

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
})

// const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
//   open?: boolean
// }>(({ theme, open }) => ({
//   flexGrow: 1,
//   padding: theme.spacing(0),
//   transition: theme.transitions.create("margin", {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   marginLeft: `-${drawerWidth}px`,
//   ...(open && {
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   }),
//   height: "calc(100% - 64px)", // new
// }))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

const StyledTypography = styled(Typography)(({ theme }) => {
  return {
    color: theme.palette.secondary.light,
    fontWeight: "bold",
  }
})

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}))

export default function HomeScreen() {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { logout, user } = useContext(AuthContext)!

  const isDashboard = () => {
    return pathname === "/"
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const navigate = useNavigate()
  const handleNavigate = (route: string) => {
    navigate(route)
  }

  const logoutUser = async () => await logout()

  const { toggleColorMode } = useContext(ThemeContext)

  return (
    <Box sx={{ display: "flex", height: "100%", overflowX: "hidden" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <img
            style={{ marginRight: theme.spacing(3) }}
            src={logo}
            width={40}
            height={40}
          />
          <Typography variant="h6" noWrap component="div">
            {projectName}
          </Typography>

          {/* <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              sx={{ ml: 1 }}
              onClick={toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader style={{ justifyContent: "space-between" }}>
          <StyledTypography variant="h6">{user?.username}</StyledTypography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {globalMenuItems(theme.palette.mode).map((item) => (
            <ListItem
              button
              key={item.route}
              onClick={() => {
                handleNavigate(item.route)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
        {adminlMenuItems(user!.token, theme.palette.mode).length > 0 && (
          <Divider />
        )}
        {adminlMenuItems(user!.token, theme.palette.mode).length > 0 && (
          <List>
            {adminlMenuItems(user!.token, theme.palette.mode).map((item) => (
              <ListItem
                button
                key={item.route}
                onClick={() => {
                  handleNavigate(item.route)
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
        )}
        {adminReportsMenuItems(user!.token, theme.palette.mode).length > 0 && (
          <Divider />
        )}
        {adminReportsMenuItems(user!.token, theme.palette.mode).length > 0 && (
          <List>
            {adminReportsMenuItems(user!.token, theme.palette.mode).map(
              (item) => (
                <ListItem
                  button
                  key={item.route}
                  onClick={() => {
                    handleNavigate(item.route)
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              )
            )}
          </List>
        )}

        <Divider />
        <ListItem
          button
          key="switch-theme"
          onClick={toggleColorMode}
          color="inherit"
        >
          <ListItemIcon>
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon style={{ color: blue[700] }} />
            ) : (
              <Brightness4Icon style={{ color: blue[700] }} />
            )}
          </ListItemIcon>
          <ListItemText primary="Toggle Theme" />
        </ListItem>
        <ListItem
          button
          key="change-password"
          onClick={() => navigate("/change-password")}
        >
          <ListItemIcon>
            <PasswordRoundedIcon style={{ color: blue[400] }} />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItem>
        <ListItem button key="logout" onClick={async () => await logoutUser()}>
          <ListItemIcon>
            <LogoutRounded style={{ color: deepOrange[900] }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Drawer>
      <Box
        component="main"
        style={{
          padding: 0,
          margin: 0,
          height: pathname === "/reports/gantt" ? "99%" : "calc(100% - 64px)",
          overflowY: pathname === "/reports/gantt" ? "hidden" : undefined,
          overflowX: pathname === "/reports/gantt" ? "hidden" : undefined,
        }}
        sx={{ flexGrow: 1, p: 3 }}
      >
        <DrawerHeader />
        {isDashboard() && <Dashboard />}
        {!isDashboard() && <Outlet />}
      </Box>
    </Box>
  )
}
