import { User } from '../model/entities/user.entity';
import { Transaction } from '../model/entities/transaction.entity';
import { ApiException } from '../error/api-exception';
import { AppDataSource } from '../config/db-config';

export class MLMService {
  // Lazy-load repositories from AppDataSource to ensure database connection is initialized
  private get userRepository() {
    return AppDataSource.getRepository(User);
  }

  private get transactionRepository() {
    return AppDataSource.getRepository(Transaction);
  }

  /**
   * Register a new user with MLM binary structure
   */
  async registerUser(
    username: string,
    email: string,
    password: string,
    registrationAmount: number,
    referralCode?: string,
    placement?: 'left' | 'right'
  ): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiException(409, 'User already exists with this email');
    }

    // If this is the first user (registration amount matches), create as root
    const allUsers = await this.userRepository.find();
    let referrerUser: User | null = null;
    let newUser: User;

    if (allUsers.length === 0) {
      // First user - default username is "A"
      if (username !== 'A') {
        username = 'A';
      }
      newUser = this.userRepository.create({
        username,
        email,
        password, // Note: In production, hash this password!
        registrationAmount,
        balance: registrationAmount,
        referrerId: null,
        status: 'active'
      });
    } else {
      // Validate referral code and get referrer
      if (!referralCode) {
        throw new ApiException(400, 'Referral code is required for non-root users');
      }

      referrerUser = await this.userRepository.findOne({
        where: { username: referralCode }
      });

      if (!referrerUser) {
        throw new ApiException(404, 'Invalid referral code');
      }

      // Create new user
      newUser = this.userRepository.create({
        username,
        email,
        password, // Note: In production, hash this password!
        registrationAmount,
        balance: registrationAmount,
        referrerId: referrerUser.id,
        status: 'active'
      });

      // Place user in binary tree (left or right)
      if (placement === 'left') {
        if (referrerUser.leftPlacementId) {
          throw new ApiException(409, 'Left position already occupied');
        }
      } else if (placement === 'right') {
        if (referrerUser.rightPlacementId) {
          throw new ApiException(409, 'Right position already occupied');
        }
      } else {
        // Auto-place in available position
        if (!referrerUser.leftPlacementId) {
          placement = 'left';
        } else if (!referrerUser.rightPlacementId) {
          placement = 'right';
        } else {
          throw new ApiException(409, 'Both positions are occupied for this referrer');
        }
      }
    }

    // Save new user
    const savedUser = await this.userRepository.save(newUser);

    // Update referrer's binary tree if applicable
    if (referrerUser) {
      if (placement === 'left') {
        referrerUser.leftPlacementId = savedUser.id;
      } else {
        referrerUser.rightPlacementId = savedUser.id;
      }
      await this.userRepository.save(referrerUser);

      // Credit 2% referral bonus to referrer
      const bonusAmount = registrationAmount * 0.02;
      referrerUser.referralBonus = (parseFloat(referrerUser.referralBonus.toString()) + bonusAmount).toString() as any;
      referrerUser.balance = (parseFloat(referrerUser.balance.toString()) + bonusAmount).toString() as any;
      await this.userRepository.save(referrerUser);

      // Log referral bonus transaction
      await this.transactionRepository.save(
        this.transactionRepository.create({
          userId: referrerUser.id,
          amount: bonusAmount,
          type: 'referral_bonus',
          description: `2% referral bonus from user ${savedUser.username}`,
          status: 'completed'
        })
      );
    }

    // Log registration transaction
    await this.transactionRepository.save(
      this.transactionRepository.create({
        userId: savedUser.id,
        amount: registrationAmount,
        type: 'registration',
        description: 'Registration amount',
        status: 'completed'
      })
    );

    return savedUser;
  }

  /**
   * Get user with their binary tree structure
   */
  async getUserWithBinaryTree(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['leftPlacement', 'rightPlacement', 'referrer']
    });

    if (!user) {
      throw new ApiException(404, 'User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      registrationAmount: user.registrationAmount,
      referralBonus: user.referralBonus,
      referrer: user.referrer ? { id: user.referrer.id, username: user.referrer.username } : null,
      leftPlacement: user.leftPlacement ? { id: user.leftPlacement.id, username: user.leftPlacement.username } : null,
      rightPlacement: user.rightPlacement ? { id: user.rightPlacement.id, username: user.rightPlacement.username } : null,
      createdAt: user.createdAt
    };
  }

  /**
   * Get all users (for admin)
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['leftPlacement', 'rightPlacement', 'referrer']
    });
  }

  /**
   * Get user transactions
   */
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }
}
