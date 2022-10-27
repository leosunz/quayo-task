import { Button, Dialog, IconButton, styled, TextField, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { api, HttpMethods } from "../../api/ApiControllers"
import { addTaskMoreDetailsUrl, deleteProjectTaskItemUrl, taskMoredetailsUrl } from "../../api/TaskTemplateApi"
import { AuthContext } from "../../contexts/AuthContext"
import { CustomPaginationTableRow } from "../reusable/CustomPaginationTable"
import LivePaginationTable, { PaginationActionType } from "../reusable/LivePaginationTable"
import { InputContainer, StyledVerticalDivider } from "../StyledComponents"
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { blue, red } from "@mui/material/colors"
import EditProjectTaskItemDialog from "./EditProjectTaskItemDialog"
import ConfirmationDialog from "./ConfirmationDialog"
import { Console } from "console"

export interface TaskMoreDetailsDialog {
    open: boolean
    handleClose: () => void
    taskId: number
    projectId: number
    data: any[]
}

export interface ITaskItem{
    id: number
    item_number: string
    item_name: string
    quantity: number
}


const HeaderContainer = styled("div")(({ theme }) => {
    return {
      width: "100%",
      // backgroundColor: grey[200],
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    }
  })

export default function TaskMoreDetailsDialog(
    props: TaskMoreDetailsDialog
  ) {

    

    const [pageNumber, setPageNumber] = useState(0)
    const [pageCount, setPageCount] = useState(1)
    const [data, setData] = useState<ITaskItem[]>(props.data)
    const { user } = useContext(AuthContext)!
    const [itemNumber, setItemNumber] = useState({ error: false, value: "" })
    const [itemName, setItemName] = useState({ error: false, value: "" })
    const [quantity, setQuantity] = useState({ error: false, value: 0 })

    const [currentItemNumber, setCurrentItemNumber] = useState("")
    const [currentItemName, setCurrentItemName] = useState("testestt")
    const [currentQuantity, setCurrentQuantity] = useState(0)
    const [currentItemId, setCurrentItemId] = useState(0)

    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  
    const [openEditDialog, setOpenEditDialog] = useState(false)

    var currentname = "testinitial"

    const onEditClick = ()=>{

    }

    useEffect(()=>{
      getData()
    }, [openEditDialog])
    useEffect(()=>{
      getData()
    }, [isConfirmOpen])
    useEffect(()=>{
      getData()
    }, [props.open])


    const getTableState =  (data: ITaskItem[]) => {
    
        const headers: string[] = [
          "Item Number",
          "Item Name",
          "Quantity",
          "Actions"
        ]

      
        const rows:  CustomPaginationTableRow[] = data.map((detail) => {
 
            return {
              id: detail.id,
              cells: [
                detail.item_number,
                detail.item_name,
                detail.quantity, 
                   
            <div style={{ display: "flex", flexDirection: "row" }}>
            <IconButton
              onClick={() => {
           
                setCurrentItemName(detail.item_name)
                setCurrentItemNumber(detail.item_number)
                setCurrentQuantity(detail.quantity)
                setCurrentItemId(detail.id)
                setOpenEditDialog(true)
                console.log("CURRENTTT NAME",detail.item_name ,  currentItemName )
                // setComment(task.comment ?? "No comments yet.")
                // setCommentDialog(true)
              }}
            >
              <EditIcon
                style={{
                  color: blue[800],
                }}
              />
            </IconButton>

            <IconButton
              onClick={() => {
                setCurrentItemId(detail.id)
                setIsConfirmOpen(true)
                // setcurrentTaskId(task.id)
                // setIsMoreDetailsDialogOpen(true)
              }}
            >
              <DeleteForeverIcon
                style={{
                  color: red[500],
                }}
              />
            </IconButton>

          </div>
              
              ],
            }

        })
    
    
        return {
          heads: headers,
          rows,
        }
    
    
      }

    const getData = async () => {
        try {

          console.log("GET DATATATATATATATTA")
      
          const res: any = await api<ITaskItem[]>(
            taskMoredetailsUrl(props.projectId, props.taskId),
            HttpMethods.Get,
            //{ page_number: pageNum, search: search },
            null,
            {
              Authorization: `Bearer ${user?.tokenStr}`,
            },
            "Something went wrong",
            true
          )
     

          setData(res!)
          console.log("ressss",res)

          // //props.data.splice(0,props.data.length)
          // res!.forEach((item: ITaskItem )=> {
          //   props.data.push(item)
          // });

          // props.data = res!

          console.log("PROPSSS DATA",props.data)
      
        } catch (e: any) {
          console.log("ERRRR",e)
      
        }
      }

      

      const addItem = async () =>{
        try {
            const res: any = await api<any>(
                addTaskMoreDetailsUrl(),
                HttpMethods.Post,
                { projectId: props.projectId, taskId: props.taskId,itemName: itemName, itemNumber: itemNumber, quantity: quantity },
                //null,
                {
                  Authorization: `Bearer ${user?.tokenStr}`,
                },
                "Something went wrong",
                true
              )
            
        } catch (error: any) {
            
        }
      }

      //URLS
      //taskMoredetailsUrl
      //addTaskMoreDetailsUrl



    const movePageCallback = async (type: PaginationActionType, page?: number) => {


        // switch (type) {
        //   case PaginationActionType.Input:{
        //     if (page == null || page == undefined || page == NaN) {
        //       break
        //     }else{
        //       getData(page!!)
        //       break
        //     }
      
        //   }
        //   case PaginationActionType.First: {
        //     getData(0)
        //     break
        //   }
        //   case PaginationActionType.Previous: {
        //     let newPage
        //    // if (!didSearchChange) {
        //       newPage = pageNumber - 1
        //     // } else {
        //     //   newPage = 0
        //     // }
        //     // const newPage = pageNumber - 1
        //     getData(newPage)
        //     break
        //   }
        //   case PaginationActionType.Next: {
        //     let newPage
        //    // if (!didSearchChange) {
        //       newPage = pageNumber + 1
        //     //} else {
        //       //newPage = 0
        //     //}
    
        //     //const newPage = pageNumber + 1
        //     getData(newPage)
        //     break
        //   }
        //   case PaginationActionType.Last: {
        //     let newPage
        //    // if (!didSearchChange) {
        //       newPage = pageCount - 1
        //     // } else {
        //     //   newPage = 0
        //     // }
        //     getData(newPage)
        //     break
        //   }
        //   default: {
        //     break
        //   }
        // }
      }

      function clear() {
            setItemName({error: false, value: ''})
      
            setItemNumber({error: false, value: ""})
        
            setQuantity({error: false, value: 0})
      }

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


      const submit = async  ()=>{

        try {
            if(validate()){
              console.log( { projectId: props.projectId, taskId: props.taskId,itemName: itemName.value, itemNumber: itemNumber.value, quantity: quantity.value })
            const res: any = await api<any>(
                addTaskMoreDetailsUrl(),
                HttpMethods.Post,
                //body:
                { projectId: props.projectId, taskId: props.taskId,itemName: itemName.value, itemNumber: itemNumber.value, quantity: quantity.value },
                
                {
                  Authorization: `Bearer ${user?.tokenStr}`,
                },
                "Something went wrong",
                true
              )

             // props.data.push({id:props.data.length+1,item_name: itemName.value, item_number: itemNumber.value, quantity: quantity.value })
             
             getData()
             
             clear()
            }

     
        //getData();
            
        } catch (error: any) {
            
        }

      }

      const deleteItem = async () =>{
            const res: any = await api<any>(
                deleteProjectTaskItemUrl(currentItemId),
                HttpMethods.Delete,
                //body:
                //{ projectId: props.projectId, taskId: props.taskId,itemName: itemName.value, itemNumber: itemNumber.value, quantity: quantity.value },
                null,
                {
                  Authorization: `Bearer ${user?.tokenStr}`,
                },
                "Something went wrong",
                true
              )

              setIsConfirmOpen(false)

              console.log("DELETEDDDD")
      }

    //  const updateData = (nb: string, nm: string, qt: number)=>{
    //     var i = props.data.findIndex((a)=>{
    //       a.id == currentItemId
    //     })
    //     props.data[i].item_name = nm
    //     props.data[i].item_number = nb
    //     props.data[i].quantity = q

        
    //   }

    


      if(user?.token.roles.includes("ADMIN") || user?.token.roles.includes("CFO") ){

    return (
        <Dialog
        open={props.open}
        onClose={() => {
          props.handleClose()
        //  clear()
        }}
        fullWidth
       maxWidth="xl"
      >

<HeaderContainer>
  
         <InputContainer>
           <Typography variant="h6">Item Number: &nbsp;&nbsp;</Typography>
            <TextField
              required
              type="text"
              label="Item Number"
              value={itemNumber.value}
              error={itemNumber.error}
              onChange={(e) => {
                setItemNumber({
                  error: itemNumber.error,
                  value: e.target.value,
                })
              }}
            />
            </InputContainer>   

            <StyledVerticalDivider orientation="vertical" flexItem />
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

            <StyledVerticalDivider orientation="vertical" flexItem />
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

           <Button onClick={submit}>Add</Button>

</HeaderContainer>

         <LivePaginationTable
              currentPage={pageNumber}
              pageCount={pageCount}
              movePage={movePageCallback}
              onRowClick={()=>{}}
              table={getTableState(data)}
              notInProjectsView={true}
            />

<EditProjectTaskItemDialog
          open={openEditDialog}
          handleClose={()=> getData()}
          taskId={props.taskId}
          projectId={props.projectId}
          item_number={currentItemNumber}
          item_name={currentItemName}
          quantity={currentQuantity}
          item_id={currentItemId}
          dismiss={()=> {
            setOpenEditDialog(false)
            getData()
          } }
          
          ></EditProjectTaskItemDialog>
        <ConfirmationDialog
        isOpen={isConfirmOpen}
        title={"Delete Task Item"}
        content={"Are You Sure You Want To Delete This Item?"}
        dismiss={() => setIsConfirmOpen(false)}
        positive={async () => await deleteItem()}
        negativeText="Cancel"
        positiveText={"Delete"}
      />





      </Dialog>

        
    )}
    else{
        return (
            <Dialog
            open={props.open}
            onClose={() => {
              props.handleClose()
            //  clear()
            }}
          >
            <LivePaginationTable
            currentPage={pageNumber}
            pageCount={pageCount}
            movePage={movePageCallback}
            onRowClick={()=>{}}
            table={getTableState(data)}
            notInProjectsView={true}
          />
          <EditProjectTaskItemDialog
          open={openEditDialog}
          handleClose={()=> getData()}
          taskId={props.taskId}
          projectId={props.projectId}
          item_number={currentItemNumber}
          item_name={currentItemName}
          quantity={currentQuantity}
          item_id={currentItemId}
          dismiss={()=> {
            setOpenEditDialog(false)
            getData()
          } }
          
          ></EditProjectTaskItemDialog>
        <ConfirmationDialog
        isOpen={isConfirmOpen}
        title={"Delete Task Item"}
        content={"Are You Sure You Want To Delete This Item?"}
        dismiss={() => setIsConfirmOpen(false)}
        positive={async () => {
          await deleteItem()
         
        }}
        negativeText="Cancel"
        positiveText={"Delete"}
      />
       

          
      </Dialog>

        )
    }
  }