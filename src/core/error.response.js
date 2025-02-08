'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
    }
}

class ConflicRequestError extends ErrorResponse {
    constructor(statusCode = StatusCode.FORBIDDEN, message = ReasonStatusCode.CONFLICT) {
        super(statusCode, message)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(statusCode = StatusCode.FORBIDDEN, message = ReasonStatusCode.CONFLICT) {
        super(statusCode, message)
    }
}

module.exports = {
    ConflicRequestError,
    BadRequestError
}