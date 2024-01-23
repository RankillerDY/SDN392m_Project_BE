import reasonPhraseCore from './reasonPhrase.core';
import statusCodeCore from './statusCode.core';

class ErrorResponse extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status; //config
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = reasonPhraseCore.CONFLICT, statusCode = statusCodeCore.CONFLICT) {
    super(message, statusCode);
  }
  getNotice = () => {
    return {
      message: this.message,
      status: this.status
    };
  };
}

class BadRequestError extends ErrorResponse {
  constructor(message = reasonPhraseCore.BAD_REQUEST, statusCode = statusCodeCore.BAD_REQUEST) {
    super(message, statusCode);
  }
  getNotice = () => {
    return {
      message: this.message,
      status: this.status
    };
  };
}

class AuthFailureError extends ErrorResponse {
  constructor(message = reasonPhraseCore.UNAUTHORIZED, statusCode = statusCodeCore.UNAUTHORIZED) {
    console.log(message);
    super(message, statusCode);
  }
  getNotice = () => {
    return {
      message: this.message,
      status: this.status
    };
  };
}

class NotFoundError extends ErrorResponse {
  constructor(message = reasonPhraseCore.NOT_FOUND, statusCode = statusCodeCore.NOT_FOUND) {
    console.log(message);
    super(message, statusCode);
  }

  getNotice() {
    return {
      message: this.message,
      status: this.status
    };
  }
}

class NotModified extends ErrorResponse {
  constructor(message = reasonPhraseCore.NOT_MODIFIED, statusCode = statusCodeCore.NOT_MODIFIED) {
    console.log(message);
    super(message, statusCode);
  }
  getNotice() {
    return {
      message: this.message,
      status: this.status
    };
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = reasonPhraseCore.FORBIDDEN, statusCode = statusCodeCore.FORBIDDEN) {
    console.log(message);
    super(message, statusCode);
  }

  getNotice() {
    return {
      message: this.message,
      status: this.status
    };
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message = reasonPhraseCore.INTERNAL_SERVER_ERROR, statusCode = statusCodeCore.INTERNAL_SERVER_ERROR) {
    console.log(message);
    super(message, statusCode);
  }

  getNotice() {
    return {
      message: this.message,
      status: this.status
    };
  }
}
export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  NotModified,
  InternalServerError
};
