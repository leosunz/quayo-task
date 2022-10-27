import AccountBoxRounded from "@mui/icons-material/AccountBoxRounded"
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded"
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded"
import { Token } from "../models/AuthState"
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded"
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded"
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded"
import PrecisionManufacturingRoundedIcon from "@mui/icons-material/PrecisionManufacturingRounded"
import {
  blue,
  cyan,
  deepOrange,
  green,
  lightBlue,
  orange,
  purple,
  red,
  teal,
} from "@mui/material/colors"
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded"
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded"
import UpcomingRoundedIcon from "@mui/icons-material/UpcomingRounded"
import InsertChartRoundedIcon from "@mui/icons-material/InsertChartRounded"
import LocalAtmRoundedIcon from "@mui/icons-material/LocalAtmRounded"

export interface MenuItem {
  title: string
  icon: any
  route: string
  desc: string
  cardColor?: string
}

export const globalMenuItems = (theme: "light" | "dark") => {
  return [
    {
      title: "Dashboard",
      icon: <DashboardRoundedIcon style={{ color: "#ff7043" }} />,
      route: "/",
      desc: "",
    },
    {
      title: "Projects",
      icon: <BusinessCenterRoundedIcon style={{ color: orange[700] }} />,
      route: "/projects",
      desc: "Create, view, and edit your projects list.",
      cardColor: theme === "light" ? "#ffad42" : "#bb4d00",
    },
  ]
}

export const adminlMenuItems: (
  token: Token,
  theme: "light" | "dark"
) => MenuItem[] = (token: Token, theme: "light" | "dark") => {
  if (token.roles.includes("ADMIN")) {
    return [
      {
        title: "Clients",
        icon: <AccountBoxRounded style={{ color: blue[700] }} />,
        route: "/clients",
        desc: "Create, view, and edit your clients list.",
        cardColor: theme === "light" ? "#63a4ff" : "#004ba0",
      },
      {
        title: "Users",
        icon: <AdminPanelSettingsRounded style={{ color: teal[700] }} />,
        route: "/users",
        desc: "Create, view, and edit your users list.",
        cardColor: theme === "light" ? "#48a999" : "#004c40",
      },
      {
        title: "Templates",
        icon: <AssignmentRoundedIcon style={{ color: purple[700] }} />,
        route: "/tasks/templates",
        desc: "Create, view, and edit your template list.",
        cardColor: theme === "light" ? "#ae52d4" : "#4a0072",
      },
      {
        title: "Currencies",
        icon: <MonetizationOnRoundedIcon style={{ color: green[700] }} />,
        route: "/currencies",
        desc: "Create, view, and edit your currencies list.",
        cardColor: theme === "light" ? "#6abf69" : "#00600f",
      },
      {
        title: "Dropdown Values",
        icon: <ViewListRoundedIcon style={{ color: red[700] }} />,
        route: "/settings/dropdown",
        desc: "Create, view, and edit your dropdown values.",
        cardColor: theme === "light" ? "#ba6b6c" : "#9a0007",
      },
    ]
  } else {
    return []
  }
}

export const adminReportsMenuItems: (
  token: Token,
  theme: "light" | "dark"
) => MenuItem[] = (token: Token, theme: "light" | "dark") => {
  if (token.roles.includes("ADMIN")) {
    return [
      {
        title: "Order Status",
        icon: (
          <PrecisionManufacturingRoundedIcon
            style={{ color: deepOrange[700] }}
          />
        ),
        route: "/reports/order-status",
        desc: "Track your orders.",
        cardColor: theme === "light" ? "#ff7d47" : "#ac0800",
      },
      {
        title: "Tasks By Employee",
        icon: <TaskAltRoundedIcon style={{ color: green[700] }} />,
        route: "/reports/tasks-by-employee",
        desc: "Track your orders.",
        cardColor: theme === "light" ? "#6abf69" : "#00600f",
      },
      {
        title: "Pipeline Orders",
        icon: <UpcomingRoundedIcon style={{ color: cyan[700] }} />,
        route: "/reports/pipeline-orders",
        desc: "Track your orders.",
        cardColor: theme === "light" ? "#56c8d8" : "#006978",
      },
      {
        title: "Gantt Chart",
        icon: <InsertChartRoundedIcon style={{ color: lightBlue[700] }} />,
        route: "/reports/gantt",
        desc: "Track your orders.",
        cardColor: theme === "light" ? "#5eb8ff" : "#005b9f",
      },
      {
        title: "Cash Forecast",
        icon: <LocalAtmRoundedIcon style={{ color: green[700] }} />,
        route: "/reports/cash-forecast",
        desc: "Track your orders.",
        cardColor: theme === "light" ? "#6abf69" : "#00600f",
      },
    ]
  } else {
    return []
  }
}

export const passwordHint =
  "Password must be at least 6 characters in length containing at least: 1 uppercase letter, 1 numeric value, 1 lowercase letter, 1special character (!, @, #, $, %, ^, *, -, _, +)"

export const passwordChars = "!, @, #, $, %, ^, *, -, _, +"

export const checkPasswordValidation = (
  password1: string,
  password2: string
) => {
  let isValid =
    password1.length > 5 && password2.length > 5 && password1 === password2

  if (!isValid) {
    return false
  } else {
    let containsUpper = false

    for (let i = 0; i < password1.length; i++) {
      const char = password1.charAt(i)
      if (char === char.toUpperCase()) {
        containsUpper = true
        break
      }
    }

    let containsLower = false

    for (let i = 0; i < password1.length; i++) {
      const char = password1.charAt(i)
      if (char === char.toLocaleLowerCase()) {
        containsLower = true
        break
      }
    }

    let containsNumber = false

    for (let i = 0; i < password1.length; i++) {
      const char = password1.charAt(i)
      if (
        !Number.isNaN(char) &&
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(char))
      ) {
        containsNumber = true
        break
      }
    }

    let containsSpecial = false

    for (let i = 0; i < password1.length; i++) {
      const char = password1.charAt(i)
      if (passwordChars.includes(char)) {
        containsSpecial = true
        break
      }
    }

    return containsUpper && containsLower && containsNumber && containsSpecial
  }
}
