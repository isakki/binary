# MLM Binary API - Node.js TypeScript Implementation

## Features Implemented

### 1. **User Registration API**
- Register new users with a registration amount
- First user gets username "A" as root
- Subsequent users need referral code from existing users
- 2% referral bonus automatically credited to referrer

### 2. **Binary MLM Structure**
- Each user has left and right placement positions
- Users can be auto-placed or manually placed
- Binary tree structure stored in MySQL

### 3. **Referral System**
- 2% bonus on registration amount credited to referrer
- Bonus immediately added to referrer's balance
- Transaction logs maintained for all activities

### 4. **Transaction Tracking**
- All transactions logged with type, amount, and status
- Transaction types: registration, referral_bonus, withdrawal, debit

---

## API Endpoints

### 1. **Register User**
```
POST /mlm/register
```
**Request Body:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "registrationAmount": 1000,
  "referralCode": "A",
  "placement": "left"
}
```

**Response (Success - 201):**
```json
{
  "statusCode": 201,
  "data": {
    "id": 2,
    "username": "user123",
    "email": "user@example.com",
    "balance": 1000,
    "registrationAmount": 1000,
    "message": "User registered successfully"
  },
  "message": "Registration successful"
}
```

**Notes:**
- `registrationAmount` is required and must be > 0
- For first user, username becomes "A" regardless of input
- For subsequent users, `referralCode` is required (username of referrer)
- `placement` can be "left", "right", or auto-placed if not specified

---

### 2. **Get User Profile with Binary Tree**
```
GET /mlm/users/:userId
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "id": 1,
    "username": "A",
    "email": "root@example.com",
    "balance": 1020,
    "registrationAmount": 1000,
    "referralBonus": 20,
    "referrer": null,
    "leftPlacement": {
      "id": 2,
      "username": "user123"
    },
    "rightPlacement": null,
    "createdAt": "2026-01-22T10:30:00Z"
  },
  "message": "User profile retrieved successfully"
}
```

---

### 3. **Get All Users (Admin)**
```
GET /mlm/users
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "username": "A",
      "email": "root@example.com",
      ...
    },
    ...
  ],
  "message": "Users retrieved successfully"
}
```

---

### 4. **Get User Transactions**
```
GET /mlm/transactions/:userId
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "amount": 1000,
      "type": "registration",
      "description": "Registration amount",
      "status": "completed",
      "createdAt": "2026-01-22T10:30:00Z"
    },
    {
      "id": 2,
      "userId": 1,
      "amount": 20,
      "type": "referral_bonus",
      "description": "2% referral bonus from user user123",
      "status": "completed",
      "createdAt": "2026-01-22T10:31:00Z"
    }
  ],
  "message": "Transactions retrieved successfully"
}
```

---

## Database Setup

### MySQL Tables Created Automatically (with TypeORM)

1. **users** - Stores user information with binary tree references
2. **transactions** - Stores all transaction records

### Environment Variables
Create a `.env` file based on `.env.example`:
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=mlm_binary
```

---

## How It Works

### Registration Flow:
1. User calls `/mlm/register` with registration amount and referral code
2. System validates the referral code (username of referrer)
3. New user is created and placed in binary tree (left/right)
4. 2% of registration amount is credited to referrer
5. Transaction logs are created for both users
6. Response with user details and confirmation

### Binary Tree Placement:
```
        A (1000)
       / \
      /   \
   user1  user2
   (left) (right)
```

---

## Installation & Running

1. **Install Dependencies:**
```bash
npm install
```

2. **Configure Database:**
   - Create MySQL database named `mlm_binary`
   - Update `.env` file with MySQL credentials

3. **Run Server:**
```bash
npm run start:dev  # Development with nodemon
npm run build      # Build TypeScript
npm start          # Run built project
```

4. **Test API:**
```bash
# Create root user (first user becomes "A")
curl -X POST http://localhost:4000/mlm/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "root@example.com",
    "password": "password123",
    "registrationAmount": 1000
  }'

# Register second user
curl -X POST http://localhost:4000/mlm/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "email": "user1@example.com",
    "password": "password123",
    "registrationAmount": 500,
    "referralCode": "A",
    "placement": "left"
  }'
```

---

## Future Enhancements

- [ ] Password hashing (bcrypt)
- [ ] JWT authentication
- [ ] Withdrawal system
- [ ] Income calculation from levels
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] ROI calculations
- [ ] Matching bonus system
