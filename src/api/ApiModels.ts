// Models of the Backend tables

export interface Property {
    id: number
    description: string
    type: number
    is_editable: boolean
    is_required: boolean
    input_type: number
    sort_order: number
}

export enum PropertyInputType {
    Text = 1,
    Password = 2,
    TextArea = 3,
}

export namespace PropertyInputType {
    export function parse(type: number) {
        switch (type) {
            case 1:
                return PropertyInputType.Text
            case 2:
                return PropertyInputType.Password
            case 3:
                return PropertyInputType.TextArea
            default:
                return PropertyInputType.Text
        }
    }
}

export interface Criteria {
    criteria_id: number
    description: string
    criteria_type: number
    is_editable: boolean
    is_required: boolean
    sort_order: number
    criteria_values: CriteriaValue[]
}

export interface CriteriaValue {
    criteria_value_id: number
    criteria_id: number
    description: string
}

export enum CriteriaType {
    Dropdown = 1,
}

export namespace CriteriaType {
    export function parse(type: number) {
        switch (type) {
            case 1:
                return CriteriaType.Dropdown

            default:
                return CriteriaType.Dropdown
        }
    }
}

export interface Role {
    role_id: number
    role_name: string
}
