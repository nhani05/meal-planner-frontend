# Chiến lược triển khai API Endpoints còn thiếu

Triển khai toàn bộ các endpoint được liệt kê trong tài liệu [API Endpoints](api_endpoints.md) theo mô hình 3 lớp.

## Phân nhóm triển khai

### Nhóm 1: Health Goal & Dish Category ✅ Hoàn thành
- **Health Goal:** `HealthGoalController` + `HealthGoalServiceImpl` đã triển khai. Lưu và lấy mục tiêu dinh dưỡng theo `accountId`.
- **Dish Category:** `DishCategoryController` + `DishCategoryServiceImpl` đã triển khai. Lấy danh sách danh mục món ăn.

### Nhóm 2: Dish Interaction (Ratings & Favorites) ✅ Hoàn thành
- **Dish Rating:** `DishRatingController` + `DishRatingServiceImpl` đã triển khai. Cho phép người dùng đánh giá món ăn (score, comment).
- **Favorites:** `FavoriteDishController` + `FavoriteDishServiceImpl` đã triển khai. Thêm/Xóa món ăn yêu thích.

### Nhóm 3: Ingredients & Meal/Portions ✅ Hoàn thành
- **Ingredients:** `IngredientController` + `IngredientServiceImpl` đã triển khai CRUD đầy đủ, bao gồm `GET /ingredients` với phân trang (`page`, `size`) và tìm kiếm (`search`).
- **Meal & Portions:** `PortionController` + `PortionServiceImpl` đã triển khai. Tự động tính dinh dưỡng khi thêm/cập nhật khẩu phần và tạo `Meal` nếu chưa tồn tại. `GET /meal-plans/{planId}/meals` đã implement trong `MealController`.

### Nhóm 4: Admin & Feedback ✅ Hoàn thành
- `UserFeedback` entity/repository, `AdminAuditLog` entity/repository đã tạo.
- `AdminController` + `AdminServiceImpl` đã triển khai đầy đủ: Thống kê, Quản lý users (lock/unlock/soft delete/getById), Quản lý feedbacks, CRUD món ăn dưới `/admin/dishes`.

### Nhóm 5: Auth bổ sung ✅ Hoàn thành
- `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/verify-otp`, `POST /auth/reset-password`, `PUT /auth/change-password` đã triển khai trong `AuthController` + `UserAccountServiceImpl`.

---

## Danh sách file đã tạo/chỉnh sửa

### Entities & Repositories (đã tạo)
- `UserFeedback.java` & `UserFeedbackRepository.java` ✅
- `AdminAuditLog.java` & `AdminAuditLogRepository.java` ✅

### DTOs (đã tạo)
- `FeedbackDTO.java` ✅
- `AdminStatsDTO.java` ✅

### Services & Controllers (đã triển khai)
1. **HealthGoalService** & `HealthGoalController` ✅
2. **DishCategoryService** & `DishCategoryController` ✅
3. **DishRatingService** & `DishRatingController` ✅
4. **FavoriteDishService** & `FavoriteDishController` ✅
5. **IngredientService** & `IngredientController` ✅ (đầy đủ: CRUD + phân trang/tìm kiếm)
6. **PortionService** & `PortionController` ✅
7. **AdminService** & `AdminController` ✅ (đầy đủ: users, feedbacks, dishes)

---

## Logic xử lý quan trọng (Portions) ✅ Đã hoàn thành
Khi thêm hoặc cập nhật `Portion`, Backend phải:
1. Lấy `NutritionInfo` của món ăn tương ứng.
2. Tính toán `caloriesKcal`, `proteinG`, `carbG`, `fatG` dựa trên `quantityG` và giá trị dinh dưỡng trên 100g.
3. Tự động tạo `Meal` nếu bữa ăn đó chưa tồn tại trong `MealPlan`.

---

## Kế hoạch thực hiện

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| **Giai đoạn 1** | Health Goal, Categories, Ingredients (cơ bản) | ✅ Hoàn thành |
| **Giai đoạn 2** | Ratings, Favorites | ✅ Hoàn thành |
| **Giai đoạn 3** | Portions (tính toán dinh dưỡng) | ✅ Hoàn thành |
| **Giai đoạn 4** | Admin module (stats, users, feedbacks) | ✅ Hoàn thành |

## Các endpoint / tính năng còn thiếu cần triển khai

### Auth ✅ Đã hoàn thành (05/05/2026)

### Meal Plans ✅ Hoàn thành
- ✅ `GET /meal-plans/{id}` (lấy theo ID) — `MealPlanController`
- ✅ `GET /meal-plans/{planId}/meals` (liệt kê bữa ăn) — `MealController`
- ✅ `GET /meal-plan-templates` (mẫu kế hoạch) — `MealPlanTemplateController`

### Ingredients ✅ Hoàn thành
- ✅ `GET /ingredients` với phân trang (`page`, `size`) và tìm kiếm (`search`) — `IngredientController`

### Admin ✅ Hoàn thành
- ✅ `GET /admin/users/{id}` — `AdminController`
- ✅ `GET /admin/dishes` (phân trang, lọc theo keyword + categoryId) — `AdminController`
- ✅ `POST /admin/dishes` (tạo Dish + NutritionInfo + Ingredients) — `AdminController`
- ✅ `PUT /admin/dishes/{id}` (cập nhật toàn bộ) — `AdminController`
- ✅ `DELETE /admin/dishes/{id}` (kiểm tra portions trước khi xóa) — `AdminController`

> **Tất cả backend endpoints đã được triển khai hoàn chỉnh!**
