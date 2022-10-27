import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"
import SortableTree from "@nosferatu500/react-sortable-tree"
import { useContext, useEffect, useState } from "react"
import { MainTaskTemplate } from "../../api/TaskTemplateApi"
import { EditTasksScreenContext } from "../../contexts/EditTaskScreenContext"
import { TreeElement } from "../dialogs/TaskTreeViewDialog"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import { grey } from "@mui/material/colors"
import { Typography } from "@mui/material"
import empty from "../../images/empty_temp_1.png"

const MainContainer = styled("div")<{ empty: boolean }>(({ theme, empty }) => {
  return {
    height: "100%",
    display: empty ? "flex" : undefined,
    flexDirection: empty ? "column" : undefined,
    alignItems: empty ? "center" : undefined,
    justifyContent: empty ? "center" : undefined,
  }
})

const TreeDiv = styled("div")(({ theme }) => {
  return {
    height: "90%",
    backgroundColor:
      theme.palette.mode === "light"
        ? grey[100]
        : theme.palette.grey[900],
  }
})

export default function TaskTemplatePreview() {
  const { template, pickTemplate } = useContext(EditTasksScreenContext)!

  useEffect(() => {
    setTreeData(getTreeData(template?.children ?? []))
  }, [template])

  const getTreeData: (tasks: MainTaskTemplate[]) => TreeElement[] = (
    tasks: MainTaskTemplate[]
  ) => {
    return tasks.map((element) => {
      return {
        title: element.task_name,
        children: getTreeData(element.children ?? []),
      }
    })
  }

  const [treeData, setTreeData] = useState(
    getTreeData(template?.children ?? [])
  )

  return (
    <MainContainer empty={treeData.length === 0}>
      {treeData.length === 0 && (
        <>
          <img src={empty} />
          <Typography variant="h6">This template is empty</Typography>
        </>
      )}

      {treeData.length > 0 && (
        <>
          <TreeDiv>
            <SortableTree
            style={{color: "black"}}
              canDrag={() => false}
              canDrop={() => false}
              onChange={(data) => {
                setTreeData(data)
              }}
              treeData={treeData}
            />
          </TreeDiv>
          <div
            style={{
              height: "10%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              endIcon={<CheckRoundedIcon />}
              variant="contained"
              color="success"
              onClick={pickTemplate}
            >
              Select this template
            </Button>
          </div>
        </>
      )}
    </MainContainer>
  )
}
