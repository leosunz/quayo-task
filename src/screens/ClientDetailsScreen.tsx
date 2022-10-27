import { useContext, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { api, HttpMethods } from "../api/ApiControllers"
import { CriteriaType, PropertyInputType } from "../api/ApiModels"
import {
  ClientWithTemplate,
  getClientByCodeUrl,
  UpdateClientRequest,
} from "../api/ClientsApi"
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

export default function ClientDetailsScreen() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()

  const {
    data,
    isLoading: isInitLoading,
    error,
  } = useFetch<ClientWithTemplate>(
    getClientByCodeUrl(id!),
    HttpMethods.Get,
    null,
    {
      Authorization: `Bearer ${user?.tokenStr}`,
    }
  )
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  const getForm: () => DynamicFormElement[] = () => {
    const elements: DynamicFormElement[] = [
      {
        id: "client_code",
        db_id: "client_code",
        editable: false,
        formFieldModel: FormFieldModelType.Main,
        label: "Client username",
        required: false,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 1,
        variant: "outlined",
        initialValue: data!.client.client_code,
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
        initialValue: data!.client.description,
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
        sortOrder: 3,
        variant: "outlined",
        initialValue: data!.client.is_active ? "1" : "0",
        values: [0, 1].map((i) => {
          return {
            id: i.toString(),
            description: i === 0 ? "Disabled" : "Active",
          }
        }),
      },
      {
        id: "barcode",
        db_id: "barcode",
        editable: false,
        formFieldModel: FormFieldModelType.Display,
        label: "Barcode",
        required: false,
        type: FormElementType.Text,
        fullWidth: true,
        sortOrder: 4,
        variant: "outlined",
        initialValue: data!.client.barcode,
      },
    ]

    const criteria: DynamicFormElement[] =
      data!.template.criteria.map<DynamicFormElement>((criterion, index) => {
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
          initialValue: data!.client.criteria_values
            .find((cr) => cr.criteria_id == criterion.criteria_id)
            ?.criteria_value_id?.toString(),
        }
      })

    const properties: DynamicFormElement[] = data!.template.properties.map(
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
          sortOrder: 4 + (data?.template?.properties?.length ?? 0) + index,
          variant: "outlined",
          initialValue: data!.client.properties.find(
            (pr) => pr.property_id == property.id
          )!.description,
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
      values: data!.template.currencies.map<DynamicSelectElement>((curr) => {
        return {
          id: curr.currency_code,
          description: curr.currency_symbol,
        }
      }),
      initialValue: data!.client.currency_code,
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
      values: data!.template.sales_representatives.map<DynamicSelectElement>(
        (rep) => {
          return {
            id: rep.user_code,
            description: rep.description,
          }
        }
      ),
      initialValue: data!.client.default_user,
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
      values: data!.template.addresses.map<DynamicSelectElement>((add) => {
        return {
          id: add.address_code,
          description: add.description,
        }
      }),
      initialValue: data!.client.addresses[0].address_code,
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
    const body: UpdateClientRequest = {
      description: main.find((e) => e.element.id === "description")!.value,
      is_active: main.find((e) => e.element.id === "is_active")!.value === "1",
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

    // api call
    try {
      setIsLoading(true)
      await api(
        getClientByCodeUrl(id!),
        HttpMethods.Patch,
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
      {isInitLoading && <Loading text="Loading Client.." />}
      {error && <ErrorComponent text={error} />}
      {isLoading && <Loading text="Updating Client" />}
      {data && !isLoading && !isInitLoading && (
        <EditTemplate
          formElements={getForm()}
          gridTempCol="1fr 1fr"
          submitForm={submitForm}
          title="Update Client"
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
