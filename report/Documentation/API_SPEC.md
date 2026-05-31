# TRUSTEDGE — API Specification v1.0

> **This document is the contract.** Frontend and backend teams build from this spec.  
> Every endpoint is documented BEFORE implementation.  
> No endpoint exists in code unless it exists here first.

---

## Base URL

```
http://localhost:5000/api/v1
```

## Response Format (All Endpoints)

### Success
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

### Success (Paginated)
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error
```json
{
  "success": false,
  "message": "What went wrong",
  "error": [ { "field": "email", "message": "Invalid email" } ]
}
```

## Pagination Strategy

All list endpoints support:
- `?page=1` — Page number (default: 1)
- `?limit=20` — Items per page (default: 20, max: 100)

## Authentication

- Protected routes require: `Authorization: Bearer <accessToken>`
- Roles: `CUSTOMER`, `EMPLOYEE`, `ADMIN`

---

## MODULE 1: AUTH

### POST `/auth/register`
> Create a new user account.

| Field | Value |
|---|---|
| **Auth** | None (public) |
| **Roles** | Any |

**Request Body:**
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@trustedge.com",
  "password": "Test@1234",
  "role": "CUSTOMER"
}
```

**Validation:**
| Field | Rules |
|---|---|
| name | Required, 2-100 chars |
| email | Required, valid email, unique |
| password | Required, 8-128 chars |
| role | Optional, CUSTOMER/EMPLOYEE/ADMIN, default: CUSTOMER |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Arjun Sharma",
      "email": "arjun@trustedge.com",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2026-02-27T10:00:00.000Z",
      "updatedAt": "2026-02-27T10:00:00.000Z"
    },
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

**Error Cases:**
| Status | Condition |
|---|---|
| 400 | Validation failed |
| 409 | Email already exists |

---

### POST `/auth/login`
> Login with email and password.

| Field | Value |
|---|---|
| **Auth** | None (public) |

**Request Body:**
```json
{
  "email": "arjun@trustedge.com",
  "password": "Test@1234"
}
```

**Validation:**
| Field | Rules |
|---|---|
| email | Required, valid email |
| password | Required, min 1 char |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": { "id": "uuid", "name": "...", "email": "...", "role": "..." },
    "accessToken": "jwt...",
    "refreshToken": "jwt..."
  }
}
```

**Error Cases:**
| Status | Condition |
|---|---|
| 400 | Validation failed |
| 401 | Invalid email or password |
| 403 | Account deactivated |

---

### POST `/auth/refresh`
> Get a new access token using a refresh token.

| Field | Value |
|---|---|
| **Auth** | None (public — uses refreshToken in body) |

**Request Body:**
```json
{
  "refreshToken": "jwt..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully.",
  "data": {
    "user": { ... },
    "accessToken": "new-jwt...",
    "refreshToken": "new-jwt..."
  }
}
```

**Error Cases:**
| Status | Condition |
|---|---|
| 401 | Invalid or expired refresh token |

---

### GET `/auth/me`
> Get current logged-in user profile.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER, EMPLOYEE, ADMIN |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved.",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Arjun Sharma",
      "email": "arjun@trustedge.com",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

## MODULE 2: TRUSTEDGE CORE (Stress Detection)

### GET `/core/profile`
> Get current customer's financial profile and stress level.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Financial profile retrieved.",
  "data": {
    "profile": {
      "id": "uuid",
      "monthlyIncome": 50000,
      "monthlyExpenses": 38000,
      "currentBalance": 12500,
      "riskScore": 0.65,
      "stressLevel": "MODERATE",
      "lastAssessedAt": "2026-02-27T10:00:00.000Z"
    }
  }
}
```

**Error Cases:**
| Status | Condition |
|---|---|
| 404 | No financial profile found |

---

### GET `/core/transactions`
> Get customer's transaction history (paginated).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER |
| **Query** | `?page=1&limit=20&category=SALARY&type=CREDIT` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transactions retrieved.",
  "data": [
    {
      "id": "uuid",
      "type": "CREDIT",
      "category": "SALARY",
      "amount": 50000,
      "description": "Monthly salary",
      "transactionDate": "2026-02-01T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 36, "totalPages": 2 }
}
```

---

### GET `/core/alerts`
> Get stress alerts for current customer, OR all alerts if Employee/Admin.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER, EMPLOYEE, ADMIN |
| **Query** | `?page=1&limit=20&status=OPEN&severity=HIGH` |

**Behavior by role:**
- **CUSTOMER**: Gets only their own alerts.
- **EMPLOYEE**: Gets alerts assigned to them.
- **ADMIN**: Gets all alerts.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Alerts retrieved.",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "assignedEmployeeId": "uuid",
      "alertType": "SALARY_DROP",
      "severity": "HIGH",
      "message": "Salary has dropped by 23%...",
      "status": "OPEN",
      "resolvedAt": null,
      "createdAt": "...",
      "customer": { "id": "uuid", "name": "Arjun Sharma", "email": "..." },
      "employee": { "id": "uuid", "name": "Priya Patel", "email": "..." }
    }
  ],
  "pagination": { ... }
}
```

---

### PATCH `/core/alerts/:id`
> Update alert status (acknowledge, resolve, dismiss).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | EMPLOYEE, ADMIN |

**Request Body:**
```json
{
  "status": "RESOLVED"
}
```

**Validation:**
| Field | Rules |
|---|---|
| status | Required, one of: ACKNOWLEDGED / RESOLVED / DISMISSED |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Alert updated successfully.",
  "data": { "alert": { ... } }
}
```

**Error Cases:**
| Status | Condition |
|---|---|
| 404 | Alert not found |
| 403 | Not assigned to this employee |

---

### POST `/core/analyze`
> Run stress detection analysis on a customer's transactions. (Admin/Employee trigger)

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | EMPLOYEE, ADMIN |

**Request Body:**
```json
{
  "customerId": "uuid"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Stress analysis complete.",
  "data": {
    "stressLevel": "HIGH",
    "riskScore": 0.78,
    "alertsGenerated": 2,
    "patterns": [
      { "type": "SALARY_DROP", "severity": "HIGH", "detail": "23% drop detected" },
      { "type": "EMERGENCY_WITHDRAWAL", "severity": "MODERATE", "detail": "3 in 7 days" }
    ]
  }
}
```

---

## MODULE 3: SHIELD (Employee Protection)

### POST `/shield/checkin`
> Submit an end-of-shift well-being check-in.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | EMPLOYEE |

**Request Body:**
```json
{
  "stressScore": 8,
  "mood": "STRUGGLING",
  "notes": "Had to reject 3 loan applications today.",
  "difficultCasesCount": 3,
  "peerSupportRequested": true,
  "shiftDate": "2026-02-27T00:00:00.000Z"
}
```

**Validation:**
| Field | Rules |
|---|---|
| stressScore | Required, integer 1-10 |
| mood | Required, one of: GOOD / OKAY / STRUGGLING / OVERWHELMED |
| notes | Optional, max 1000 chars |
| difficultCasesCount | Optional, integer >= 0, default 0 |
| peerSupportRequested | Optional, boolean, default false |
| shiftDate | Required, valid ISO date |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Check-in recorded. Take care of yourself.",
  "data": {
    "checkin": { ... },
    "supportMessage": "You're not alone. A peer support colleague is available if you need to talk."
  }
}
```

---

### GET `/shield/history`
> Get own check-in history (employees can ONLY see their own data).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | EMPLOYEE |
| **Query** | `?page=1&limit=20` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Check-in history retrieved.",
  "data": [
    {
      "id": "uuid",
      "stressScore": 8,
      "mood": "STRUGGLING",
      "notes": "...",
      "difficultCasesCount": 3,
      "peerSupportRequested": true,
      "shiftDate": "2026-02-27",
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

**Security:** NO admin/manager endpoint exists to read Shield data. This is by design.

---

### GET `/shield/stats`
> Get own well-being trend summary (last 7 / 30 days).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | EMPLOYEE |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Well-being stats retrieved.",
  "data": {
    "last7Days": {
      "avgStressScore": 6.2,
      "totalCheckins": 5,
      "peerSupportRequests": 2,
      "moodBreakdown": { "GOOD": 1, "OKAY": 2, "STRUGGLING": 2, "OVERWHELMED": 0 }
    },
    "last30Days": {
      "avgStressScore": 5.1,
      "totalCheckins": 22,
      "peerSupportRequests": 5,
      "moodBreakdown": { "GOOD": 8, "OKAY": 9, "STRUGGLING": 4, "OVERWHELMED": 1 }
    }
  }
}
```

---

## MODULE 4: SAGE (Financial Education)

### POST `/sage/chat`
> Send a message to SAGE and get a financial education response.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER |

**Request Body:**
```json
{
  "message": "How should I manage my budget when my salary drops?",
  "topic": "BUDGETING"
}
```

**Validation:**
| Field | Rules |
|---|---|
| message | Required, 1-1000 chars |
| topic | Optional, one of: BUDGETING / SAVING / DEBT / INVESTING / GENERAL. Default: GENERAL |

**Success Response (200):**
```json
{
  "success": true,
  "message": "SAGE response generated.",
  "data": {
    "conversation": {
      "id": "uuid",
      "topic": "BUDGETING",
      "userMessage": "How should I manage my budget when my salary drops?",
      "sageResponse": "I understand that can be stressful. Let's start by...",
      "createdAt": "..."
    }
  }
}
```

---

### GET `/sage/history`
> Get chat history with SAGE (paginated).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER |
| **Query** | `?page=1&limit=20&topic=BUDGETING` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Chat history retrieved.",
  "data": [ { "id": "uuid", "topic": "...", "userMessage": "...", "sageResponse": "...", "helpful": true, "createdAt": "..." } ],
  "pagination": { ... }
}
```

---

### PATCH `/sage/feedback/:id`
> Rate a SAGE response as helpful or not.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER |

**Request Body:**
```json
{
  "helpful": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Feedback recorded. Thank you!",
  "data": { "conversation": { ... } }
}
```

---

## MODULE 5: TRUTH (Product Comparison)

### GET `/truth/products`
> List all financial products (paginated, filterable).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER, EMPLOYEE, ADMIN |
| **Query** | `?page=1&limit=20&type=LOAN&provider=TRUSTEDGE Bank` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved.",
  "data": [
    {
      "id": "uuid",
      "name": "QuickCash Personal Loan",
      "provider": "FastBank",
      "type": "LOAN",
      "interestRate": 18.5,
      "processingFee": 2500,
      "annualFee": 0,
      "prepaymentPenalty": 3000,
      "riskLevel": "HIGH",
      "description": "..."
    }
  ],
  "pagination": { ... }
}
```

---

### GET `/truth/products/:id`
> Get detailed info about a single product.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER, EMPLOYEE, ADMIN |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product details retrieved.",
  "data": { "product": { ... } }
}
```

---

### POST `/truth/compare`
> Run an unbiased comparison/analysis on a product for the current customer.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER |

**Request Body:**
```json
{
  "productId": "uuid",
  "loanAmount": 200000,
  "tenureMonths": 24
}
```

**Validation:**
| Field | Rules |
|---|---|
| productId | Required, valid UUID |
| loanAmount | Optional, positive number |
| tenureMonths | Optional, integer 1-360 |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product analysis complete.",
  "data": {
    "comparison": {
      "id": "uuid",
      "verdict": "CAUTION",
      "totalCost": 247500,
      "hiddenFeesTotal": 5500,
      "reasoning": "This loan has a high interest rate of 18.5% and a hidden prepayment penalty of ₹3,000. Total cost over 24 months would be ₹2,47,500.",
      "product": { ... },
      "betterAlternative": {
        "id": "uuid",
        "name": "TrustBuilder Personal Loan",
        "provider": "TRUSTEDGE Bank",
        "interestRate": 11.5,
        "totalCost": 225000
      }
    }
  }
}
```

---

### GET `/truth/comparisons`
> Get past comparisons the customer has run.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | CUSTOMER |
| **Query** | `?page=1&limit=20` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Comparison history retrieved.",
  "data": [ { ... } ],
  "pagination": { ... }
}
```

---

## MODULE 6: ADMIN

### GET `/admin/users`
> List all users (paginated, filterable).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | ADMIN |
| **Query** | `?page=1&limit=20&role=CUSTOMER&isActive=true` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved.",
  "data": [ { "id": "uuid", "name": "...", "email": "...", "role": "...", "isActive": true } ],
  "pagination": { ... }
}
```

---

### PATCH `/admin/users/:id`
> Update user role or deactivate account.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | ADMIN |

**Request Body:**
```json
{
  "role": "EMPLOYEE",
  "isActive": false
}
```

**Validation:**
| Field | Rules |
|---|---|
| role | Optional, CUSTOMER / EMPLOYEE / ADMIN |
| isActive | Optional, boolean |

---

### GET `/admin/stats`
> Get system-wide dashboard statistics.

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | ADMIN |

**Success Response (200):**
```json
{
  "success": true,
  "message": "System stats retrieved.",
  "data": {
    "users": { "total": 150, "customers": 120, "employees": 25, "admins": 5 },
    "alerts": { "total": 45, "open": 12, "acknowledged": 8, "resolved": 25 },
    "sage": { "totalConversations": 350, "helpfulRate": 0.78 },
    "truth": { "totalComparisons": 90, "cautionRate": 0.35 },
    "shield": { "avgStressScore": 4.8, "peerSupportRequests": 12 }
  }
}
```

---

### GET `/admin/audit-logs`
> View system audit trail (paginated).

| Field | Value |
|---|---|
| **Auth** | Bearer Token |
| **Roles** | ADMIN |
| **Query** | `?page=1&limit=50&action=LOGIN&userId=uuid` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Audit logs retrieved.",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "action": "LOGIN",
      "entityType": "User",
      "entityId": "uuid",
      "details": "...",
      "ipAddress": "127.0.0.1",
      "createdAt": "..."
    }
  ],
  "pagination": { ... }
}
```

---

## Endpoint Summary

| # | Method | Endpoint | Module | Roles |
|---|---|---|---|---|
| 1 | POST | `/auth/register` | AUTH | Public |
| 2 | POST | `/auth/login` | AUTH | Public |
| 3 | POST | `/auth/refresh` | AUTH | Public |
| 4 | GET | `/auth/me` | AUTH | All |
| 5 | GET | `/core/profile` | CORE | CUSTOMER |
| 6 | GET | `/core/transactions` | CORE | CUSTOMER |
| 7 | GET | `/core/alerts` | CORE | All |
| 8 | PATCH | `/core/alerts/:id` | CORE | EMPLOYEE, ADMIN |
| 9 | POST | `/core/analyze` | CORE | EMPLOYEE, ADMIN |
| 10 | POST | `/shield/checkin` | SHIELD | EMPLOYEE |
| 11 | GET | `/shield/history` | SHIELD | EMPLOYEE |
| 12 | GET | `/shield/stats` | SHIELD | EMPLOYEE |
| 13 | POST | `/sage/chat` | SAGE | CUSTOMER |
| 14 | GET | `/sage/history` | SAGE | CUSTOMER |
| 15 | PATCH | `/sage/feedback/:id` | SAGE | CUSTOMER |
| 16 | GET | `/truth/products` | TRUTH | All |
| 17 | GET | `/truth/products/:id` | TRUTH | All |
| 18 | POST | `/truth/compare` | TRUTH | CUSTOMER |
| 19 | GET | `/truth/comparisons` | TRUTH | CUSTOMER |
| 20 | GET | `/admin/users` | ADMIN | ADMIN |
| 21 | PATCH | `/admin/users/:id` | ADMIN | ADMIN |
| 22 | GET | `/admin/stats` | ADMIN | ADMIN |
| 23 | GET | `/admin/audit-logs` | ADMIN | ADMIN |

**Total: 23 endpoints across 6 modules.**
