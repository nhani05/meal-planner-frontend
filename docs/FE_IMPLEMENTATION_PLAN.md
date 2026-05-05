# Kế hoạch Triển khai Frontend — Meal Planner System

> **Ngày lập:** 05/05/2026  
> **Phiên bản:** 1.0  
> **Stack:** React 19 + Vite + TailwindCSS + shadcn/ui + Zustand + React Hook Form + Zod + Recharts  
> **Base URL:** `http://localhost:8081/api`  
> **Ngôn ngữ giao diện:** Tiếng Việt  

---

## 1. Tổng quan

Tài liệu này mô tả lộ trình triển khai toàn bộ giao diện Frontend (FE) cho **Hệ thống Lập Kế hoạch Bữa Ăn & Quản lý Dinh Dưỡng**, dựa trên:
- Tài liệu thiết kế UI/UX: `docs/frontend-implementation-mealplanner.md`
- Tài liệu API đầy đủ: `docs_BE/API.md`
- Tài liệu Entity & DB: `docs_BE/database/ENTITY_DOCUMENTATION.md`

**Backend đã hoàn thành 100%** (47 endpoints, tất cả đã implement theo `docs_BE/planning/IMPLEMENTATION_PLAN.md`). FE chỉ cần tích hợp đúng API và xây dựng giao diện.

---

## 2. Trạng thái hiện tại (Gap Analysis)

### 2.1 Đã có sẵn trong codebase

| Thành phần | Chi tiết |
|---|---|
| **Project scaffold** | React 19 + Vite + TailwindCSS + shadcn/ui (`components/ui/*`) |
| **HTTP Client** | Axios instance (`src/api/api.js`) với JWT interceptor, xử lý 401/403/423/410 |
| **State Management** | Zustand (`authStore.js`, `userStore.js`) |
| **Routing** | `react-router-dom` v7 — `src/router/index.jsx` đã có 3 layout (Public, Dashboard, Admin) |
| **API Services** | `authService`, `dishService`, `mealService`, `userService`, `adminService`, `ingredientService` |
| **Pages tồn tại** | Home, Login, Register, ForgotPassword, Profile, MealCalendar, MealDetail, CreateMealPlan, Dish, CreateDish, Ingredient, AdminDashboard, AdminUser, AdminDish |
| **Shared Components** | Navbar, Sidebar, AdminSidebar, Toaster, các Radix UI primitive |

### 2.2 Còn thiếu so với tài liệu thiết kế

| STT | Thiếu sót | Mức độ |
|---|---|---|
| 1 | Route `/dashboard` (User Dashboard) | **Cao** |
| 2 | Route `/reset-password` | **Cao** |
| 3 | Route `/profile/goals` (Mục tiêu sức khỏe) | **Cao** |
| 4 | Route `/dishes/:id` (Chi tiết món ăn) | **Cao** |
| 5 | Route `/my-dishes` (Món của tôi) | **Cao** |
| 6 | Route `/favorites` (Yêu thích) | **Cao** |
| 7 | Route `/admin/stats` & `/admin/feedbacks` | **Trung bình** |
| 8 | Các Modal: Thêm món vào bữa, Lưu template, Xác nhận xóa, Chi tiết phản hồi | **Cao** |
| 9 | Chuẩn hóa routes cho `/meal-plan/*`, `/my-dishes/*` khớp docs | **Trung bình** |
| 10 | Biểu đồ dinh dưỡng (Donut chart macro) & Admin Charts | **Trung bình** |
| 11 | Đổi mật khẩu trong Profile | **Trung bình** |
| 12 | Dish Rating (đánh giá món ăn) | **Thấp** |
| 13 | Loading states (Skeleton), Empty states, Error boundaries | **Trung bình** |

---

## 3. Kiến trúc triển khai

```
src/
├── api/                    # HTTP services (axios wrappers)
│   ├── api.js              # Axios instance + interceptors ✅
│   ├── authService.js      # Auth endpoints ✅ (cần bổ sung change-password)
│   ├── userService.js      # Profile, Health Goal, Favorites ✅ (cần bổ sung goals/favorites)
│   ├── dishService.js      # Dishes, Categories, Ratings ✅ (cần bổ sung ratings)
│   ├── mealService.js      # MealPlans, Meals, Portions, Templates ✅ (cần bổ sung portions/templates)
│   ├── ingredientService.js# Ingredients ✅
│   └── adminService.js     # Admin CRUD ✅ (cần bổ sung stats/feedbacks)
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui primitives ✅
│   ├── Navbar.jsx          # ✅
│   ├── Sidebar.jsx         # ✅
│   ├── AdminSidebar.jsx    # ✅
│   ├── ConfirmDialog.jsx   # 🆕 Reusable confirmation modal
│   ├── EmptyState.jsx      # 🆕 Empty state illustration
│   └── SkeletonGrid.jsx    # 🆕 Loading skeletons
├── features/               # Domain-driven page modules
│   ├── public/             # Landing pages ✅
│   ├── auth/               # Login, Register, ForgotPassword ✅
│   ├── dashboard/          # 🆕 User Dashboard (/dashboard)
│   ├── profile/            # Profile ✅ (cần Goals sub-page)
│   ├── mealplan/           # Meal Calendar, Detail, Create ✅ (cần modals & portions)
│   ├── dish/               # Dish Library, Create ✅ (cần Detail, MyDishes, Favorites)
│   └── admin/              # Admin Dashboard, Users, Dishes ✅ (cần Stats, Feedbacks)
├── router/
│   └── index.jsx           # Route definitions 🔄 CẦN CẬP NHẬT
├── store/
│   ├── authStore.js        # ✅
│   ├── userStore.js        # 🔄 CẦN MỞ RỘNG (goals, favorites)
│   ├── dishStore.js        # 🆕 Global dish cache, filters
│   └── mealStore.js        # 🆕 Meal plan cache, selected week
├── hooks/
│   ├── useAuth.js          # 🆕 Auth + role check
│   ├── useMealPlan.js      # 🆕 Fetch & mutate meal plans
│   └── useDishes.js        # 🆕 Fetch dishes with filters
└── lib/
    └── utils.js            # cn() helper ✅
```

---

## 4. Kế hoạch theo Giai đoạn (Phase-driven)

> **Quy tắc:** Mỗi Phase có **Definition of Done (DoD)** rõ ràng và tạo ra **Artifact chuẩn chỉ** có thể kiểm tra / demo.

---

### 🔹 Phase 1: Nền tảng & Chuẩn hóa (Foundation Week)

**Mục tiêu:** Chuẩn bị codebase để các phase sau chạy song song không bị block.

| # | Task | File liên quan | Artifact |
|---|---|---|---|
| 1.1 | **Chuẩn hóa Routes** — Điều chỉnh `router/index.jsx` khớp 100% với tài liệu thiết kế (thêm `/dashboard`, `/reset-password`, `/profile/goals`, `/dishes/:id`, `/my-dishes`, `/my-dishes/create`, `/favorites`, `/admin/stats`, `/admin/feedbacks`). Duy trì backward-compatible nếu cần. | `src/router/index.jsx` | Route Map chuẩn |
| 1.2 | **Hoàn thiện API Services** — Cập nhật TẤT CẢ service files để gọi đúng 47 endpoints BE đã implement (đặc biệt: `auth/change-password`, `health-goal/*`, `favorites/*`, `dish-ratings/*`, `portions/*`, `meal-plan-templates`, `admin/stats`, `admin/feedbacks`). | `src/api/*.js` | Service Layer hoàn chỉnh |
| 1.3 | **Tạo Reusable Components** — `ConfirmDialog`, `EmptyState`, `SkeletonCard`, `SkeletonTable`, `NutritionSummaryPanel` (hiển thị tổng calo/protein/carb/fat + progress bars). | `src/components/*.jsx` | UI Component Library mở rộng |
| 1.4 | **Tạo Custom Hooks** — `useAuth` (trả về user, role, isAuth, checkRole), `useToast` (wrap shadcn toaster). | `src/hooks/*.js` | Hook API |
| 1.5 | **Mở rộng Zustand Stores** — `userStore` (thêm healthGoal, favorites), tạo `dishStore` (filters, cache), `mealStore` (selectedWeek, activePlan). | `src/store/*.js` | State Layer hoàn chỉnh |

**Artifact đầu ra:**
- `docs/phase1_routing_spec.md` — Bảng mapping route chuẩn
- `src/api/*Service.js` — Đã cập nhật đầy đủ endpoint
- `src/components/ConfirmDialog.jsx`, `EmptyState.jsx`, `NutritionSummaryPanel.jsx`
- `src/hooks/useAuth.js`, `useToast.js`
- `src/store/dishStore.js`, `mealStore.js`

**Definition of Done:**
- [ ] Postman/Swagger test pass cho tất cả service methods (console log hoặc unit test đơn giản).
- [ ] Router render đúng layout theo role (Guest / User / Admin) không lỗi 404.
- [ ] ConfirmDialog & EmptyState hiển thị đúng design token (`#4CAF50`, `#F44336`, …).

---

### 🔹 Phase 2: Module 1 — Quản lý Tài khoản (Auth + Profile)

**Mục tiêu:** Hoàn thiện luồng xác thực và hồ sơ người dùng.

| # | Task | File liên quan | API Endpoints |
|---|---|---|---|
| 2.1 | **Reset Password Page** — Form nhập OTP + mật khẩu mới, validate OTP 6 số, password ≥ 6 ký tự, khớp confirm. Xử lý lỗi OTP sai/hết hạn. | `src/features/auth/ResetPasswordPage.jsx` | `POST /auth/verify-otp`, `POST /auth/reset-password` |
| 2.2 | **Profile Sidebar Tabs** — Chuyển ProfilePage thành layout 2 cột có sidebar (Thông tin cá nhân \| Mục tiêu sức khỏe \| Đổi mật khẩu). | `src/features/profile/ProfilePage.jsx` | — |
| 2.3 | **Health Goals Page (`/profile/goals`)** — Form chọn goalType (radio), activityLevel (select), targetWeight, dailyCalories. Hiển thị TDEE gợi ý tự động (tính local). | `src/features/profile/GoalsPage.jsx` | `GET /health-goal/{id}`, `POST /health-goal/{id}` |
| 2.4 | **Change Password Tab** — Form oldPassword, newPassword, confirm. Validate FE + BE. | `src/features/profile/ChangePasswordTab.jsx` | `PUT /auth/change-password` |
| 2.5 | **Auth Service Update** — Bổ sung `changePassword`, `resetPassword`, `verifyOtp` vào `authService.js`. | `src/api/authService.js` | — |

**Artifact đầu ra:**
- `src/features/auth/ResetPasswordPage.jsx`
- `src/features/profile/GoalsPage.jsx`
- `src/features/profile/ChangePasswordTab.jsx`
- `src/features/profile/ProfileLayout.jsx` (sidebar tabs)

**Definition of Done:**
- [ ] Luồng Quên → OTP → Reset → Login hoạt động trơn tru (test end-to-end).
- [ ] Lưu Health Goal thành công, reload lại hiển thị đúng.
- [ ] Đổi mật khẩu thành công, token cũ bị xóa, yêu cầu đăng nhập lại.

---

### 🔹 Phase 3: Module 2 — Quản lý Kế hoạch Bữa Ăn (Meal Planning)

**Mục tiêu:** Xây dựng trung tâm ứng dụng — lịch kế hoạch tuần, chi tiết ngày, thêm/xóa món, tóm tắt dinh dưỡng.

| # | Task | File liên quan | API Endpoints |
|---|---|---|---|
| 3.1 | **User Dashboard (`/dashboard`)** — KPI hôm nay (calo/macro), card kế hoạch hôm nay, card lịch tuần mini, shortcuts. Gọi `GET /meal-plans/account/{id}`, `GET /health-goal/{id}`. | `src/features/dashboard/DashboardPage.jsx` | `GET /meal-plans/account/{id}`, `GET /health-goal/{id}` |
| 3.2 | **Meal Calendar Page (`/meal-plan`)** — Lưới 7 ngày, navigation tuần trước/sau. Mỗi card hiển thị tổng calo + progress bar (so với dailyCalories từ HealthGoal). Màu: xanh (80-110%), vàng (50-79% / 111-130%), đỏ (còn lại). | `src/features/mealplan/MealCalendarPage.jsx` | `GET /meal-plans/account/{id}` |
| 3.3 | **Meal Detail Page (`/meal-plan/:date`)** — Layout 2 cột: trái là 4 section (Breakfast/Lunch/Dinner/Snack), mỗi section list portions (editable quantity, delete icon); phải là `NutritionSummaryPanel` sticky. Nút "Xóa kế hoạch", "Lưu làm mẫu". | `src/features/mealplan/MealDetailPage.jsx` | `GET /meal-plans/account/{id}/date/{date}`, `GET /meal-plans/{planId}/meals` |
| 3.4 | **Modal Thêm món vào bữa** — Search real-time theo tên, tabs (Gần đây / Yêu thích / Tất cả), multi-select, nhập khẩu phần từng món. | `src/features/mealplan/AddDishModal.jsx` | `GET /dishes`, `GET /favorites/account/{id}`, `POST /meal-plans/{planId}/meals/{type}/portions` |
| 3.5 | **Modal Lưu kế hoạch mẫu** — Input tên mẫu, validate trùng tên → confirm ghi đè. | `src/features/mealplan/SaveTemplateModal.jsx` | `GET /meal-plan-templates`, (POST template nếu BE hỗ trợ) |
| 3.6 | **Create Meal Plan Page (`/meal-plan/create`)** — 2 bước: chọn Tạo mới / Dùng mẫu. Nếu mẫu → load template rồi render giống MealDetail. Nút "Lưu kế hoạch". | `src/features/mealplan/CreateMealPlanPage.jsx` | `POST /meal-plans?accountId={id}` |
| 3.7 | **Portion Management** — Inline edit quantity → `PUT portions`; delete icon → `DELETE portions` + confirm. Tự động recalculate tổng dinh dưỡng FE side sau mỗi mutation (hoặc refetch). | `src/features/mealplan/PortionItem.jsx` | `PUT /meal-plans/.../portions/{id}`, `DELETE /meal-plans/.../portions/{id}` |

**Artifact đầu ra:**
- `src/features/dashboard/DashboardPage.jsx`
- `src/features/mealplan/MealCalendarPage.jsx` (refactored routes)
- `src/features/mealplan/MealDetailPage.jsx` (refactored)
- `src/features/mealplan/AddDishModal.jsx`
- `src/features/mealplan/SaveTemplateModal.jsx`
- `src/features/mealplan/CreateMealPlanPage.jsx` (refactored)
- `src/features/mealplan/PortionItem.jsx`
- `src/components/NutritionSummaryPanel.jsx`

**Definition of Done:**
- [ ] Tạo kế hoạch cho 1 ngày, thêm món vào 4 bữa, chỉnh khẩu phần, xóa món — tất cả cập nhật đúng tổng calo/macro real-time.
- [ ] Progress bar trên calendar đổi màu đúng theo % mục tiêu.
- [ ] Dashboard hiển thị KPI hôm nay chính xác dựa trên kế hoạch + health goal.

---

### 🔹 Phase 4: Module 3 — Quản lý Món Ăn (Dishes, Favorites, Ratings)

**Mục tiêu:** Thư viện món, món của tôi, yêu thích, chi tiết & đánh giá.

| # | Task | File liên quan | API Endpoints |
|---|---|---|---|
| 4.1 | **Dish Library Page (`/dishes`)** — Grid 3-4 cột, filter theo category, calo range, search. Mỗi card: ảnh, tên, category badge, calo/100g, icon tim (toggle yêu thích). | `src/features/dish/DishPage.jsx` | `GET /dishes`, `GET /dish-categories` |
| 4.2 | **Dish Detail Page (`/dishes/:id`)** — 2 cột: ảnh + info trái; bảng dinh dưỡng + nguyên liệu + ratings phải. Nút "Thêm vào kế hoạch" mở modal chọn bữa. | `src/features/dish/DishDetailPage.jsx` | `GET /dishes/{id}`, `GET /dishes/{id}/ratings` |
| 4.3 | **My Dishes Page (`/my-dishes`)** — Grid giống `/dishes` nhưng chỉ hiển thị `source = "custom"`. Nút "+ Thêm món", "Sửa", "Xóa" trên mỗi card. | `src/features/dish/MyDishesPage.jsx` | `GET /dishes/account/{id}`, `POST /dishes`, `PUT /dishes/{id}`, `DELETE /dishes/{id}` |
| 4.4 | **Favorites Page (`/favorites`)** — Grid các món đã thích. Empty state nếu chưa có. | `src/features/dish/FavoritesPage.jsx` | `GET /favorites/account/{id}` |
| 4.5 | **Dish Rating** — Trên DishDetail: form đánh giá (1-5 sao + comment), list các đánh giá đã có. | `src/features/dish/DishRating.jsx` | `POST /dishes/{id}/ratings`, `GET /dishes/{id}/ratings` |
| 4.6 | **Favorite Toggle** — Component `FavoriteButton` reusable (trái tim), dùng ở `/dishes`, `/dishes/:id`, `/favorites`. Optimistic UI. | `src/components/FavoriteButton.jsx` | `POST /favorites/.../{dishId}`, `DELETE /favorites/.../{dishId}` |

**Artifact đầu ra:**
- `src/features/dish/DishDetailPage.jsx`
- `src/features/dish/MyDishesPage.jsx`
- `src/features/dish/FavoritesPage.jsx`
- `src/features/dish/DishRating.jsx`
- `src/components/FavoriteButton.jsx`

**Definition of Done:**
- [ ] Search + filter trên `/dishes` hoạt động (FE-side filter nếu BE chưa hỗ trợ query params).
- [ ] Toggle yêu thích phản hồi ngay lập tức (optimistic), đồng bộ trên các trang.
- [ ] Dish Detail hiển thị đầy đủ NutritionInfo /100g và danh sách Ingredient.

---

### 🔹 Phase 5: Module 4 — Quản trị Hệ thống (Admin)

**Mục tiêu:** Hoàn thiện Admin Dashboard với thống kê và quản lý phản hồi.

| # | Task | File liên quan | API Endpoints |
|---|---|---|---|
| 5.1 | **Admin Dashboard (`/admin`)** — 4 KPI cards (totalUsers, newUsersThisMonth, totalPlans, totalDishes). Biểu đồ users mới theo tháng (Recharts bar/line). Bảng top 5 món phổ biến. Badge phản hồi chưa xử lý. | `src/features/admin/AdminDashboardPage.jsx` | `GET /admin/statistics` |
| 5.2 | **Admin Stats Page (`/admin/stats`)** — Date range picker (7 ngày / 30 ngày / 3 tháng). Line chart users mới, bar chart kế hoạch tạo. Table top 10 món. | `src/features/admin/AdminStatsPage.jsx` | `GET /admin/statistics?startDate=&endDate=` |
| 5.3 | **Admin Feedback Page (`/admin/feedbacks`)** — Tabs filter (Tất cả / Chưa xử lý / Đang xử lý / Đã xử lý). Table list: tên, email, ngày, tóm tắt, badge trạng thái. Nút "Xem chi tiết". | `src/features/admin/AdminFeedbackPage.jsx` | `GET /admin/feedbacks?status=&page=&size=` |
| 5.4 | **Feedback Detail Modal** — Hiển thị nội dung đầy đủ. Dropdown đổi trạng thái. Textarea ghi chú Admin. Nút Lưu / Đóng. | `src/features/admin/FeedbackDetailModal.jsx` | `PATCH /admin/feedbacks/{id}/status` |
| 5.5 | **Admin Dish CRUD trong Modal** — Thêm/Sửa món hệ thống với upload ảnh, nhập NutritionInfo, dynamic list Ingredients. | `src/features/admin/AdminDishModal.jsx` | `POST /admin/dishes`, `PUT /admin/dishes/{id}` |
| 5.6 | **Admin Sidebar Update** — Thêm link `/admin/stats`, `/admin/feedbacks`. | `src/components/AdminSidebar.jsx` | — |

**Artifact đầu ra:**
- `src/features/admin/AdminStatsPage.jsx`
- `src/features/admin/AdminFeedbackPage.jsx`
- `src/features/admin/FeedbackDetailModal.jsx`
- `src/features/admin/AdminDishModal.jsx`
- `src/components/AdminSidebar.jsx` (updated)

**Definition of Done:**
- [ ] Admin Dashboard load KPI đúng từ `GET /admin/statistics`.
- [ ] Feedback list phân trang đúng, cập nhật status thành công.
- [ ] Tạo món hệ thống mới với ảnh + nutrition + ingredients thành công.

---

### 🔹 Phase 6: Tích hợp, Polish & QA

**Mục tiệu:** Đảm bảo trải nghiệm mượt mà, responsive, lỗi được xử lý gracefully.

| # | Task | File liên quan | Mô tả |
|---|---|---|---|
| 6.1 | **Error Boundary** — React Error Boundary cho toàn app và từng feature zone. | `src/components/ErrorBoundary.jsx` | Catch runtime errors, hiển thị friendly message |
| 6.2 | **Responsive Audit** — Test tất cả pages trên mobile (≤640px), tablet (≤1024px). Điều chỉnh grid columns, sidebar behavior. | `src/features/*/*.jsx` | Không có layout bể trên thiết bị nhỏ |
| 6.3 | **Loading States** — Skeleton loaders cho table, grid, card list. Spinner cho form submit. | `src/components/Skeleton*.jsx` | Dùng shadcn Skeleton |
| 6.4 | **Empty States** — Trang trống cho `/favorites`, `/my-dishes`, `/meal-plan` khi chưa có dữ liệu. | `src/components/EmptyState.jsx` | Icon + text + CTA button |
| 6.5 | **Toast Notifications** — Tích hợp toàn bộ success/error messages qua shadcn Toaster. | `src/hooks/useToast.js` | CRUD nào cũng có toast phản hồi |
| 6.6 | **Integration Testing** — Chạy toàn bộ app với BE local, checklist 20 use cases chính. | `docs/QA_CHECKLIST.md` | Pass ≥ 18/20 use cases |

**Artifact đầu ra:**
- `src/components/ErrorBoundary.jsx`
- `docs/QA_CHECKLIST.md`
- `docs/BUG_TRACKING.md` (nếu có)

**Definition of Done:**
- [ ] Không còn console error / warning khi chạy production build.
- [ ] Lighthouse score ≥ 70 (Performance, Accessibility).
- [ ] Tất cả routes điều hướng đúng, refresh page không 404 (Vite SPA fallback config nếu deploy).

---

## 5. Bảng Mapping Routes chuẩn (FE ↔ BE)

| Route FE | Page Component | Layout | Auth | BE Endpoints chính |
|---|---|---|---|---|
| `/` | `HomePage` | Public | None | — |
| `/login` | `LoginPage` | Public | None | `POST /auth/login` |
| `/register` | `RegisterPage` | Public | None | `POST /auth/register` |
| `/forgot-password` | `ForgotPasswordPage` | Public | None | `POST /auth/forgot-password` |
| `/reset-password` | `ResetPasswordPage` | Public | None | `POST /auth/verify-otp`, `POST /auth/reset-password` |
| `/dashboard` | `DashboardPage` | Dashboard | User | `GET /meal-plans/account/{id}`, `GET /health-goal/{id}` |
| `/meal-plan` | `MealCalendarPage` | Dashboard | User | `GET /meal-plans/account/{id}` |
| `/meal-plan/:date` | `MealDetailPage` | Dashboard | User | `GET /meal-plans/account/{id}/date/{date}`, `GET /meal-plans/{planId}/meals` |
| `/meal-plan/create` | `CreateMealPlanPage` | Dashboard | User | `POST /meal-plans?accountId={id}`, `GET /meal-plan-templates` |
| `/dishes` | `DishPage` | Dashboard | User/Guest | `GET /dishes`, `GET /dish-categories` |
| `/dishes/:id` | `DishDetailPage` | Dashboard | User/Guest | `GET /dishes/{id}`, `GET /dishes/{id}/ratings` |
| `/my-dishes` | `MyDishesPage` | Dashboard | User | `GET /dishes/account/{id}` |
| `/my-dishes/create` | `CreateDishPage` | Dashboard | User | `POST /dishes` |
| `/favorites` | `FavoritesPage` | Dashboard | User | `GET /favorites/account/{id}` |
| `/profile` | `ProfilePage` | Dashboard | User | `GET /health-profile/{id}`, `POST /health-profile/{id}` |
| `/profile/goals` | `GoalsPage` | Dashboard | User | `GET /health-goal/{id}`, `POST /health-goal/{id}` |
| `/admin` | `AdminDashboardPage` | Admin | Admin | `GET /admin/statistics` |
| `/admin/users` | `AdminUserPage` | Admin | Admin | `GET /admin/users` |
| `/admin/dishes` | `AdminDishPage` | Admin | Admin | `GET /admin/dishes`, `POST /admin/dishes`, … |
| `/admin/stats` | `AdminStatsPage` | Admin | Admin | `GET /admin/statistics?startDate=&endDate=` |
| `/admin/feedbacks` | `AdminFeedbackPage` | Admin | Admin | `GET /admin/feedbacks`, `PATCH /admin/feedbacks/{id}/status` |

---

## 6. Enum & Design Token Reference (dùng xuyên suốt)

### 6.1 Enum Values (lowercase string)

| Enum | Giá trị hợp lệ | Dùng ở |
|---|---|---|
| `role` | `user`, `admin` | `UserAccountDTO` |
| `status` | `active`, `locked`, `deleted` | `UserAccountDTO` |
| `gender` | `male`, `female`, `other` | `HealthProfileDTO` |
| `goalType` | `weight_loss`, `muscle_gain`, `maintain` | `HealthGoalDTO` |
| `activityLevel` | `low`, `medium`, `high` | `HealthGoalDTO` |
| `source` | `system`, `custom` | `DishDTO` |
| `difficulty` | `easy`, `medium`, `hard` | `DishDTO` |
| `mealType` | `breakfast`, `lunch`, `dinner`, `snack` | `MealDTO`, `PortionDTO` |
| `feedbackStatus` | `pending`, `processing`, `resolved` | Feedback |

### 6.2 Design Tokens

| Token | Giá trị | Dùng cho |
|---|---|---|
| Primary | `#4CAF50` | Nút primary, success, progress đạt mục tiêu |
| Secondary | `#2196F3` | Link, info |
| Danger | `#F44336` | Xóa, lỗi, progress vượt 130% |
| Warning | `#FF9800` | Cảnh báo nhẹ, progress 50-79% |
| Background | `#F5F5F5` | Nền trang |
| Card | `#FFFFFF` | Nền card |
| Text Primary | `#212121` | Tiêu đề, body |
| Text Secondary | `#757575` | Mô tả phụ |
| Border | `#E0E0E0` | Viền input, divider |

---

## 7. Tiến độ đề xuất

| Tuần | Phase | Mục tiêu chính | Output có thể demo |
|---|---|---|---|
| **Tuần 1** | Phase 1 | Foundation: Routes chuẩn, Services hoàn chỉnh, Reusable UI | Demo routing + API test console |
| **Tuần 2** | Phase 2 | Auth hoàn chỉnh: ResetPassword, Goals, ChangePassword | Login → Goals → Profile flow |
| **Tuần 3** | Phase 3 | Meal Planning: Dashboard, Calendar, Detail, Portions | Tạo kế hoạch tuần, thêm món, xem tổng dinh dưỡng |
| **Tuần 4** | Phase 4 | Dish Module: Detail, MyDishes, Favorites, Ratings | Browse dishes, toggle fav, view nutrition |
| **Tuần 5** | Phase 5 | Admin: Stats, Feedbacks, Dish CRUD modal | Admin dashboard + feedback management |
| **Tuần 6** | Phase 6 | Polish, Responsive, QA, Bugfix | Production-ready build |

---

## 8. Lưu ý kỹ thuật quan trọng

1. **Portions Auto-calculation:** Backend tự động tính `caloriesKcal`, `proteinG`, `carbG`, `fatG` khi tạo/cập nhật portion. FE chỉ cần gửi `dishId` + `quantityG`, sau đó refetch meals để hiển thị.
2. **Image Upload:** `imageUrl` hiện là URL string. Nếu cần upload file thật, BE cần hỗ trợ multipart. Tạm thời dùng URL placeholder hoặc input text cho imageUrl.
3. **Date Format:** Mọi date gửi/nhận BE đều là `yyyy-MM-dd` (meal plan) hoặc ISO 8601 (template savedAt).
4. **Pagination:** Admin tables (`users`, `dishes`, `feedbacks`) và `ingredients` đều dùng Spring `Page` (`content`, `totalPages`, `totalElements`). FE cần component `DataTable` với pagination UI.
5. **Auth Header:** Tất cả request (trừ login/register/forgot-password) phải có `Authorization: Bearer <token>`. Axios interceptor đã xử lý.
6. **Role Guard:** `AdminRoute` kiểm tra `role === 'admin'`. Nếu user cố truy cập admin → redirect `/`.
7. **Optimistic UI:** Toggle yêu thích nên update UI ngay rồi rollback nếu API lỗi, để UX mượt.

---

> **Kết luận:** Backend đã sẵn sàng 100%. Frontend cần 6 tuần để triển khai hoàn chỉnh 21 màn hình + reusable components theo tài liệu thiết kế. Mỗi phase có artifact đầu ra rõ ràng, có thể review và demo độc lập.
