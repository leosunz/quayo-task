import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import grey from "@mui/material/colors/grey"
import { red, yellow } from "@mui/material/colors"

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const getTableRowHover = (theme: "light" | "dark", isDelayed?: boolean | null) => {
  console.log(isDelayed)
  if(isDelayed == null){
    return theme === "light" ? grey[500] : grey[800]
  }
  else if(isDelayed == true){
    return theme === "light" ? red[400] : red[700]
  }else{
    return theme === "light" ? yellow[400] : yellow[700]
  }
}

export const StyledTableRow = styled(TableRow)<{
  cursor?: string
  isSelected?: boolean,
  isDelayed?: boolean | null
}>(({ theme, cursor, isSelected , isDelayed}) => ({
 
  "&:nth-of-type(odd)": {
    backgroundColor: isSelected
      ? getTableRowHover(theme.palette.mode, isDelayed)
      : isDelayed != null?  getTableRowHover(theme.palette.mode, isDelayed) : theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: getTableRowHover(theme.palette.mode, isDelayed),
    cursor: cursor ?? "pointer",
  },
  backgroundColor: isSelected
    ? getTableRowHover(theme.palette.mode, isDelayed)
    : isDelayed != null?  getTableRowHover(theme.palette.mode, isDelayed) : undefined,

}))

export default function ({ table, onRowClick }: CustomTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="data table">
        <TableHead>
          <TableRow>
            {table.heads.map((head) => (
              <StyledTableCell key={head}>{head}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.rows.map((row) => (
            <StyledTableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => onRowClick(row.id)}
            >
              {row.cells.map(
                (
                  cell,
                  index // index to make the cell unique id
                ) => (
                  <StyledTableCell key={index + cell}>{cell}</StyledTableCell>
                )
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export interface CustomTableProps {
  table: CustomTableState
  onRowClick(id: number | string): void
}

export interface CustomTableRow {
  id: number | string
  cells: any[]
}

export interface CustomTableState {
  heads: string[]
  rows: CustomTableRow[]
}
