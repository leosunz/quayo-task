import grey from "@mui/material/colors/grey"
import { useContext, useEffect, useState } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import {
  ScreenContainer,
  StyledVerticalDivider,
} from "../components/StyledComponents"
import { styled } from "@mui/material/styles"
import { ProjectContext } from "../contexts/ProjectContext"
import ProjectEditPill from "../components/reusable/ProjectEditPill"
import { Button, FormControl, IconButton } from "@mui/material"
import { green, blue, teal, orange, red, purple, yellow, lightBlue } from "@mui/material/colors"
import TextPillComponent from "../components/reusable/PillComponent"
import { formatCurrency, getDayFromDate, getProjectIdFormat } from "../utils/formatters"
import { useNavigate, useParams } from "react-router"
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded"
import CustomPaginationTable, {
  CustomPaginationTableRow,
  CustomPaginationTableState,
} from "../components/reusable/CustomPaginationTable"
import { getProjecTableView, getProjectStatus, ProjectTableView } from "../api/ProjectApi"
import { AuthContext } from "../contexts/AuthContext"
import { api, HttpMethods } from "../api/ApiControllers"
import CommentRoundedIcon from "@mui/icons-material/CommentRounded"
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded"
import AlertDialog from "../components/dialogs/AlertDialog"
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded"
import ConfirmationDialog from "../components/dialogs/ConfirmationDialog"

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import moment from "moment";
import NewTaskTempFormDialog2 from "../components/dialogs/NewProjectTaskTempFormDialog2"
import TaskMoreDetailsDialog, { ITaskItem } from "../components/dialogs/TaskMoreDetailsDialog"
import InfoIcon from '@mui/icons-material/Info';
import { taskMoredetailsUrl } from "../api/TaskTemplateApi"

const MainContainer = styled("div")(() => {
  return {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    overflow: "hidden",
  }
})

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
export function currentGetDayFromDate(date: string) {
  let parts = date.split('/');
  let months = ["Jan",  
  "Feb" ,
  "Mar",    
  "Apr" ,   
  "May"  ,    
  "Jun",     
  "Jul",     
  "Aug" ,  
  "Sep",
  "Oct"  ,
  "Nov" ,
  "Dec" ]
  let month =parts[1]
  let year = parts[2]
  let day = parts[0]
  let time = parts[3].split(':')

  
  const datee = new Date(parseInt(year), parseInt(month), parseInt(day))
  console.log("DATE", datee)

  const momnt = moment(datee).format("DD/MM/YYYY")
  

  return datee
}


export default function ProjectDetailsScreen() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)!
  const { project, deleteProject } = useContext(ProjectContext)!
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // comment
  const [comment, setComment] = useState<string | null>(null)
  const [commentDialog, setCommentDialog] = useState(false)

  const [tasks, setTasks] = useState<ProjectTableView[]>([])
  const [currentTaskId, setcurrentTaskId]= useState(0)
  const [isMoreDetailsDialogOpen, setIsMoreDetailsDialogOpen]= useState(false)


  const [sortValue, setSortValue] = useState('none');
  const [projectStatus, setProjectStatus] = useState('Active')

  const[taskItems, setTaskItems] = useState<ITaskItem[]>([])

  // delete
  const [deleteDialog, setDeleteDialog] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    
    api<ProjectTableView[]>(
     
      getProjecTableView(id!),
      HttpMethods.Get,
      null,
      { Authorization: `Bearer ${user?.tokenStr}` },
      "Something went wrong",
      true
    )
      .then((data) => {
        setIsLoading(false)
        setError(null)
        setTasks(data!)
        console.log("TASKS",tasks)
      })
      .catch((e) => {
        setIsLoading(false)
        setError(e.message)
      })
  }, [])

  const getTaskItem = async (taskId: number) => {
    try {

      console.log("GET TASK ITEMS 2")
  
      const res: any = await api<ITaskItem[]>(
        taskMoredetailsUrl(parseInt(id!), taskId),
        HttpMethods.Get,
        //{ page_number: pageNum, search: search },
        null,
        // {
        //   Authorization: `Bearer ${user?.tokenStr}`,
        // },
        null,
        "Something went wrong",
        true
      )


      console.log("DETAILS",res)
      setTaskItems(res!)
  
    } catch (e: any) {
      console.log(" DETAILS ERRRR",e)
    
    }
  }

  //projectStatus
  // useEffect(() => {
  //   setIsLoading(true)
    
  //   api<any>(
     
  //     getProjectStatus(id!),
  //     HttpMethods.Get,
  //     null,
  //     { Authorization: `Bearer ${user?.tokenStr}` },
  //     "Something went wrong",
  //     true
  //   )
  //     .then((data) => {
  //       setIsLoading(false)
  //       setError(null)
  //       if(data==true){
  //         setProjectStatus("Complete")

  //       }else{
  //         setProjectStatus("Active")
  //       }
  //       console.log("PROJECT ID STATUS",projectStatus)
  //     })
  //     .catch((e) => {
  //       setIsLoading(false)
  //       setError(e.message)
  //     })
  // }, [])
  

  
  
  const handleSortingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortValue((event.target as HTMLInputElement).value);
    let currentSortValue = (event.target as HTMLInputElement).value;
    let sortedDataa;
   
    switch (currentSortValue) {
      case 'none':
        
          api<ProjectTableView[]>(
            getProjecTableView(id!),
            HttpMethods.Get,
            null,
            { Authorization: `Bearer ${user?.tokenStr}` },
            "Something went wrong",
            true
          )
            .then((data) => {
              setIsLoading(false)
              setError(null)
              setTasks(data!)
            })
            .catch((e) => {
              setIsLoading(false)
              setError(e.message)
            })
       
      
        break;
      case 'status':
        sortedDataa = tasks!.sort((a: any,b: any)=>{ console.log("a.status:", a.status); return a.status - b.status})
        setTasks(sortedDataa);
        break;
      case 'plannedEndDate':
        sortedDataa = tasks!.sort((a: any,b: any)=>{ 
          let dateA =specififcDateFormat(getDayFromDate(new Date(a.planned_start_date)));
         let dateB =specififcDateFormat(getDayFromDate(new Date(b.planned_start_date)));
       
         if(dateA < dateB){
            return -1;
           //return 1;
          }
          if(dateA > dateB){
            return 1;
           // return -1;
          }
          return 0;
        })
        setTasks(sortedDataa);
      break;
      case 'plannedStartDate':
        sortedDataa = tasks!.sort((a: any,b: any)=>{ 

          console.log("TASKSS",tasks)
          let dateA =specififcDateFormat(getDayFromDate(new Date(a.planned_start_date)));
         let dateB =specififcDateFormat(getDayFromDate(new Date(b.planned_start_date)));

    
         if(dateA < dateB){
            return -1;
            //return 1;
          }
          if(dateA > dateB){
            return 1;
           // return -1;
          }
          return 0;
        })
        setTasks(sortedDataa);
      break;
      default:
        break;
    }




    
  };

  function specififcDateFormat(date:string) {
    let parts= date.split('/')
    let month = parseInt(parts[1])-1
    let day = parseInt(parts[0])
    let year = parseInt(parts[2])
   
   
    let newDate = new Date(year, month, day)
   
     return newDate;
   }

   function getDifferenceInDays(date1: any, date2: any) {
    const diffInMs = Math.abs(date2 - date1);
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  
function isDelayed(task:any) {
  if(task?.status != "Complete"){
    if(new Date().getTime() > new Date(task?.planned_end_date).getTime()){
       return getDifferenceInDays(new Date(), new Date(task?.planned_end_date))
    }else{
     return null
    }
  }else{
    return null
  }
  
}

  function getTableState(): CustomPaginationTableState {
    const headers: string[] = [
      "Assigned",
      "Code",
      "Name",
      "Time",
      "Unit",
      "Planned Start",
      "Planned End",
      "Actual Start",
      "Actual End",
      "Progress",
      "Progress Updated",
      "Status",
      "Actions"
    ]

    const rows: CustomPaginationTableRow[] = tasks.map((task) => {
      //TODO: Charbel: Added the completed check for the mark as completed button
      let completed = false
      if(task.progress == 100){
        completed = true
      }
      console.log("STATUS", task.status)
      if(completed){
        return {
          id: task.id,
          cells: [
            task.assigned_to ?? "-",
            task.task_code ?? "-",
            task.task_name ?? "-",
            task.estimated_time,
            task.time_unit,
            task.planned_start_date
              ? getDayFromDate(new Date(task.planned_start_date))
              : "-",
            task.planned_end_date
              ? getDayFromDate(new Date(task.planned_end_date))
              : "-",
            task.actual_start_date
              ? getDayFromDate(new Date(task.actual_start_date))
              : "-",
            task.actual_end_date
              ? getDayFromDate(new Date(task.actual_end_date))
              : "-",
            task.progress + "%",
            task.progress_last_updated
              ? getDayFromDate(new Date(task.progress_last_updated))
              : "-",
            task.status,
            
            <div style={{ display: "flex", flexDirection: "row" }}>
              <IconButton
                onClick={() => {
                  setComment(task.comment ?? "No comments yet.")
                  setCommentDialog(true)
                }}
              >
                <CommentRoundedIcon
                  style={{
                    color: blue[800],
                  }}
                />
              </IconButton>

              <IconButton
                onClick={async () => {
                  await getTaskItem(task.id)
                  setcurrentTaskId(task.id)
                  setIsMoreDetailsDialogOpen(true)
                }}
              >
                <InfoIcon
                  style={{
                    color: lightBlue[500],
                  }}
                />
              </IconButton>

            </div>
          ],
        }
      }else{
        return {
          id: task.id,
          cells: [
            task.assigned_to ?? "-",
            task.task_code ?? "-",
            task.task_name ?? "-",
            task.estimated_time,
            task.time_unit,
            task.planned_start_date
              ? getDayFromDate(new Date(task.planned_start_date))
              : "-",
            task.planned_end_date
              ? getDayFromDate(new Date(task.planned_end_date))
              : "-",
            task.actual_start_date
              ? getDayFromDate(new Date(task.actual_start_date))
              : "-",
            task.actual_end_date
              ? getDayFromDate(new Date(task.actual_end_date))
              : "-",
            task.progress + "%",
            task.progress_last_updated
              ? getDayFromDate(new Date(task.progress_last_updated))
              : "-",
            task.status,
  
            <div style={{ display: "flex", flexDirection: "row" }}>
              <IconButton
                onClick={() => {
                  setComment(task.comment ?? "No comments yet.")
                  setCommentDialog(true)
                }}
              >
                <CommentRoundedIcon
                  style={{
                    color: blue[800],
                  }}
                />
              </IconButton>

              <IconButton
                onClick={async () => {
                  await getTaskItem(task.id)
                  setcurrentTaskId(task.id)
                  setIsMoreDetailsDialogOpen(true)
                }}
              >
                <InfoIcon
                  style={{
                    color: lightBlue[500],
                  }}
                />
              </IconButton>
            </div>
            
          ],
        }
      }
    })


    return {
      heads: headers,
      rows,
    }
  }


  //TODO: Charbel: Added the TextPillComponent for the last task due date, the ADMIN check for the price tag, and the number of delayed days 
  const today = getDayFromDate(new Date()).split("/")
  const a = getDayFromDate(new Date(tasks[tasks.length-1]?.planned_end_date!)).split("/")
  console.log("fetched date: ", tasks[tasks.length-1]?.planned_end_date!)
  console.log("a",a)
  let days = parseInt(today[0]) - parseInt(a[0])
  if(parseInt(today[1]) > parseInt(a[1])){
    const difference = parseInt(today[1]) - parseInt(a[1])
    for(let i=0; i<difference; i++){
      if(today[1] == "2"){
        days += 28 
      }else if(today[1] == "1" || today[1] == "3" || today[1] == "5" || today[1] == "7" || today[1] == "8" || today[1] == "10" || today[1] == "12"){
        days += 31 
      }else{
        days += 30 
      }
    }
  }
  if(parseInt(today[2]) > parseInt(a[2])){
    const difference = parseInt(today[2]) - parseInt(a[2])
    days += 365 * difference
  } 
  
  let status;
  if(project?.is_draft == 1){
    status = "Pending"
  }else if(project?.is_draft == 2){
    status = "Complete"
  }else{
    status ="Active"
  }
  // if(projectStatus == "Complete"){
  //   status = "Complete"
  // }
 // if(tasks[tasks.length-1]?.status != 'Complete' && (parseInt(today[2]) > parseInt(a[2]) || (parseInt(today[1]) > parseInt(a[1]) || (parseInt(today[0]) > parseInt(a[0]))))){
 if(isDelayed(tasks[tasks.length-1]) != null)  {
 if(user?.token.roles.includes("ADMIN") || user?.token.roles.includes("CFO") ){
      return (
        <ScreenContainer isDataLoaded={!isLoading && !error}>
          {isLoading && <Loading text="Loading Project.." />}
          {error && <ErrorComponent text={error ?? "Something went wrong"} />}
          {!isLoading && !error && (
            <div
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <HeaderContainer>
              <TextPillComponent
                  title="Project Number"
                 
                  value={JSON.stringify(getProjectIdFormat(project?.id) ?? 0).slice(1).replace('"', '')}


                  lightColor={grey[100]}
                  darkColor={grey[900]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Client"
                  value={project?.client?.description ?? ""}
                  lightColor={green[100]}
                  darkColor={green[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Project Owner"
                  value={project?.user?.description ?? ""}
                  lightColor={blue[100]}
                  darkColor={blue[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Price"
                  value={formatCurrency(
                    project?.total_price ?? 0,
                    project?.currency_code ?? "USD"
                  )}
                  lightColor={teal[100]}
                  darkColor={teal[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Paid"
                  value={formatCurrency(
                    project?.paid_amount ?? 0,
                    project?.currency_code ?? "USD"
                  )}
                  lightColor={orange[100]}
                  darkColor={orange[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Delivery Date"
                  value={
                    project?.estimated_delivery
                      ? getDayFromDate(new Date(project.estimated_delivery))
                      : "N/A"
                  }
                  lightColor={red[100]}
                  darkColor={red[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Status"
                  value={status}
                  lightColor={purple[100]}
                  darkColor={purple[800]}
                />
                <Button
                  endIcon={<AttachMoneyRoundedIcon />}
                  style={{
                    borderRadius: "50px",
                    padding: "1rem",
                    marginLeft: "10px",
                    backgroundColor: green[600],
                  }}
                  variant="contained"
                  onClick={() => navigate(`/projects/${id}/payments`)}
                >
                  Payment
                </Button>
                {user?.token?.roles.includes("ADMIN") && (
                  <Button
                    color="error"
                    endIcon={<DeleteRoundedIcon />}
                    style={{
                      borderRadius: "50px",
                      padding: "1rem",
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete Project
                  </Button>
                )}
    
                <ProjectEditPill />
    
                <TextPillComponent
                  title="Last Task Due Date"
                  value={tasks[tasks.length-1]?.planned_end_date
                    ? getDayFromDate(new Date(tasks[tasks.length-1]?.planned_end_date!))
                    : "N/A"}
                  lightColor={yellow[100]}
                  darkColor={yellow[800]}
                />

                <StyledVerticalDivider flexItem orientation="vertical" />

                <TextPillComponent
                  title = "Number of Delayed Days"
                  value = {JSON.stringify(isDelayed(tasks[tasks.length-1])!)  }
                  lightColor = {red[100]}
                  darkColor = {red[800]}
                />
    
              </HeaderContainer>
              {/* //TODO: Paul Obeid: Added the sortby radio buttons */}
              <FormControl>
                 <FormLabel id="demo-row-radio-buttons-group-label">Sort By:</FormLabel>
                   <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={sortValue}
                   onChange={handleSortingChange}
               >
                 <FormControlLabel value="none" control={<Radio />} label="None" />
                 <FormControlLabel value="status" control={<Radio />} label="status" />
                  <FormControlLabel value="plannedEndDate" control={<Radio />} label="Planned End Date" />
                  <FormControlLabel value="plannedStartDate" control={<Radio />} label="Planned Start Date" />
               
               </RadioGroup>
            </FormControl>
              <CustomPaginationTable
                table={getTableState()}
                onRowClick={() => {}}
                cursor="default"
              />
                 <TaskMoreDetailsDialog
                  data={taskItems}
                  open={isMoreDetailsDialogOpen}
                   handleClose={() => setIsMoreDetailsDialogOpen(false)}
                   taskId={currentTaskId}
                   projectId = {parseInt(id!)}
                />
              <AlertDialog
                content={comment ?? "No comments yet."}
                isOpen={commentDialog}
                title="Comments"
                onClose={() => setCommentDialog(false)}
              />
              <ConfirmationDialog
                content="Are you sure you want to delete this project?"
                negativeText="Cancel"
                positiveText="Delete"
                title="Delete Project"
                isOpen={deleteDialog}
                dismiss={() => setDeleteDialog(false)}
                positive={async () => {
                  setDeleteDialog(false)
                  await deleteProject()
                }}
              />
            </div>
          )}
        </ScreenContainer>
      )
    }else{
      return (
        <ScreenContainer isDataLoaded={!isLoading && !error}>
          {isLoading && <Loading text="Loading Project.." />}
          {error && <ErrorComponent text={error ?? "Something went wrong"} />}
          {!isLoading && !error && (
            <div
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <HeaderContainer>
              <TextPillComponent
                  title="Project Number"
                  
                  value={JSON.stringify(getProjectIdFormat(project?.id) ?? 0).slice(1).replace('"', '')}


                  lightColor={grey[100]}
                  darkColor={grey[900]}
                />
                 <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Client"
                  value={project?.client?.description ?? ""}
                  lightColor={green[100]}
                  darkColor={green[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Project Owner"
                  value={project?.user?.description ?? ""}
                  lightColor={blue[100]}
                  darkColor={blue[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Delivery Date"
                  value={
                    project?.estimated_delivery
                      ? getDayFromDate(new Date(project.estimated_delivery))
                      : "N/A"
                  }
                  lightColor={red[100]}
                  darkColor={red[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Status"
                  value={status}
                  lightColor={purple[100]}
                  darkColor={purple[800]}
                />
                <Button
                  endIcon={<AttachMoneyRoundedIcon />}
                  style={{
                    borderRadius: "50px",
                    padding: "1rem",
                    marginLeft: "10px",
                    backgroundColor: green[600],
                  }}
                  variant="contained"
                  onClick={() => navigate(`/projects/${id}/payments`)}
                >
                  Payment
                </Button>
                {user?.token?.roles.includes("ADMIN") && (
                  <Button
                    color="error"
                    endIcon={<DeleteRoundedIcon />}
                    style={{
                      borderRadius: "50px",
                      padding: "1rem",
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete Project
                  </Button>
                )}
    
                <ProjectEditPill />
    
                <TextPillComponent
                  title="Last Task Due Date"
                  value={tasks[tasks.length-1]?.planned_end_date
                    ? getDayFromDate(new Date(tasks[tasks.length-1]?.planned_end_date!))
                    : "N/A"}
                  lightColor={yellow[100]}
                  darkColor={yellow[800]}
                />

                <StyledVerticalDivider flexItem orientation="vertical" />

                <TextPillComponent
                  title = "Number of Delayed Days"
                  value = { days.toString() + " Days" }
                  lightColor = {red[100]}
                  darkColor = {red[800]}
                />
    
              </HeaderContainer>
              {/* //TODO: Paul Obeid: Added the sortby radio buttons */}
              <FormControl>
                 <FormLabel id="demo-row-radio-buttons-group-label">Sort By:</FormLabel>
                   <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={sortValue}
                   onChange={handleSortingChange}
               >
                 <FormControlLabel value="none" control={<Radio />} label="None" />
                 <FormControlLabel value="status" control={<Radio />} label="status" />
                 <FormControlLabel value="plannedEndDate" control={<Radio />} label="Planned End Date" />
                  <FormControlLabel value="plannedStartDate" control={<Radio />} label="Planned Start Date" />
               
               </RadioGroup>
            </FormControl>
              <CustomPaginationTable
                table={getTableState()}
                onRowClick={() => {}}
                cursor="default"
              />
             <TaskMoreDetailsDialog
              data={taskItems}
                  open={isMoreDetailsDialogOpen}
                   handleClose={() => setIsMoreDetailsDialogOpen(false)}
                   taskId={currentTaskId}
                   projectId = {parseInt(id!)}
                />
              <AlertDialog
                content={comment ?? "No comments yet."}
                isOpen={commentDialog}
                title="Comments"
                onClose={() => setCommentDialog(false)}
              />
              <ConfirmationDialog
                content="Are you sure you want to delete this project?"
                negativeText="Cancel"
                positiveText="Delete"
                title="Delete Project"
                isOpen={deleteDialog}
                dismiss={() => setDeleteDialog(false)}
                positive={async () => {
                  setDeleteDialog(false)
                  await deleteProject()
                }}
              />
            </div>
          )}
        </ScreenContainer>
      )
    }
  }else{
    if(user?.token.roles.includes("ADMIN") || user?.token.roles.includes("CFO")){
      return (
        <ScreenContainer isDataLoaded={!isLoading && !error}>
          {isLoading && <Loading text="Loading Project.." />}
          {error && <ErrorComponent text={error ?? "Something went wrong"} />}
          {!isLoading && !error && (
            <div
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <HeaderContainer>
              <TextPillComponent
                  title="Project Number"
                  value={JSON.stringify(getProjectIdFormat(project?.id) ?? 0).slice(1).replace('"', '')}



                  lightColor={grey[100]}
                  darkColor={grey[900]}
                />
                 <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Client"
                  value={project?.client?.description ?? ""}
                  lightColor={green[100]}
                  darkColor={green[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Project Owner"
                  value={project?.user?.description ?? ""}
                  lightColor={blue[100]}
                  darkColor={blue[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Price"
                  value={formatCurrency(
                    project?.total_price ?? 0,
                    project?.currency_code ?? "USD"
                  )}
                  lightColor={teal[100]}
                  darkColor={teal[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Paid"
                  value={formatCurrency(
                    project?.paid_amount ?? 0,
                    project?.currency_code ?? "USD"
                  )}
                  lightColor={orange[100]}
                  darkColor={orange[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Delivery Date"
                  value={
                    project?.estimated_delivery
                      ? getDayFromDate(new Date(project.estimated_delivery))
                      : "N/A"
                  }
                  lightColor={red[100]}
                  darkColor={red[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Status"
                  value={status}
                  lightColor={purple[100]}
                  darkColor={purple[800]}
                />
                <Button
                  endIcon={<AttachMoneyRoundedIcon />}
                  style={{
                    borderRadius: "50px",
                    padding: "1rem",
                    marginLeft: "10px",
                    backgroundColor: green[600],
                  }}
                  variant="contained"
                  onClick={() => navigate(`/projects/${id}/payments`)}
                >
                  Payment
                </Button>
                {user?.token?.roles.includes("ADMIN") && (
                  <Button
                    color="error"
                    endIcon={<DeleteRoundedIcon />}
                    style={{
                      borderRadius: "50px",
                      padding: "1rem",
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete Project
                  </Button>
                )}
    
                <ProjectEditPill />
    
                {/* <TextPillComponent
                  title="Last Task Due Date"
                  value={tasks[tasks.length-1]?.planned_end_date
                    ? getDayFromDate(new Date(tasks[tasks.length-1]?.planned_end_date!))
                    : "N/A"}
                  lightColor={yellow[100]}
                  darkColor={yellow[800]}
                />
     */}
              </HeaderContainer>
              {/* //TODO: Paul Obeid: Added the sortby radio buttons */}
              <FormControl>
                 <FormLabel id="demo-row-radio-buttons-group-label">Sort By:</FormLabel>
                   <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={sortValue}
                   onChange={handleSortingChange}
               >
                 <FormControlLabel value="none" control={<Radio />} label="None" />
                 <FormControlLabel value="status" control={<Radio />} label="status" />
                 <FormControlLabel value="plannedEndDate" control={<Radio />} label="Planned End Date" />
                  <FormControlLabel value="plannedStartDate" control={<Radio />} label="Planned Start Date" />
               
               </RadioGroup>
            </FormControl>
              <CustomPaginationTable
                table={getTableState()}
                onRowClick={() => {}}
                cursor="default"
              />
                 <TaskMoreDetailsDialog
                  data={taskItems}
                  open={isMoreDetailsDialogOpen}
                   handleClose={() => setIsMoreDetailsDialogOpen(false)}
                   taskId={currentTaskId}
                   projectId = {parseInt(id!)}
                />
              <AlertDialog
                content={comment ?? "No comments yet."}
                isOpen={commentDialog}
                title="Comments"
                onClose={() => setCommentDialog(false)}
              />
              <ConfirmationDialog
                content="Are you sure you want to delete this project?"
                negativeText="Cancel"
                positiveText="Delete"
                title="Delete Project"
                isOpen={deleteDialog}
                dismiss={() => setDeleteDialog(false)}
                positive={async () => {
                  setDeleteDialog(false)
                  await deleteProject()
                }}
              />
            </div>
          )}
        </ScreenContainer>
      )
    }else{
      return (
        <ScreenContainer isDataLoaded={!isLoading && !error}>
          {isLoading && <Loading text="Loading Project.." />}
          {error && <ErrorComponent text={error ?? "Something went wrong"} />}
          {!isLoading && !error && (
            <div
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <HeaderContainer>
              <TextPillComponent
                  title="Project Number"
                  value={JSON.stringify(getProjectIdFormat(project?.id) ?? 0).slice(1).replace('"', '')}



                  lightColor={grey[100]}
                  darkColor={grey[900]}
                />
                 <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Client"
                  value={project?.client?.description ?? ""}
                  lightColor={green[100]}
                  darkColor={green[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Project Owner"
                  value={project?.user?.description ?? ""}
                  lightColor={blue[100]}
                  darkColor={blue[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Delivery Date"
                  value={
                    project?.estimated_delivery
                      ? getDayFromDate(new Date(project.estimated_delivery))
                      : "N/A"
                  }
                  lightColor={red[100]}
                  darkColor={red[800]}
                />
                <StyledVerticalDivider flexItem orientation="vertical" />
                <TextPillComponent
                  title="Status"
                  value={status}
                  lightColor={purple[100]}
                  darkColor={purple[800]}
                />
                <Button
                  endIcon={<AttachMoneyRoundedIcon />}
                  style={{
                    borderRadius: "50px",
                    padding: "1rem",
                    marginLeft: "10px",
                    backgroundColor: green[600],
                  }}
                  variant="contained"
                  onClick={() => navigate(`/projects/${id}/payments`)}
                >
                  Payment
                </Button>
                {user?.token?.roles.includes("ADMIN") && (
                  <Button
                    color="error"
                    endIcon={<DeleteRoundedIcon />}
                    style={{
                      borderRadius: "50px",
                      padding: "1rem",
                      marginLeft: "10px",
                    }}
                    variant="contained"
                    onClick={() => setDeleteDialog(true)}
                  >
                    Delete Project
                  </Button>
                )}
    
                <ProjectEditPill />

                {/* <TextPillComponent
                  title="Last Task Due Date"
                  value={tasks[tasks.length-1]?.planned_end_date
                    ? getDayFromDate(new Date(tasks[tasks.length-1]?.planned_end_date!))
                    : "N/A"}
                  lightColor={yellow[100]}
                  darkColor={yellow[800]}
                /> */}
    
              </HeaderContainer>
              {/* //TODO: Paul Obeid: Added the sortby radio buttons */}
              <FormControl>
                 <FormLabel id="demo-row-radio-buttons-group-label">Sort By:</FormLabel>
                   <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={sortValue}
                   onChange={handleSortingChange}
               >
                 <FormControlLabel value="none" control={<Radio />} label="None" />
                 <FormControlLabel value="status" control={<Radio />} label="status" />
                 <FormControlLabel value="plannedEndDate" control={<Radio />} label="Planned End Date" />
                  <FormControlLabel value="plannedStartDate" control={<Radio />} label="Planned Start Date" />
               
               </RadioGroup>
            </FormControl>
              <CustomPaginationTable
                table={getTableState()}
                onRowClick={() => {}}
                cursor="default"
              />
                 <TaskMoreDetailsDialog
                  open={isMoreDetailsDialogOpen}
                  data={taskItems}
                   handleClose={() => setIsMoreDetailsDialogOpen(false)}
                   taskId={currentTaskId}
                   projectId = {parseInt(id!)}
                />
              <AlertDialog
                content={comment ?? "No comments yet."}
                isOpen={commentDialog}
                title="Comments"
                onClose={() => setCommentDialog(false)}
              />
              <ConfirmationDialog
                content="Are you sure you want to delete this project?"
                negativeText="Cancel"
                positiveText="Delete"
                title="Delete Project"
                isOpen={deleteDialog}
                dismiss={() => setDeleteDialog(false)}
                positive={async () => {
                  setDeleteDialog(false)
                  await deleteProject()
                }}
              />
            </div>
          )}
        </ScreenContainer>
      )
    }
  }
  
}