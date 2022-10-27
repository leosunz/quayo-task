import { grey, red } from "@mui/material/colors"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { api, HttpMethods } from "../api/ApiControllers"
import { CriteriaType, PropertyInputType } from "../api/ApiModels"
import {
  getInitUserUrl,
  InitUser,
  NewUserRequest,
  newUserUrl,
} from "../api/UsersApi"
import AlertDialog from "../components/dialogs/AlertDialog"
import ErrorComponent from "../components/ErrorComponent"
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

export default function NewUserScreen() {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()

  const {
    data,
    isLoading: isInitLoading,
    error,
  } = useFetch<InitUser>(getInitUserUrl, HttpMethods.Get, null, {
    Authorization: `Bearer ${user?.tokenStr}`,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  const getForm: () => DynamicFormElement[] = () => {
    const elements: DynamicFormElement[] = [
      {
        id: "user_code",
        db_id: "user_code",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Username",
        required: true,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 1,
        variant: "outlined",
        removeWhiteSpaces: true,
      },
      {
        id: "description",
        db_id: "description",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Description",
        required: true,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 2,
        variant: "outlined",
      },
      {
        id: "password",
        db_id: "password",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Password",
        required: true,
        type: FormElementType.Password,
        fullWidth: true,
        sortOrder: 3,
        variant: "outlined",
      },
      {
        id: "email",
        db_id: "email",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Email",
        required: true,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 4,
        variant: "outlined",
      },
    ]

    const criteria: DynamicFormElement[] =
      data!.criteria.map<DynamicFormElement>((criterion, index) => {
        return {
          id: "criteria_" + criterion.criteria_id.toString(),
          db_id: criterion.criteria_id.toString(),
          editable: criterion.is_editable,
          formFieldModel: FormFieldModelType.Criteria,
          label: criterion.description,
          required: criterion.is_required,
          type: FormElementType.fromCriteriaType(
            CriteriaType.parse(criterion.criteria_type)
          )!,
          fullWidth: true,
          sortOrder: 4 + index,
          variant: "outlined",
          values: criterion.criteria_values.map<DynamicSelectElement>((cv) => {
            return {
              id: cv.criteria_value_id.toString(),
              description: cv.description,
            }
          }),
        }
      })

    const properties: DynamicFormElement[] = data!.properties.map(
      (property, index) => {
        return {
          id: "property_" + property.id.toString(),
          db_id: property.id.toString(),
          editable: property.is_editable,
          formFieldModel: FormFieldModelType.Property,
          label: property.description,
          required: property.is_required,
          type: FormElementType.fromPropertyInputType(
            PropertyInputType.parse(property.input_type)
          )!,
          fullWidth: true,
          sortOrder: 4 + (data?.properties?.length ?? 0) + index,
          variant: "outlined",
        }
      }
    )

    const roles: DynamicFormElement = {
      id: "role",
      db_id: "role",
      editable: true,
      formFieldModel: FormFieldModelType.Role,
      label: "Role",
      required: true,
      type: FormElementType.Dropdown,
      fullWidth: true,
      sortOrder:
        4 + (data?.properties?.length ?? 0) + (data?.criteria?.length ?? 0) + 1,
      variant: "outlined",
      values: data!.roles.map<DynamicSelectElement>((role) => {
        return {
          id: role.role_id.toString(),
          description: role.role_name,
        }
      }),
    }

    elements.push(...criteria)
    elements.push(...properties)
    elements.push(roles)

    return elements
  }

  const submitForm = async (state: DynamicFormState[]) => {
    // filtering the elements
    const main = state.filter(
      (element) => element.element.formFieldModel === FormFieldModelType.Main
    )
    const props = state.filter(
      (element) =>
        element.element.formFieldModel === FormFieldModelType.Property
    )
    const criteria = state.filter(
      (element) =>
        element.element.formFieldModel === FormFieldModelType.Criteria
    )
    const roles = state.filter(
      (element) => element.element.formFieldModel === FormFieldModelType.Role
    )

    // constructing the body
    const body: NewUserRequest = {
      user_code: main.find((e) => e.element.id === "user_code")!.value,
      password: main.find((e) => e.element.id === "password")!.value,
      email: main.find((e) => e.element.id === "email")!.value,
      description: main.find((e) => e.element.id === "description")!.value,
      properties: props.map((prop) => {
        return {
          property_id: prop.element.db_id as number,
          description: prop.value,
        }
      }),
      criteria: criteria.map((cr) => {
        return {
          user_criteria_value_id: Number(cr.value),
        }
      }),
      roles: roles.map((role) => Number(role.value)),
    }

    // api call
    try {
      setIsLoading(true)
      await api(
        newUserUrl,
        HttpMethods.Post,
        body,
        {
          Authorization: `Bearer ${user?.tokenStr}`,
        },
        undefined,
        false
      )

      navigate("/users")
    } catch (e: any) {
      setDialogTitle("Something went wrong")
      setDialogContent(e.message)
      setDialogOpen(true)
      setIsLoading(false)
    }
  }

  return (
    <ScreenContainer
      isDataLoaded={!isInitLoading && !isLoading && !error && data !== null}
    >
      {isInitLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error} />}
      {isLoading && <Loading text="Creating User" />}
      {data && !isLoading && !isInitLoading && (
        <CreateTemplate
          buttonText="Add"
          formElements={getForm()}
          gridTempCol="1fr 1fr"
          submitForm={submitForm}
          title="New User"
        />
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
