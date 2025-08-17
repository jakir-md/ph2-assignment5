# DigiWallet
### **🎯 Project Overview**
Digiwallet is a digital wallet service which facilitates the transactions we made in our day to day life. There are 3 roles (USER, ADMIN, AGENT). The features are: KYC support for user verification, Peer to Peer sendMoney(USER to USER and AGENT to AGENT), addMoney from cards or banks, cashIn and cashOut using agent account(like our regular MFS), checking wallet's balance, updating user Information, and viewing transactions for each roles. All of the transactions are stored in Database and Atomic property of transaction is maintained. All transaction is validated and business policy is applied, like negative amounts checking, deducting system charges and adding agent comissions. Zod validation for taking user input has been implemented along with mongoose validation strategies. For the safer use of the app User Authentication and Authorization and route protection has been implemented.

### **📌Implemented Functional Requirements**

- ✅ JWT-based login system with three roles: `admin`, `user`, `agent`
- ✅ Secure password hashing (using bcrypt)
- ✅ Each user and agent must have a wallet automatically created at registration (e.g., initial balance: ৳50)
- ✅ Users should be able to:
    - Add money
    - Withdraw money
    - Send money to another user
    - View transaction history
- ✅ Agents should be able to:
    - Add money to any user's wallet
    - Withdraw money from any user's wallet
    - View their commission history
- ✅ Admins should be able to:
    - View all users, agents, wallets and transactions
    - Block/unblock user wallets
    - Approve/suspend agents
    - Set system parameters (e.g., transaction fees)
- ✅ Role-based route protection must be implemented
---


### API endpoints:
- Auth:
    - 1. POST: /api/v1/auth/login --> Public Route
    - 2. POST: /api/v1/auth/logout --> Public Route
    - 3. POST: /api/v1/auth/refresh-token --> Public Route
- User: 
    - 1. POST: /api/v1/user/register --> Public Route
    - 2. PATCH: /api/v1/user/verify-with-kyc/:id --> Protected(All Roles)
    - 3. PATCH: /api/v1/user/:userId --> Protected(All Roles)
    - 4. GET: /api/v1/user/all-users-with-wallet --> Protected(ADMIN Only)

- Wallet:
    - 1. GET: /api/v1/wallet/check-balance --> Protected(USER, AGENT)
    - 2. GET: /api/v1/wallet/all-wallets --> Protected(ADMIN)
    - 3. POST: /api/v1/wallet/add-money-by-agent/:phone --> Protected(Only AGENT)
    - 4. POST: /api/v1/wallet/cash-out --> Protected (USER)
    - 5. POST: /api/v1/wallet/send-money --> Protected(USER, AGENT)
    - 6. POST: /api/v1/wallet/add-money/:phone --> Protected(USER, AGENT)
    - 7. PATCH: /api/v1/wallet/update-status/:id --> Protected (USER, AGENT, ADMIN)

- Transactions:
    - 1. GET: /api/v1/transaction/transaction-history --> Protected(ADMIN)
    - 2. POST: /api/v1/transaction/user-history --> Protected(USER)
    - 3. POST: /api/v1/transaction/comission-history --> Protected(AGENT)

- System Parameter:
    - 1. POST: /api/v1/systemParameter/add-new-parameter --> Protected(ADMIN)