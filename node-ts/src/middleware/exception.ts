import { Request, Response, NextFunction } from 'express';
import { ApiException, UnhandledException } from '../error/api-exception';

interface ApiExceptionType {
    httpCode: number;
    message: string;
    details?: any;
    innerError?: Error;
}

interface createUnhandledExceptionType {
    httpCode?: number;
    message: string;
    details?: any;
}

export const unhandledErrorHandler = (error: Error, request: Request, response: Response, next: NextFunction): void => {
    let err: ApiExceptionType | createUnhandledExceptionType;
    if (error instanceof ApiException) {
        err = error;
    } else {        
        err = new UnhandledException(error);
    }

    // Log errors other than 4xx errors
    if (err.httpCode >= 500 || err.httpCode < 400) {
        console.log(error);
        if (err.httpCode === 503) {
            // Tell the client to retry after 1 minute
            response.setHeader('Retry-After', 60);
        }
    }
    response.status(err.httpCode).send({
        status: err.httpCode,
        message: err.message,
        data: err.details
    });    
};

export const routeErrorHandler = (request: Request, response: Response, next: NextFunction): void => {
    if (!request.route) {
        response.status(404).send({
            message: 'Requested resource could not be found',
            resourcePath: request.path,
            method: request.method
        });
    }
    next();
};
