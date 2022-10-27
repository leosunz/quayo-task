import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthContextProvider from "./contexts/AuthContext"
import {
  EnsureAuthenticated,
  EnsureUnAuthenticated,
} from "./components/ProtectedComponents"
import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen"
import ClientsScreen from "./screens/ClientsScreen"
import NewClientScreen from "./screens/NewClientScreen"
import UsersScreen from "./screens/UsersScreen"
import UserDetailsScreen from "./screens/UserDetailsScreen"
import NewUserScreen from "./screens/NewUserScreen"
import ClientDetailsScreen from "./screens/ClientDetailsScreen"
import MainTemplatesScreen from "./screens/MainTemplatesScreen"
import MainTemplateDetailsScreen from "./screens/MainTemplateDetailsScreen"

// Tree
import NewMainTaskTemplateScreen from "./screens/NewMainTaskTemplateScreen"
import "@nosferatu500/react-sortable-tree/style.css"
import TaskTemplateContextProvider from "./contexts/TaskTemplateContext"
import NotFound from "./screens/NotFound"
import ProjectsScreen from "./screens/ProjectsScreen"
import ProjectContextProvider from "./contexts/ProjectContext"
import ProjectDetailsScreen from "./screens/ProjectDetailsScreen"
import NewProjectScreen from "./screens/NewProjectScreen"
import ProjectTasksEditScreen from "./screens/ProjectTasksEditScreen"
import EditTasksScreenContextProvider from "./contexts/EditTaskScreenContext"
import ProjectPaymentContextProvider from "./contexts/ProjectPaymentContext"
import ProjectPaymentScreen from "./screens/ProjectPaymentScreen"
import CurrenciesScreen from "./screens/CurrenciesScreen"
import CurrenciesContextProvider from "./contexts/CurrenciesContext"
import DropdownValuesScreen from "./screens/DropdownValuesScreen"
import DropdownContextProvider from "./contexts/DropdownContext"
import RescheduleRequestsScreen from "./screens/RescheduleRequestsScreen"
import ThemeContextProvider from "./contexts/ThemeContext"
import ProjectPreviewContextProvider from "./contexts/ProjectPreviewContext"
import ProjectPreviewWithAssignedTasks from "./screens/ProjectPreviewWithAssignedTasks"
import OrderStatusScreen from "./screens/OrderStatusScreen"
import TasksByEmployeeScreen from "./screens/TasksByEmployeeScreen"
import PipelineOrdersScreen from "./screens/PipelineOrdersScreen"
import GanttScreen from "./screens/GanttScreen"
import AvgDurationTaskScreen from "./screens/AvgDurationTaskScreen"
import CashForecastScreen from "./screens/CashForecastScreen"
import ChangePasswordScreen from "./screens/ChangePasswordScreen"
import EditProjectHeadersContextProvider, {
  EditProjectHeadersContext,
} from "./contexts/EditProjectHeadersContext"
import EditProjectHeadersScreen from "./screens/EditProjectHeadersScreen"

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <AuthContextProvider>
          <div className="App">
            <Routes>
              <Route
                path="/"
                element={<EnsureAuthenticated children={<HomeScreen />} />}
              >
                {/* Clients */}
                <Route
                  path="/clients"
                  element={<EnsureAuthenticated children={<ClientsScreen />} />}
                />
                <Route
                  path="/clients/:id"
                  element={
                    <EnsureAuthenticated children={<ClientDetailsScreen />} />
                  }
                />
                <Route
                  path="/clients/new"
                  element={
                    <EnsureAuthenticated children={<NewClientScreen />} />
                  }
                />

                {/* Users */}
                <Route
                  path="/users"
                  element={<EnsureAuthenticated children={<UsersScreen />} />}
                />
                <Route
                  path="/users/:id"
                  element={
                    <EnsureAuthenticated children={<UserDetailsScreen />} />
                  }
                />
                <Route
                  path="/users/new"
                  element={<EnsureAuthenticated children={<NewUserScreen />} />}
                />

                {/* Templ */}
                <Route
                  path="/tasks/templates"
                  element={
                    <EnsureAuthenticated children={<MainTemplatesScreen />} />
                  }
                />
                <Route
                  path="/tasks/templates/:id"
                  element={
                    <EnsureAuthenticated
                      children={
                        <TaskTemplateContextProvider>
                          <MainTemplateDetailsScreen />
                        </TaskTemplateContextProvider>
                      }
                    />
                  }
                />
                <Route
                  path="/tasks/templates/new"
                  element={
                    <EnsureAuthenticated
                      children={<NewMainTaskTemplateScreen />}
                    />
                  }
                />
                {/* Projects */}
                <Route
                  path="/projects"
                  element={
                    <EnsureAuthenticated children={<ProjectsScreen />} />
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <EnsureAuthenticated
                      children={
                        <ProjectContextProvider>
                          <ProjectDetailsScreen />
                        </ProjectContextProvider>
                      }
                    />
                  }
                />
                <Route
                  path="/projects/:id/tasks/edit"
                  element={
                    <EnsureAuthenticated
                      children={
                        <EditTasksScreenContextProvider>
                          <ProjectTasksEditScreen />
                        </EditTasksScreenContextProvider>
                      }
                    />
                  }
                />
                <Route
                  path="/projects/:id/tasks/duration/report"
                  element={
                    <EnsureAuthenticated children={<AvgDurationTaskScreen />} />
                  }
                />
                <Route
                  path="/projects/:id/payments"
                  element={
                    <EnsureAuthenticated
                      children={
                        <ProjectPaymentContextProvider>
                          <ProjectPaymentScreen />
                        </ProjectPaymentContextProvider>
                      }
                    />
                  }
                />
                <Route
                  path="/projects/:id/reschedule"
                  element={
                    <EnsureAuthenticated
                      children={<RescheduleRequestsScreen />}
                    />
                  }
                />
                <Route
                  path="/projects/new"
                  element={
                    <EnsureAuthenticated children={<NewProjectScreen />} />
                  }
                />
                <Route
                  path="/projects/:id/preview"
                  element={
                    <EnsureAuthenticated
                      children={
                        <ProjectPreviewContextProvider>
                          <ProjectPreviewWithAssignedTasks />
                        </ProjectPreviewContextProvider>
                      }
                    />
                  }
                />
                <Route
                  path="/projects/:id/edit"
                  element={
                    <EnsureAuthenticated
                      children={
                        <EditProjectHeadersContextProvider>
                          <EditProjectHeadersScreen />
                        </EditProjectHeadersContextProvider>
                      }
                    />
                  }
                />
                {/* Currencies */}
                <Route
                  path="/currencies"
                  element={
                    <EnsureAuthenticated
                      children={
                        <CurrenciesContextProvider>
                          <CurrenciesScreen />
                        </CurrenciesContextProvider>
                      }
                    />
                  }
                />
                {/* Dropdown */}
                <Route
                  path="/settings/dropdown"
                  element={
                    <EnsureAuthenticated
                      children={
                        <DropdownContextProvider>
                          <DropdownValuesScreen />
                        </DropdownContextProvider>
                      }
                    />
                  }
                />
                {/* Order Status */}
                <Route
                  path="/reports/order-status"
                  element={
                    <EnsureAuthenticated children={<OrderStatusScreen />} />
                  }
                />
                <Route
                  path="/reports/tasks-by-employee"
                  element={
                    <EnsureAuthenticated children={<TasksByEmployeeScreen />} />
                  }
                />
                <Route
                  path="/reports/pipeline-orders"
                  element={
                    <EnsureAuthenticated children={<PipelineOrdersScreen />} />
                  }
                />
                <Route
                  path="/reports/gantt"
                  element={<EnsureAuthenticated children={<GanttScreen />} />}
                />
                <Route
                  path="/reports/cash-forecast"
                  element={
                    <EnsureAuthenticated children={<CashForecastScreen />} />
                  }
                />
                {/* Password */}
                <Route
                  path="/change-password"
                  element={
                    <EnsureAuthenticated children={<ChangePasswordScreen />} />
                  }
                />
              </Route>
              <Route
                path="/login"
                element={<EnsureUnAuthenticated children={<LoginScreen />} />}
              />
              <Route
                path="/*"
                element={<EnsureAuthenticated children={<NotFound />} />}
              />
            </Routes>
          </div>
        </AuthContextProvider>
      </BrowserRouter>
    </ThemeContextProvider>
  )
}

export default App

// TODO: check fast-deep-equal
