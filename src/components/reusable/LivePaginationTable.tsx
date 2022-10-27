import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { useTheme } from "@mui/material/styles"
import LastPageIcon from "@mui/icons-material/LastPage"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Typography,
  TextField,
  Input,
} from "@mui/material"
import { StyledTableCell, StyledTableRow } from "./CustomTable"
import { CustomPaginationTableState } from "./CustomPaginationTable"
import empty from "../../images/empty_search.png"
import { styled } from "@mui/material/styles"
import { useState } from "react"



export enum PaginationActionType {
  Next,
  Previous,
  First,
  Last,
  Input,
}

interface TablePaginationActionsProps {
  pageCount: number
  currentPage: number
  movePage(type: PaginationActionType, page?: number): Promise<void>
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  var { pageCount, currentPage, movePage} = props
  var [page, setPage]=useState(JSON.stringify(currentPage+1))


  return (
    <Box
      sx={{
        flexShrink: 0,
        ml: 2.5,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={theme.palette.mode === "light" ? 0 : 1}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[400]
              : theme.palette.grey[900],
          margin: theme.spacing(1),
        }}
      >
        <IconButton
          onClick={async () => {await movePage(PaginationActionType.First)
            setPage(JSON.stringify(currentPage+1))}}
          disabled={currentPage === 0  || currentPage!! == null}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={async () =>{ 
            await movePage(PaginationActionType.Previous)
            setPage(JSON.stringify(currentPage + 1))
            
          }}
          disabled={currentPage === 0  || currentPage!! == null}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        {/* <Typography color={theme.palette.success.main}>
               {currentPage + 1}&nbsp;&nbsp; 
        </Typography> */}
        <Input value={page} type="string" disableUnderline style={InputStyles} 
        onChange={async (e) =>{
          if(e.target.value == "0"){
            return
          }else{
            setPage(e.target.value)
          }
          
 
         }}
         onKeyUp={async (e)=>{
          if(e.keyCode == 13){
            if(page == ''){
              setPage(JSON.stringify(currentPage + 1))
              return
            }
            const param = parseInt(page) - 1
            if(param === NaN){
              setPage(JSON.stringify(currentPage + 1))
              return
            }
            await movePage(PaginationActionType.Input, param)
          }
         }}
         onKeyPress={(e)=>{
            const keyCode = e.keyCode
            const excludedKeys = [8, 37, 39, 46]
            if(((keyCode >= 48 && keyCode <= 57) ||
            (keyCode >= 96 && keyCode <= 105) ||
            (excludedKeys.includes(keyCode)))||
          
            String.fromCharCode(e.charCode).match(
              /^[^*|\":<>[\]{}`\\()';@&$+-=]+$/g
            )!=null){
              e.preventDefault()
            }
         }}
         />
        <Typography>-</Typography>
        <Typography color={theme.palette.warning.main}>
          &nbsp;&nbsp;{pageCount === 0 ? 1 : pageCount}
        </Typography>
        <IconButton
          onClick={async () => {
            await movePage(PaginationActionType.Next)
            console.log(currentPage)
            setPage(JSON.stringify(currentPage + 1))
          }}
          disabled={currentPage!! >= pageCount - 1 || currentPage!! == null}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={async () =>{
             await movePage(PaginationActionType.Last)
             setPage(JSON.stringify(currentPage + 1))
             
            }}
          disabled={currentPage!! >= pageCount - 1  || currentPage!! == null}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Paper>
    </Box>
  )
}

export interface LivePaginationTableProps {
  table: CustomPaginationTableState
  onRowClick(id: number | string): void
  cursor?: string
  selectedRowId?: number | string
  movePage(type: PaginationActionType): Promise<void>
  currentPage: number
  pageCount: number
  notInProjectsView?: boolean
}

export default function LivePaginationTable({
  table,
  onRowClick,
  cursor,
  selectedRowId,
  pageCount,
  movePage,
  currentPage,
  notInProjectsView
}: LivePaginationTableProps) {
  const theme = useTheme()

  if(notInProjectsView == true){
    return (
      <Paper
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <TableContainer style={{ flex: "1" }}>
          <Table
            stickyHeader
            sx={{ minWidth: 500 }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
                {table.heads.map((head) => (
                  <StyledTableCell key={head}>{head}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            {table.rows.length > 0 && (
              <TableBody>
                {table.rows.map((row) => (
                  <StyledTableRow
                    isSelected={selectedRowId === row.id}
                    cursor={cursor}
                    onClick={() => onRowClick(row.id)}
                    key={row.id}
                  >
                    {row.cells.map(
                      (
                        cell,
                        index // index to make the cell unique id
                      ) => (
                        <StyledTableCell key={index + cell}>
                          {cell}
                        </StyledTableCell>
                      )
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
          {table.rows.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1",
                alignItems: "center",
                justifyContent: "center",
                height: "80%",
              }}
            >
              <img
                src={empty}
                style={{
                  display: "flex",
                  alignSelf: "center",
                  justifySelf: "center",
                  marginBottom: theme.spacing(1),
                }}
              />
              <Typography variant="h5">Sorry! No results found.</Typography>
            </div>
          )}
        </TableContainer>
      </Paper>
    )

  }else{
    return (
      <Paper
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        sx={{ width: "100%", overflow: "hidden" }}
      >
        <TableContainer style={{ flex: "1" }}>
          <Table
            stickyHeader
            sx={{ minWidth: 500 }}
            aria-label="custom pagination table"
          >
            <TableHead>
              <TableRow>
                {table.heads.map((head) => (
                  <StyledTableCell key={head}>{head}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            {table.rows.length > 0 && (
              <TableBody>
                {table.rows.map((row) => (
                  <StyledTableRow
                    isSelected={selectedRowId === row.id}
                    cursor={cursor}
                    onClick={() => onRowClick(row.id)}
                    key={row.id}
                  >
                    {row.cells.map(
                      (
                        cell,
                        index // index to make the cell unique id
                      ) => (
                        <StyledTableCell key={index + cell}>
                          {cell}
                        </StyledTableCell>
                      )
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
          {table.rows.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1",
                alignItems: "center",
                justifyContent: "center",
                height: "80%",
              }}
            >
              <img
                src={empty}
                style={{
                  display: "flex",
                  alignSelf: "center",
                  justifySelf: "center",
                  marginBottom: theme.spacing(1),
                }}
              />
              <Typography variant="h5">Sorry! No results found.</Typography>
            </div>
          )}
        </TableContainer>
        <TablePaginationActions
          pageCount={pageCount}
          currentPage={currentPage}
          movePage={movePage}
        />
      
      </Paper>
    )
  }

}


const InputStyles = {
  width: "18px",
  backgroundColor: "transparent",
  borderColor: "transparent",
  borderBottom: "0px !important",
  border: "0px",
  outline: "0px",
  TextAlign: "center",
  color: "rgb(31,160,31)"
}
