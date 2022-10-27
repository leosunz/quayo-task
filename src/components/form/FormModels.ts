import { PropertyInputType, CriteriaType } from "../../api/ApiModels"

export type formVariants = "standard" | "filled" | "outlined"

export enum FormElementType {
  Dropdown = 1,
  Text = 2,
  Password = 3,
  RadioGroup = 4,
  Checkbox = 5,
  TextArea = 6,
  Number = 7,
  Date = 8,
}

export namespace FormElementType {
  export function fromPropertyInputType(type: PropertyInputType) {
    if (type === PropertyInputType.Text) {
      return FormElementType.Text
    } else if (type === PropertyInputType.Password) {
      return FormElementType.Password
    } else if (type === PropertyInputType.TextArea) {
      return FormElementType.TextArea
    }
  }

  export function fromCriteriaType(type: CriteriaType) {
    if (type === CriteriaType.Dropdown) {
      return FormElementType.Dropdown
    }
  }
}

export interface DynamicFormElement {
  db_id: number | string
  id: string
  type: FormElementType
  required: boolean
  editable: boolean
  label: string
  sortOrder?: number
  formFieldModel: FormFieldModelType
  fullWidth?: boolean
  variant?: formVariants
  values?: DynamicSelectElement[]
  initialValue?: string
  removeWhiteSpaces?: boolean
}

export interface DynamicSelectElement {
  id: string
  description: string
}

export interface DynamicFormState {
  element: DynamicFormElement
  value: string
  error: boolean
}

// export interface DynamicFormSubmit {
//   id: string
//   value: string
// }

/**
 * Type of the field on the BE.
 * Main for main colmns, property and criteria
 */
export enum FormFieldModelType {
  Main,
  Property,
  Criteria,
  Role,
  Address,
  Currency,
  Display, // only for display purposes
}
