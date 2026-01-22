import express, { Router, Request, Response, NextFunction } from 'express';
import { isUserLoggedin } from '../middleware/auth';
import {AuthController} from '../controller/auth.controller';
import multer from 'multer';

const upload = multer();

const authRouter: Router = express.Router();

// authRouter.post("/getProfile", isUserLoggedin, AuthController.getProfile);

authRouter.post("/getProfile", AuthController.getProfile);


// authRouter.post('/getProfile', upload.single('video'), AuthController.getProfile)


// routeHandler(req, res, {
//     POST: async (req, res) => {
//       // Apply multer middleware
//       await new Promise<void>((resolve, reject) => {
//         upload.single('video')(req as any, res as any, (err: any) => {
//           if (err) return reject(err);
//           resolve();
//         });
//       });

//       // Call the actual handler
//       await AuthController.getProfile(req, res,err);
//     }
//   });


  


export default authRouter;
