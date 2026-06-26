# 🧪 API Testing Guide — task_testing.md

Base URL: `http://localhost:5000`

---

## ✅ Test Checklist

- [x] **Test 1**: Register a new user
- [x] **Test 2**: Register with duplicate email (should fail)
- [x] **Test 3**: Register with invalid data (should fail)
- [x] **Test 4**: Login with valid credentials
- [x] **Test 5**: Login with wrong password (should fail)
- [x] **Test 6**: Login with non-existent email (should fail)
- [x] **Test 7**: Get all users as Admin
- [x] **Test 8**: Get all users as normal user (should fail - 403)
- [x] **Test 9**: Get all users without token (should fail - 401)
- [x] **Test 10**: Reset password with correct current password
- [x] **Test 11**: Reset password with wrong current password (should fail)
- [x] **Test 12**: Update profile (username/email)
- [x] **Test 13**: Update profile with already taken email (should fail)
- [x] **Test 14**: Access protected route without token (should fail - 401)

---

## 📌 Test 1 — Register a New User

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/register`  
**Headers**:
```
Content-Type: application/json
```
**Body**:
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "test1234"
}
```
**Expected Response** `201`:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "<user_id>",
    "username": "testuser",
    "email": "testuser@example.com",
    "role": "user",
    "createdAt": "<timestamp>"
  }
}
```

---

## 📌 Test 2 — Register with Duplicate Email (Should Fail)

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/register`  
**Body**:
```json
{
  "username": "anotheruser",
  "email": "testuser@example.com",
  "password": "test1234"
}
```
**Expected Response** `409`:
```json
{
  "success": false,
  "message": "Email is already in use"
}
```

---

## 📌 Test 3 — Register with Invalid Data (Should Fail)

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/register`  
**Body**:
```json
{
  "username": "ab",
  "email": "not-an-email",
  "password": "123"
}
```
**Expected Response** `400`:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    { "field": "username", "message": "Username must be at least 3 characters long" },
    { "field": "email", "message": "Invalid email address format" },
    { "field": "password", "message": "Password must be at least 6 characters long" }
  ]
}
```

---

## 📌 Test 4 — Login with Valid Credentials

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/login`  
**Body**:
```json
{
  "email": "testuser@example.com",
  "password": "test1234"
}
```
**Expected Response** `200`:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt_token>",
  "data": {
    "id": "<user_id>",
    "username": "testuser",
    "email": "testuser@example.com",
    "role": "user"
  }
}
```
> ⚠️ **Note**: Copy the `token` value — you will need it for protected routes.

---

## 📌 Test 5 — Login with Wrong Password (Should Fail)

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/login`  
**Body**:
```json
{
  "email": "testuser@example.com",
  "password": "wrongpassword"
}
```
**Expected Response** `401`:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 📌 Test 6 — Login with Non-Existent Email (Should Fail)

**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/login`  
**Body**:
```json
{
  "email": "nobody@example.com",
  "password": "test1234"
}
```
**Expected Response** `401`:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 📌 Test 7 — Get All Users as Admin

> First login as admin to get the admin token.

**Step 1 — Admin Login**:  
**Method**: `POST`  
**URL**: `http://localhost:5000/api/auth/login`  
**Body**:
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```
Copy the `token` from response.

**Step 2 — Get All Users**:  
**Method**: `GET`  
**URL**: `http://localhost:5000/api/users`  
**Headers**:
```
Authorization: Bearer <admin_jwt_token>
```
**Expected Response** `200`:
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "total": 2,
  "data": [
    {
      "id": "<id>",
      "username": "testuser",
      "email": "testuser@example.com",
      "role": "user",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    },
    {
      "id": "<id>",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "createdAt": "<timestamp>",
      "updatedAt": "<timestamp>"
    }
  ]
}
```

---

## 📌 Test 8 — Get All Users as Normal User (Should Fail — 403)

**Method**: `GET`  
**URL**: `http://localhost:5000/api/users`  
**Headers**:
```
Authorization: Bearer <normal_user_jwt_token>
```
**Expected Response** `403`:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action."
}
```

---

## 📌 Test 9 — Get All Users Without Token (Should Fail — 401)

**Method**: `GET`  
**URL**: `http://localhost:5000/api/users`  
**Headers**: _(none)_

**Expected Response** `401`:
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## 📌 Test 10 — Reset Password (Logged-in User)

**Method**: `PUT`  
**URL**: `http://localhost:5000/api/auth/reset-password`  
**Headers**:
```
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```
**Body**:
```json
{
  "currentPassword": "test1234",
  "newPassword": "newpassword123"
}
```
**Expected Response** `200`:
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## 📌 Test 11 — Reset Password with Wrong Current Password (Should Fail)

**Method**: `PUT`  
**URL**: `http://localhost:5000/api/auth/reset-password`  
**Headers**:
```
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```
**Body**:
```json
{
  "currentPassword": "wrongpassword",
  "newPassword": "newpassword123"
}
```
**Expected Response** `400`:
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## 📌 Test 12 — Update Profile

**Method**: `PUT`  
**URL**: `http://localhost:5000/api/auth/update-profile`  
**Headers**:
```
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```
**Body**:
```json
{
  "username": "updatedUser"
}
```
**Expected Response** `200`:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "<user_id>",
    "username": "updatedUser",
    "email": "testuser@example.com",
    "role": "user",
    "updatedAt": "<timestamp>"
  }
}
```

---

## 📌 Test 13 — Update Profile with Taken Email (Should Fail)

**Method**: `PUT`  
**URL**: `http://localhost:5000/api/auth/update-profile`  
**Headers**:
```
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```
**Body**:
```json
{
  "email": "admin@example.com"
}
```
**Expected Response** `409`:
```json
{
  "success": false,
  "message": "Email is already in use by another account"
}
```

---

## 📌 Test 14 — Access Protected Route Without Token (Should Fail)

**Method**: `PUT`  
**URL**: `http://localhost:5000/api/auth/update-profile`  
**Headers**: _(none)_

**Expected Response** `401`:
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## 📊 Test Results

| Test | Endpoint | Expected Status | Result |
|------|----------|----------------|--------|
| Test 1  | POST /api/auth/register | 201 | ✅ |
| Test 2  | POST /api/auth/register | 409 | ✅ |
| Test 3  | POST /api/auth/register | 400 | ✅ |
| Test 4  | POST /api/auth/login | 200 | ✅ |
| Test 5  | POST /api/auth/login | 401 | ✅ |
| Test 6  | POST /api/auth/login | 401 | ✅ |
| Test 7  | GET /api/users (admin) | 200 | ✅ |
| Test 8  | GET /api/users (user) | 403 | ✅ |
| Test 9  | GET /api/users (no token) | 401 | ✅ |
| Test 10 | PUT /api/auth/reset-password | 200 | ✅ |
| Test 11 | PUT /api/auth/reset-password | 400 | ✅ |
| Test 12 | PUT /api/auth/update-profile | 200 | ✅ |
| Test 13 | PUT /api/auth/update-profile | 409 | ✅ |
| Test 14 | PUT /api/auth/update-profile | 401 | ✅ |

---

## 🎉 All 14/14 Tests Passed Successfully!

