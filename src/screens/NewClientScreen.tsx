import { grey, red } from "@mui/material/colors"
import { useContext, useState } from "react"
import { useNavigate } from "react-router"
import { api, HttpMethods } from "../api/ApiControllers"
import { CriteriaType, PropertyInputType } from "../api/ApiModels"
import {
  ClientInit,
  getNewClientInitUrl,
  NewClientRequest,
  newClientUrl,
} from "../api/ClientsApi"
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

export default function NewClientScreen() {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()

  const {
    data,
    isLoading: isInitLoading,
    error,
  } = useFetch<ClientInit>(getNewClientInitUrl, HttpMethods.Get, null, {
    Authorization: `Bearer ${user?.tokenStr}`,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  const getForm: () => DynamicFormElement[] = () => {
    const elements: DynamicFormElement[] = [
      {
        id: "client_code",
        db_id: "client_code",
        editable: true,
        formFieldModel: FormFieldModelType.Main,
        label: "Client username",
        required: true,
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
        required: true,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 2,
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

    // currency drop down
    const currency: DynamicFormElement = {
      id: "currency_code",
      db_id: "currency_code",
      editable: true,
      formFieldModel: FormFieldModelType.Criteria,
      label: "Currency",
      required: true,
      type: FormElementType.Dropdown,
      fullWidth: true,
      sortOrder: 1,
      variant: "outlined",
      values: data?.currencies.map<DynamicSelectElement>((curr) => {
        return {
          id: curr.currency_code,
          description: curr.currency_symbol,
        }
      }),
    }

    // sales rep
    const sales: DynamicFormElement = {
      id: "sales_representative",
      db_id: "sales_representative",
      editable: true,
      formFieldModel: FormFieldModelType.Criteria,
      label: "Sales Rep.",
      required: true,
      type: FormElementType.Dropdown,
      fullWidth: true,
      sortOrder: 1,
      variant: "outlined",
      values: data?.sales_representatives.map<DynamicSelectElement>((rep) => {
        return {
          id: rep.user_code,
          description: rep.description,
        }
      }),
    }

    // TODO country
    const address: DynamicFormElement = {
      id: "address_code",
      db_id: "address_code",
      editable: true,
      formFieldModel: FormFieldModelType.Criteria,
      label: "Country",
      required: true,
      type: FormElementType.Dropdown,
      fullWidth: true,
      sortOrder: 1,
      variant: "outlined",
      values: data?.addresses.map<DynamicSelectElement>((add) => {
        return {
          id: add.address_code,
          description: add.description,
        }
      }),
    }

    elements.push(...criteria)
    elements.push(...properties)
    elements.push(currency)
    elements.push(sales)
    elements.push(address)

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
    const body: NewClientRequest = {
      client_code: main.find((e) => e.element.id === "client_code")!.value,
      description: main.find((e) => e.element.id === "description")!.value,
      properties: props.map((prop) => {
        return {
          property_id: prop.element.db_id as number,
          description: prop.value,
        }
      }),
      criteria: criteria
        .map((cr) => {
          return {
            client_criteria_value_id: Number(cr.value),
          }
        })
        .filter((e) => !Number.isNaN(e.client_criteria_value_id)),
      sales_representative: criteria.find(
        (e) => e.element.id === "sales_representative"
      )!.value,
      currency_code: criteria.find((e) => e.element.id === "currency_code")!
        .value,
      address_code: criteria.find((e) => e.element.id === "address_code")!
        .value,
    }
    console.log(body)

    // api call
    try {
      setIsLoading(true)
      await api(
        newClientUrl,
        HttpMethods.Post,
        body,
        {
          Authorization: `Bearer ${user?.tokenStr}`,
        },
        undefined,
        false
      )

      navigate("/clients")
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
      {isLoading && <Loading text="Creating Client" />}
      {data && !isLoading && !isInitLoading && (
        <CreateTemplate
          buttonText="Add"
          formElements={getForm()}
          gridTempCol="1fr 1fr"
          submitForm={submitForm}
          title="New Client"
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
