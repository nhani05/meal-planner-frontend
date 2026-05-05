# 📋 API Endpoints — Meal Planner System

**Base URL:** `http://localhost:8081/api`  
**Content-Type:** `application/json`  
**Auth Header:** `Authorization: Bearer <JWT_TOKEN>` (trừ endpoint công khai)

---

## Mục lục

1. [Quy ước chung](#1-quy-ước-chung)
2. [Auth — Xác thực](#2-auth--xác-thực)
3. [Health Profile — Hồ sơ sức khỏe](#3-health-profile)
4. [Health Goal — Mục tiêu sức khỏe](#4-health-goal)
5. [Dishes — Món ăn](#5-dishes)
6. [Dish Categories](#6-dish-categories)
7. [Dish Ratings](#7-dish-ratings)
8. [Favorites — Yêu thích](#8-favorites)
9. [Ingredients — Nguyên liệu](#9-ingredients)
10. [Meal Plans — Kế hoạch bữa ăn](#10-meal-plans)
11. [Meals — Bữa ăn](#11-meals)
12. [Portions — Khẩu phần](#12-portions)
13. [Meal Plan Templates](#13-meal-plan-templates)
14. [Admin](#14-admin)
15. [Bảng so sánh BE vs FE](#15-bảng-so-sánh-be-vs-fe)
16. [Enum Values](#16-enum-values)

---

## 1. Quy ước chung

### Error Response (mọi endpoint)

```json
{
  "status": 400,
  "message": "Mô tả lỗi cụ thể",
  "timestamp": 1746345600000
}
```

| HTTP Status | Khi nào |
|---|---|
| `200 OK` | Thành công (GET, PUT, POST) |
| `204 No Content` | Xóa thành công (DELETE) |
| `400 Bad Request` | Validation failed |
| `401 Unauthorized` | Chưa đăng nhập / JWT hết hạn |
| `403 Forbidden` | Không đủ quyền |
| `404 Not Found` | Tài nguyên không tồn tại |
| `500 Internal Server Error` | Lỗi server |

---

## 2. Auth — Xác thực

### 2.1 `POST /auth/register` ✅ BE + FE

> **Auth:** Không yêu cầu

**Request:**
```json
{
  "username": "tester1",
  "email": "tester1@example.com",
  "password": "P@ssw0rd",
  "passwordConfirm": "P@ssw0rd"
}
```

**Response 200:**
```json
{
  "id": 1,
  "username": "tester1",
  "email": "tester1@example.com",
  "role": "user",
  "status": "active"
}
```

**Errors:** `400` — `"Passwords do not match"` / `"Username already exists"` / `"Email already exists"`

---

### 2.2 `POST /auth/login` ✅ BE + FE

> **Auth:** Không yêu cầu

**Request:**
```json
{
  "username": "tester1",
  "password": "P@ssw0rd"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "tester1",
    "email": "tester1@example.com",
    "role": "user",
    "status": "active"
  }
}
```

> [!IMPORTANT]
> FE `authService.js` comment ghi response là `{ token, tokenType, expiresIn, role, userId }` — **SAI**. BE thực tế trả `{ token, user: {...} }`. FE cần đọc `response.data.token` và `response.data.user`.

**Errors:** `400` — `"Invalid username or password"`

---

### 2.3 `GET /auth/user/{id}` ✅ BE + FE

> **Auth:** Bearer Token

**Response 200:**
```json
{
  "id": 1,
  "username": "tester1",
  "email": "tester1@example.com",
  "role": "user",
  "status": "active"
}
```

**Errors:** `404` — `"UserAccount not found with id {id}"`

---

### 2.4 `POST /auth/logout` ⚠️ FE only — BE chưa implement

FE gọi `api.post('/auth/logout')` — BE không có endpoint này. Logout xử lý client-side (xóa token).

---

### 2.5 `POST /auth/forgot-password` ⚠️ FE only — BE chưa implement

**Request:** `{ "email": "user@example.com" }`

---

### 2.6 `POST /auth/verify-otp` ⚠️ FE only — BE chưa implement

**Request:** `{ "email": "user@example.com", "otp": "123456" }`

---

### 2.7 `POST /auth/reset-password` ⚠️ FE only — BE chưa implement

**Request:** `{ "token": "...", "newPassword": "NewP@ss" }`

---

### 2.8 `PUT /auth/change-password` ⚠️ FE only — BE chưa implement

**Request:** `{ "oldPassword": "...", "newPassword": "..." }`

---

## 3. Health Profile

### 3.1 `GET /health-profile/{accountId}` ✅ BE + FE

> **Auth:** Bearer Token

**Response 200:**
```json
{
  "id": 1,
  "fullName": "Nguyen Van A",
  "age": 30,
  "gender": "male",
  "heightCm": 175.00,
  "weightKg": 70.00,
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Errors:** `404` — `"Health profile not found for account {accountId}"`

---

### 3.2 `POST /health-profile/{accountId}` ✅ BE + FE

> **Auth:** Bearer Token — Tạo mới hoặc cập nhật

**Request:**
```json
{
  "fullName": "Nguyen Van A",
  "age": 30,
  "gender": "male",
  "heightCm": 175.00,
  "weightKg": 70.00,
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Response 200:** (trả HealthProfileDTO đã lưu — cùng format GET)

---

## 4. Health Goal

### 4.1 `GET /health-goal/{accountId}` ⚠️ FE only — BE chưa implement

**Response 200:**
```json
{
  "id": 1,
  "goalType": "weight_loss",
  "activityLevel": "medium",
  "targetWeightKg": 65.0,
  "dailyCaloriesKcal": 1800,
  "proteinGDay": 120.0,
  "carbGDay": 200.0,
  "fatGDay": 60.0
}
```

---

### 4.2 `POST /health-goal/{accountId}` ⚠️ FE only — BE chưa implement

**Request:**
```json
{
  "goalType": "weight_loss",
  "activityLevel": "medium",
  "targetWeightKg": 65.0,
  "dailyCaloriesKcal": 1800,
  "proteinGDay": 120.0,
  "carbGDay": 200.0,
  "fatGDay": 60.0
}
```

**Response 200:** (HealthGoalDTO đã lưu)

---

## 5. Dishes — Món ăn

### 5.1 `GET /dishes` ✅ BE + FE

> **Auth:** Bearer Token

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Grilled Chicken",
    "categoryId": 1,
    "imageUrl": "https://example.com/chicken.jpg",
    "source": "system",
    "difficulty": "easy",
    "totalTimeMin": 45
  }
]
```

> [!NOTE]
> FE `dishService.getDishes()` gửi query params `{ keyword, categoryId, minCal, maxCal, page, size }` — nhưng BE hiện tại **không hỗ trợ filter/phân trang**, trả toàn bộ danh sách.

---

### 5.2 `GET /dishes/{id}` ✅ BE + FE

**Response 200:** (1 DishDTO — cùng format trên)

**Errors:** `404` — `"Dish not found with id {id}"`

---

### 5.3 `GET /dishes/system` ✅ BE only

Lấy danh sách món `source = "system"`. FE chưa gọi trực tiếp.

---

### 5.4 `GET /dishes/account/{accountId}` ✅ BE only

Lấy danh sách món `source = "custom"` của user. FE chưa gọi trực tiếp.

---

### 5.5 `POST /dishes` ✅ BE + FE

> **Auth:** Bearer Token

**Request:**
```json
{
  "name": "Grilled Chicken",
  "categoryId": 1,
  "imageUrl": "https://example.com/chicken.jpg",
  "source": "system",
  "difficulty": "easy",
  "totalTimeMin": 45
}
```

**Response 200:** (DishDTO đã lưu)

**Errors:** `400` — `"Dish name is required"`

---

### 5.6 `PUT /dishes/{id}` ✅ BE + FE

**Request:** (cùng format POST, chỉ gửi trường cần update)

**Response 200:** (DishDTO đã cập nhật)

**Errors:** `404` — `"Dish not found with id {id}"`

---

### 5.7 `DELETE /dishes/{id}` ✅ BE + FE

**Response 204 No Content** (không có body)

> [!WARNING]
> FE `dishService.deleteDish()` đang `return response.data` — sẽ là `undefined` vì 204 không có body. FE nên kiểm tra `response.status === 204`.

**Errors:** `404` — `"Dish not found with id {id}"`

---

## 6. Dish Categories

### 6.1 `GET /dish-categories` ⚠️ FE only — BE chưa implement

**Response 200 (expected):**
```json
[
  { "id": 1, "name": "Cơm" },
  { "id": 2, "name": "Canh" }
]
```

---

## 7. Dish Ratings

### 7.1 `POST /dishes/{dishId}/ratings` ⚠️ FE only — BE chưa implement

**Request:**
```json
{
  "score": 5,
  "comment": "Rất ngon!"
}
```

---

### 7.2 `GET /dishes/{dishId}/ratings` ⚠️ FE only — BE chưa implement

**Response 200:**
```json
[
  {
    "id": 1,
    "accountId": 1,
    "dishId": 5,
    "score": 5,
    "comment": "Rất ngon!"
  }
]
```

---

## 8. Favorites — Yêu thích

### 8.1 `GET /favorites/account/{accountId}` ⚠️ FE only — BE chưa implement

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Grilled Chicken",
    "categoryId": 1,
    "imageUrl": "https://example.com/chicken.jpg",
    "source": "system",
    "difficulty": "easy",
    "totalTimeMin": 45
  }
]
```

---

### 8.2 `POST /favorites/account/{accountId}/{dishId}` ⚠️ FE only — BE chưa implement

**Response 200:** (Thành công)

---

### 8.3 `DELETE /favorites/account/{accountId}/{dishId}` ⚠️ FE only — BE chưa implement

**Response 204 No Content**

---

## 9. Ingredients — Nguyên liệu

> **Tất cả đều ⚠️ FE only — BE chưa implement**

### 9.1 `GET /ingredients` — Query: `{ page, size, search }`
### 9.2 `GET /ingredients/{id}`
### 9.3 `POST /ingredients` — Body: `IngredientDTO`
### 9.4 `PUT /ingredients/{id}` — Body: `IngredientDTO`
### 9.5 `DELETE /ingredients/{id}`

**IngredientDTO format:**
```json
{
  "id": 1,
  "dishId": 5,
  "name": "Ức gà",
  "quantityG": 200.00,
  "unit": "g"
}
```

---

## 10. Meal Plans — Kế hoạch bữa ăn

### 10.1 `GET /meal-plans/account/{accountId}` ✅ BE + FE

> **Auth:** Bearer Token

**Response 200:**
```json
[
  {
    "id": 1,
    "planName": "Lunch Plan",
    "planDate": "2026-05-03"
  }
]
```

---

### 10.2 `GET /meal-plans/account/{accountId}/date/{planDate}` ✅ BE + FE

**Path:** `planDate` format `yyyy-MM-dd`

**Response 200:** (1 MealPlanDTO)

**Errors:** `404` — `"MealPlan not found for account {id} on {date}"`

---

### 10.3 `GET /meal-plans/{id}` ⚠️ FE only — BE chưa implement

FE `mealService.getMealPlanById(id)` gọi endpoint này nhưng BE không có.

---

### 10.4 `POST /meal-plans?accountId={accountId}` ✅ BE + FE

> **Auth:** Bearer Token — `accountId` là **query param**

**Request:**
```json
{
  "planName": "Lunch Plan",
  "planDate": "2026-05-03"
}
```

**Response 200:** (MealPlanDTO đã tạo)

---

### 10.5 `PUT /meal-plans/{id}` ✅ BE + FE

**Request:** (cùng format POST)

**Response 200:** (MealPlanDTO đã cập nhật)

**Errors:** `404` — `"MealPlan not found with id {id}"`

---

### 10.6 `DELETE /meal-plans/{id}` ✅ BE + FE

**Response 204 No Content**

---

## 11. Meals — Bữa ăn

> **Endpoint trung gian được dùng trong Portions**

### 11.1 `GET /meal-plans/{planId}/meals` ⚠️ BE chưa implement

**Response 200:**
```json
[
  {
    "id": 1,
    "mealPlanId": 10,
    "mealType": "breakfast"
  },
  {
    "id": 2,
    "mealPlanId": 10,
    "mealType": "lunch"
  }
]
```

---

## 12. Portions — Khẩu phần

### 12.1 `POST /meal-plans/{planId}/meals/{mealType}/portions` ⚠️ FE only — BE chưa implement

**Request:**
```json
{
  "dishId": 5,
  "quantityG": 200.0
}
```

**Response 200:**
```json
{
  "id": 1,
  "mealId": 3,
  "dishId": 5,
  "quantityG": 200.0,
  "caloriesKcal": 330.0,
  "proteinG": 62.0,
  "carbG": 0.0,
  "fatG": 7.2
}
```

---

### 12.2 `PUT /meal-plans/{planId}/meals/{mealType}/portions/{portionId}` ⚠️ FE only — BE chưa implement

**Request:**
```json
{
  "quantityG": 250.0
}
```

**Response 200:** (PortionDTO đã cập nhật)

---

### 12.3 `DELETE /meal-plans/{planId}/meals/{mealType}/portions/{portionId}` ⚠️ FE only — BE chưa implement

**Response 204 No Content**

---

## 13. Meal Plan Templates

### 13.1 `GET /meal-plan-templates?accountId={id}` ⚠️ FE only — BE chưa implement

**Response 200:**
```json
[
  {
    "id": 1,
    "templateName": "Gym Day Diet",
    "savedAt": "2026-05-01T10:00:00Z"
  }
]
```

---

## 14. Admin

### 14.1 `GET /admin/statistics?startDate=&endDate=` ⚠️ FE only — BE chưa implement

**Response 200:**
```json
{
  "totalUsers": 150,
  "totalDishes": 500,
  "activePlansToday": 45,
  "newFeedbacks": 5
}
```

---

### 14.2 `GET /admin/users?keyword=&status=&page=&size=` ⚠️ FE only — BE chưa implement

**Response 200:**
```json
{
  "content": [
    { "id": 1, "username": "user1", "email": "user1@a.com", "role": "user", "status": "active" }
  ],
  "totalPages": 5,
  "totalElements": 100
}
```

---

### 14.3 `GET /admin/users/{id}` ⚠️ FE only — BE chưa implement

**Response 200:** (UserAccountDTO)

---

### 14.4 `PATCH /admin/users/{id}/lock` ⚠️ FE only — BE chưa implement

**Response 200:** (UserAccountDTO updated)

---

### 14.5 `PATCH /admin/users/{id}/unlock` ⚠️ FE only — BE chưa implement

**Response 200:** (UserAccountDTO updated)

---

### 14.6 `DELETE /admin/users/{id}` ⚠️ FE only — BE chưa implement

**Response 204 No Content**

---

### 14.7 `GET /admin/dishes?keyword=&categoryId=&page=&size=` ⚠️ FE only — BE chưa implement

**Response 200:** (Paginated DishDTO list)

---

### 14.8 `POST /admin/dishes` ⚠️ FE only — BE chưa implement

**Request:** (DishDTO + NutritionInfo)

---

### 14.9 `PUT /admin/dishes/{id}` ⚠️ FE only — BE chưa implement

---

### 14.10 `DELETE /admin/dishes/{id}` ⚠️ FE only — BE chưa implement

---

### 14.11 `GET /admin/feedbacks?status=&page=&size=` ⚠️ FE only — BE chưa implement

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "accountId": 5,
      "content": "Ứng dụng rất hay",
      "status": "pending",
      "submittedAt": "2026-05-04T12:00:00Z"
    }
  ]
}
```

---

### 14.12 `PATCH /admin/feedbacks/{id}/status` ⚠️ FE only — BE chưa implement

**Request:** `{ "status": "resolved" }`

**Response 200:** (FeedbackDTO updated)

---

## 14. Bảng so sánh BE vs FE

### ✅ Đã implement cả BE + FE (khớp nhau)

| # | Method | Endpoint | BE Controller | FE Service |
|---|---|---|---|---|
| 1 | POST | `/auth/register` | `AuthController` | `authService.register()` |
| 2 | POST | `/auth/login` | `AuthController` | `authService.login()` |
| 3 | GET | `/auth/user/{id}` | `AuthController` | `authService.getUserAccount()` |
| 4 | GET | `/health-profile/{accountId}` | `HealthProfileController` | `userService.getProfile()` |
| 5 | POST | `/health-profile/{accountId}` | `HealthProfileController` | `userService.updateProfile()` |
| 6 | GET | `/dishes` | `DishController` | `dishService.getDishes()` |
| 7 | GET | `/dishes/{id}` | `DishController` | `dishService.getDishById()` |
| 8 | POST | `/dishes` | `DishController` | `dishService.createDish()` |
| 9 | PUT | `/dishes/{id}` | `DishController` | `dishService.updateDish()` |
| 10 | DELETE | `/dishes/{id}` | `DishController` | `dishService.deleteDish()` |
| 11 | GET | `/meal-plans/account/{accountId}` | `MealPlanController` | `mealService.getMealPlans()` |
| 12 | GET | `/meal-plans/account/{accountId}/date/{date}` | `MealPlanController` | `mealService.getMealPlanByDate()` |
| 13 | POST | `/meal-plans?accountId={id}` | `MealPlanController` | `mealService.createMealPlan()` |
| 14 | PUT | `/meal-plans/{id}` | `MealPlanController` | `mealService.updateMealPlan()` |
| 15 | DELETE | `/meal-plans/{id}` | `MealPlanController` | `mealService.deleteMealPlan()` |

### ✅ BE implement nhưng FE chưa gọi

| # | Method | Endpoint | BE Controller |
|---|---|---|---|
| 1 | GET | `/dishes/system` | `DishController` |
| 2 | GET | `/dishes/account/{accountId}` | `DishController` |

### ⚠️ FE gọi nhưng BE chưa implement

| # | Method | Endpoint | FE Service | Cần implement |
|---|---|---|---|---|
| 1 | POST | `/auth/logout` | `authService.logout()` | `AuthController` |
| 2 | POST | `/auth/forgot-password` | `authService.forgotPassword()` | `AuthController` |
| 3 | POST | `/auth/verify-otp` | `authService.verifyOtp()` | `AuthController` |
| 4 | POST | `/auth/reset-password` | `authService.resetPassword()` | `AuthController` |
| 5 | PUT | `/auth/change-password` | `authService.changePassword()` | `AuthController` |
| 6 | GET | `/health-goal/{accountId}` | `userService.getHealthGoal()` | `HealthGoalController` |
| 7 | POST | `/health-goal/{accountId}` | `userService.updateHealthGoal()` | `HealthGoalController` |
| 8 | GET | `/dish-categories` | `dishService.getCategories()` | `DishCategoryController` |
| 9 | POST | `/dishes/{id}/ratings` | `dishService.rateDish()` | `DishRatingController` |
| 10 | GET | `/dishes/{id}/ratings` | `dishService.getDishRatings()` | `DishRatingController` |
| 11 | GET | `/favorites/account/{id}` | `userService.getFavorites()` | `FavoriteController` |
| 12 | POST | `/favorites/account/{id}/{dishId}` | `userService.addFavorite()` | `FavoriteController` |
| 13 | DELETE | `/favorites/account/{id}/{dishId}` | `userService.removeFavorite()` | `FavoriteController` |
| 14 | CRUD | `/ingredients/**` | `ingredientService.*()` | `IngredientController` |
| 15 | GET | `/meal-plans/{id}` | `mealService.getMealPlanById()` | `MealPlanController` |
| 16 | POST | `/meal-plans/{planId}/meals/{type}/portions` | `mealService.addPortion()` | `PortionController` |
| 17 | PUT | `/meal-plans/{planId}/meals/{type}/portions/{id}` | `mealService.updatePortion()` | `PortionController` |
| 18 | DELETE | `/meal-plans/{planId}/meals/{type}/portions/{id}` | `mealService.deletePortion()` | `PortionController` |
| 19 | GET | `/meal-plan-templates` | `mealService.getTemplates()` | `TemplateController` |
| 20-31 | * | `/admin/**` | `adminService.*()` | `AdminController` |

---

## 15. Enum Values

> Tất cả enum gửi/nhận đều là **lowercase string**, khớp với MySQL ENUM.

| Enum | Giá trị | Dùng ở |
|---|---|---|
| `role` | `"user"`, `"admin"` | UserAccountDTO |
| `status` | `"active"`, `"locked"`, `"deleted"` | UserAccountDTO |
| `gender` | `"male"`, `"female"`, `"other"` | HealthProfileDTO |
| `goalType` | `"weight_loss"`, `"muscle_gain"`, `"maintain"` | HealthGoalDTO |
| `activityLevel` | `"low"`, `"medium"`, `"high"` | HealthGoalDTO |
| `source` | `"system"`, `"custom"` | DishDTO |
| `difficulty` | `"easy"`, `"medium"`, `"hard"` | DishDTO |
| `mealType` | `"breakfast"`, `"lunch"`, `"dinner"`, `"snack"` | MealDTO, Portions |
| `feedbackStatus` | `"pending"`, `"processing"`, `"resolved"` | Admin Feedback |

---

## DTO Reference

### UserAccountDTO
```json
{ "id": 1, "username": "str", "email": "str", "role": "user", "status": "active" }
```

### HealthProfileDTO
```json
{ "id": 1, "fullName": "str", "age": 30, "gender": "male", "heightCm": 175.00, "weightKg": 70.00, "avatarUrl": "str" }
```

### HealthGoalDTO
```json
{ "id": 1, "goalType": "weight_loss", "activityLevel": "medium", "targetWeightKg": 65.00, "dailyCaloriesKcal": 1800, "proteinGDay": 120.00, "carbGDay": 200.00, "fatGDay": 60.00 }
```

### DishDTO
```json
{ "id": 1, "name": "str", "categoryId": 1, "imageUrl": "str", "source": "system", "difficulty": "easy", "totalTimeMin": 45 }
```

### MealPlanDTO
```json
{ "id": 1, "planName": "str", "planDate": "2026-05-03" }
```

### MealDTO
```json
{ "id": 1, "mealPlanId": 1, "mealType": "breakfast" }
```

### PortionDTO
```json
{ "id": 1, "mealId": 1, "dishId": 5, "quantityG": 200.00, "caloriesKcal": 330.00, "proteinG": 62.00, "carbG": 0.00, "fatG": 7.20 }
```

### NutritionInfoDTO
```json
{ "id": 1, "dishId": 5, "caloriesPer100g": 165.00, "proteinPer100g": 31.00, "carbPer100g": 0.00, "fatPer100g": 3.60, "fiberPer100g": 0.00, "satFatPer100g": 1.00, "vitaminAMcg": 6.00, "vitaminCMg": 0.00, "vitaminDMcg": 0.00, "calciumMg": 15.00, "ironMg": 1.00 }
```

### ErrorResponse
```json
{ "status": 400, "message": "Mô tả lỗi", "timestamp": 1746345600000 }
```
