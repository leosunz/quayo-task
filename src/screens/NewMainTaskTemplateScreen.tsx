import { grey } from "@mui/material/colors"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { api, HttpMethods } from "../api/ApiControllers"
import { CriteriaType, PropertyInputType } from "../api/ApiModels"
import {
  getTimeUnitsUrl,
  NewMainTaskRequest,
  newMainTaskTemplateUrl,
  TimeUnit,
} from "../api/TaskTemplateApi"
import { newUserUrl } from "../api/UsersApi"
import AlertDialog from "../components/dialogs/AlertDialog"
import ErrorComponent from "../components/ErrorComponent"
import CustomDynamicForm from "../components/form/CustomDynamicForm"
import {
  DynamicFormElement,
  DynamicFormState,
  DynamicSelectElement,
  FormElementType,
  FormFieldModelType,
} from "../components/form/FormModels"
import Loading from "../components/Loading"
import { ScreenContainer } from "../components/StyledComponents"
import CreateTemplate from "../components/templates/CreateTemplate"
import { AuthContext } from "../contexts/AuthContext"
import useFetch from "../hooks/useFetch"

export default function NewMainTaskTemplateScreen() {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()

  // state
  const [isLoading, setIsLoading] = useState(false)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  // fetch
  const {
    data: timeUnits,
    isLoading: initLoading,
    error,
  } = useFetch<TimeUnit[]>(getTimeUnitsUrl, HttpMethods.Get, null, {
    Authorization: `Bearer ${user?.tokenStr}`,
  })

  const getForm: () => DynamicFormElement[] = () => {
    const elements: DynamicFormElement[] = [
      {
        id: "task_name",
        db_id: "task_name",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Task Name",
        required: true,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 1,
        variant: "outlined",
      },
      {
        id: "task_code",
        db_id: "task_code",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Task Code",
        required: false,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 1,
        variant: "outlined",
      },
      {
        id: "description",
        db_id: "description",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Description",
        required: false,
        type: FormElementType.TextArea,
        fullWidth: true,
        sortOrder: 2,
        variant: "outlined",
      },
      {
        id: "estimated_time",
        db_id: "estimated_time",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Estimated Time",
        required: true,
        type: FormElementType.Number,
        fullWidth: true,
        sortOrder: 1,
        variant: "outlined",
      },
      {
        id: "time_unit_id",
        db_id: "time_unit_id",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Unit",
        required: true,
        type: FormElementType.Dropdown,
        fullWidth: true,
        sortOrder: 4,
        variant: "outlined",
        values: timeUnits!.map<DynamicSelectElement>((tUnit) => {
          return {
            id: tUnit.id.toString(),
            description: tUnit.description,
          }
        }),
      },
    ]

    return elements
  }

  const submitForm = async (state: DynamicFormState[]) => {
    // filtering the elements
    const main = state.filter(
      (element) => element.element.formFieldModel === FormFieldModelType.Main
    )

    // constructing the body
    const body: NewMainTaskRequest = {
      task_name: main.find((e) => e.element.id === "task_name")!.value,
      task_code: main.find((e) => e.element.id === "task_code")!.value,
      description: main.find((e) => e.element.id === "description")!.value,
      time_unit_id: Number(
        main.find((e) => e.element.id === "time_unit_id")!.value
      ),
      estimated_time: Number(
        main.find((e) => e.element.id === "estimated_time")!.value
      ),
      sort_order: 1,
    }
    // api call
    try {
      setIsLoading(true)
      const response = await api<{ id: number }>(
        newMainTaskTemplateUrl,
        HttpMethods.Post,
        body,
        {
          Authorization: `Bearer ${user?.tokenStr}`,
        },
        undefined
      )
      console.log(response)

      const redirect = response
        ? `/tasks/templates/${response.id}`
        : "/tasks/templates/"

      navigate(redirect)
    } catch (e: any) {
      setDialogTitle("Something went wrong")
      setDialogContent(e.message)
      setDialogOpen(true)
      setIsLoading(false)
    }
  }

  return (
    <ScreenContainer
      isDataLoaded={!initLoading && !isLoading && !error && timeUnits !== null}
    >
      {initLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error} />}
      {isLoading && <Loading text="Creating Template" />}
      {timeUnits && !isLoading && !initLoading && (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "stretch",
          }}
        >
          <CreateTemplate
            buttonText="Create"
            formElements={getForm()}
            gridTempCol="1fr 1fr"
            submitForm={submitForm}
            title="New Template"
          />
        </div>
      )}

      <AlertDialog
        content={dialogContent}
        isOpen={dialogOpen}
        title={dialogTitle}
        onClose={() => setDialogOpen(false)}
      />
    </ScreenContainer>
  )
}
