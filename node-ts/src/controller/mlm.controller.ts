import { Request, Response, NextFunction } from 'express';
import { MLMService } from '../service/mlm.service';
import { ApiResponse } from '../helper/api-response.helper';
import { ApiException } from '../error/api-exception';

const mlmService = new MLMService();

export class MLMController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, registrationAmount, referralCode, placement } = req.body;

      // Validation
      if (!username || !email || !password || !registrationAmount) {
        throw new ApiException(400, 'Missing required fields: username, email, password, registrationAmount');
      }

      if (registrationAmount <= 0) {
        throw new ApiException(400, 'Registration amount must be greater than 0');
      }

      const user = await mlmService.registerUser(
        username,
        email,
        password,
        registrationAmount,
        referralCode,
        placement
      );

      res.status(201).json(
        new ApiResponse(201, {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
          registrationAmount: user.registrationAmount,
          message: 'User registered successfully'
        }, 'Registration successful')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile with binary tree
   */
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new ApiException(400, 'User ID is required');
      }

      const user = await mlmService.getUserWithBinaryTree(parseInt(userId));

      res.status(200).json(
        new ApiResponse(200, user, 'User profile retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await mlmService.getAllUsers();

      res.status(200).json(
        new ApiResponse(200, users, 'Users retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user transactions
   */
  async getUserTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new ApiException(400, 'User ID is required');
      }

      const transactions = await mlmService.getUserTransactions(parseInt(userId));
      
      // Calculate total amount from transactions
      const totalAmount = transactions.reduce((sum, transaction) => {
        return sum + parseFloat(transaction.amount.toString());
      }, 0);

      res.status(200).json(
        new ApiResponse(200, { 
          transactions, 
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          transactionCount: transactions.length 
        }, 'Transactions retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}
