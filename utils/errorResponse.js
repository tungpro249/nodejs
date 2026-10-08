class ErrorResponse extends Error {
    constructor({ status = 400, message = '' }) {
        super(message);
        this.status = status;
    }
}


class ConflictRequestError extends ErrorResponse {
    constructor(message) {
        super({ status: 409, message })
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message) {
        super({ status: 400, message })
    }
}

class AuthFailError extends ErrorResponse {
    constructor(message = 'Unauthorized') {
        super({ status: 401, message })
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = 'Not Found') {
        super({ status: 404, message })
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = 'Forbidden') {
        super({ status: 403, message })
    }
}

class InternalError extends ErrorResponse {
    constructor(message = 'Internal Error') {
        super({ status: 500, message })
    }
}

module.exports = {
    BadRequestError,
    ConflictRequestError,
    AuthFailError,
    NotFoundError,
    ForbiddenError,
    InternalError
}
