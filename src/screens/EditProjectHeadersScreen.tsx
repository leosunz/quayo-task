import AdapterDateFns from "@mui/lab/AdapterDateFns"
import DatePicker from "@mui/lab/DatePicker"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import grey from "@mui/material/colors/grey"
import Divider from "@mui/material/Divider"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import Select from "@mui/material/Select"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useContext } from "react"
import ErrorComponent from "../components/ErrorComponent"
import Loading from "../components/Loading"
import {
  InputContainer,
  ScreenContainer,
  StyledVerticalDivider,
} from "../components/StyledComponents"
import { EditProjectHeadersContext } from "../contexts/EditProjectHeadersContext"
import SaveIcon from "@mui/icons-material/Save"
//import frLocale from "date-fns/locale/fr"
import frLocale from "date-fns/locale/en-CA"

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

const HeaderContainer = styled("div")(() => {
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

export default function EditProjectHeadersScreen() {
  // context
  const {
    isLoading,
    error,
    headers,
    setTitle,
    setEstimatedDelivery,
    setProjectOwner,
    setTotalAmount,
    setLostSales,
    update,
  } = useContext(EditProjectHeadersContext)!
  const dropSize = 160
  return (
    <ScreenContainer isDataLoaded={!isLoading && !error}>
      {isLoading && <Loading text="Loading Schema.." />}
      {error && <ErrorComponent text={error ?? "Something went wrong"} />}
      {!isLoading && !error && headers && (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
          <MainContainer>
            <HeaderContainer>
              <Typography gutterBottom variant="h5">
                Edit Project Headers
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
                    onChange={(e) => setTitle(e.target.value)}
                    value={headers.title}
                    // error={title.error}
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
                        value={headers.client_code}
                        label="Client"
                        disabled
                      >
                        {headers.clients.map((client) => (
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
                        value={headers.user_code}
                        label="User"
                        onChange={(e) => setProjectOwner(e.target.value)}
                      >
                        {headers.users.map((user) => (
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
                        value={headers.project_currency}
                        label="Currency"
                        disabled
                      >
                        {headers.currencies.map((curr) => (
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
                    value={headers.estimated_delivery_date}
                    onChange={(newValue) => {
                      if (newValue) {
                        setEstimatedDelivery(newValue)
                      }
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
                      setTotalAmount(Math.abs(Number(e.target.value)))
                    }
                    value={headers.total_price}
                    label="Project Price"
                  />
                </InputContainer>
                <StyledVerticalDivider orientation="vertical" flexItem />
                <InputContainer>
                  <Typography variant="h6">Lost sales: &nbsp;&nbsp;</Typography>
                  <TextField
                    
                    type="text"
                    variant="outlined"
                    onChange={(e) => setLostSales(e.target.value)}
                    value={headers.lost_sales}
                    // error={title.error}
                    label="Lost Sales"
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
              onClick={async () => await update()}
              endIcon={<SaveIcon />}
            >
              Update
            </Button>
          </MainContainer>
        </LocalizationProvider>
      )}
    </ScreenContainer>
  )
}
