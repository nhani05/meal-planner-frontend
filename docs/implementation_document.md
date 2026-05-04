# TÀI LIỆU TRIỂN KHAI (IMPLEMENTATION DOCUMENT)
## HỆ THỐNG LẬP KẾ HOẠCH BỮA ĂN VÀ QUẢN LÝ DINH DƯỠNG

**Học viện Công nghệ Bưu chính Viễn thông – Khoa CNTT1**
Môn học: Nhập môn Công nghệ Phần mềm | Giảng viên: Nguyễn Đình Quảng | Nhóm: 04

| Thành viên | MSSV |
|---|---|
| Nguyễn Minh Huyền | B23DCKH060 |
| Lê Xuân Nhân | B23DCKH083 |
| Vũ Minh Phước | B23DCKH091 |

---

## Mục lục

1. [Tổng quan tài liệu](#i-tổng-quan)
2. [Công nghệ sử dụng](#ii-công-nghệ-sử-dụng)
3. [Cấu trúc dự án](#iii-cấu-trúc-dự-án)
4. [Thiết kế cơ sở dữ liệu](#iv-thiết-kế-cơ-sở-dữ-liệu)
5. [Thiết kế REST API](#v-thiết-kế-rest-api)
6. [Logic nghiệp vụ & quy tắc tính toán](#vi-logic-nghiệp-vụ)
7. [Thiết kế component frontend](#vii-thiết-kế-component-frontend)
8. [Bảo mật & xử lý lỗi](#viii-bảo-mật--xử-lý-lỗi)
9. [Yêu cầu phi chức năng](#ix-yêu-cầu-phi-chức-năng)
10. [Kế hoạch kiểm thử](#x-kế-hoạch-kiểm-thử)
11. [Quy trình làm việc](#xi-quy-trình-làm-việc)
12. [Cấu hình môi trường](#xii-cấu-hình-môi-trường)
13. [Phụ lục – Mapping Use Case](#xiii-phụ-lục--mapping-use-case)

---

## I. Tổng quan

### 1.1 Mục đích tài liệu

Tài liệu này cung cấp hướng dẫn chi tiết để lập trình viên (FE/BE) triển khai hệ thống Meal Planner dựa trên kết quả phân tích (Analysis) và thiết kế (Design) đã hoàn thành. Mọi quyết định code đều phải bám sát tài liệu này.

### 1.2 Phạm vi hệ thống

Hệ thống gồm 4 module chính, mỗi module tương ứng với một nhóm Use Case:

| Module | Use Case | Mô tả |
|---|---|---|
| Module 1 | UC01 – UC06 | Quản lý tài khoản |
| Module 2 | UC07 – UC12 | Quản lý kế hoạch bữa ăn |
| Module 3 | UC13 – UC15 | Quản lý món ăn |
| Module 4 | UC16 – UC19 | Quản trị hệ thống (Admin) |

---

## II. Công nghệ sử dụng

| Thành phần | Công nghệ | Phiên bản / Ghi chú |
|---|---|---|
| **Frontend** | ReactJS + Vite | SPA framework, component-based UI |
| **Styling** | Tailwind CSS | Utility-first CSS, responsive |
| **UI Components** | shadcn/ui | Accessible components trên Radix UI |
| **State Management** | Zustand | Global state: auth, user profile |
| **Form Handling** | React Hook Form + Zod | Form state + schema validation |
| **HTTP Client** | Axios | API calls, interceptor gắn JWT |
| **Charts** | Recharts | Biểu đồ dinh dưỡng, dashboard |
| **Routing** | React Router v6 | Client-side routing, protected routes |
| **Backend** | Spring Boot 3.x (Java 17) | REST API, kiến trúc MVC |
| **ORM** | Spring Data JPA / Hibernate | Entity mapping, repository pattern |
| **Security** | Spring Security + JWT | Xác thực, phân quyền theo role |
| **Email** | Spring Mail (SMTP) | Gửi OTP lấy lại mật khẩu |
| **Database** | MySQL 8 | Charset utf8mb4 |
| **Build Tool** | Maven | Dependency management |
| **API Docs** | Springdoc OpenAPI (Swagger) | Tự sinh tài liệu REST API |

---

## III. Cấu trúc dự án

### Frontend (React)

```
src/
├── api/                    # Axios instances & API call functions
├── components/             # Shared UI components (Navbar, Button, Modal...)
│   └── ui/                 # shadcn/ui primitive components
├── features/
│   ├── auth/               # Login, Register, ForgotPassword pages & hooks
│   ├── mealplan/           # MealCalendar, CreatePlan, MealDetail, AddDish...
│   ├── dish/               # DishSearch, DishDetail, CustomDish, Favorites
│   ├── admin/              # AdminDashboard, UserMgmt, DishMgmt, Feedback
│   └── profile/            # Profile page, HealthGoal setup
├── store/                  # Zustand stores (authStore, userStore)
├── hooks/                  # Custom React hooks (useAuth, useNutrition...)
├── utils/                  # Helper functions (calcCalories, formatDate...)
├── router/                 # Route definitions, ProtectedRoute wrapper
└── types/                  # TypeScript interfaces & types
```

### Backend (Spring Boot)

```
src/main/java/…/
├── controller/             # REST controllers
├── service/                # Business logic services
├── repository/             # JPA repositories
├── entity/                 # JPA entity classes (ánh xạ tbl* tables)
├── dto/                    # Data Transfer Objects (request / response)
├── security/               # JWT filter, SecurityConfig, UserDetailsService
├── exception/              # Custom exceptions & GlobalExceptionHandler
└── config/                 # CORS, Mail, OpenAPI config
src/main/resources/
└── application.yml         # DB, JWT, Mail configuration
```

> **Lưu ý:** Tên entity Java dùng PascalCase không có prefix `tbl`.  
> Ví dụ: bảng `tblUserAccount` → entity `UserAccount`; bảng `tblDish` → entity `Dish`.

---

## IV. Thiết kế cơ sở dữ liệu

> **Quy ước chung:**
> - Tên bảng: prefix `tbl` + PascalCase (ví dụ: `tblUserAccount`)
> - Charset: `utf8mb4` — hỗ trợ tiếng Việt và emoji
> - Khóa chính: `BIGINT UNSIGNED AUTO_INCREMENT` (trừ `tblDishCategory` dùng `INT UNSIGNED`)
> - Soft delete: bảng `tblUserAccount` dùng `status = 'deleted'` thay vì xóa vật lý
> - Tất cả FK quan trọng đều khai báo `ON DELETE CASCADE` hoặc `RESTRICT` tùy nghiệp vụ

### 4.1 Sơ đồ quan hệ tổng quan

```
tblUserAccount ──1:1──► tblHealthProfile
tblUserAccount ──1:N──► tblHealthGoal
tblUserAccount ──1:N──► tblPasswordResetToken
tblUserAccount ──1:N──► tblMealPlan
  tblMealPlan  ──1:N──► tblMeal
    tblMeal    ──1:N──► tblPortion ──N:1──► tblDish
tblUserAccount ──1:N──► tblMealPlanTemplate
  tblMealPlanTemplate ──1:N──► tblTemplateMeal
    tblTemplateMeal   ──1:N──► tblTemplatePortion ──N:1──► tblDish
tblDish        ──1:1──► tblNutritionInfo
tblDish        ──1:N──► tblIngredient
tblUserAccount ──N:N──► tblDish  (qua tblFavoriteDish)
tblUserAccount ──N:N──► tblDish  (qua tblDishRating)
tblUserAccount ──1:N──► tblAdjustmentSuggestion
tblUserAccount ──1:N──► tblUserFeedback
tblUserAccount ──1:N──► tblAdminAuditLog  (admin_id)
```

---

### 4.2 Module 1 – Quản lý tài khoản

#### Bảng `tblUserAccount`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `username` | `VARCHAR(50)` | NOT NULL, UNIQUE | Tên đăng nhập |
| `email` | `VARCHAR(100)` | NOT NULL, UNIQUE | Địa chỉ email |
| `password_hash` | `VARCHAR(255)` | NOT NULL | Mật khẩu đã mã hóa BCrypt |
| `role` | `ENUM('user','admin')` | NOT NULL, DEFAULT `'user'` | Vai trò trong hệ thống |
| `status` | `ENUM('active','locked','deleted')` | NOT NULL, DEFAULT `'active'` | Trạng thái tài khoản |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày tạo tài khoản |
| `updated_at` | `DATETIME` | ON UPDATE NOW() | Ngày cập nhật cuối |

> **Business Rule:** Tài khoản bị `deleted` không bị xóa vật lý (soft delete). Tài khoản `locked` không thể đăng nhập. Sai mật khẩu 5 lần liên tiếp → tự động đặt `status = 'locked'`.

---

#### Bảng `tblHealthProfile`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, UNIQUE, CASCADE | Liên kết tài khoản (quan hệ 1-1) |
| `full_name` | `VARCHAR(100)` | NULLABLE | Họ và tên đầy đủ |
| `age` | `TINYINT UNSIGNED` | NULLABLE | Tuổi (1–120) |
| `gender` | `ENUM('male','female','other')` | NULLABLE | Giới tính |
| `height_cm` | `DECIMAL(5,2)` | NULLABLE | Chiều cao (cm) |
| `weight_kg` | `DECIMAL(5,2)` | NULLABLE | Cân nặng (kg) |
| `avatar_url` | `VARCHAR(500)` | NULLABLE | Đường dẫn ảnh đại diện |
| `updated_at` | `DATETIME` | ON UPDATE NOW() | Lần cập nhật cuối |

---

#### Bảng `tblHealthGoal`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Liên kết tài khoản |
| `goal_type` | `ENUM('weight_loss','muscle_gain','maintain')` | NOT NULL | Loại mục tiêu sức khỏe |
| `activity_level` | `ENUM('low','medium','high')` | NOT NULL, DEFAULT `'medium'` | Mức độ vận động |
| `target_weight_kg` | `DECIMAL(5,2)` | NULLABLE | Cân nặng mục tiêu |
| `daily_calories_kcal` | `INT UNSIGNED` | NULLABLE | Calo mục tiêu mỗi ngày (kcal) |
| `protein_g_day` | `DECIMAL(6,2)` | NULLABLE | Protein mục tiêu (g/ngày) |
| `carb_g_day` | `DECIMAL(6,2)` | NULLABLE | Carb mục tiêu (g/ngày) |
| `fat_g_day` | `DECIMAL(6,2)` | NULLABLE | Chất béo mục tiêu (g/ngày) |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày tạo |
| `updated_at` | `DATETIME` | ON UPDATE NOW() | Ngày cập nhật cuối |

---

#### Bảng `tblPasswordResetToken`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Tài khoản yêu cầu reset |
| `token` | `VARCHAR(64)` | NOT NULL, UNIQUE | OTP / token đặt lại mật khẩu |
| `expires_at` | `DATETIME` | NOT NULL | Thời điểm hết hạn (tạo + 5 phút) |
| `used` | `TINYINT(1)` | NOT NULL, DEFAULT `0` | Đã sử dụng chưa (`0` = chưa, `1` = đã dùng) |
| `created_at` | `DATETIME` | DEFAULT NOW() | Thời điểm tạo token |

> **Business Rule:** Token hết hạn sau **5 phút**. Sau khi dùng xong đặt `used = 1`. Mỗi lần gửi OTP mới sẽ tạo bản ghi mới (không update bản cũ).

---

### 4.3 Module 3 – Quản lý món ăn

#### Bảng `tblDishCategory`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `INT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `name` | `VARCHAR(100)` | NOT NULL, UNIQUE | Tên danh mục (Cơm, Canh, Salad...) |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày tạo |

---

#### Bảng `tblDish`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `name` | `VARCHAR(200)` | NOT NULL | Tên món ăn |
| `category_id` | `INT UNSIGNED` | FK → `tblDishCategory.id`, SET NULL | Danh mục món ăn |
| `image_url` | `VARCHAR(500)` | NULLABLE | Ảnh minh họa |
| `source` | `ENUM('system','custom')` | NOT NULL, DEFAULT `'system'` | Nguồn gốc món ăn |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE, NULLABLE | Người tạo (NULL nếu là món hệ thống) |
| `difficulty` | `ENUM('easy','medium','hard')` | NULLABLE | Độ khó chế biến |
| `total_time_min` | `INT UNSIGNED` | NULLABLE | Tổng thời gian chế biến (phút) |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày tạo |
| `updated_at` | `DATETIME` | ON UPDATE NOW() | Ngày cập nhật cuối |

> **Business Rule:** Tên món không được trùng lặp (kiểm tra case-insensitive ở tầng Service). Khi `source = 'system'` thì `account_id = NULL`. Khi `source = 'custom'` thì `account_id` phải có giá trị.

---

#### Bảng `tblNutritionInfo`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `dish_id` | `BIGINT UNSIGNED` | FK → `tblDish.id`, UNIQUE, CASCADE | Liên kết món ăn (1-1) |
| `calories_per_100g` | `DECIMAL(7,2)` | NOT NULL, DEFAULT `0` | Calo / 100g |
| `protein_per_100g` | `DECIMAL(6,2)` | NOT NULL, DEFAULT `0` | Protein / 100g (g) |
| `carb_per_100g` | `DECIMAL(6,2)` | NOT NULL, DEFAULT `0` | Carbohydrate / 100g (g) |
| `fat_per_100g` | `DECIMAL(6,2)` | NOT NULL, DEFAULT `0` | Chất béo / 100g (g) |
| `fiber_per_100g` | `DECIMAL(6,2)` | NULLABLE | Chất xơ / 100g (g) |
| `sat_fat_per_100g` | `DECIMAL(6,2)` | NULLABLE | Chất béo bão hòa / 100g (g) |
| `vitamin_a_mcg` | `DECIMAL(8,2)` | NULLABLE | Vitamin A (mcg/100g) |
| `vitamin_c_mg` | `DECIMAL(8,2)` | NULLABLE | Vitamin C (mg/100g) |
| `vitamin_d_mcg` | `DECIMAL(8,2)` | NULLABLE | Vitamin D (mcg/100g) |
| `calcium_mg` | `DECIMAL(8,2)` | NULLABLE | Canxi (mg/100g) |
| `iron_mg` | `DECIMAL(8,2)` | NULLABLE | Sắt (mg/100g) |
| `updated_at` | `DATETIME` | ON UPDATE NOW() | Ngày cập nhật cuối |

---

#### Bảng `tblIngredient`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `dish_id` | `BIGINT UNSIGNED` | FK → `tblDish.id`, CASCADE | Món ăn chứa nguyên liệu |
| `name` | `VARCHAR(200)` | NOT NULL | Tên nguyên liệu |
| `quantity_g` | `DECIMAL(8,2)` | NOT NULL | Khối lượng trong công thức gốc (gram) |
| `unit` | `VARCHAR(30)` | DEFAULT `'g'` | Đơn vị đo lường |

---

#### Bảng `tblDishRating`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Người đánh giá |
| `dish_id` | `BIGINT UNSIGNED` | FK → `tblDish.id`, CASCADE | Món ăn được đánh giá |
| `score` | `TINYINT UNSIGNED` | NOT NULL, 1–5 | Điểm đánh giá |
| `comment` | `TEXT` | NULLABLE | Nội dung nhận xét |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày đánh giá |

> **Constraint:** `UNIQUE KEY uq_rating (account_id, dish_id)` — mỗi người chỉ đánh giá một món một lần.

---

#### Bảng `tblFavoriteDish`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Người dùng |
| `dish_id` | `BIGINT UNSIGNED` | FK → `tblDish.id`, CASCADE | Món ăn yêu thích |
| `saved_at` | `DATETIME` | DEFAULT NOW() | Thời điểm lưu yêu thích |

> **Constraint:** `UNIQUE KEY uq_fav (account_id, dish_id)` — mỗi món chỉ lưu yêu thích một lần.

---

### 4.4 Module 2 – Quản lý kế hoạch bữa ăn

#### Bảng `tblMealPlan`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Chủ sở hữu kế hoạch |
| `plan_name` | `VARCHAR(200)` | NULLABLE | Tên kế hoạch (tùy chọn) |
| `plan_date` | `DATE` | NOT NULL | Ngày áp dụng kế hoạch |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày tạo |
| `updated_at` | `DATETIME` | ON UPDATE NOW() | Ngày cập nhật cuối |

> **Business Rule (cần enforce ở tầng Service):** Một người dùng không được tạo hai kế hoạch cùng `plan_date`. Kiểm tra trùng ngày trước khi `INSERT`.  
> *Ghi chú: Schema hiện tại không có UNIQUE KEY (account_id, plan_date) — tầng Service phải kiểm tra thủ công bằng query trước khi lưu.*

---

#### Bảng `tblMeal`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `meal_plan_id` | `BIGINT UNSIGNED` | FK → `tblMealPlan.id`, CASCADE | Kế hoạch chứa bữa ăn |
| `meal_type` | `ENUM('breakfast','lunch','dinner','snack')` | NOT NULL | Loại bữa ăn |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày tạo |

> **Constraint:** `UNIQUE KEY uq_meal_slot (meal_plan_id, meal_type)` — mỗi kế hoạch chỉ có duy nhất một bữa sáng, một bữa trưa, một bữa tối và một bữa phụ.  
> **Lưu ý khi code:** Tổng calo của bữa ăn **không được lưu** trong bảng này. Phải tính động bằng cách `SUM` các `calories_kcal` trong `tblPortion` theo `meal_id`.

---

#### Bảng `tblPortion`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `meal_id` | `BIGINT UNSIGNED` | FK → `tblMeal.id`, CASCADE | Bữa ăn chứa khẩu phần |
| `dish_id` | `BIGINT UNSIGNED` | FK → `tblDish.id`, **RESTRICT** | Món ăn được chọn |
| `quantity_g` | `DECIMAL(8,2)` | NOT NULL, > 0 | Khẩu phần thực tế (gram) |
| `calories_kcal` | `DECIMAL(8,2)` | NULLABLE, tính tự động | Calo thực tế |
| `protein_g` | `DECIMAL(7,2)` | NULLABLE, tính tự động | Protein thực tế (g) |
| `carb_g` | `DECIMAL(7,2)` | NULLABLE, tính tự động | Carb thực tế (g) |
| `fat_g` | `DECIMAL(7,2)` | NULLABLE, tính tự động | Chất béo thực tế (g) |

> ⚠️ **Quan trọng – ON DELETE RESTRICT:** Khác với các bảng khác, `dish_id` trong `tblPortion` dùng `RESTRICT` thay vì `CASCADE`. Nghĩa là **không thể xóa một món ăn đang được dùng trong kế hoạch bữa ăn**. Tầng Service phải kiểm tra và thông báo lỗi rõ ràng trước khi cho phép xóa `tblDish`.
>
> **Công thức tính khi INSERT/UPDATE:**
> ```
> calories_kcal = (NutritionInfo.calories_per_100g × quantity_g) / 100
> protein_g     = (NutritionInfo.protein_per_100g  × quantity_g) / 100
> carb_g        = (NutritionInfo.carb_per_100g     × quantity_g) / 100
> fat_g         = (NutritionInfo.fat_per_100g      × quantity_g) / 100
> ```

---

#### Bảng `tblMealPlanTemplate`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Chủ sở hữu mẫu |
| `template_name` | `VARCHAR(200)` | NOT NULL | Tên mẫu kế hoạch |
| `saved_at` | `DATETIME` | DEFAULT NOW() | Ngày lưu mẫu |

---

#### Bảng `tblTemplateMeal`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `template_id` | `BIGINT UNSIGNED` | FK → `tblMealPlanTemplate.id`, CASCADE | Mẫu kế hoạch |
| `meal_type` | `ENUM('breakfast','lunch','dinner','snack')` | NOT NULL | Loại bữa trong mẫu |

---

#### Bảng `tblTemplatePortion`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `template_meal_id` | `BIGINT UNSIGNED` | FK → `tblTemplateMeal.id`, CASCADE | Bữa ăn trong mẫu |
| `dish_id` | `BIGINT UNSIGNED` | FK → `tblDish.id`, **RESTRICT** | Món ăn trong mẫu |
| `quantity_g` | `DECIMAL(8,2)` | NOT NULL | Khẩu phần trong mẫu (gram) |

> **Lưu ý khi code template:** Khi lưu kế hoạch thành mẫu, sao chép từng `Meal` → `TemplateMeal` và từng `Portion` → `TemplatePortion`. **Không** sao chép `plan_date`. Khi áp dụng mẫu vào kế hoạch mới, thực hiện chiều ngược lại.

---

#### Bảng `tblAdjustmentSuggestion`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Người dùng |
| `meal_plan_id` | `BIGINT UNSIGNED` | FK → `tblMealPlan.id`, SET NULL, NULLABLE | Kế hoạch liên quan |
| `suggestion_type` | `ENUM('add_dish','reduce_portion','swap_dish')` | NOT NULL | Loại gợi ý |
| `content` | `TEXT` | NOT NULL | Nội dung gợi ý |
| `status` | `ENUM('pending','applied','dismissed')` | NOT NULL, DEFAULT `'pending'` | Trạng thái xử lý |
| `created_at` | `DATETIME` | DEFAULT NOW() | Ngày tạo gợi ý |

---

### 4.5 Module 4 – Quản trị hệ thống

#### Bảng `tblUserFeedback`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `account_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, CASCADE | Người gửi phản hồi |
| `content` | `TEXT` | NOT NULL | Nội dung phản hồi / báo cáo |
| `status` | `ENUM('pending','processing','resolved')` | NOT NULL, DEFAULT `'pending'` | Trạng thái xử lý |
| `admin_note` | `TEXT` | NULLABLE | Ghi chú của admin khi xử lý |
| `submitted_at` | `DATETIME` | DEFAULT NOW() | Ngày gửi |
| `updated_at` | `DATETIME` | ON UPDATE NOW() | Ngày cập nhật cuối |

> **Lưu ý:** Giá trị `status` trong DB là `'pending'`, `'processing'`, `'resolved'` — **khác** với `'in_progress'` trong một số tài liệu cũ. Khi mapping sang DTO/frontend phải dùng đúng giá trị này.

---

#### Bảng `tblAdminAuditLog`

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | PK, AUTO_INCREMENT | Khóa chính |
| `admin_id` | `BIGINT UNSIGNED` | FK → `tblUserAccount.id`, **RESTRICT** | Admin thực hiện hành động |
| `action` | `VARCHAR(100)` | NOT NULL | Hành động (ví dụ: `lock_account`, `delete_dish`) |
| `target_type` | `VARCHAR(50)` | NOT NULL | Loại đối tượng (`tblUserAccount`, `tblDish`...) |
| `target_id` | `BIGINT UNSIGNED` | NOT NULL | ID đối tượng bị tác động |
| `note` | `TEXT` | NULLABLE | Ghi chú thêm về hành động |
| `acted_at` | `DATETIME` | DEFAULT NOW() | Thời điểm thực hiện |

> **ON DELETE RESTRICT trên admin_id:** Không thể xóa tài khoản admin khi còn bản ghi nhật ký. Phải soft delete (status='deleted').

---

### 4.6 Index

| Index | Bảng | Cột | Mục đích |
|---|---|---|---|
| `idx_meal_plans_account_date` | `tblMealPlan` | `(account_id, plan_date)` | Truy vấn lịch tuần theo user |
| `idx_meals_plan` | `tblMeal` | `(meal_plan_id)` | Lấy bữa ăn theo kế hoạch |
| `idx_portions_meal` | `tblPortion` | `(meal_id)` | Lấy khẩu phần theo bữa |
| `idx_dishes_category` | `tblDish` | `(category_id)` | Lọc món theo danh mục |
| `idx_dishes_source_account` | `tblDish` | `(source, account_id)` | Lấy món custom của user |
| `idx_feedbacks_status` | `tblUserFeedback` | `(status)` | Lọc phản hồi theo trạng thái |
| `idx_audit_admin` | `tblAdminAuditLog` | `(admin_id, acted_at)` | Xem log theo admin & thời gian |
| `idx_suggestions_account` | `tblAdjustmentSuggestion` | `(account_id, status)` | Lấy gợi ý theo user |

---

## V. Thiết kế REST API

### 5.1 Quy ước chung

- **Base URL:** `/api` (dev: `http://localhost:8080/api`)
- **Content-Type:** `application/json`
- **Authorization:** `Bearer <JWT_TOKEN>` trong header
- **Tên endpoint:** kebab-case, danh từ số nhiều
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Phân trang:** query params `?page=0&size=20` (Spring Data mặc định)

### 5.2 Chuẩn Response lỗi

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": { "email": "Email không hợp lệ" },
  "timestamp": "2026-05-01T10:00:00Z"
}
```

| HTTP Status | Khi nào |
|---|---|
| `400 Bad Request` | Validation failed; thiếu trường bắt buộc |
| `401 Unauthorized` | Chưa đăng nhập hoặc JWT hết hạn |
| `403 Forbidden` | Không đủ quyền (user cố truy cập admin endpoint) |
| `404 Not Found` | Tài nguyên không tồn tại |
| `409 Conflict` | Trùng dữ liệu (email, username, plan_date cùng ngày) |
| `410 Gone` | Tài khoản bị xóa (status='deleted') |
| `423 Locked` | Tài khoản bị khóa (status='locked') |
| `500 Internal Server Error` | Lỗi server — không trả stack trace ra FE |

---

### 5.3 Module 1 – Quản lý tài khoản

#### Auth

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Đăng ký tài khoản mới | Không |
| `POST` | `/auth/login` | Đăng nhập; trả JWT | Không |
| `POST` | `/auth/logout` | Đăng xuất | USER, ADMIN |
| `POST` | `/auth/forgot-password` | Gửi OTP về email | Không |
| `POST` | `/auth/verify-otp` | Xác minh OTP | Không |
| `POST` | `/auth/reset-password` | Đặt lại mật khẩu bằng token | Không |
| `PUT` | `/auth/change-password` | Đổi mật khẩu (biết mật khẩu cũ) | USER, ADMIN |

**POST `/auth/login` – Request:**
```json
{ "username": "user123", "password": "securePass" }
```

**POST `/auth/login` – Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "role": "user",
  "userId": 42
}
```

> **Lưu ý:** Giá trị `role` trả về là `"user"` hoặc `"admin"` (lowercase) — khớp với ENUM trong DB.

#### Profile

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/users/me` | Lấy thông tin cá nhân hiện tại | USER, ADMIN |
| `PUT` | `/users/me/profile` | Cập nhật hồ sơ sức khỏe | USER, ADMIN |
| `GET` | `/users/me/health-goal` | Lấy mục tiêu sức khỏe | USER |
| `PUT` | `/users/me/health-goal` | Tạo / cập nhật mục tiêu sức khỏe | USER |

---

### 5.4 Module 2 – Quản lý kế hoạch bữa ăn

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/meal-plans?startDate=&endDate=` | Lấy danh sách theo khoảng ngày (default: tuần hiện tại) | USER |
| `GET` | `/meal-plans/{id}` | Lấy chi tiết kế hoạch (gồm meals + portions) | USER |
| `POST` | `/meal-plans` | Tạo kế hoạch bữa ăn mới | USER |
| `PUT` | `/meal-plans/{id}` | Cập nhật kế hoạch | USER |
| `DELETE` | `/meal-plans/{id}` | Xóa kế hoạch (cascade meals + portions) | USER |
| `POST` | `/meal-plans/{planId}/meals/{mealType}/portions` | Thêm khẩu phần vào bữa | USER |
| `PUT` | `/meal-plans/{planId}/meals/{mealType}/portions/{portionId}` | Cập nhật khẩu phần | USER |
| `DELETE` | `/meal-plans/{planId}/meals/{mealType}/portions/{portionId}` | Xóa khẩu phần | USER |
| `GET` | `/meal-plan-templates` | Lấy danh sách mẫu của user | USER |
| `POST` | `/meal-plan-templates` | Lưu kế hoạch thành mẫu | USER |
| `DELETE` | `/meal-plan-templates/{id}` | Xóa mẫu | USER |

**POST `/meal-plans` – Request:**
```json
{
  "planDate": "2026-05-10",
  "planName": "Thực đơn tuần 20",
  "meals": [
    {
      "mealType": "breakfast",
      "portions": [
        { "dishId": 5, "quantityG": 200 },
        { "dishId": 12, "quantityG": 150 }
      ]
    },
    { "mealType": "lunch",   "portions": [] },
    { "mealType": "dinner",  "portions": [] },
    { "mealType": "snack",   "portions": [] }
  ]
}
```

> **Lưu ý:** `mealType` phải là lowercase (`"breakfast"`, `"lunch"`, `"dinner"`, `"snack"`) — khớp với ENUM trong DB.

---

### 5.5 Module 3 – Quản lý món ăn

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/dishes?keyword=&categoryId=&minCal=&maxCal=&page=&size=` | Tìm kiếm + lọc (phân trang) | Không (Guest xem được) |
| `GET` | `/dishes/{id}` | Chi tiết món ăn (kèm nutrition + ingredients) | Không |
| `POST` | `/dishes` | Thêm món tùy chỉnh (source=custom) | USER |
| `PUT` | `/dishes/{id}` | Sửa món tùy chỉnh (chỉ chủ sở hữu) | USER |
| `DELETE` | `/dishes/{id}` | Xóa món tùy chỉnh | USER |
| `GET` | `/dish-categories` | Lấy tất cả danh mục | Không |
| `GET` | `/users/me/favorites` | Lấy danh sách yêu thích | USER |
| `POST` | `/users/me/favorites/{dishId}` | Thêm vào yêu thích | USER |
| `DELETE` | `/users/me/favorites/{dishId}` | Bỏ khỏi yêu thích | USER |
| `POST` | `/dishes/{id}/ratings` | Đánh giá món ăn | USER |
| `GET` | `/dishes/{id}/ratings` | Lấy danh sách đánh giá | Không |

---

### 5.6 Module 4 – Admin

| Method | Endpoint | Mô tả | Auth |
|---|---|---|---|
| `GET` | `/admin/users?keyword=&status=&page=&size=` | Danh sách người dùng | ADMIN |
| `GET` | `/admin/users/{id}` | Chi tiết người dùng | ADMIN |
| `PATCH` | `/admin/users/{id}/lock` | Khóa tài khoản (status=locked) | ADMIN |
| `PATCH` | `/admin/users/{id}/unlock` | Mở khóa (status=active) | ADMIN |
| `DELETE` | `/admin/users/{id}` | Soft delete (status=deleted) | ADMIN |
| `GET` | `/admin/dishes?keyword=&categoryId=&page=&size=` | Danh sách tất cả món ăn | ADMIN |
| `POST` | `/admin/dishes` | Thêm món hệ thống (source=system) | ADMIN |
| `PUT` | `/admin/dishes/{id}` | Sửa bất kỳ món ăn nào | ADMIN |
| `DELETE` | `/admin/dishes/{id}` | Xóa món ăn (kiểm tra RESTRICT trước) | ADMIN |
| `POST` | `/admin/dishes/{id}/image` | Upload ảnh (multipart/form-data) | ADMIN |
| `GET` | `/admin/statistics?startDate=&endDate=` | Thống kê hệ thống | ADMIN |
| `GET` | `/admin/feedbacks?status=&page=&size=` | Danh sách phản hồi | ADMIN |
| `PATCH` | `/admin/feedbacks/{id}/status` | Cập nhật trạng thái phản hồi | ADMIN |

---

## VI. Logic nghiệp vụ

### 6.1 Công thức tính toán dinh dưỡng

> Tất cả tính toán thực hiện ở tầng **Service (Backend)**. Frontend chỉ nhận kết quả đã tính sẵn.

**Tính giá trị dinh dưỡng thực tế của khẩu phần (gọi khi INSERT/UPDATE `tblPortion`):**

```
calories_kcal = (tblNutritionInfo.calories_per_100g × quantity_g) / 100
protein_g     = (tblNutritionInfo.protein_per_100g  × quantity_g) / 100
carb_g        = (tblNutritionInfo.carb_per_100g     × quantity_g) / 100
fat_g         = (tblNutritionInfo.fat_per_100g      × quantity_g) / 100
```

**Tổng calo bữa ăn (tính động, không lưu DB):**
```sql
SELECT SUM(calories_kcal) FROM tblPortion WHERE meal_id = ?
```

**Tổng calo ngày (tính động):**
```sql
SELECT SUM(p.calories_kcal)
FROM tblPortion p
JOIN tblMeal m ON p.meal_id = m.id
WHERE m.meal_plan_id = ?
```

---

### 6.2 Tính TDEE và calo mục tiêu

**BMR (Harris-Benedict):**
```
BMR (Nam)   = 88.362 + (13.397 × weight_kg) + (4.799 × height_cm) − (5.677 × age)
BMR (Nữ)    = 447.593 + (9.247 × weight_kg) + (3.098 × height_cm) − (4.330 × age)
TDEE        = BMR × activity_factor
  low    → × 1.2
  medium → × 1.55
  high   → × 1.725
```

**Điều chỉnh theo `goal_type`:**
```
weight_loss  → daily_calories_kcal = TDEE − 500
muscle_gain  → daily_calories_kcal = TDEE + 300
maintain     → daily_calories_kcal = TDEE
```

Kết quả được lưu vào `tblHealthGoal.daily_calories_kcal` sau khi người dùng lưu mục tiêu.

---

### 6.3 Bảng quy tắc nghiệp vụ

| Quy tắc | Lớp xử lý | Mô tả |
|---|---|---|
| Sai MK 5 lần → khóa TK | `AuthService` | Đếm số lần sai; đặt `status='locked'` |
| OTP hết hạn 5 phút | `AuthService` | So sánh `expires_at` với `NOW()` và kiểm tra `used=0` |
| Không trùng plan_date | `MealPlanService` | Query trước khi INSERT; ném `409 Conflict` |
| Cascade xóa kế hoạch | DB (CASCADE) | Xóa `tblMealPlan` → tự xóa `tblMeal` → `tblPortion` |
| Không xóa dish đang dùng | `DishService` | `ON DELETE RESTRICT`; bắt `DataIntegrityViolationException` |
| Tên món không trùng | `DishService` | Kiểm tra case-insensitive; ném `409 Conflict` |
| Chỉ sửa/xóa món của mình | `DishService` | So sánh `dish.account_id` với JWT `userId` |
| Chỉ sửa/xóa KH của mình | `MealPlanService` | So sánh `mealPlan.account_id` với JWT `userId` |
| Lưu mẫu: không copy plan_date | `TemplateService` | Chỉ copy cấu trúc meals + portions |
| Ghi nhật ký admin | `AdminService` | Insert `tblAdminAuditLog` sau mỗi hành động quan trọng |

---

## VII. Thiết kế component Frontend

### 7.1 Danh sách component

#### Auth & Profile

| Component | Vị trí | Trách nhiệm |
|---|---|---|
| `LoginPage` | `features/auth/` | Form đăng nhập; gọi POST /auth/login; lưu JWT |
| `RegisterPage` | `features/auth/` | Form đăng ký; validate username/email/password |
| `ForgotPasswordPage` | `features/auth/` | 3 bước: nhập email → nhập OTP → đặt MK mới |
| `ProtectedRoute` | `router/` | HOC kiểm tra JWT; redirect /login nếu chưa đăng nhập |
| `AdminRoute` | `router/` | HOC kiểm tra role=admin; trả 403 nếu không đủ quyền |
| `ProfilePage` | `features/profile/` | Xem & chỉnh sửa hồ sơ sức khỏe |
| `HealthGoalForm` | `features/profile/` | Form thiết lập mục tiêu; tự tính TDEE preview |
| `ChangePasswordForm` | `features/profile/` | Đổi mật khẩu; validate MK cũ/mới/xác nhận |

#### MealPlan

| Component | Vị trí | Trách nhiệm |
|---|---|---|
| `MealCalendarPage` | `features/mealplan/` | Lịch tuần 7 ngày; tóm tắt calo; điều hướng tuần |
| `CreateMealPlanPage` | `features/mealplan/` | Tạo mới hoặc áp dụng mẫu; khung bữa ăn trống |
| `MealDetailPage` | `features/mealplan/` | Chi tiết kế hoạch ngày; dinh dưỡng tổng hợp |
| `MealSlotFrame` | `features/mealplan/` | Khung bữa ăn; danh sách khẩu phần; nút thêm/xóa |
| `AddDishModal` | `features/mealplan/` | Tìm kiếm + multi-select món; nhập khẩu phần; preview dinh dưỡng |
| `NutritionSummaryBar` | `features/mealplan/` | Thanh tiến độ calo & macro so với mục tiêu (realtime) |
| `SaveTemplateModal` | `features/mealplan/` | Nhập tên mẫu; gọi POST /meal-plan-templates |

#### Dish & Admin

| Component | Vị trí | Trách nhiệm |
|---|---|---|
| `DishLibraryPage` | `features/dish/` | Thư viện món ăn; tìm kiếm + bộ lọc |
| `DishDetailPage` | `features/dish/` | Chi tiết món; bảng dinh dưỡng; nút yêu thích; đánh giá |
| `CustomDishPage` | `features/dish/` | Form thêm món tùy chỉnh; nguyên liệu động |
| `FavoriteDishPage` | `features/dish/` | Danh sách yêu thích |
| `AdminDashboardPage` | `features/admin/` | Bảng điều khiển; thống kê tổng quan |
| `UserManagementPage` | `features/admin/` | Bảng user; Khóa/Xóa; phân trang |
| `DishManagementPage` | `features/admin/` | Bảng món ăn; Thêm/Sửa/Xóa; upload ảnh |
| `StatisticsPage` | `features/admin/` | Biểu đồ Recharts; bộ lọc thời gian |
| `FeedbackManagementPage` | `features/admin/` | Danh sách phản hồi; cập nhật status |

#### Shared

| Component | Vị trí | Trách nhiệm |
|---|---|---|
| `Navbar` | `components/` | Điều hướng chính; hiển thị theo role |
| `ConfirmDialog` | `components/` | Dialog xác nhận dùng chung (xóa, khóa, đăng xuất) |
| `LoadingSpinner` | `components/` | Spinner toàn trang hoặc nội tuyến |
| `ToastNotification` | `components/` | Toast thành công / lỗi toàn app |

---

### 7.2 Zustand Store

```typescript
// authStore.ts
interface AuthStore {
  token: string | null;
  role: 'user' | 'admin' | null;   // lowercase – khớp với DB ENUM
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string, role: string, userId: number) => void;
  logout: () => void;
}

// userStore.ts
interface UserStore {
  profile: HealthProfile | null;
  healthGoal: HealthGoal | null;
  setProfile: (p: HealthProfile) => void;
  setHealthGoal: (g: HealthGoal) => void;
  clearUser: () => void;
}
```

---

### 7.3 Routing

| Path | Component | Guard |
|---|---|---|
| `/` | `DashboardPage` / `LandingPage` | — |
| `/login` | `LoginPage` | — |
| `/register` | `RegisterPage` | — |
| `/forgot-password` | `ForgotPasswordPage` | — |
| `/profile` | `ProfilePage` | `ProtectedRoute` |
| `/meal-plans` | `MealCalendarPage` | `ProtectedRoute` |
| `/meal-plans/new` | `CreateMealPlanPage` | `ProtectedRoute` |
| `/meal-plans/:id` | `MealDetailPage` | `ProtectedRoute` |
| `/dishes` | `DishLibraryPage` | — (public) |
| `/dishes/:id` | `DishDetailPage` | — (public) |
| `/dishes/new` | `CustomDishPage` | `ProtectedRoute` |
| `/favorites` | `FavoriteDishPage` | `ProtectedRoute` |
| `/admin` | `AdminDashboardPage` | `AdminRoute` |
| `/admin/users` | `UserManagementPage` | `AdminRoute` |
| `/admin/dishes` | `DishManagementPage` | `AdminRoute` |
| `/admin/statistics` | `StatisticsPage` | `AdminRoute` |
| `/admin/feedbacks` | `FeedbackManagementPage` | `AdminRoute` |

---

## VIII. Bảo mật & xử lý lỗi

### 8.1 Biện pháp bảo mật

| Biện pháp | Cách thực hiện | Lưu ý khi code |
|---|---|---|
| JWT Authentication | Sau đăng nhập trả JWT; FE lưu trong Zustand (memory) | Không lưu vào `localStorage` (XSS risk) |
| Password Hashing | BCryptPasswordEncoder strength=12 | Không lưu plain text; không hiển thị hash |
| RBAC | Spring Security kiểm tra role từ JWT claim | FE ẩn menu Admin nhưng BE vẫn phải kiểm tra |
| CORS | Chỉ cho phép origin FE dev/prod | Không dùng `allowedOrigins=*` trong production |
| Input Sanitization | Jakarta Bean Validation; Parameterized Query | Không string concat trong JPQL/SQL |
| OTP Security | 6 chữ số; hết hạn 5 phút; `used=1` sau khi dùng | Rate-limit `/auth/forgot-password` |
| File Upload | Kiểm tra MIME type thực; giới hạn 5MB; JPG/JPEG/PNG | Lưu ngoài webroot; trả URL qua API |
| Admin Audit Log | Insert `tblAdminAuditLog` sau mỗi hành động | Không cho phép admin xóa log của mình |

---

### 8.2 Validation

Tất cả validation thực hiện ở **cả hai tầng**:
- **Frontend:** React Hook Form + Zod (realtime, trước khi gửi request)
- **Backend:** Jakarta Bean Validation (đảm bảo dù FE bị bypass)

| Trường | Màn hình | Quy tắc | Thông báo lỗi |
|---|---|---|---|
| `username` | Đăng ký | Không trống; 4–50 ký tự; a-z, 0-9, _ | "Username phải 4–50 ký tự" |
| `email` | Đăng ký / Quên MK | Không trống; đúng format; chưa tồn tại | "Email không hợp lệ hoặc đã dùng" |
| `password` | Đăng ký / Đặt lại MK | Tối thiểu 6 ký tự; khớp confirmPassword | "Mật khẩu quá ngắn hoặc không khớp" |
| `age` | Hồ sơ | Số nguyên dương; 1–120 | "Tuổi không hợp lệ" |
| `height_cm` | Hồ sơ | Số thực dương; 50–300 | "Chiều cao không hợp lệ" |
| `weight_kg` | Hồ sơ | Số thực dương; 10–500 | "Cân nặng không hợp lệ" |
| `daily_calories_kcal` | Mục tiêu | Số dương; 500–10000 | "Calo mục tiêu phải trong khoảng 500–10000" |
| `plan_date` | Tạo kế hoạch | Không trống; yyyy-MM-dd; không trùng ngày cũ | "Ngày không hợp lệ hoặc đã có kế hoạch" |
| `quantity_g` | Thêm món | Số thực; > 0; ≤ 10000 | "Khẩu phần phải lớn hơn 0" |
| `dish.name` | Thêm/sửa món | Không trống; ≤ 200 ký tự; không trùng | "Tên món đã tồn tại" |
| `score` (rating) | Đánh giá | Số nguyên; 1–5 | "Điểm đánh giá phải từ 1 đến 5" |
| `template_name` | Lưu mẫu | Không trống; ≤ 200 ký tự | "Tên mẫu không được để trống" |
| `token` (OTP) | Quên MK | 6 chữ số; còn hạn; `used=0` | "OTP không đúng hoặc đã hết hạn" |
| Image upload | Admin | JPG/JPEG/PNG; ≤ 5MB | "File ảnh không đúng định dạng hoặc quá lớn" |

---

## IX. Yêu cầu phi chức năng

### 9.1 Hiệu năng
- Tất cả API phản hồi < 3 giây điều kiện bình thường
- Endpoint GET /dishes phân trang, tối đa 20 items/trang
- Tải trang thống kê admin ≤ 5 giây
- Tính dinh dưỡng realtime trên FE không block UI (`useMemo`/`useCallback`)

### 9.2 Bảo mật
- JWT hết hạn sau 24 giờ; không lưu vào localStorage
- BCrypt strength=12 cho tất cả mật khẩu
- CORS chỉ cho phép origin FE domain
- Rate limiting: tối đa 5 request/phút/IP cho `/auth/forgot-password`

### 9.3 Khả năng sử dụng
- Responsive: hiển thị đúng từ 320px đến 1920px
- Form hiển thị lỗi inline ngay tại trường nhập
- Dialog xác nhận bắt buộc trước mọi thao tác xóa / khóa / đăng xuất
- Toast thông báo kết quả trong 3 giây

### 9.4 Khả năng bảo trì
- Code coverage ≥ 70% cho tầng Service (JUnit + Mockito)
- Swagger mô tả đầy đủ endpoint, DTO, response code
- GlobalExceptionHandler bắt tất cả exception; không lộ stack trace
- Tên biến/hàm/class dùng tiếng Anh, có nghĩa (camelCase Java, camelCase TS)

---

## X. Kế hoạch kiểm thử

### 10.1 Chiến lược
- **Unit Test (BE):** JUnit 5 + Mockito cho tất cả Service classes
- **Integration Test (BE):** MockMvc cho Controller layer
- **Manual Test:** Theo từng Test Case trong tài liệu Design
- **API Test:** Postman Collection cho tất cả endpoint

### 10.2 Test Case – UC01 Đăng ký

| # | Kịch bản | Input | Kết quả mong đợi |
|---|---|---|---|
| 1 | Thành công | username=user1, email=a@b.com, pass=abc123 | 201; tài khoản lưu DB |
| 2 | Email đã tồn tại | email đã có trong DB | 409; "Email đã được sử dụng" |
| 3 | Username đã tồn tại | username đã có | 409; "Username đã tồn tại" |
| 4 | Email sai định dạng | email='notanemail' | 400; field error tại email |
| 5 | Password < 6 ký tự | password='abc' | 400; field error tại password |
| 6 | Thiếu trường bắt buộc | username='' | 400; field error tại username |

### 10.3 Test Case – UC02 Đăng nhập

| # | Kịch bản | Input | Kết quả mong đợi |
|---|---|---|---|
| 1 | Thành công | Đúng username/password | 200; JWT token; role trả về |
| 2 | Sai mật khẩu | password sai | 401; "Thông tin đăng nhập không đúng" |
| 3 | TK bị khóa | status='locked' | 423; "Tài khoản đã bị khóa" |
| 4 | TK bị xóa | status='deleted' | 410; "Tài khoản không tồn tại" |
| 5 | Sai MK 5 lần | 5 lần sai liên tiếp | 423; TK tự động bị khóa |
| 6 | Để trống username | username='' | 400; field error |

### 10.4 Test Case – UC07 Tạo kế hoạch bữa ăn

| # | Kịch bản | Input | Kết quả mong đợi |
|---|---|---|---|
| 1 | Thành công | planDate hợp lệ, các bữa hợp lệ | 201; kế hoạch lưu DB; hiện trên lịch |
| 2 | Trùng ngày | planDate đã có kế hoạch | 409; "Ngày đã có kế hoạch" |
| 3 | Thiếu planDate | planDate=null | 400; field error tại planDate |
| 4 | Tạo từ mẫu | templateId hợp lệ | 201; món ăn từ mẫu điền vào bữa |
| 5 | Khẩu phần âm | quantityG=-100 | 400; field error tại quantityG |

### 10.5 Test Case – UC17 Admin quản lý món ăn

| # | Kịch bản | Input | Kết quả mong đợi |
|---|---|---|---|
| 1 | Thêm món mới | Tên chưa tồn tại, dinh dưỡng hợp lệ | 201; món lưu DB; danh sách làm mới |
| 2 | Thêm tên trùng | Tên đã có (case-insensitive) | 409; "Tên món đã tồn tại" |
| 3 | Sửa món thành công | Dish tồn tại, data hợp lệ | 200; DB cập nhật |
| 4 | Xóa món không dùng | Dish không có trong tblPortion | 200; xóa thành công |
| 5 | Xóa món đang dùng | Dish có record trong tblPortion | 409; "Món đang được dùng trong kế hoạch" |
| 6 | Upload ảnh > 5MB | File 6MB | 400; "File quá lớn" |

---

## XI. Quy trình làm việc

### 11.1 Git Branching

```
main          ← production-ready
  └─ develop  ← tích hợp tính năng
       ├─ feature/uc01-register
       ├─ feature/uc07-meal-plan
       └─ fix/login-locked-account
```

Merge vào `develop` bằng Pull Request; cần review ≥ 1 thành viên.

### 11.2 Quy ước commit (Conventional Commits)

```
feat(auth):      implement login with JWT
fix(mealplan):   fix cascade delete not working
refactor(dish):  extract nutrition calculation to util
test(auth):      add unit tests for AuthService
docs(api):       update swagger docs for meal-plan endpoint
```

### 11.3 Thứ tự implement

1. **Setup:** init Spring Boot + React + Vite; cấu hình DB, CORS, JWT filter
2. **Module 1 – Auth:** Register, Login, Logout, ForgotPassword (OTP), ChangePassword
3. **Module 1 – Profile:** Xem/cập nhật hồ sơ, thiết lập mục tiêu sức khỏe
4. **Module 3 – Dishes (Admin):** CRUD món hệ thống, seed dữ liệu ban đầu
5. **Module 2 – MealPlan:** Xem lịch tuần, tạo kế hoạch, thêm/sửa/xóa khẩu phần
6. **Module 2 – Templates:** Lưu mẫu, áp dụng mẫu khi tạo kế hoạch
7. **Module 3 – Custom Dish + Favorites + Rating:** Thêm món tùy chỉnh, yêu thích, đánh giá
8. **Module 4 – Admin:** Quản lý users, thống kê, phản hồi
9. **Integration & Testing:** Test toàn bộ luồng, sửa lỗi, tối ưu

---

## XII. Cấu hình môi trường

### 12.1 Backend – `application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mealplanner_db?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&characterEncoding=UTF-8
    username: root
    password: YOUR_PASSWORD
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate        # 'update' khi dev, 'validate' khi production
    show-sql: false
    properties:
      hibernate.dialect: org.hibernate.dialect.MySQLDialect

  mail:
    host: smtp.gmail.com
    port: 587
    username: YOUR_EMAIL
    password: YOUR_APP_PASSWORD
    properties.mail.smtp.auth: true
    properties.mail.smtp.starttls.enable: true

app:
  jwt:
    secret: YOUR_256BIT_SECRET_KEY    # tối thiểu 256-bit
    expiration: 86400000              # 24 giờ (ms)
  otp:
    expiration-minutes: 5
  upload:
    path: uploads/
    max-size: 5242880                 # 5MB

server:
  port: 8080
  servlet.context-path: /api

springdoc:
  api-docs.path: /v3/api-docs
  swagger-ui.path: /swagger-ui.html
```

### 12.2 Frontend – `.env`

```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=MealPlanner
```

### 12.3 Tạo database

```sql
CREATE DATABASE mealplanner_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 12.4 Hướng dẫn chạy

**Backend:**
```bash
# 1. Tạo DB và chạy schema.sql
# 2. Cập nhật application.yml
cd backend && mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env   # cập nhật VITE_API_BASE_URL
npm run dev            # http://localhost:5173
```

> ⚠️ **Không commit** `application.yml` chứa password thật hoặc file `.env` vào Git. Thêm vào `.gitignore` ngay từ đầu.

---

## XIII. Phụ lục – Mapping Use Case

| UC ID | Tên Use Case | Controller | Service | Repository |
|---|---|---|---|---|
| UC01 | Đăng ký | `AuthController` | `AuthService` | `UserAccountRepository` |
| UC02 | Đăng nhập | `AuthController` | `AuthService` | `UserAccountRepository` |
| UC03 | Đăng xuất | `AuthController` | `AuthService` | (client-side) |
| UC04 | Lấy lại mật khẩu | `AuthController` | `AuthService`, `OtpService` | `UserAccountRepository`, `PasswordResetTokenRepository` |
| UC05 | Cập nhật thông tin | `ProfileController` | `ProfileService` | `HealthProfileRepository` |
| UC06 | Thiết lập mục tiêu | `ProfileController` | `GoalService` | `HealthGoalRepository` |
| UC07 | Tạo kế hoạch | `MealPlanController` | `MealPlanService` | `MealPlanRepository` |
| UC08 | Thêm món vào kế hoạch | `MealPlanController` | `MealPlanService`, `PortionService` | `PortionRepository`, `DishRepository` |
| UC09 | Chỉnh sửa kế hoạch | `MealPlanController` | `MealPlanService` | `MealPlanRepository`, `PortionRepository` |
| UC10 | Xóa kế hoạch | `MealPlanController` | `MealPlanService` | `MealPlanRepository` |
| UC11 | Xem lịch kế hoạch | `MealPlanController` | `MealPlanService` | `MealPlanRepository` |
| UC12 | Lưu kế hoạch mẫu | `MealPlanController` | `TemplateService` | `MealPlanTemplateRepository`, `TemplateMealRepository`, `TemplatePortionRepository` |
| UC13 | Tìm kiếm món ăn | `DishController` | `DishService` | `DishRepository` |
| UC14 | Thêm món tùy chỉnh | `DishController` | `DishService` | `DishRepository`, `NutritionInfoRepository`, `IngredientRepository` |
| UC15 | Lưu yêu thích | `DishController` | `FavoriteService` | `FavoriteDishRepository` |
| UC16 | Admin – quản lý users | `AdminController` | `AdminService` | `UserAccountRepository` |
| UC17 | Admin – quản lý món ăn | `AdminController` | `AdminDishService` | `DishRepository`, `NutritionInfoRepository` |
| UC18 | Admin – thống kê | `AdminController` | `StatisticsService` | (Aggregate queries) |
| UC19 | Admin – phản hồi | `AdminController` | `FeedbackService` | `UserFeedbackRepository` |

---

*── Hết tài liệu Implementation ──*
