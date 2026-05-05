# Kế hoạch hoàn thiện Backend — Meal Planner System

> **Ngày lập:** 05/05/2026
> **Tổng endpoint còn thiếu:** 14
> **Kiến trúc:** Spring Boot 3-layer (Controller → Service → Repository)
> **Mục tiêu:** Triển khai toàn bộ endpoint BE chưa implement để khớp với FE.

---

## 1. Tổng quan các endpoint còn thiếu

| STT | Module | Endpoint | Mô tả | Độ phức tạp |
|---|---|---|---|---|
| 1 | Auth | `POST /auth/logout` | Client-side xóa token | Thấp |
| 2 | Auth | `POST /auth/forgot-password` | Gửi OTP qua email | Trung bình |
| 3 | Auth | `POST /auth/verify-otp` | Xác minh OTP | Thấp |
| 4 | Auth | `POST /auth/reset-password` | Đặt lại mật khẩu | Thấp |
| 5 | Auth | `PUT /auth/change-password` | Đổi mật khẩu (đã đăng nhập) | Thấp |
| 6 | Meal Plans | `GET /meal-plans/{id}` | Lấy kế hoạch theo ID | Thấp |
| 7 | Meals | `GET /meal-plans/{planId}/meals` | Lấy danh sách bữa ăn | Trung bình |
| 8 | Templates | `GET /meal-plan-templates` | Lấy mẫu kế hoạch của user | Thấp |
| 9 | Ingredients | `GET /ingredients` | Liệt kê + phân trang + tìm kiếm | Thấp |
| 10 | Admin | `GET /admin/users/{id}` | Chi tiết user | Thấp |
| 11 | Admin | `GET /admin/dishes` | Danh sách món + phân trang/lọc | Trung bình |
| 12 | Admin | `POST /admin/dishes` | Tạo món hệ thống + dinh dưỡng | Trung bình |
| 13 | Admin | `PUT /admin/dishes/{id}` | Cập nhật món hệ thống | Trung bình |
| 14 | Admin | `DELETE /admin/dishes/{id}` | Xóa món hệ thống | Thấp |

---

## 2. Kế hoạch theo giai đoạn

### Giai đoạn 1: Auth bổ sung (5 endpoint) — Ưu tiên cao

**File cần tạo / chỉnh sửa:**
- `dto/ChangePasswordDTO.java` — `oldPassword`, `newPassword`
- `dto/ForgotPasswordDTO.java` — `email`
- `dto/ResetPasswordDTO.java` — `token`, `newPassword`
- `dto/VerifyOtpDTO.java` — `email`, `otp`
- `service/UserAccountService.java` — thêm 3 methods: `changePassword(Long accountId, String oldPassword, String newPassword)`, `generateResetToken(String email)`, `resetPassword(String token, String newPassword)`
- `service/impl/UserAccountServiceImpl.java` — implement logic
- `controller/AuthController.java` — thêm 5 endpoints

**Logic nghiệp vụ:**
- **Forgot Password:**
  1. Tìm user theo email → không tìm thấy thì vẫn trả 200 (không leak email tồn tại).
  2. Tạo OTP 6 chữ số (Random).
  3. Lưu vào `tblPasswordResetToken`: `account_id`, `token` (OTP), `expires_at` = `NOW() + 5 phút`, `used = false`.
  4. Hiện tại chưa có SMTP: **log OTP ra console** hoặc trả OTP trong response (dev only).
- **Verify OTP:**
  1. Tìm token theo OTP + account_id.
  2. Kiểm tra `expires_at > NOW()` và `used = false`.
  3. Trả `200` nếu hợp lệ, `400` nếu sai/hết hạn.
- **Reset Password:**
  1. Tìm token theo OTP → kiểm tra hợp lệ.
  2. `passwordEncoder.encode(newPassword)` và cập nhật `tblUserAccount`.
  3. Đánh dấu token `used = true`.
- **Change Password (có JWT):**
  1. Lấy `accountId` từ JWT trong request.
  2. Verify `oldPassword` khớp với `password_hash`.
  3. Encode `newPassword` và lưu.
- **Logout:**
  1. Client-side xóa token (BE có thể trả `200 OK` đơn giản).

---

### Giai đoạn 2: Meal Plans & Meals bổ sung (2 endpoint)

**File cần tạo / chỉnh sửa:**
- `controller/MealPlanController.java` — thêm `GET /meal-plans/{id}`
- `controller/MealController.java` — TẠO MỚI với `GET /meal-plans/{planId}/meals`
- `converter/MealConverter.java` — TẠO MỚI `toDTO(Meal)`
- `service/MealService.java` — có interface rồi, thêm `List<MealDTO> findByMealPlanId(Long planId)`
- `service/impl/MealServiceImpl.java` — implement

**Logic nghiệp vụ:**
- `GET /meal-plans/{id}`: gọi `mealPlanService.findById(id)` → convertToDTO.
- `GET /meal-plans/{planId}/meals`: gọi `mealRepository.findByMealPlanId(planId)` → convert sang `MealDTO`.
  - Optional: tính tổng dinh dưỡng của từng meal bằng `SUM(portions)`.

---

### Giai đoạn 3: Meal Plan Templates (1 endpoint)

**File cần tạo / chỉnh sửa:**
- `dto/MealPlanTemplateDTO.java` — `id`, `templateName`, `savedAt`
- `converter/MealPlanTemplateConverter.java` — TẠO MỚI
- `controller/MealPlanTemplateController.java` — TẠO MỚI
- `service/MealPlanTemplateService.java` — có interface chưa? Kiểm tra.
- `service/impl/MealPlanTemplateServiceImpl.java` — implement `findByAccountId(Long accountId)`

**Logic nghiệp vụ:**
- `GET /meal-plan-templates?accountId={id}`: trả về `List<MealPlanTemplateDTO>`.
- Lưu ý: `TemplateMeal` và `TemplatePortion` entity chưa tạo. Hiện tại chỉ cần liệt kê templates; tính năng **apply template** có thể bổ sung sau.

---

### Giai đoạn 4: Ingredients — Phân trang & Tìm kiếm (1 endpoint)

**File cần chỉnh sửa:**
- `repository/IngredientRepository.java` — thêm `Page<Ingredient> findByNameContaining(String name, Pageable pageable)`
- `service/IngredientService.java` — thêm `Page<IngredientDTO> findAll(Pageable pageable)`, `Page<IngredientDTO> searchByName(String name, Pageable pageable)`
- `service/impl/IngredientServiceImpl.java` — implement
- `controller/IngredientController.java` — thêm `GET /ingredients?page=&size=&search=`

---

### Giai đoạn 5: Admin bổ sung (5 endpoint)

**File cần chỉnh sửa:**
- `service/AdminService.java` — thêm:
  - `UserAccountDTO getUserById(Long id)`
  - `Page<DishDTO> getAllDishes(String keyword, Long categoryId, Pageable pageable)`
  - `DishDTO createAdminDish(DishDTO dishDTO, NutritionInfoDTO nutritionDTO, List<IngredientDTO> ingredients)`
  - `DishDTO updateAdminDish(Long id, DishDTO dishDTO, NutritionInfoDTO nutritionDTO)`
  - `void deleteAdminDish(Long id)`
- `service/impl/AdminServiceImpl.java` — implement
- `controller/AdminController.java` — thêm 5 endpoints

**Logic nghiệp vụ:**
- `GET /admin/users/{id}`: gọi `userAccountRepository.findById()` → convertToDTO.
- `GET /admin/dishes?keyword=&categoryId=&page=&size=`:
  - Query `Dish` theo `keyword` (ILIKE `name`) và `categoryId`.
  - Trả `Page<DishDTO>`.
- `POST /admin/dishes`:
  - Tạo `Dish` (source = SYSTEM).
  - Tạo `NutritionInfo` liên kết với dish.
  - Tạo `Ingredient` list nếu có.
- `PUT /admin/dishes/{id}`:
  - Cập nhật `Dish`, `NutritionInfo`, xóa + tạo lại `Ingredient`.
- `DELETE /admin/dishes/{id}`:
  - Soft-delete hoặc hard-delete? Theo thiết kế DB thì `ON DELETE RESTRICT` ở `tblPortion`.
  - Nếu dish đang được dùng trong portions → trả `409 Conflict`.
  - Nếu không → xóa `NutritionInfo` + `Ingredients` + `Dish`.

---

## 3. Danh sách file cần tạo

```
src/main/java/com/example/javaweb/meal_planner_system/
├── controller/
│   └── MealController.java                    [NEW] GET /meal-plans/{planId}/meals
│   └── MealPlanTemplateController.java        [NEW] GET /meal-plan-templates
├── dto/
│   ├── ChangePasswordDTO.java                 [NEW]
│   ├── ForgotPasswordDTO.java                [NEW]
│   ├── ResetPasswordDTO.java                 [NEW]
│   ├── VerifyOtpDTO.java                     [NEW]
│   └── MealPlanTemplateDTO.java              [NEW]
├── converter/
│   ├── MealConverter.java                     [NEW]
│   └── MealPlanTemplateConverter.java        [NEW]
└── service/
    ├── MealService.java                        [UPDATE] thêm method
    ├── IngredientService.java                  [UPDATE] thêm method
    ├── UserAccountService.java                 [UPDATE] thêm method
    └── AdminService.java                       [UPDATE] thêm method
```

---

## 4. Thứ tự triển khai đề xuất

| Thứ tự | Giai đoạn | Lý do ưu tiên |
|---|---|---|
| 1 | **Auth bổ sung** | Các tính năng cơ bản của user (quên MK, đổi MK) cần có sớm. |
| 2 | **Meal Plans + Meals** | FE đang gọi `getMealPlanById()` và `getMeals()` nhưng BE thiếu. |
| 3 | **Ingredients — GET /ingredients** | FE cần danh sách nguyên liệu để hiển thị. |
| 4 | **Admin bổ sung** | Quản lý món ăn và chi tiết user cho admin dashboard. |
| 5 | **Templates** | Tính năng phụ, có thể để sau cùng. |

---

## 5. Kiểm thử từng endpoint

Sau mỗi giai đoạn, dùng Postman collection tại `docs/postman_collection.json` hoặc cURL để kiểm tra:

```bash
# Ví dụ kiểm tra forgot-password
curl -X POST http://localhost:8081/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"tester1@example.com"}'

# Ví dụ kiểm tra GET meals trong meal plan
curl http://localhost:8081/api/meal-plans/1/meals \
  -H "Authorization: Bearer <JWT>"
```

---

## 6. Lưu ý kỹ thuật quan trọng

- **Transaction:** Các thao tác liên quan đến nhiều bảng (Admin tạo Dish + NutritionInfo + Ingredients) phải đặt `@Transactional`.
- **Phân trang:** Dùng `Pageable` của Spring Data JPA cho tất cả endpoint danh sách.
- **Validation:** Kiểm tra `newPassword` tối thiểu 6 ký tự; OTP phải là 6 chữ số.
- **Bảo mật:**
  - Change-password **bắt buộc** phải có JWT hợp lệ.
  - Admin endpoints cần kiểm tra `ROLE_ADMIN` (hiện tại BE chưa có method-level security, cần bổ sung `@PreAuthorize("hasRole('ADMIN')")`).
- **Error Response:** Dùng `GlobalExceptionHandler` đã có; trả `ErrorResponse` với `status`, `message`, `timestamp`.
