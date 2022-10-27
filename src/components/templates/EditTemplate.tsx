import { Divider, Paper, Typography } from "@mui/material"
import grey from "@mui/material/colors/grey"
import { styled } from "@mui/material/styles"
import CustomDynamicForm from "../form/CustomDynamicForm"
import { DynamicFormElement, DynamicFormState } from "../form/FormModels"
import { StyledDivider } from "../StyledComponents"

const MainContainer = styled(Paper)(({ theme }) => {
  return {
    width: "95%",
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "flex-start",
    paddingTop: theme.spacing(3),
    backgroundColor:
      theme.palette.mode == "light"
        ? grey[200]
        : theme.palette.background.paper,
  }
})

const StyledTypo = styled(Typography)(({ theme }) => {
  return {
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
  }
})

export interface EditTemplateProps {
  title: string
  formElements: DynamicFormElement[]
  submitForm(state: DynamicFormState[]): Promise<void>
  gridTempCol: string
}

export default function EditTemplate(props: EditTemplateProps) {
  return (
    <MainContainer>
      <StyledTypo gutterBottom variant="h4">
        {props.title}
      </StyledTypo>
      <StyledDivider />
      <CustomDynamicForm
        buttonText="Update"
        formElements={props.formElements}
        submitForm={props.submitForm}
        gridTempCol={props.gridTempCol}
      />
    </MainContainer>
  )
}
