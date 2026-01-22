import { Request, Response, NextFunction } from 'express';
import { ApiException } from '../error/api-exception';

export const isUserLoggedin = async (request: Request, response: Response, next: NextFunction) => {
    try {        
        const authorizationToken = request.headers.authorization;
        const split = authorizationToken.split(' ');        
        if (!authorizationToken)
        {            
            return next(
                new ApiException(
                    401,
                    'Authorization Required'
                )
            )            
        }
        else if (!authorizationToken.startsWith('Bearer'))
        {
            return next(
                new ApiException(
                    401,
                    'Invalid Authorization token'
                )
            )            
        }        
        else if (split.length !== 2)
        {
            return next(
                new ApiException(
                    401,
                    'Invalid Authorization token'
                )
            )            
        } else {
            return next();
        }
    } catch (e) {
        console.log(e);
        next(new ApiException(401, 'You are not authorized to make this request'));
    }
};
