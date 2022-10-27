import * as Errors from "./LoginErrors"

export async function api<T>(
  url: string,
  method: HttpMethods,
  body?: any,
  headers?: any,
  errorMessage?: string,
  hasBody: boolean = true
): Promise<T | undefined> {
  const response = await fetch(url, {
    method: method,
    body: body ? JSON.stringify(body) : null,
    headers: { ...headers, "Content-Type": "application/json" },
  })



  if (!response.ok) {
    let resBody
    try {
      resBody = await response.json()
    } catch (error) {
      resBody = {
        error_message: errorMessage ?? "Something went wrong",
        error_code: "500",
      }
    }

    handleUnsuccessfulReponse(response.status, resBody)
  }

  if (hasBody) {
    try {
      console.log("resp", response)
      return await response.json()
    } catch (e) {
      console.log(e)
      throw new Errors.GeneralError("An error occurred")
    }
  } else {
    return undefined
  }
}

export enum HttpMethods {
  Get = "GET",
  Post = "POST",
  Patch = "PATCH",
  Delete = "DELETE",
}

export function handleUnsuccessfulReponse(
  resStatus: number,
  resBody: Errors.ErrorResponse
) {
  const message = resBody.error_message
  if (resStatus === 404) {
    throw new Errors.NotFoundError(message)
  } else if (resStatus === 401) {
    throw new Errors.LoginError(message)
  } else if (resStatus === 400) {
    throw new Errors.BadRequestError(message)
  } else if (resStatus === 409) {
    throw new Errors.ConflictError(message)
  } else if (resStatus === 403) {
    throw new Errors.ForbiddenError(message)
  } else if ((resStatus >= 700 && resStatus <= 799) || resStatus === 418) {
    throw new Errors.ValidationError(message)
  } else {
    throw new Errors.GeneralError("An error occurred")
  }
}

export function handleError(e: Error): IError {
  let title: string
  let message: string

  if (e instanceof Errors.LoginError) {
    title = "Unauthorized"
    message = "You are currently not logged in"
  } else if (e instanceof Errors.NetworkError) {
    title = "Network Error"
    message = "Could not connect to the server"
  } else if (e instanceof Errors.BadRequestError) {
    title = "Something went wrong."
    message = "Something went wrong. Try refreshing the page."
  } else if (e instanceof Errors.ConflictError) {
    title = "Conflict Error"
    message = e.message
  } else if (e instanceof Errors.ForbiddenError) {
    title = "Forbidden Error"
    message = e.message
  } else if (e instanceof Errors.NotFoundError) {
    title = "Not Found"
    message = e.message
  } else if (e instanceof Errors.GeneralError) {
    title = "An Error Occurred"
    message = e.message
  } else {
    title = "Something went wrong."
    message = "Something went wrong. Try refreshing the page"
  }

  return { title, message }
}

export interface IError {
  title: string
  message: string
}
