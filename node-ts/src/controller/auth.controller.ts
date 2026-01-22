import express, { Request, Response, NextFunction } from 'express';
import { createApiResponse } from "../helper/api-response.helper";
import { ApiException, handleException } from '../error/api-exception';
import { UserService } from "../service/user.service";

async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const uid = req.body.uid;
        if (!uid) {
            throw new ApiException(400, 'UID is required');
        }
        const user = await UserService.getProfile(uid as string);
        if (!user) {
            throw new ApiException(404, 'User not found');
        } else {
            res.status(200).send(createApiResponse({ "user": user },"User data retrieved successfully"));
        }
    } catch (e) {
        handleException(e, next);
    }
}

export const AuthController = {getProfile}
