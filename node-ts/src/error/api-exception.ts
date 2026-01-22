import { NextFunction } from 'express';

class ApiException extends Error {
    public httpCode: number;
    public details: any;
    public innerError: Error | undefined;

    constructor(httpCode: number, message: string, details?: any, innerError?: Error) {
        super(message);
        this.httpCode = httpCode;
        this.details = details;
        this.innerError = innerError;
    }
}

class FirebaseAuthError extends ApiException {
    constructor(e: Error) {
        super(400, e.message, e);
    }
}

class UserNotFoundException extends ApiException {
    constructor() {
        super(400, 'User not found');
    }
}

class UnhandledException extends ApiException {
    constructor(error: Error, details?: any) {
        super(500, 'Something went wrong. Please try again', details, error);
    }
}

const handleException = (error: Error, next: NextFunction): void => {
    if (error instanceof FirebaseAuthError || error instanceof ApiException) {
        next(error);
    } else {
        next(new UnhandledException(error));
    }
};

class ExceptionDetails {
    public errorCode: number;
    public data: any;

    constructor(errorCode: number, data: any) {
        this.errorCode = errorCode;
        this.data = data;
    }
}

export {
    handleException,
    ExceptionDetails,
    ApiException,
    FirebaseAuthError,
    UserNotFoundException,
    UnhandledException
};
