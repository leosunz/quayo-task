import { Button, TextField, Typography } from "@mui/material"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import { useContext, useEffect, useState } from "react"
import { CurrrenciesContext } from "../contexts/CurrenciesContext"
import { StyledDivider } from "./StyledComponents"
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded"
import { green, orange } from "@mui/material/colors"
import { NewCurrencyReq } from "../api/CurrenciesApi"

const Container = styled(Paper)(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
  }
})

const CustomTextField = styled(TextField)(({ theme }) => {
  return {
    margin: theme.spacing(2),
  }
})

const RowContainer = styled("div")(({ theme }) => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  }
})

export default function NewCurrencyForm() {
  const { currencies, newCurrency, selectedCurrency, updateCurrency } =
    useContext(CurrrenciesContext)!

  const [code, setCode] = useState<string | null>(null)
  const [codeErr, setCodeErr] = useState(false)
  const [desc, setDesc] = useState<string | null>(null)
  const [descErr, setDescErr] = useState(false)
  const [symbol, setSymbol] = useState<string | null>(null)
  const [symbolErr, setSymbolErr] = useState(false)

  const [ratio, setRatio] = useState<number>(0)
  const [ratioErr, setRatioErr] = useState(false)
  const [mirroredRatio, setMirroredRatio] = useState<number>(0)

  useEffect(() => {
    if (selectedCurrency) {
      setCode(selectedCurrency.currency_code)
      setDesc(selectedCurrency.description)
      setSymbol(selectedCurrency.symbol)
      setRatioCb(selectedCurrency.ratio.toString())
    } else {
      setCode(null)
      setDesc(null)
      setSymbol(null)
      setRatioCb("0")
    }
  }, [selectedCurrency])

  const setRatioCb = (e: string) => {
    let value = Number(e)
    if (!Number.isNaN(value)) {
      if (value < 0) {
        value = value * -1
      }
      setRatio(value)

      const mirVal = 1 / value
      setMirroredRatio(Number.isFinite(mirVal) ? mirVal : 0)
    }
  }

  const setRatioMirroredCb = (e: string) => {
    let value = Number(e)
    if (!Number.isNaN(value)) {
      if (value < 0) {
        value = value * -1
      }
      setMirroredRatio(value)

      const mirVal = 1 / value

      setRatio(Number.isFinite(mirVal) ? mirVal : 0)
    }
  }

  const setCurrencyCode = (e: string) => {
    setCode(e.toLocaleUpperCase())
    const uniqueCodes = currencies.map((i) =>
      i.currency_code.toLocaleUpperCase()
    )

    if (uniqueCodes.includes(e.toLocaleUpperCase()) && !selectedCurrency) {
      setCodeErr(true)
    } else {
      setCodeErr(false)
    }
  }

  const getMainCurr = () => {
    return currencies.find((c) => c.is_main)
  }

  const submit = async () => {
    if (validate()) {
      if (!selectedCurrency) {
        const body: NewCurrencyReq = {
          currency_code: code!,
          ratio: ratio,
          symbol: symbol!,
          description: desc!,
        }
        await newCurrency(body)
      } else {
        await updateCurrency(selectedCurrency!.currency_code, ratio)
      }
    }
  }

  function validate(): boolean {
    let valid = true
    const uniqueCodes = currencies.map((i) =>
      i.currency_code.toLocaleUpperCase()
    )

    if (!selectedCurrency) {
      if (
        !code ||
        code.length < 1 ||
        uniqueCodes.includes(code.toLocaleUpperCase())
      ) {
        setCodeErr(true)
        valid = false
      } else {
        setCodeErr(false)
      }

      if (!desc || desc.length < 1) {
        setDescErr(true)
        valid = false
      } else {
        setDescErr(false)
      }

      if (!symbol || symbol.length < 1) {
        setSymbolErr(true)
        valid = false
      } else {
        setSymbolErr(false)
      }
    }

    if (ratio <= 0) {
      setRatioErr(true)
      valid = false
    } else {
      setRatioErr(false)
    }

    return valid
  }

  const mainCurrStyle = { color: green[700], fontWeight: "bold" }
  const toCurrStyle = { color: orange[700], fontWeight: "bold" }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {selectedCurrency ? "Update Currency" : "New Currency"}
      </Typography>

      <CustomTextField
        type="text"
        disabled={selectedCurrency !== null}
        label="Currency Code"
        required
        value={code ?? ""}
        error={codeErr}
        onChange={(e) => setCurrencyCode(e.target.value)}
      />

      <CustomTextField
        type="text"
        label="Description"
        disabled={selectedCurrency !== null}
        required
        value={desc ?? ""}
        error={descErr}
        onChange={(e) => setDesc(e.target.value)}
      />

      <CustomTextField
        type="text"
        label="Symbol"
        disabled={selectedCurrency !== null}
        required
        value={symbol ?? ""}
        error={symbolErr}
        onChange={(e) => setSymbol(e.target.value)}
      />

      <StyledDivider orientation="horizontal" />

      <Typography style={{ marginTop: "1rem" }} gutterBottom variant="h5">
        Rate
      </Typography>

      <RowContainer>
        <Typography style={mainCurrStyle} gutterBottom variant="h6">
          {getMainCurr()?.currency_code}
        </Typography>
        <Typography gutterBottom variant="h6" style={toCurrStyle}>
          {!code || code?.length === 0 ? "———" : code}
        </Typography>
        <Typography gutterBottom variant="h6">
          =
        </Typography>
        <CustomTextField
          type="number"
          label="Ratio"
          required
          value={ratio?.toString()}
          error={ratioErr}
          onChange={(e) => setRatioCb(e.target.value)}
        />
      </RowContainer>

      <RowContainer>
        <Typography gutterBottom variant="h6" style={toCurrStyle}>
          {!code || code?.length === 0 ? "———" : code}
        </Typography>
        <Typography gutterBottom variant="h6" style={mainCurrStyle}>
          {getMainCurr()?.currency_code}
        </Typography>
        <Typography gutterBottom variant="h6">
          =
        </Typography>

        <CustomTextField
          type="number"
          label="Ratio"
          required
          value={mirroredRatio?.toString()}
          onChange={(e) => setRatioMirroredCb(e.target.value)}
        />
      </RowContainer>

      <Button
        style={{ height: "60px", margin: "1rem" }}
        color="success"
        variant="contained"
        endIcon={<CheckCircleRoundedIcon />}
        onClick={async () => await submit()}
      >
        {selectedCurrency ? "Update" : "Submit"}
      </Button>
    </Container>
  )
}
