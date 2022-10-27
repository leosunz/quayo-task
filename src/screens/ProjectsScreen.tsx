import { styled } from "@mui/material/styles"
import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { CustomPaginationTableRow } from "../components/reusable/CustomPaginationTable"
import DisplayTemplate from "../components/templates/DisplayTemplate"
import { AuthContext } from "../contexts/AuthContext"
import { getAllMinifiedProjectsUrl, getProjecTableView, getProjectStatus, MinifiedProject, ProjectTableView } from "../api/ProjectApi"
import {  getProjectIdFormat, getTableProjectTitleFormat } from "../utils/formatters"
import { api, HttpMethods } from "../api/ApiControllers"
import moment from "moment"

const MainContainer = styled("div")(() => {
  return {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
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

  const momnt = moment(datee).format("D/M/YYYY")
  

  return momnt
}

export default function ProjectsScreen() {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()



function localGetProjectStatus(id: number | string){

  
  api<any>(
    getProjectStatus(id!),
    HttpMethods.Get,
    null,
    { Authorization: `Bearer ${user?.tokenStr}` },
    "Something went wrong",
    true
  )

    .then((data) => {

      if(data==true){
        return "Complete"
      }else{
        return "Active"
       
      }
     
    })
    .catch((e) => {
      console.log(e)
      
    })

}

  const getTableState =  (data: MinifiedProject[]) => {
  // if(user?.token.roles.includes("ADMIN") || user?.token.roles.includes("CFO") )

    
 
    const headers: string[] = [
      "Number",
      "Title",
      "Client",
      "Assigned to",
      // "Total",
      // "Paid",
      // "Remaining",
      "Delivery Date",
      "Status",
    ]

  


    
  
    const rows:  CustomPaginationTableRow[] = data.map((project) => {
      //TODO: Charbel: Added this status check to change the project status to complete if the last task is completed


      let status;
      if(project.is_draft==1){
        status = "Pending"
      }else if(project.is_draft==2){
        status = "Complete"
      }else{
        status = "Active"
      }

     

      
        return {
          
          id: `${project.id}&${project.user_code}`,
          cells: [
            getProjectIdFormat(project.id),
            project.title,
            project.client_code,
            project.user_code,
            // project.total_price,
            // project.amount_paid,
            // project.total_price - project.amount_paid,
            JSON.stringify(getDayFromDate(project.estimated_delivery)).replaceAll('"', ''),
            status,
          ],
        }
  

      
    })




    return {
      heads: headers,
      rows,
    // rowsWithstatus
    }


  }

  
  return (
    <MainContainer>
      <DisplayTemplate
        searchLabel="Search titles.."
        loadingLabel="Loading Projects.."
        url={getAllMinifiedProjectsUrl}
        newButtonText="New Project"
        newEntityUrl="/projects/new"
        tableState={(data) => getTableState(data as MinifiedProject[])}
        rowClicked={(id) => {
          const [projId, userCode] = id.toString().split("&")
          if (
            user?.username === userCode ||
            user?.token?.roles?.includes("ADMIN")
          ) {
            navigate(`/projects/${projId}`)
          } else {
            navigate(`/projects/${projId}/preview`)
          }
        }}
        pageTitle="Projects"
        showNewButton={user?.token?.roles.includes("ADMIN")}
      />
    </MainContainer>
  )
      

}
