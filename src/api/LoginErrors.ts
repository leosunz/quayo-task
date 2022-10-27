/**
 * Errors
 */

export interface ErrorResponse {
  error_message: string
  error_code: string
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class GeneralError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
  }
}


