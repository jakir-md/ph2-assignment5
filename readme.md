# DigiWallet

**DigiWallet** is a digital wallet service that facilitates transactions in our day-to-day life.  
There are three roles in the system: **USER, ADMIN, and AGENT**.

---

## 🚀 Features

- ✅ KYC support for user verification
- 🔄 Peer-to-Peer money transfer (USER ⇆ USER and AGENT ⇆ AGENT)
- 💳 Add money from cards or banks
- 💰 Cash-in and cash-out using an agent account (similar to regular MFS)
- 📊 Check wallet balance
- 📝 Update user information
- 📜 View transactions for each role

---

## 🗄️ Transactions & Validation

- All transactions are stored in the **database**.
- The **atomic property of transactions** is maintained.
- Business rules are applied, including:
  - Checking for negative amounts
  - Deducting system charges
  - Adding agent commissions

---

## 🔐 Security & Validation

- Input validation using **Zod** and **Mongoose validation strategies**
- **User authentication & authorization**
- **Route protection** for safer use of the app

---

### API endpoints:


- Auth:
  - 1. POST: /api/v1/auth/login --> Public Route
  - 2. POST: /api/v1/auth/logout --> Public Route
  - 3. POST: /api/v1/auth/refresh-token --> Public Route
- ### 🔹 User Routes
  - 1. #### Register User
       **POST** `/api/v1/users/register` `Public Route` 
    - 2. PATCH: /api/v1/user/verify-with-kyc/:id --> Protected(All Roles) - 3. PATCH: /api/v1/user/:userId --> Protected(All Roles) - 4. GET: /api/v1/user/all-users-with-wallet --> Protected(ADMIN Only)

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
  - 3. POST: /api/v1/transaction/comission-history --> Protected(AGENT);

- System Parameter:
  - 1. POST: /api/v1/systemParameter/add-new-parameter --> Protected(ADMIN)
