import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"
import CustomPaginationTable, {
  CustomPaginationTableState,
} from "../reusable/CustomPaginationTable"
import { StyledFab } from "../StyledComponents"
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { useContext, useEffect, useState } from "react"
import { api, HttpMethods } from "../../api/ApiControllers"
import { AuthContext } from "../../contexts/AuthContext"
import Loading from "../Loading"
import ErrorComponent from "../ErrorComponent"
import { IconButton, TextField, useTheme } from "@mui/material"
import SearchRoundedIcon from "@mui/icons-material/SearchRounded"
import LivePaginationTable, {
  PaginationActionType,
} from "../reusable/LivePaginationTable"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import moment from "moment"
import { CustomTableRow } from "../reusable/CustomTable"
import { getProjectStatus, MinifiedProject } from "../../api/ProjectApi"
import { setTimeout } from "timers"


export interface PagingDto<T> {
  page_count: number
  current_page: number
  data: T
}

const MainContainer = styled("div")<{ dataloaded: boolean }>(
  ({ dataloaded }) => {
    return {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: dataloaded ? "flex-start" : "center",
      alignItems: dataloaded ? "stretch" : "center",
    }
  }
)

const StyledContainer = styled("div")(({ theme }) => {
  return {
    overfowY: "hidden",
    padding: theme.spacing(2),
    height: "85%",
    backgroundColor: theme.palette.background.default,
  }
})

const StyledHeader = styled(Paper)(({ theme }) => {
  return {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }
})

const StyledTypography = styled(Typography)(({ theme }) => {
  return {
    color: theme.palette.primary.dark,
  }
})


export function getDayFromDate(date: string) {
  let parts = date.split(' ');
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
  let month = months.findIndex((m)=> m==parts[1])+1
  let year = parts[5]
  let day = parts[2]
  let time = parts[3].split(':')
  let hours  = parseInt(time[0])
  let min = parseInt(time[1])
  let sec = parseInt(time[2])
  
  const datee = new Date(parseInt(year), month, parseInt(day),hours,min, sec)
  console.log(date, datee)

  const momnt = moment(datee).format("DD/MM/YYYY")
  

  return datee
}


export interface DisplayTemplateProps<T> {
  tableState: (data: never[]) => CustomPaginationTableState
  newButtonText: string
  rowClicked(id: number | string): void
  newEntityUrl: string
  pageTitle: string
  showNewButton?: boolean
  url: string
  searchLabel: string
  loadingLabel: string
}

export default function DisplayTemplate<T>(props: DisplayTemplateProps<T>) {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)!
  const theme = useTheme()

  const [data, setData] = useState<any>([])
  const [newProjects, setNewProjects]= useState<any>([])
  // const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>()
  const [search, setSearch] = useState("")
  const [pageNumber, setPageNumber] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [didSearchChange, setDidSearchChange] = useState(false)
  const [sortValue, setSortValue] = useState('none');

  
//  function localGetProjectStatus(id: number | string){

  
//  return api<any>(
//     getProjectStatus(id!),
//     HttpMethods.Get,
//     null,
//     { Authorization: `Bearer ${user?.tokenStr}` },
//     "Something went wrong",
//     true
//   )
//     // .then((data) => {
//     //   console.log("FROM ALL Projects", data)
//     //   if(data==true){
//     //     return "Complete"
//     //   }else{
//     //     return "Active"
       
//     //   }
     
//     // })
//     // .catch((e) => {
//     //   console.log(e)
//     // })

// }
//  async function returnProjectsWithStatus(projects: any[]){

//   let newProjects: any = [] ;

//   projects.forEach(async (proj) => {
//    await localGetProjectStatus(proj.id).then((data) => {
//       console.log("from the promise", data)
//       let status;
//       if(data==true){
//         status= "Complete"
//       }else{
//         status= "Active"
       
//       }

//       let project = {
//         ...proj,
//         status: status
//       }
//       newProjects.push(project)
//     })
//   });

//   setData(newProjects)

 
//  /// return newProjects;

// }


  console.log("projects",data)

  const getData = async (pageNum: number) => {
    try {
      setIsLoading(true)
      const res: any = await api<PagingDto<T>>(
        props.url,
        HttpMethods.Post,
        { page_number: pageNum, search: search },
        {
          Authorization: `Bearer ${user?.tokenStr}`,
        },
        "Something went wrong",
        true
      )
      console.log('DATAAA',res!.data)
     // var date = "Sun Jan 16 00:00:00 EET 2022"
      //console.log("Date", new Date(getDayFromDate(date)))
      
      setData(res!.data)
      setPageCount(res!.page_count)
      setPageNumber(res!.current_page)
      setIsLoading(false)
      setDidSearchChange(false)
    } catch (e: any) {
      setIsLoading(false)
      setError(e.message)
    }
  }

  useEffect(() => {
    getData(0)
  }, [])

  const movePageCallback = async (type: PaginationActionType, page?: number) => {


    switch (type) {
      case PaginationActionType.Input:{
        if (page == null || page == undefined || page == NaN) {
          break
        }else{
          getData(page!!)
          break
        }
  
      }
      case PaginationActionType.First: {
        getData(0)
        break
      }
      case PaginationActionType.Previous: {
        let newPage
        if (!didSearchChange) {
          newPage = pageNumber - 1
        } else {
          newPage = 0
        }
        // const newPage = pageNumber - 1
        getData(newPage)
        break
      }
      case PaginationActionType.Next: {
        let newPage
        if (!didSearchChange) {
          newPage = pageNumber + 1
        } else {
          newPage = 0
        }

        //const newPage = pageNumber + 1
        getData(newPage)
        break
      }
      case PaginationActionType.Last: {
        let newPage
        if (!didSearchChange) {
          newPage = pageCount - 1
        } else {
          newPage = 0
        }
        getData(newPage)
        break
      }
      default: {
        break
      }
    }
  }

  console.log("props.tableState(data)", props.tableState(data))

  const handleSortingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortValue((event.target as HTMLInputElement).value);
    let currentSortValue = (event.target as HTMLInputElement).value;
    let sortedDataa;


    
    switch (currentSortValue) {
      case 'none':
        getData(0)
        break;
      case 'status':
        console.log("DATA",data)
        sortedDataa = data!.sort((a: any,b: any)=>{
          console.log("a.status:", a.is_draft); 
          if(a.is_draft == true && b.is_draft == false){return -1}
          if(a.is_draft == false && b.is_draft == true){return 1}
          return 0
        })
        setData(sortedDataa);
        break;
      case 'deliveryDate':
        sortedDataa = data!.sort((a: any,b: any)=>{ 
          let dateA = getDayFromDate(a.estimated_delivery)
         let dateB = getDayFromDate(b.estimated_delivery)
         console.log("dateA", getDayFromDate(b.estimated_delivery).getDate())
         if(dateA < dateB){
            return -1;
          }
          if(dateA > dateB){
            return 1;
          }
          return 0;
        })
        setData(sortedDataa);
      break;
      default:
        break;
    }




    
  };




 
    if(props.pageTitle == "Task Templates"){
      return (
        <MainContainer dataloaded={!isLoading && !error && data !== null}>
        {isLoading && <Loading text={props.loadingLabel} />}
        {error && <ErrorComponent text={error} />}
        {!isLoading && !error && data && (
          <StyledContainer>
            <StyledHeader elevation={0}>
              <StyledTypography variant="h4">{props.pageTitle}</StyledTypography>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: theme.spacing(3),
                }}
              >
              
                <TextField
                  variant="outlined"
                  value={search}
                  label={props.searchLabel}
                  onChange={(e) => {
                    setDidSearchChange(true)
                    setSearch(e.target.value)
                  }}
                />
  
                <IconButton
                  onClick={async () => {
                    setPageNumber(0)
                    await getData(0)
                  }}
                  style={{ marginLeft: theme.spacing(1) }}
                >
                  <SearchRoundedIcon
                    style={{ color: theme.palette.primary.main }}
                  />
                </IconButton>
              </div>
            </StyledHeader>
       
            <LivePaginationTable
              currentPage={pageNumber}
              pageCount={pageCount}
              movePage={movePageCallback}
              onRowClick={props.rowClicked}
              table={props.tableState(data)}
            />
            {(props.showNewButton === true ||
              props.showNewButton === undefined) && (
              <StyledFab
                variant="extended"
                onClick={() => {
                  navigate(props.newEntityUrl)
                }}
              >
                <AddCircleRoundedIcon sx={{ mr: 1 }} />
                {props.newButtonText}
              </StyledFab>
            )}
          </StyledContainer>
        )}
      </MainContainer>
    )
  
    }else{
      return (
      <MainContainer dataloaded={!isLoading && !error && data !== null}>
      {isLoading && <Loading text={props.loadingLabel} />}
      {error && <ErrorComponent text={error} />}
      {!isLoading && !error && data && (
        <StyledContainer>
          <StyledHeader elevation={0}>
            <StyledTypography variant="h4">{props.pageTitle}</StyledTypography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginRight: theme.spacing(3),
              }}
            >
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
                  <FormControlLabel value="deliveryDate" control={<Radio />} label="Delivery Date" />
               
               </RadioGroup>
            </FormControl>
              <TextField
                variant="outlined"
                value={search}
                label={props.searchLabel}
                onChange={(e) => {
                  setDidSearchChange(true)
                  setSearch(e.target.value)
                }}
              />

              <IconButton
                onClick={async () => {
                  setPageNumber(0)
                  await getData(0)
                }}
                style={{ marginLeft: theme.spacing(1) }}
              >
                <SearchRoundedIcon
                  style={{ color: theme.palette.primary.main }}
                />
              </IconButton>
            </div>
          </StyledHeader>
     
          <LivePaginationTable
            currentPage={pageNumber}
            pageCount={pageCount}
            movePage={movePageCallback}
            onRowClick={props.rowClicked}
            table={props.tableState(data)}
          />
          {(props.showNewButton === true ||
            props.showNewButton === undefined) && (
            <StyledFab
              variant="extended"
              onClick={() => {
                navigate(props.newEntityUrl)
              }}
            >
              <AddCircleRoundedIcon sx={{ mr: 1 }} />
              {props.newButtonText}
            </StyledFab>
          )}
        </StyledContainer>
      )}
    </MainContainer>
  )

    }
   

}
