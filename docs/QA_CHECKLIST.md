# QA Checklist — Meal Planner Frontend

> **Môi trường test:** BE local `http://localhost:8081/api`  
> **Ngày:** 05/05/2026

## 1. Auth & Account

| # | Test Case | Cách test | Pass/Fail |
|---|---|---|---|
| 1.1 | Đăng nhập thành công | Nhập đúng username/password → vào Dashboard | |
| 1.2 | Đăng nhập sai | Nhập sai → toast lỗi, không redirect | |
| 1.3 | Đăng ký tài khoản mới | Fill form → verify email nếu có → login | |
| 1.4 | Quên mật khẩu → OTP → Reset | `/forgot-password` → nhận OTP → `/reset-password` → login | |
| 1.5 | Đổi mật khẩu trong Profile | Tab "Đổi mật khẩu" → nhập old/new → toast thành công | |
| 1.6 | Token hết hạn → auto logout | Đợi token hết hạn / xóa token trong DevTools → refresh → redirect login | |
| 1.7 | Tài khoản bị khóa (423) | BE trả 423 → redirect `/login?reason=locked` | |

## 2. Dashboard & Meal Planning

| # | Test Case | Cách test | Pass/Fail |
|---|---|---|---|
| 2.1 | Dashboard hiển thị KPI | `/dashboard` → thấy calo hôm nay, mục tiêu, kế hoạch tuần | |
| 2.2 | Lịch tuần navigation | Prev/Next week, Today → đổi tuần đúng | |
| 2.3 | Progress bar màu đúng | Tạo plan với calo <50%, 80-110%, >130% → màu đỏ/xanh lục/vàng | |
| 2.4 | Click ngày có plan → chi tiết | Click card → `/meal-plans/:id` → hiển thị 4 bữa | |
| 2.5 | Click ngày trống → tạo mới | Click card trống → `/meal-plans/new` | |
| 2.6 | Thêm món vào bữa | Mở modal, search, chọn món, nhập quantity → thêm thành công | |
| 2.7 | Xóa portion | Click trash icon → confirm → mất khỏi danh sách | |
| 2.8 | Tổng dinh dưỡng cập nhật | Thêm/xóa món → NutritionSummaryBar đổi số | |
| 2.9 | Xóa kế hoạch | Nút "Xóa kế hoạch" → confirm → redirect calendar | |
| 2.10 | Lưu mẫu | Nút "Lưu thành Mẫu" → toast thông báo | |

## 3. Dish Library

| # | Test Case | Cách test | Pass/Fail |
|---|---|---|---|
| 3.1 | Grid hiển thị món | `/dishes` → grid card với ảnh/calo | |
| 3.2 | Search real-time | Nhập tên món → grid lọc đúng | |
| 3.3 | Filter danh mục | Chọn category → chỉ hiển thị món thuộc category | |
| 3.4 | Filter calo range | Chọn "200-400 kcal" → chỉ hiển thị món trong range | |
| 3.5 | Toggle yêu thích | Click tim → đổi màu đỏ → `/favorites` hiển thị món đó | |
| 3.6 | Chi tiết món | Click card → `/dishes/:id` → hiển thị nutrition, ingredients | |
| 3.7 | Thêm món tùy chỉnh | `/dishes/new` → fill form → tạo thành công | |
| 3.8 | Món của tôi | `/my-dishes` → chỉ hiển thị source=custom | |

## 4. Profile & Health Goal

| # | Test Case | Cách test | Pass/Fail |
|---|---|---|---|
| 4.1 | Cập nhật hồ sơ | Tab "Thông tin cơ bản" → sửa chiều cao/cân nặng → lưu | |
| 4.2 | Cập nhật mục tiêu | Tab "Mục tiêu sức khỏe" → chọn goal, activity → lưu | |
| 4.3 | Đổi mật khẩu | Tab "Đổi mật khẩu" → nhập đúng old/new → toast thành công | |

## 5. Admin

| # | Test Case | Cách test | Pass/Fail |
|---|---|---|---|
| 5.1 | Admin Dashboard | `/admin` → KPI load từ API (không còn mock) | |
| 5.2 | Quản lý Users | `/admin/users` → table, pagination, search | |
| 5.3 | Khóa / Mở khóa user | Click icon → gọi API lock/unlock → reload đúng status | |
| 5.4 | Xóa user | Click trash → confirm → user biến mất, reload đúng | |
| 5.5 | Quản lý Dishes | `/admin/dishes` → table, pagination, search | |
| 5.6 | Xóa dish admin | Click trash → confirm → dish biến mất | |
| 5.7 | Thống kê | `/admin/stats` → biểu đồ render | |
| 5.8 | Phản hồi | `/admin/feedbacks` → filter status, cập nhật status | |

## 6. Responsive & UX

| # | Test Case | Cách test | Pass/Fail |
|---|---|---|---|
| 6.1 | Mobile (<640px) | DevTools → iPhone SE → kiểm tra layout không bể | |
| 6.2 | Tablet (768px) | DevTools → iPad → sidebar hiển thị | |
| 6.3 | Loading states | Thấy spinner/skeleton khi fetch data | |
| 6.4 | Empty states | Trang trống khi chưa có dữ liệu | |
| 6.5 | Toast notifications | Mọi CRUD đều có toast phản hồi | |

---

> **Kết quả:** __ / 28 test cases pass
