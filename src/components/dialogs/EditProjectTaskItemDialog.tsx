import { Button, Dialog, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { api, HttpMethods } from "../../api/ApiControllers"
import { addTaskMoreDetailsUrl, editProjectTaskItemUrl } from "../../api/TaskTemplateApi"
import { AuthContext } from "../../contexts/AuthContext"
import { InputContainer } from "../StyledComponents"

export interface EditProjectTaskItemDialog {
    open: boolean
    handleClose: () => void
    taskId: number
    projectId: number
    item_number: string
    item_name: string
    quantity: number
    item_id: number
    dismiss(): void 
}



export default function EditProjectTaskItemDialog(
    props: EditProjectTaskItemDialog
  ) {


   
    const { user } = useContext(AuthContext)!
    //const [itemNumber, setItemNumber] = useState({ error: false, value: "" })
   const [itemNumber, setItemNumber] = useState({ error: false, value: props.item_number })
   // const [itemName, setItemName] = useState({ error: false, value: "" })
    const [itemName, setItemName] = useState({ error: false, value: props.item_name })
   // const [quantity, setQuantity] = useState({ error: false, value: 0 })
    const [quantity, setQuantity] = useState({ error: false, value: props.quantity })

    const [open, setOpen] = useState(props.open)

    console.log("ITEM NUMBEEr", props.item_number, itemNumber)



    function setInputsValues(){
       
        setItemName({ error: false, value: props.item_name })
        setItemNumber({ error: false, value: props.item_number })
        setQuantity({ error: false, value: props.quantity })
    }


    useEffect(()=>{
      console.log("uxsdsdsfdfdgfs") 
      if(props.open==true){
        setInputsValues()
      }
    }, [props.open])
   
  //  ()=>{
      //setInputsValues()
    //}

   // setInputsValues()

    // useEffect(()=>{
    //   console.log("uxs") 
    //     setInputsValues()
    //   }, [])

      
      function validate(): boolean {
        let valid = true

        if(itemName.value == ""){
            setItemName({error: true, value: ''})
            valid=false
        }else{
            setItemName({error: false, value: itemName.value})
        }
    
        if(Number.isNaN(itemNumber.value)){
            setItemNumber({error: true, value: ""})
            valid= false
        }else{
            setItemNumber({error: false, value: itemNumber.value})
        }

        if(Number.isNaN(quantity.value)){
            setQuantity({error: true, value: 0})
            valid=false
        }else{
            setQuantity({error: false, value: quantity.value})
            
        }
    
        return valid
      }

      function clear() {
        setItemName({error: false, value: ''})
  
        setItemNumber({error: false, value: ""})
    
        setQuantity({error: false, value: 0})
  }
  

    const submit =  async  ()=>{

        try {
            if(validate()){
              console.log("EDIIT BODY:",  { id: props.item_id,project_id: props.projectId, task_id: props.taskId,item_name: itemName.value, item_number: itemNumber.value, quantity: quantity.value })
            const res: any = await api<any>(
                editProjectTaskItemUrl(),
                HttpMethods.Patch,
                { id: props.item_id,project_id: props.projectId, task_id: props.taskId,item_name: itemName.value, item_number: itemNumber.value, quantity: quantity.value },
                //null,
                {
                  Authorization: `Bearer ${user?.tokenStr}`,
                },
                "Something went wrong",
                true
              )
            }

             
        clear()
        props.dismiss()
        
            
        } catch (error: any) {
            
        }
       

      }


      return(
        <Dialog
              open={props.open}
              onClose={() => {
                  props.handleClose()
              } }
              onBackdropClick={()=>{
                props.dismiss()
                
              }}
          >

<InputContainer>
           <Typography variant="h6">Item Number: &nbsp;&nbsp;</Typography>
            <TextField
              required
              type="number"
              label="Item Number"
              value={itemNumber.value}
              error={itemNumber.error}
              onChange={(e) => {
                setItemNumber( {
                  error: itemNumber.error, 
                  value: e.target.value, 
                })
              }}
            />
            </InputContainer>   

            <InputContainer>
            <Typography variant="h6">Item name: &nbsp;&nbsp;</Typography>
            <TextField
              required
              label="Item Name"
              value={itemName.value}
              type="text"
              error={itemName.error}
              onChange={(e) => {
                setItemName({ error: itemName.error, value: e.target.value })
              }}
            />
            </InputContainer>

            <InputContainer>
            <Typography variant="h6">Quantity: &nbsp;&nbsp;</Typography>
            <TextField
              required
              type="number"
              label="Quantity"
              value={quantity.value}
              error={quantity.error}
              onChange={(e) => {
                setQuantity({
                  error: quantity.error,
                  value: parseInt(e.target.value),
                })
              }}
            />
            </InputContainer>

            <Button onClick={submit}>Edit</Button>

        </Dialog>
      )

  }