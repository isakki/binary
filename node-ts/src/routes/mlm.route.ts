import { Router } from 'express';
import { MLMController } from '../controller/mlm.controller';
import { rateLimitMiddleware } from '../middleware/rate-limit';

const mlmRouter = Router();
const mlmController = new MLMController();

/**
 * @route POST /mlm/register
 * @description Register a new user with MLM binary structure
 * @body {
 *   username: string,
 *   email: string,
 *   password: string,
 *   registrationAmount: number,
 *   referralCode?: string (required for non-root users),
 *   placement?: 'left' | 'right' (auto-placed if not specified)
 * }
 */
mlmRouter.post('/register', (req, res, next) => mlmController.register(req, res, next));

/**
 * @route GET /mlm/users/:userId
 * @description Get user profile with binary tree structure
 * @rateLimit 5 requests per 10 minutes
 */
mlmRouter.get('/users/:userId', rateLimitMiddleware(5, 10 * 60 * 1000), (req, res, next) => mlmController.getUserProfile(req, res, next));

/**
 * @route GET /mlm/users
 * @description Get all users (admin endpoint)
 */
mlmRouter.get('/users', (req, res, next) => mlmController.getAllUsers(req, res, next));

/**
 * @route GET /mlm/transactions/:userId
 * @description Get user transactions
 */
mlmRouter.get('/transactions/:userId', (req, res, next) => mlmController.getUserTransactions(req, res, next));

export default mlmRouter;
