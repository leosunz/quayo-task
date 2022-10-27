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
  TablePagination,
  TableHead,
  TextField,
  TableFooter,
  Input,
} from "@mui/material"
import { MouseEventHandler, useCallback, useState } from "react"
import { StyledTableCell, StyledTableRow } from "./CustomTable"
import { isNull } from "util"
import { type } from "os"
import { getDayFromDate } from "../../utils/formatters"


interface TablePaginationActionsProps {
  count: number
  page: number
  rowsPerPage: number
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme()
  var { count, page, rowsPerPage, onPageChange } = props
  var [inpuPage, setInputPage]= useState(JSON.stringify(page+1))
  

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0)
    setInputPage(JSON.stringify(0))

  }

  const handleBackButtonClick = ( 
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1)
    setInputPage(JSON.stringify(parseInt(inpuPage)-1))
  }

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1)
    setInputPage(JSON.stringify(parseInt(inpuPage)+1))

  }

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    setInputPage(JSON.stringify(Math.max(0, Math.ceil(count / rowsPerPage) - 1)))

  }

  // const handlePageInput = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   onPageChange(event, parseInt(inpuPage)-1)
    
  // }



  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <Input value={inpuPage} type="string" disableUnderline style={InputStyles} 
        onChange={async (e) =>{
          if(e.target.value == "0"){
            setInputPage("1")
            return
          }else{
            setInputPage(e.target.value)
          }
          
 
         }}
         onKeyUp={async (e)=>{
          if(e.keyCode == 13){
           
            if(inpuPage == '' ){
              setInputPage("1")
              onPageChange(null, 0)
            
              return
            }
           
            var param = parseInt(inpuPage) - 1
        
            if(Number.isNaN(param)|| param == null){
            
              setInputPage("1")
              
              onPageChange(null,0)
              return
            }
            onPageChange(null,param)
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
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? ( 
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
  
    </Box>

  )
}

export interface CustomPaginationTableProps {
  table: CustomPaginationTableState
  onRowClick(id: number | string): void
  cursor?: string
  selectedRowId?: number | string
}

export interface CustomPaginationTableRow {
  id: number | string
  cells: any[]
}

export interface CustomPaginationTableState {
  heads: string[]
  customHeaders?: { title: any; id: string }[]
  rows: CustomPaginationTableRow[]
}


type SortOrder = "ascn" | "desc";



function SortButton({
  sortOrder,
  columnKey,
  sortKey,
  onClick,
}: {
  sortOrder: SortOrder;
  columnKey: any;
  sortKey: any;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        sortKey === columnKey && sortOrder === "desc"
          ? "sort-button sort-reverse"
          : "sort-button"
      }`}
    >
      ▲
    </button>
  );
}

function specififcDateFormat(date:string) {
 let parts= date.split('/')
 let month = parseInt(parts[1])-1
 let day = parseInt(parts[0])
 let year = parseInt(parts[2])


 let newDate = new Date(year, month, day)

  return newDate;
}

export default function CustomPaginationTable({
  table,
  onRowClick,
  cursor,
  selectedRowId,
}: CustomPaginationTableProps) {


  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25) // TODO:

  const [sortKey, setSortKey] = useState<any>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascn");

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - table.rows.length) : 0

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const sortedData = useCallback(
    ({row,}:{row: CustomPaginationTableRow;}) => sortData({ row: row, sortKey, reverse: sortOrder === "desc" }),
    [table.rows, sortKey, sortOrder]
  );

  function changeSort(key: any) {
    setSortOrder(sortOrder === "ascn" ? "desc" : "ascn");

    setSortKey(key);
  }

  function sortData({
    row,
    sortKey,
    reverse,
  }: {
    row: CustomPaginationTableRow;
    sortKey: any;
    reverse: boolean;
  }) {
    if (!sortKey) return row.cells;
  
    const sortedData =  row.cells.sort((a, b) => {
      return a[sortKey] > b[sortKey] ? 1 : -1;
    });
  
    if (reverse) {
      return sortedData.reverse();
    }
  
    return sortedData;
  }

function isDelayed(row:any) {
  if(row.cells[11] != "Complete"){
    if(new Date().getTime() > specififcDateFormat(row.cells[5]).getTime()){
      if(new Date().getTime() > specififcDateFormat(row.cells[6]).getTime()){
        return true;
      }else{
        return false
      }
    }else{
     return null
    }
  }else{
    return null
  }
  
}


  console.log("TABLE", table)
  console.log("DATE CHECKING", new Date().getDate() < new Date("5/10/2022").getDate())
  console.log("DATE STRING",  new Date("5/1/2022"), new Date())

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
              {table.customHeaders
                ? table.customHeaders.map((head) => (
                    <StyledTableCell key={head.id}>
                      {head.title}
                    </StyledTableCell>
                    
                  ))
                : table.heads.map((head) => (
                    <StyledTableCell key={head}>{head}</StyledTableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? table.rows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : table.rows
            ).map((row) => (
              //const today = getDayFromDate(new Date()).split("/")
             // const a = getDayFromDate(new Date(row.cells[18])).split("/")
              <StyledTableRow
                isSelected={selectedRowId === row.id}
                cursor={cursor}
                onClick={() => onRowClick(row.id)}
                // isDelayed={row.cells[11] != "Complete"? new Date().getTime() > specififcDateFormat(row.cells[5]).getTime()? new Date().getTime()>specififcDateFormat(row.cells[6]).getTime()? false : true : false :null}
               isDelayed={isDelayed(row)}
                key={row.id}
              >
                { row.cells.map( 
                  ( 
                    cell, 
                    index // index to make the cell unique id
                  ) => (
                    <StyledTableCell key={index + cell}>{cell}</StyledTableCell>
                  )
                )}
              </StyledTableRow>
            ))}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
   
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // { label: "All", value: -1 }]}
        colSpan={3}
        count={table.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
  
  

      
    </Paper>
  )
}


   
const InputStyles = {
  width: "20px",
  backgroundColor: "transparent",
  borderColor: "transparent",
  borderBottom: "0px !important",
  border: "0px",
  outline: "0px",
  TextAlign: "center",
  color: "#0036EC",
  alignItems: 'center',
}
