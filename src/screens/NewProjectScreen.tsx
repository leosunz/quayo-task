import { useContext, useEffect, useState } from "react"
import { styled } from "@mui/material/styles"
import {
  InputContainer,
  ScreenContainer,
  StyledDivider,
  StyledInputContainer,
  StyledVerticalDivider,
} from "../components/StyledComponents"
import useFetch from "../hooks/useFetch"
import {
  initProjectUrl,
  MinifiedProject,
  NewProjectRequest,
  newProjectWithoutTempUrl,
  ProjectInit,
} from "../api/ProjectApi"
import { AuthContext } from "../contexts/AuthContext"
import { api, HttpMethods } from "../api/ApiControllers"
import Loading from "../components/Loading"
import ErrorComponent from "../components/ErrorComponent"
import Box from "@mui/system/Box"
import DatePicker from "@mui/lab/DatePicker"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { useNavigate } from "react-router-dom"
import AlertDialog from "../components/dialogs/AlertDialog"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import green from "@mui/material/colors/green"
import grey from "@mui/material/colors/grey"
import deepPurple from "@mui/material/colors/deepPurple"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

const MainContainer = styled(Paper)(({ theme }) => {
  return {
    backgroundColor:
      theme.palette.mode === "light"
        ? grey[200]
        : theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
  }
})

const HeaderContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  }
})

const MainElements = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
})
const dropSize = 160
export default function NewProjectScreen() {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()

  // Dialog
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogContent, setDialogContent] = useState("")

  // Mandatory
  const [clientSelected, setClientSelected] = useState({
    error: false,
    value: "",
  })
  const [userSelected, setUserSelected] = useState({ error: false, value: "" })
  const [title, setTitle] = useState({ error: false, value: "" })
  const [projectCurrency, setProjectCurrency] = useState({
    error: false,
    value: "",
  })
  const [estimatedDelivery, setEstimatedDelivery] = useState<{
    value: Date | null
    error: boolean
  }>({
    error: false,
    value: new Date(),
  })
  const [totalPrice, setTotalPrice] = useState({ error: false, value: "" })

  const [lostSales, setLostSales] = useState({ error: false, value: "" })

  // Payment
  const [downPayment, setDownPayment] = useState({ error: false, value: "" })
  const [downPaymentCurr, setDownPaymentCurr] = useState({
    error: false,
    value: "",
  })
  const [paymentCollDate, setPaymentCollDate] = useState<{
    value: Date | null
    error: boolean
  }>({
    error: false,
    value: new Date(),
  })

  const {
    data: initData,
    isLoading: initLoading,
    error,
  } = useFetch<ProjectInit>(initProjectUrl, HttpMethods.Get, null, {
    Authorization: `Bearer ${user?.tokenStr}`,
  })

  const submit = async () => {
    if (validate()) {
      let body: NewProjectRequest = {
        user_code: userSelected.value,
        client_code: clientSelected.value,
        total_price: Number(totalPrice.value),
        project_currency: projectCurrency.value,
        estimated_delivery_date: estimatedDelivery.value!.getTime(),
        title: title.value,
        lost_sales: lostSales.value
      }

      if (downPayment.value.length >= 1) {
        body.down_payment = Number(downPayment.value)
        body.payment_collection_date = paymentCollDate.value!.getTime()
        body.down_payment_currency = downPaymentCurr.value
      }

      let url = newProjectWithoutTempUrl

      // api call

      try {
        setIsLoading(true)
        const { id } = (await api<MinifiedProject>(
          url,
          HttpMethods.Post,
          body,
          {
            Authorization: `Bearer ${user?.tokenStr}`,
          },
          undefined,
          true
        ))!

        navigate(`/projects/${id}/tasks/edit`)
      } catch (e: any) {
        setDialogTitle("Something went wrong")
        setDialogContent(e.message)
        setDialogOpen(true)
        setIsLoading(false)
      }
    }
  }

  function validate(): boolean {
    let valid = true

    if (userSelected.value.length < 1) {
      setUserSelected({ value: userSelected.value, error: true })
      valid = false
    }

    if (clientSelected.value.length < 1) {
      setClientSelected({ value: clientSelected.value, error: true })
      valid = false
    }

    if (Number.isNaN(totalPrice.value) || totalPrice.value.length < 1) {
      setTotalPrice({ value: totalPrice.value, error: true })
      valid = false
    }

    if (projectCurrency.value.length < 1) {
      setProjectCurrency({ value: projectCurrency.value, error: true })
      valid = false
    }

    if (estimatedDelivery.value === null) {
      setEstimatedDelivery({ value: estimatedDelivery.value, error: true })
      valid = false
    }

    if (title.value.length < 1) {
      setTitle({ value: title.value, error: true })
      valid = false
    }

    if (downPayment.value.length >= 1) {
      if (Number.isNaN(downPayment.value) || downPayment.value.length < 1) {
        setDownPayment({ value: downPayment.value, error: true })
        valid = false
      }

      if (downPaymentCurr.value.length < 1) {
        setDownPaymentCurr({ value: downPaymentCurr.value, error: true })
        valid = false
      }

      if (paymentCollDate.value === null) {
        setPaymentCollDate({ value: paymentCollDate.value, error: true })
        valid = false
      }
    } else {
      setDownPayment({ value: downPayment.value, error: false })
      setDownPaymentCurr({ value: downPaymentCurr.value, error: false })
      setPaymentCollDate({ value: paymentCollDate.value, error: false })
    }

    return valid
  }

  useEffect(() => {
    const client = initData?.clients.find(
      (i) => i.client_code === clientSelected.value
    )
    if (client) {
      setProjectCurrency({
        error: projectCurrency.error,
        value: client.currency,
      })
      setDownPaymentCurr({
        error: downPaymentCurr.error,
        value: client.currency,
      })
    }
  }, [clientSelected])

  return (
    <ScreenContainer
      isDataLoaded={initData !== null && !error && !isLoading && !initLoading}
    >
      {initLoading && <Loading text="Fetching Data.." />}
      {isLoading && <Loading text="Adding Project.." />}
      {error && <ErrorComponent text={error} />}
      {initData && !isLoading && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MainContainer>
            <HeaderContainer>
              <Typography gutterBottom variant="h5">
                New Project
              </Typography>
            </HeaderContainer>
            <Divider
              style={{ backgroundColor: "black", marginBottom: "1rem" }}
            />

            <InputContainer>
              <MainElements>
                <InputContainer>
                  <Typography variant="h6">Title: &nbsp;&nbsp;</Typography>
                  <TextField
                    required
                    type="text"
                    variant="outlined"
                    onChange={(e) =>
                      setTitle({
                        value: e.target.value,
                        error: title.error,
                      })
                    }
                    value={title.value}
                    error={title.error}
                    label="Title"
                  />
                </InputContainer>
                <InputContainer>
                  <Typography variant="h6">Client: &nbsp;&nbsp;</Typography>
                  <Box sx={{ minWidth: dropSize }}>
                    <FormControl fullWidth>
                      <InputLabel id="client-label">Client</InputLabel>
                      <Select
                        labelId="client-label"
                        id="client-select"
                        value={clientSelected.value}
                        error={clientSelected.error}
                        label="Client"
                        onChange={(e) =>
                          setClientSelected({
                            error: clientSelected.error,
                            value: e.target.value,
                          })
                        }
                      >
                        {initData.clients.map((client) => (
                          <MenuItem
                            key={client.client_code}
                            value={client.client_code}
                          >
                            {client.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">
                    Project Owner: &nbsp;&nbsp;
                  </Typography>
                  <Box sx={{ minWidth: dropSize }}>
                    <FormControl fullWidth>
                      <InputLabel id="user-label">User</InputLabel>
                      <Select
                        labelId="user-label"
                        id="user-select"
                        value={userSelected.value}
                        error={userSelected.error}
                        label="user"
                        onChange={(e) =>
                          setUserSelected({
                            value: e.target.value,
                            error: userSelected.error,
                          })
                        }
                      >
                        {initData.users.map((user) => (
                          <MenuItem key={user.user_code} value={user.user_code}>
                            {user.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">Currency: &nbsp;&nbsp;</Typography>
                  <Box sx={{ minWidth: dropSize }}>
                    <FormControl fullWidth>
                      <InputLabel id="currency-label">Currency</InputLabel>
                      <Select
                        labelId="currency-label"
                        id="currency-select"
                        value={projectCurrency.value}
                        error={projectCurrency.error}
                        label="Currency"
                        onChange={(e) =>
                          setProjectCurrency({
                            error: projectCurrency.error,
                            value: e.target.value,
                          })
                        }
                      >
                        {initData.currencies.map((curr) => (
                          <MenuItem
                            key={curr.currency_code}
                            value={curr.currency_code}
                          >
                            {curr.currency_symbol}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">Delivery: &nbsp;&nbsp;</Typography>
                  <DatePicker
                    label="Estimated Delivery"
                    openTo="month"
                    views={["year", "month", "day"]}
                    value={estimatedDelivery.value}
                    onChange={(newValue) => {
                      setEstimatedDelivery({
                        value: newValue,
                        error: estimatedDelivery.error,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">Price: &nbsp;&nbsp;</Typography>
                  <TextField
                    required
                    type="number"
                    variant="outlined"
                    onChange={(e) =>
                      setTotalPrice({
                        value: Math.abs(Number(e.target.value)).toString(),
                        error: totalPrice.error,
                      })
                    }
                    value={totalPrice.value}
                    error={totalPrice.error}
                    label="Project Price"
                  />
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">Lost Sales: &nbsp;&nbsp;</Typography>
                  <TextField
                    
                    type="text"
                    variant="outlined"
                    onChange={(e) =>
                      setLostSales({
                        value: e.target.value,
                        error: lostSales.error,
                      })
                    }
                    value={lostSales.value}
                    error={lostSales.error}
                    label="Lost Sales"
                  />
                </InputContainer>
              </MainElements>
            </InputContainer>
            <StyledDivider />
            <InputContainer>
              <MainElements>
                <InputContainer>
                  <Typography variant="h6">Amount: &nbsp;&nbsp;</Typography>
                  <TextField
                    type="number"
                    required
                    label="Amount"
                    variant="outlined"
                    value={downPayment.value}
                    error={downPayment.error}
                    onChange={(e) =>
                      setDownPayment({
                        value: Math.abs(Number(e.target.value)).toString(),
                        error: downPayment.error,
                      })
                    }
                  />
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">Currency: &nbsp;&nbsp;</Typography>
                  <Box sx={{ minWidth: dropSize }}>
                    <FormControl fullWidth>
                      <InputLabel id="currency-label">Currency</InputLabel>
                      <Select
                        labelId="currency-label"
                        id="currency-select"
                        value={downPaymentCurr.value}
                        error={downPaymentCurr.error}
                        label="Currency"
                        onChange={(e) =>
                          setDownPaymentCurr({
                            value: e.target.value,
                            error: downPaymentCurr.error,
                          })
                        }
                      >
                        {initData.currencies.map((curr) => (
                          <MenuItem
                            key={curr.currency_code}
                            value={curr.currency_code}
                          >
                            {curr.currency_symbol}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">
                    Collection Date: &nbsp;&nbsp;
                  </Typography>
                  <DatePicker
                    label="Collection Date"
                    openTo="month"
                    views={["year", "month", "day"]}
                    value={paymentCollDate.value}
                    onChange={(newValue) => {
                      setPaymentCollDate({
                        value: newValue,
                        error: paymentCollDate.error,
                      })
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </InputContainer>
              </MainElements>
            </InputContainer>

            <Button
              color="success"
              style={{
                alignSelf: "flex-end",
                justifySelf: "center",
                margin: "1rem",
              }}
              variant="contained"
              onClick={async () => await submit()}
              endIcon={<ArrowForwardIosRoundedIcon />}
            >
              Next
            </Button>
          </MainContainer>
        </LocalizationProvider>
      )}

      <AlertDialog
        content={dialogContent}
        isOpen={dialogOpen}
        title={dialogTitle}
        onClose={() => setDialogOpen(false)}
      />
    </ScreenContainer>
  )
}
