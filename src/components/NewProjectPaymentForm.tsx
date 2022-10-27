import AdapterDateFns from "@mui/lab/AdapterDateFns"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useContext, useState } from "react"
import { ProjectPaymentContext } from "../contexts/ProjectPaymentContext"
//import frLocale from "date-fns/locale/fr"
import frLocale from "date-fns/locale/en-CA"

import DatePicker from "@mui/lab/DatePicker"
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded"

const Container = styled(Paper)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    height: "450px",
  }
})

export default function NewProjectPaymentForm() {
  const { currencies, projectCurrency, newProjectPayment, price, paid } =
    useContext(ProjectPaymentContext)!

  const [amount, setAmount] = useState<number>()
  const [amountErr, setAmountErr] = useState(false)
  const [date, setDate] = useState(new Date())
  const [dateErr, setDateErr] = useState(false)
  const [currency, setCurrency] = useState(projectCurrency!)
  const [currencyErr, setCurrencyErr] = useState(false)

  function validate(): boolean {
    let valid = true

    if (!amount || amount <= 0 || amount > price - paid) {
      setAmountErr(true)
      valid = false
    } else {
      setAmountErr(false)
    }

    if (!date) {
      setDateErr(true)
      valid = false
    } else {
      setDateErr(false)
    }

    if (!currency) {
      setCurrencyErr(true)
      valid = false
    } else {
      setCurrencyErr(false)
    }

    return valid
  }

  async function submit() {
    if (validate()) {
      await newProjectPayment(amount!, date.getTime(), currency)
    }
  }

  return (
    <Container>
      <Typography gutterBottom variant="h5">
        New Payment
      </Typography>
      <TextField
        style={{ margin: "1rem" }}
        type="number"
        error={amountErr}
        label="Amount"
        value={amount}
        onChange={(value) => {
          if (!Number.isNaN(value.target.value)) {
            setAmount(Number(value.target.value))
          }
        }}
        required
      />
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
        <DatePicker
          label="Collection Date"
          openTo="day"
          views={["year", "month", "day"]}
          value={date}
          onChange={(newValue) => {
            if (newValue) {
              setDate(newValue)
            }
          }}
          renderInput={(params) => (
            <TextField style={{ margin: "1rem" }} error={dateErr} {...params} />
          )}
        />
      </LocalizationProvider>
      <Box style={{ margin: "1rem" }} sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            fullWidth
            error={currencyErr}
            value={currency}
            label="Currency"
            onChange={(e) => setCurrency(e.target.value)}
          >
            {currencies.map((value) => {
              return (
                <MenuItem key={value.currency_code} value={value.currency_code}>
                  {value.currency_description}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Box>
      <Button
        style={{ height: "60px", margin: "1rem" }}
        color="success"
        variant="contained"
        endIcon={<PaymentsRoundedIcon />}
        onClick={async () => await submit()}
      >
        Submit Payment
      </Button>
    </Container>
  )
}
