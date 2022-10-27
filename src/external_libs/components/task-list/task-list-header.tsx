import { Paper, Typography, useTheme } from "@mui/material"
import React from "react"
import styles from "./task-list-header.module.css"

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number
  rowWidth: string
  fontFamily: string
  fontSize: string
}> = ({ headerHeight, fontFamily, fontSize, rowWidth }) => {
  const theme = useTheme()

  return (
    <Paper
      elevation={0}
      // className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[400]
            : theme.palette.grey[800],
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
          textAlign: "center",
        }}
      >
        <Typography
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Name
        </Typography>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
            textAlign: "center",
          }}
        />
        <Typography
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;From
        </Typography>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
            textAlign: "center",
          }}
        />
        <Typography
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;To
        </Typography>
      </div>
    </Paper>
  )
}
