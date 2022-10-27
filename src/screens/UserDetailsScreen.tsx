import { useParams } from "react-router"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { api, HttpMethods } from "../api/ApiControllers"
import { CriteriaType, PropertyInputType } from "../api/ApiModels"
import { getUserUrl, UpdateUser, UserWithTemplate } from "../api/UsersApi"
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
import { AuthContext } from "../contexts/AuthContext"
import useFetch from "../hooks/useFetch"
import EditTemplate from "../components/templates/EditTemplate"
import Button from "@mui/material/Button"
import { useTheme } from "@mui/material/styles"
import ChangeUserPasswordDialog from "../components/dialogs/ChangeUserPasswordDialog"

export default function UserDetailsScreen() {
  const { id } = useParams()

  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()
  const theme = useTheme()

  const {
    data: userData,
    isLoading: isUserDataLoading,
    error,
  } = useFetch<UserWithTemplate>(getUserUrl(id!), HttpMethods.Get, null, {
    Authorization: `Bearer ${user?.tokenStr}`,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  // password
  const [changePassDialog, setChangePassDialog] = useState(false)

  const getForm: () => DynamicFormElement[] = () => {
    const elements: DynamicFormElement[] = [
      {
        id: "user_code",
        db_id: "user_code",
        editable: false,
        formFieldModel: FormFieldModelType.Main,
        label: "Username",
        required: true,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 1,
        variant: "outlined",
        initialValue: userData?.user.user_code,
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
        initialValue: userData?.user.description,
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
        initialValue: userData?.user.email,
      },
      {
        id: "is_active",
        db_id: "is_active",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Status",
        required: true,
        type: FormElementType.Dropdown,
        fullWidth: true,
        sortOrder: 5,
        variant: "outlined",
        initialValue: userData?.user.is_active ? "1" : "0",
        values: [0, 1].map((i) => {
          return {
            id: i.toString(),
            description: i === 0 ? "Disabled" : "Active",
          }
        }),
      },
    ]

    const criteria: DynamicFormElement[] =
      userData!.template.criteria.map<DynamicFormElement>(
        (criterion, index) => {
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
            initialValue: userData?.user.criteria_values
              .find((c) => c.criteria_id === criterion.criteria_id)
              ?.criteria_value_id?.toString(),
            values: criterion.criteria_values.map<DynamicSelectElement>(
              (cv) => {
                return {
                  id: cv.criteria_value_id.toString(),
                  description: cv.description,
                }
              }
            ),
          }
        }
      )

    const properties: DynamicFormElement[] = userData!.template.properties.map(
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
          sortOrder: 4 + (userData?.template?.properties?.length ?? 0) + index,
          variant: "outlined",
          initialValue: userData?.user.properties.find(
            (p) => p.property_id === property.id
          )?.description,
        }
      }
    )

    const roles: DynamicFormElement = {
      id: "role",
      db_id: "role",
      editable: false,
      formFieldModel: FormFieldModelType.Role,
      label: "Role",
      required: true,
      type: FormElementType.Dropdown,
      fullWidth: true,
      sortOrder:
        4 +
        (userData?.template?.properties?.length ?? 0) +
        (userData?.template?.criteria?.length ?? 0) +
        1,
      variant: "outlined",
      values: userData!.template.roles.map<DynamicSelectElement>((role) => {
        return {
          id: role.role_id.toString(),
          description: role.role_name,
        }
      }),
      initialValue: userData?.user?.roles[0]?.role_id?.toString(),
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

    // constructing the body
    const body: UpdateUser = {
      email: main.find((e) => e.element.id === "email")!.value,
      is_active: main.find((e) => e.element.id === "is_active")!.value === "1",
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
    }

    // api call
    try {
      setIsLoading(true)
      await api(
        getUserUrl(id!),
        HttpMethods.Patch,
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
      isDataLoaded={
        !isUserDataLoading && !isLoading && !error && userData !== null
      }
    >
      {isUserDataLoading && <Loading text="Loading User.." />}
      {error && <ErrorComponent text={error} />}
      {isLoading && <Loading text="Updating User" />}
      {userData && !isLoading && !isUserDataLoading && (
        <>
          <EditTemplate
            formElements={getForm()}
            gridTempCol="1fr 1fr"
            submitForm={submitForm}
            title="Update User"
          />
          <Button
            color="warning"
            style={{ alignSelf: "flex-end", margin: theme.spacing(2) }}
            onClick={() => setChangePassDialog(true)}
          >
            Change User Password
          </Button>
        </>
      )}
      <AlertDialog
        content={dialogContent}
        isOpen={dialogOpen}
        title={dialogTitle}
        onClose={() => setDialogOpen(false)}
      />
      <ChangeUserPasswordDialog
        userCode={id!}
        dismiss={() => setChangePassDialog(false)}
        isOpen={changePassDialog}
      />
    </ScreenContainer>
  )
}
