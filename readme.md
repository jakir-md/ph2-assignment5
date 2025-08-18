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

## 🛠️ Technology Stack

| Category                      | Technologies                                                                                                                                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Backend**                   | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)                                                |
| **Database**                  | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)                                                     |
| **Validation**                | ![Zod](https://img.shields.io/badge/Zod-3068B7?style=flat&logo=zod&logoColor=white) ![Mongoose](https://img.shields.io/badge/Mongoose%20Validation-880000?style=flat)                                                                                  |
| **Authentication & Security** | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) ![Bcrypt](https://img.shields.io/badge/Bcrypt-00BFFF?style=flat) ![Role-based Access](https://img.shields.io/badge/Role--Based%20Auth-FF5733?style=flat) |
| **API Testing**               | ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white)                                                                                                                                                        |
| **Version Control**           | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)                                                                                                                                                           |
| **Deployment**                | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)                                                                                                                                                           |
| **Language**                  | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)                                                                                                                                               |

### API endpoints:

- ### 🔹 Auth Routes

  - 1. #### Login
       **POST** `/api/v1/auth/login` `Public`
  - 2. #### Logout
       **POST** `/api/v1/auth/logout` `Public`
  - 3. #### Refresh Token
       **POST** `/api/v1/auth/refresh-token` `Public`

- ### 🔹 User Routes

  - 1. #### Register User
       **POST** `/api/v1/users/register` `Public`
  - 2. #### Verify User with KYC
       **PATCH** `/api/v1/user/verify-with-kyc/:id` `Protected (All Roles)`
  - 3. #### Update User
       **PATCH** `/api/v1/user/:userId` `Protected (All Roles)`
  - 4. #### Get All Users with Wallet
       **GET** `/api/v1/user/all-users-with-wallet` `Protected (ADMIN Only)`

- ### 🔹 Wallet Routes

  - 1. #### Check Balance
       **GET** `/api/v1/wallet/check-balance` `Protected (USER, AGENT)`
  - 2. #### Get All Wallets
       **GET** `/api/v1/wallet/all-wallets` `Protected (ADMIN)`
  - 3. #### Add Money by Agent
       **POST** `/api/v1/wallet/add-money-by-agent/:phone` `Protected (Only AGENT)`
  - 4. #### Cash Out
       **POST** `/api/v1/wallet/cash-out` `Protected (USER)`
  - 5. #### Send Money
       **POST** `/api/v1/wallet/send-money` `Protected (USER, AGENT)`
  - 6. #### Add Money
       **POST** `/api/v1/wallet/add-money/:phone` `Protected (USER, AGENT)`
  - 7. #### Update Wallet Status
       **PATCH** `/api/v1/wallet/update-status/:id` `Protected (USER, AGENT, ADMIN)`

- ### 🔹 Transaction Routes

  - 1. #### Get All Transaction History
       **GET** `/api/v1/transaction/transaction-history` `Protected (ADMIN)`
  - 2. #### Get User Transaction History
       **POST** `/api/v1/transaction/user-history` `Protected (USER)`
  - 3. #### Get Agent Commission History
       **POST** `/api/v1/transaction/comission-history` `Protected (AGENT)`

- ### 🔹 System Parameter Routes

  - 1. #### Add New System Parameter
       **POST** `/api/v1/systemParameter/add-new-parameter` `Protected (ADMIN)`
