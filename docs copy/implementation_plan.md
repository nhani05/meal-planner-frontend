# Chiến lược triển khai API Endpoints còn thiếu

Triển khai toàn bộ các endpoint được liệt kê trong tài liệu [API Endpoints](file:///C:/Users/lexua/.gemini/antigravity/brain/f2410cb5-a81f-46bd-897c-e40f0f9d05b5/api_endpoints.md) theo mô hình 3 lớp.

## Phân nhóm triển khai

### Nhóm 1: Health Goal & Dish Category
- **Health Goal:** Lưu và lấy mục tiêu dinh dưỡng theo `accountId`.
- **Dish Category:** Lấy danh sách danh mục món ăn để FE hiển thị bộ lọc.

### Nhóm 2: Dish Interaction (Ratings & Favorites)
- **Dish Rating:** Cho phép người dùng đánh giá món ăn (score, comment).
- **Favorites:** Thêm/Xóa món ăn vào danh sách yêu thích của người dùng.

### Nhóm 3: Ingredients & Meal/Portions
- **Ingredients:** Quản lý nguyên liệu (thêm/sửa/xóa).
- **Meal & Portions:** Đây là phần quan trọng nhất để kế hoạch bữa ăn có dữ liệu chi tiết. Cần xử lý logic tính toán dinh dưỡng tự động khi thêm khẩu phần.

### Nhóm 4: Admin & Feedback
- Triển khai `UserFeedback` và `AdminAuditLog` (cần tạo Entity/Repository mới).
- Thống kê (Dashboard stats).
- Quản lý người dùng (Lock/Unlock/Soft Delete).

---

## Danh sách file cần tạo/chỉnh sửa

### [NEW] Entities & Repositories
- `UserFeedback.java` & `UserFeedbackRepository.java`
- `AdminAuditLog.java` & `AdminAuditLogRepository.java`

### [NEW] DTOs (nếu thiếu)
- `FeedbackDTO.java`
- `AdminStatsDTO.java`

### [NEW] Services & Controllers
1. **HealthGoalService** & `HealthGoalController`
2. **DishCategoryService** & `DishCategoryController`
3. **DishRatingService** & `DishRatingController`
4. **FavoriteDishService** & `FavoriteDishController`
5. **IngredientService** & `IngredientController`
6. **PortionService** & `PortionController`
7. **AdminService** & `AdminController`

---

## Logic xử lý quan trọng (Portions)
Khi thêm hoặc cập nhật `Portion`, Backend phải:
1. Lấy `NutritionInfo` của món ăn tương ứng.
2. Tính toán `caloriesKcal`, `proteinG`, `carbG`, `fatG` dựa trên `quantityG` và giá trị dinh dưỡng trên 100g.
3. Tự động tạo `Meal` nếu bữa ăn đó chưa tồn tại trong `MealPlan`.

---

## Kế hoạch thực hiện
1. **Giai đoạn 1:** Triển khai các dịch vụ đơn giản (Health Goal, Categories, Ingredients).
2. **Giai đoạn 2:** Triển khai Interaction (Ratings, Favorites).
3. **Giai đoạn 3:** Triển khai Portions (Logic tính toán phức tạp).
4. **Giai đoạn 4:** Triển khai Admin module.

## Xác nhận từ người dùng
> [!IMPORTANT]
> Tôi sẽ bắt đầu triển khai theo từng nhóm. Bạn có muốn ưu tiên nhóm nào cụ thể không, hay tôi cứ thực hiện theo thứ tự trên?
