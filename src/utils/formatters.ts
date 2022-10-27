import moment from "moment"

export function formatCurrency(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  })

  return formatter.format(amount)
}

export function getDayFromDate(date: Date) {
  const momnt = moment(date)

  return momnt.format("D/M/YYYY")
}


export function getTableProjectTitleFormat(title: string): string{
const parts = title.split("#")

let order = parts[0]
var idFormat: string;
let id = parseInt(parts[1])

if (Number.isNaN(id.valueOf()) || id == undefined || id== null) {
  return title
 
}else{
  const digits: Number = id != undefined? id.valueOf() / 10 : 0
  if(digits == 0 ){
    return title
  }
  else if(digits <= 10){
    idFormat = `${order}#00000${id}`
    return idFormat;
  }
  else if(digits <= 100){
    idFormat = `${order}#0000${id}`
    return idFormat;
  }
  else if(digits <= 1000){
    idFormat = `${order}#000${id}`
    return idFormat;
  }
  else if(digits <= 10000){
    idFormat = `${order}#00${id}`
    return idFormat;
  }
  else if(digits <= 100000){
    idFormat = `${order}#0${id}`
    return idFormat;
  }
 else{
    idFormat = `${order}#${id}`
    return idFormat;
  }
}
}

export function getProjectIdFormat1(id:Number | undefined) {
  var idFormat: string;
  if(id != undefined){
    const digits: Number = id != undefined? id.valueOf() / 10 : 0
    if(digits == 0 ){
      return undefined
    }
    else if(digits <= 10){
      idFormat = `#00000${id}`
      return idFormat;
    }
    else if(digits <= 100){
      idFormat = `#0000${id}`
      return idFormat;
    }
    else if(digits <= 1000){
      idFormat = `#000${id}`
      return idFormat;
    }
    else if(digits <= 10000){
      idFormat = `#00${id}`
      return idFormat;
    }
    else if(digits <= 100000){
      idFormat = `#0${id}`
      return idFormat;
    }
   else{
      idFormat = `#${id}`
      return idFormat;
    }
  
  }
//  const idFormat: string = `#${id}`




  
}


export function getProjectIdFormat(number: number | undefined) {

  var my_string = '' + number;
  while (my_string.length < 6) {
      my_string = '0' + my_string;
  }

  return `#${my_string}`;

}