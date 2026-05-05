# Tài liệu Triển khai Frontend – Hệ thống Lập Kế Hoạch Bữa Ăn & Quản Lý Dinh Dưỡng

> **Mục đích:** Tài liệu này mô tả toàn bộ cấu trúc giao diện, màn hình, thành phần UI và luồng điều hướng của ứng dụng web Meal Planner, phục vụ cho việc tạo giao diện bằng Google Stitch.
>
> **Lưu ý:** Backend đã có sẵn. Frontend chỉ cần gọi API và hiển thị dữ liệu.

---

## 1. Thông tin chung

| Thuộc tính | Giá trị |
|---|---|
| Kiểu ứng dụng | Web App (Responsive) |
| Ngôn ngữ giao diện | Tiếng Việt |
| Người dùng | Guest (khách), User (đã đăng nhập), Admin |
| Thiết bị hỗ trợ | Desktop, Tablet, Mobile |

---

## 2. Kiến trúc tổng quan Frontend

```
Frontend (Web App)
├── Trang công khai (không cần đăng nhập)
│   ├── Trang chủ / Giới thiệu
│   ├── Đăng ký
│   ├── Đăng nhập
│   └── Quên mật khẩu
│
├── Trang người dùng (cần đăng nhập)
│   ├── Dashboard / Trang chủ cá nhân
│   ├── Kế hoạch bữa ăn (lịch tuần + chi tiết)
│   ├── Thư viện món ăn (tìm kiếm, chi tiết)
│   ├── Món ăn của tôi (tùy chỉnh + yêu thích)
│   └── Hồ sơ cá nhân (thông tin + mục tiêu)
│
└── Trang Admin (cần đăng nhập Admin)
    ├── Admin Dashboard
    ├── Quản lý người dùng
    ├── Quản lý món ăn
    ├── Thống kê
    └── Phản hồi người dùng
```

---

## 3. Hệ thống điều hướng (Routing)

| Route | Màn hình | Quyền truy cập |
|---|---|---|
| `/` | Trang chủ / Giới thiệu | Guest, User, Admin |
| `/login` | Đăng nhập | Guest |
| `/register` | Đăng ký | Guest |
| `/forgot-password` | Quên mật khẩu | Guest |
| `/reset-password` | Đặt lại mật khẩu | Guest (có token) |
| `/dashboard` | Dashboard người dùng | User |
| `/meal-plan` | Lịch kế hoạch bữa ăn (tuần) | User |
| `/meal-plan/:date` | Chi tiết kế hoạch theo ngày | User |
| `/meal-plan/create` | Tạo kế hoạch mới | User |
| `/dishes` | Thư viện món ăn | User, Guest (xem) |
| `/dishes/:id` | Chi tiết món ăn | User, Guest (xem) |
| `/my-dishes` | Món ăn của tôi | User |
| `/my-dishes/create` | Thêm món ăn tùy chỉnh | User |
| `/favorites` | Món ăn yêu thích | User |
| `/profile` | Hồ sơ cá nhân | User |
| `/profile/goals` | Thiết lập mục tiêu sức khỏe | User |
| `/admin` | Admin Dashboard | Admin |
| `/admin/users` | Quản lý tài khoản người dùng | Admin |
| `/admin/dishes` | Quản lý danh mục món ăn | Admin |
| `/admin/stats` | Thống kê hệ thống | Admin |
| `/admin/feedbacks` | Quản lý phản hồi | Admin |

---

## 4. Layout & Navigation chung

### 4.1 Header (Thanh điều hướng trên cùng)

**Hiển thị với Guest:**
- Logo + Tên ứng dụng (bên trái)
- Nút "Đăng nhập" (bên phải)
- Nút "Đăng ký" (bên phải, nổi bật hơn)

**Hiển thị với User đã đăng nhập:**
- Logo + Tên ứng dụng (bên trái)
- Menu chính: Trang chủ | Kế hoạch bữa ăn | Thư viện món ăn | Món của tôi
- Avatar người dùng + Dropdown: Hồ sơ / Đăng xuất (bên phải)

**Hiển thị với Admin:**
- Logo + Tên ứng dụng (bên trái)
- Menu: Dashboard | Người dùng | Món ăn | Thống kê | Phản hồi
- Avatar Admin + Dropdown: Đăng xuất (bên phải)

### 4.2 Sidebar (chỉ Admin)

Sidebar dọc bên trái cho giao diện Admin với các mục:
- Dashboard
- Quản lý người dùng
- Quản lý món ăn
- Thống kê
- Phản hồi

### 4.3 Footer

- Tên ứng dụng, thông tin nhóm phát triển
- Hiển thị trên tất cả trang

---

## 5. Màn hình chi tiết

---

### 5.1 MODULE 1 – QUẢN LÝ TÀI KHOẢN

---

#### Màn hình 1.1: Đăng ký (`/register`)

**Mục đích:** UC01 – Cho phép người dùng tạo tài khoản mới.

**Layout:** Trang đơn giản, căn giữa màn hình, form dạng card.

**Thành phần UI:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Tiêu đề "Tạo tài khoản mới" | Heading H1 | |
| Trường "Họ và tên" | Input text | Bắt buộc |
| Trường "Email" | Input email | Bắt buộc, validate định dạng |
| Trường "Tên đăng nhập" | Input text | Bắt buộc, min 3 ký tự, max 30 ký tự |
| Trường "Mật khẩu" | Input password | Bắt buộc, min 6 ký tự |
| Trường "Xác nhận mật khẩu" | Input password | Bắt buộc, phải khớp với mật khẩu |
| Nút "Đăng ký" | Button (primary) | Submit form |
| Link "Đã có tài khoản? Đăng nhập" | Link | Điều hướng sang `/login` |

**Validation (hiển thị lỗi inline dưới mỗi trường):**
- Bỏ trống bất kỳ trường → "Vui lòng nhập [tên trường]"
- Email sai định dạng → "Email không hợp lệ"
- Tên đăng nhập đã tồn tại → "Tên đăng nhập đã được sử dụng"
- Email đã tồn tại → "Email này đã được đăng ký"
- Mật khẩu không khớp → "Mật khẩu xác nhận không khớp"
- Mật khẩu < 6 ký tự → "Mật khẩu tối thiểu 6 ký tự"

**Sau khi đăng ký thành công:**
- Hiển thị Toast/Alert: "Đăng ký thành công!"
- Chuyển hướng sang `/login`

---

#### Màn hình 1.2: Đăng nhập (`/login`)

**Mục đích:** UC02 – Cho phép người dùng đăng nhập.

**Layout:** Trang đơn giản, căn giữa màn hình, form dạng card.

**Thành phần UI:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Tiêu đề "Đăng nhập" | Heading H1 | |
| Trường "Email hoặc Tên đăng nhập" | Input text | Bắt buộc |
| Trường "Mật khẩu" | Input password | Bắt buộc |
| Link "Quên mật khẩu?" | Link | Điều hướng sang `/forgot-password` |
| Nút "Đăng nhập" | Button (primary) | Submit form |
| Link "Chưa có tài khoản? Đăng ký" | Link | Điều hướng sang `/register` |

**Validation:**
- Bỏ trống → "Vui lòng nhập đầy đủ thông tin"
- Sai thông tin → "Tên đăng nhập hoặc mật khẩu không đúng"
- Tài khoản bị khóa → "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ."

**Sau khi đăng nhập thành công:**
- Lưu token vào localStorage
- Nếu là User → chuyển hướng sang `/dashboard`
- Nếu là Admin → chuyển hướng sang `/admin`

---

#### Màn hình 1.3: Quên mật khẩu (`/forgot-password`)

**Mục đích:** UC04 – Gửi OTP về email để đặt lại mật khẩu.

**Layout:** Trang đơn giản, form dạng card căn giữa.

**Thành phần UI:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Tiêu đề "Lấy lại mật khẩu" | Heading H1 | |
| Mô tả ngắn | Text | "Nhập email đăng ký để nhận mã OTP" |
| Trường "Email" | Input email | Bắt buộc |
| Nút "Gửi mã OTP" | Button (primary) | Gọi API gửi OTP |
| Link "Quay lại đăng nhập" | Link | Điều hướng sang `/login` |

**Sau khi gửi OTP thành công:**
- Thông báo: "Mã OTP đã được gửi đến email của bạn"
- Form chuyển sang bước nhập OTP (hoặc chuyển sang `/reset-password?email=...`)

---

#### Màn hình 1.4: Đặt lại mật khẩu (`/reset-password`)

**Mục đích:** UC04 (tiếp theo) – Nhập OTP và mật khẩu mới.

**Thành phần UI:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Tiêu đề "Đặt lại mật khẩu" | Heading H1 | |
| Trường "Mã OTP" | Input text | 6 chữ số, bắt buộc |
| Trường "Mật khẩu mới" | Input password | Min 6 ký tự |
| Trường "Xác nhận mật khẩu mới" | Input password | Phải khớp |
| Nút "Xác nhận" | Button (primary) | |
| Nút "Gửi lại OTP" | Button (secondary/ghost) | |

**Validation:**
- OTP sai → "Mã OTP không đúng, vui lòng thử lại"
- OTP hết hạn → "Mã OTP đã hết hạn (hiệu lực 5 phút). Vui lòng gửi lại."

**Sau khi đổi mật khẩu thành công:**
- Toast: "Đặt lại mật khẩu thành công!"
- Chuyển hướng sang `/login`

---

#### Màn hình 1.5: Hồ sơ cá nhân (`/profile`)

**Mục đích:** UC05 – Xem và cập nhật thông tin cá nhân.

**Layout:** Trang 2 cột: sidebar bên trái (điều hướng profile), nội dung bên phải.

**Sidebar profile:**
- Ảnh đại diện (tròn, có nút đổi ảnh)
- Tên người dùng
- Email
- Menu: Thông tin cá nhân | Mục tiêu sức khỏe | Đổi mật khẩu

**Tab "Thông tin cá nhân":**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Trường "Họ và tên" | Input text | |
| Trường "Tuổi" | Input number | > 0 |
| Trường "Giới tính" | Select | Nam / Nữ / Khác |
| Trường "Chiều cao (cm)" | Input number | > 0 |
| Trường "Cân nặng (kg)" | Input number | > 0 |
| Nút "Lưu thay đổi" | Button (primary) | |
| Nút "Hủy" | Button (secondary) | Reset form về giá trị cũ |

**Sau khi lưu thành công:**
- Toast: "Cập nhật thông tin thành công!"

---

#### Màn hình 1.6: Thiết lập mục tiêu sức khỏe (`/profile/goals`)

**Mục đích:** UC06 – Thiết lập mục tiêu dinh dưỡng.

**Thành phần UI:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Trường "Mục tiêu" | Radio hoặc Select | Giảm cân / Tăng cơ / Duy trì |
| Trường "Mức độ vận động" | Select | Thấp / Trung bình / Cao |
| Trường "Cân nặng mục tiêu (kg)" | Input number | |
| Trường "Calo mục tiêu mỗi ngày (kcal)" | Input number | Có thể tự động tính từ thông tin cá nhân |
| Hiển thị gợi ý TDEE | Text (readonly) | Hệ thống tính tự động |
| Nút "Lưu mục tiêu" | Button (primary) | |
| Nút "Hủy" | Button (secondary) | |

**Ghi chú:** Khi người dùng thay đổi mục tiêu hoặc mức vận động, hiển thị ngay gợi ý calo khuyến nghị (tính từ TDEE).

---

### 5.2 MODULE 2 – QUẢN LÝ KẾ HOẠCH BỮA ĂN

---

#### Màn hình 2.1: Lịch kế hoạch bữa ăn theo tuần (`/meal-plan`)

**Mục đích:** UC11 – Xem tổng quan kế hoạch theo tuần.

**Layout:** Trang toàn chiều rộng, hiển thị lịch 7 ngày dạng bảng hoặc lưới.

**Thành phần UI:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Thanh điều hướng tuần | Navigation | Nút ← (tuần trước) | Tiêu đề tuần hiện tại | Nút → (tuần sau) |
| Lưới 7 ngày (Thứ 2 → Chủ nhật) | Grid/Card | Mỗi ngày là 1 card |
| Card ngày có kế hoạch | Card | Hiển thị: Ngày, Tổng calo, Thanh tiến độ % mục tiêu |
| Card ngày trống | Card | Hiển thị: Ngày, Nút "+ Tạo kế hoạch" |

**Nội dung Card ngày có kế hoạch:**
- Tiêu đề ngày (VD: Thứ 2, 01/07)
- Tổng calo (VD: 1850 / 2000 kcal)
- Thanh tiến độ (progress bar) màu sắc theo trạng thái:
  - Xanh lá: đạt 80–110% mục tiêu
  - Vàng: đạt 50–79% hoặc 111–130%
  - Đỏ: < 50% hoặc > 130%
- Nút "Xem chi tiết"

**Hành động:**
- Click vào card ngày có kế hoạch → điều hướng sang `/meal-plan/:date`
- Click nút "+ Tạo kế hoạch" → điều hướng sang `/meal-plan/create?date=...`

---

#### Màn hình 2.2: Chi tiết kế hoạch theo ngày (`/meal-plan/:date`)

**Mục đích:** UC09, UC10, UC12 – Xem, chỉnh sửa, xóa kế hoạch ngày.

**Layout:** Trang 2 khu vực: bên trái là danh sách bữa ăn, bên phải là tóm tắt dinh dưỡng.

**Phần tiêu đề trang:**
- Ngày (VD: Thứ 2, 01/07/2026)
- Nút "← Quay lại lịch"
- Nút "Xóa kế hoạch" (màu đỏ/danger)
- Nút "Lưu làm mẫu"

**Phần danh sách bữa ăn (bên trái):**

Gồm 4 section, mỗi section là một bữa:

**Cấu trúc mỗi Section bữa ăn:**
- Tiêu đề: Bữa Sáng / Bữa Trưa / Bữa Tối / Bữa Phụ
- Tổng calo của bữa (tính tự động)
- Danh sách món ăn trong bữa:
  - Tên món
  - Khẩu phần (gram/ml) – có thể chỉnh sửa trực tiếp
  - Calo của khẩu phần
  - Nút xóa món (icon thùng rác)
- Nút "+ Thêm món" ở cuối mỗi section

**Phần tóm tắt dinh dưỡng (bên phải – sticky):**
- Tổng calo ngày: XX / XX kcal (thực tế / mục tiêu)
- Progress bars cho từng chỉ số:
  - Protein: XX g / XX g
  - Carb: XX g / XX g
  - Chất béo: XX g / XX g
- Biểu đồ donut (tùy chọn) tỉ lệ macro

**Nút hành động dưới cùng:**
- Nút "Cập nhật" (primary) → Lưu thay đổi
- Nút "Hủy thay đổi" (secondary)

---

#### Modal: Thêm món ăn vào bữa

**Mục đích:** UC08 – Tìm kiếm và thêm món vào bữa ăn cụ thể.

**Kích hoạt:** Khi click nút "+ Thêm món" trong một section bữa ăn.

**Thành phần Modal:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Tiêu đề Modal | Heading | VD: "Thêm món vào Bữa Sáng" |
| Ô tìm kiếm | Input search | Tìm kiếm realtime theo tên món |
| Tab gợi ý | Tabs | "Gần đây" / "Yêu thích" / "Tất cả" |
| Danh sách kết quả | List/Card | Mỗi item: tên món, ảnh nhỏ, calo/100g, checkbox chọn |
| Phần nhập khẩu phần | Input group | Hiển thị sau khi chọn món: Trường nhập gram/ml |
| Nút "Thêm vào bữa" | Button (primary) | |
| Nút "Hủy" | Button (secondary) | Đóng modal |

**Lưu ý:** Hỗ trợ chọn nhiều món cùng lúc (multi-select). Mỗi món được chọn hiển thị ô nhập khẩu phần tương ứng.

**Validation:**
- Chưa nhập khẩu phần → "Vui lòng nhập khẩu phần cho tất cả món đã chọn"
- Khẩu phần ≤ 0 hoặc không phải số → "Khẩu phần không hợp lệ"
- Không tìm thấy món → Thông báo "Không tìm thấy món ăn phù hợp"

---

#### Màn hình 2.3: Tạo kế hoạch mới (`/meal-plan/create`)

**Mục đích:** UC07 – Tạo kế hoạch bữa ăn mới cho một ngày.

**Bước 1 – Chọn phương thức tạo:**

Hiển thị 2 card lựa chọn:
- Card "Tạo mới từ đầu" (icon tờ giấy trắng)
- Card "Sử dụng kế hoạch mẫu" (icon template)

**Bước 2a – Nếu chọn "Tạo mới từ đầu":**
- Hiển thị giao diện giống Màn hình 2.2 nhưng tất cả bữa đều trống
- Người dùng thêm món vào từng bữa
- Nút "Lưu kế hoạch" ở cuối

**Bước 2b – Nếu chọn "Sử dụng kế hoạch mẫu":**
- Hiển thị danh sách kế hoạch mẫu đã lưu (tên mẫu, ngày tạo)
- Người dùng chọn 1 mẫu
- Hệ thống điền sẵn các món từ mẫu → người dùng có thể chỉnh sửa thêm
- Nút "Lưu kế hoạch"

**Validation khi lưu:**
- Chưa chọn ngày (nếu không truyền qua query param) → "Vui lòng chọn ngày"

---

#### Modal: Lưu kế hoạch mẫu

**Kích hoạt:** Click nút "Lưu làm mẫu" trên màn hình chi tiết kế hoạch.

**Thành phần:**
- Tiêu đề: "Lưu kế hoạch làm mẫu"
- Trường "Tên mẫu" (Input text, bắt buộc)
- Nút "Lưu" (primary)
- Nút "Hủy" (secondary)

**Validation:**
- Tên mẫu trống → "Tên mẫu không được để trống"
- Tên mẫu đã tồn tại → Hiển thị cảnh báo: "Tên mẫu đã tồn tại. Bạn có muốn ghi đè không?" với nút Ghi đè / Đặt tên khác

---

#### Modal / Dialog: Xóa kế hoạch

**Kích hoạt:** Click nút "Xóa kế hoạch" trên màn hình chi tiết.

**Thành phần:**
- Tiêu đề: "Xác nhận xóa"
- Nội dung: "Bạn có chắc muốn xóa kế hoạch ngày [ngày]? Thao tác này không thể hoàn tác."
- Nút "Xác nhận xóa" (màu đỏ)
- Nút "Hủy" (secondary)

**Sau khi xóa thành công:**
- Toast: "Xóa kế hoạch thành công"
- Chuyển về `/meal-plan`

---

### 5.3 MODULE 3 – QUẢN LÝ MÓN ĂN

---

#### Màn hình 3.1: Thư viện món ăn (`/dishes`)

**Mục đích:** UC13 – Tìm kiếm và xem danh sách món ăn.

**Layout:** Trang toàn chiều rộng, thanh bộ lọc trên, danh sách bên dưới.

**Thanh tìm kiếm & bộ lọc:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Ô tìm kiếm | Input search | Tìm theo tên món |
| Bộ lọc "Danh mục" | Select/Dropdown | Cơm / Canh / Salad / Đồ uống / ... |
| Bộ lọc "Calo" | Range slider hoặc Select | VD: < 200 / 200–400 / 400–600 / > 600 |
| Nút "Tìm kiếm" | Button (primary) | |
| Nút "Xóa bộ lọc" | Button (ghost) | Reset về mặc định |

**Danh sách món ăn:**
- Hiển thị dạng Grid (3–4 cột desktop, 2 cột tablet, 1 cột mobile)
- Mỗi Card món ăn:
  - Ảnh món ăn (hoặc placeholder nếu không có)
  - Tên món
  - Danh mục (badge/tag)
  - Calo / 100g
  - Icon tim (yêu thích) – toggle
  - Khi click → điều hướng sang `/dishes/:id`

**Trạng thái không có kết quả:**
- Thông báo: "Không tìm thấy món ăn phù hợp"
- Gợi ý xóa bộ lọc hoặc thêm món tùy chỉnh

---

#### Màn hình 3.2: Chi tiết món ăn (`/dishes/:id`)

**Layout:** Trang 2 cột: ảnh + thông tin cơ bản bên trái, dinh dưỡng chi tiết bên phải.

**Thành phần:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Ảnh món ăn | Image | Lớn, chiếm 40–50% chiều rộng |
| Tên món ăn | Heading H1 | |
| Danh mục | Badge/Tag | |
| Mô tả (nếu có) | Text | |
| Icon tim yêu thích | Toggle button | Click để lưu/bỏ yêu thích |
| Bảng dinh dưỡng /100g | Table | Calo, Protein, Carb, Chất béo |
| Danh sách nguyên liệu | List | Tên nguyên liệu + khối lượng |
| Nút "Thêm vào kế hoạch" | Button (primary) | Mở modal chọn bữa |

---

#### Màn hình 3.3: Món ăn của tôi (`/my-dishes`)

**Layout:** Tương tự `/dishes` nhưng chỉ hiển thị món do người dùng tự tạo.

**Thành phần bổ sung:**
- Nút "+ Thêm món ăn mới" (nổi bật, góc trên phải)
- Mỗi card có thêm nút "Sửa" và nút "Xóa"

---

#### Màn hình 3.4: Thêm / Sửa món ăn tùy chỉnh (`/my-dishes/create`)

**Mục đích:** UC14 – Thêm món ăn tùy chỉnh.

**Layout:** Form dài, chia theo section.

**Thành phần UI:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Trường "Tên món ăn" | Input text | Bắt buộc |
| Trường "Danh mục" | Select | Cơm / Canh / Salad / Đồ uống / Khác |
| Upload "Ảnh món ăn" | File upload | JPG/PNG, tối đa 5MB |
| Section "Danh sách nguyên liệu" | Dynamic list | |
| — Tên nguyên liệu | Input text | |
| — Khối lượng (g) | Input number | > 0 |
| — Nút xóa nguyên liệu | Icon button | |
| Nút "+ Thêm nguyên liệu" | Button (ghost) | Thêm hàng mới |
| Section "Thông tin dinh dưỡng" (tự động tính) | Readonly fields | Hiển thị sau khi nhập nguyên liệu |
| Nút "Lưu món ăn" | Button (primary) | |
| Nút "Hủy" | Button (secondary) | |

**Validation:**
- Tên món trống → "Vui lòng nhập tên món ăn"
- Không có nguyên liệu → "Vui lòng thêm ít nhất 1 nguyên liệu"
- Khối lượng ≤ 0 → "Khối lượng phải lớn hơn 0"

---

#### Màn hình 3.5: Món ăn yêu thích (`/favorites`)

**Layout:** Tương tự `/dishes`, chỉ hiển thị các món đã đánh dấu yêu thích.

**Nội dung trống:** "Bạn chưa có món ăn yêu thích nào. Hãy khám phá thư viện món ăn!"

---

### 5.4 MODULE 4 – QUẢN TRỊ HỆ THỐNG (ADMIN)

---

#### Màn hình 4.1: Admin Dashboard (`/admin`)

**Layout:** Sidebar trái + nội dung phải. Nội dung hiển thị các KPI card và biểu đồ.

**Thành phần:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| KPI Card: Tổng người dùng | Stat card | Số liệu + % tăng trưởng |
| KPI Card: Người dùng mới tháng này | Stat card | |
| KPI Card: Tổng kế hoạch đã tạo | Stat card | |
| KPI Card: Số món ăn trong hệ thống | Stat card | |
| Biểu đồ người dùng mới theo tháng | Bar chart / Line chart | |
| Bảng món ăn phổ biến nhất | Table | Top 5–10 món |
| Phản hồi chưa xử lý | Badge/Alert | Số phản hồi đang chờ |

---

#### Màn hình 4.2: Quản lý tài khoản người dùng (`/admin/users`)

**Mục đích:** UC16 – Xem, khóa, xóa tài khoản người dùng.

**Thành phần:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Thanh tìm kiếm | Input search | Tìm theo tên, email |
| Bộ lọc trạng thái | Select | Tất cả / Đang hoạt động / Đã khóa |
| Bảng danh sách người dùng | Table | Có phân trang (50 user/trang) |

**Cột bảng người dùng:**
- STT
- Họ tên
- Email
- Ngày tạo tài khoản
- Trạng thái (badge: Hoạt động / Đã khóa)
- Hành động: Nút "Xem" | Nút "Khóa/Mở khóa" | Nút "Xóa"

**Dialog xác nhận Khóa:**
- "Bạn có chắc muốn khóa tài khoản [tên user]? Người dùng này sẽ không thể đăng nhập."
- Nút "Xác nhận Khóa" | Nút "Hủy"

**Dialog xác nhận Xóa:**
- "Bạn có chắc muốn xóa tài khoản [tên user]? Thao tác này không thể hoàn tác."
- Nút "Xác nhận Xóa" (đỏ) | Nút "Hủy"

---

#### Màn hình 4.3: Quản lý danh mục món ăn (`/admin/dishes`)

**Mục đích:** UC17 – Thêm, sửa, xóa món ăn trong hệ thống.

**Thành phần:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Thanh tìm kiếm + bộ lọc danh mục | Input + Select | |
| Nút "+ Thêm món ăn mới" | Button (primary) | Góc trên phải |
| Bảng danh sách món ăn | Table | |

**Cột bảng món ăn:**
- STT
- Ảnh (thumbnail nhỏ)
- Tên món
- Danh mục
- Calo/100g
- Protein/100g
- Carb/100g
- Chất béo/100g
- Hành động: Nút "Sửa" | Nút "Xóa"

**Form Thêm/Sửa món ăn (Modal hoặc trang riêng):**

| Thành phần | Loại |
|---|---|
| Tên món ăn | Input text |
| Danh mục | Select |
| Upload ảnh | File upload (JPG/JPEG/PNG, max 5MB) |
| Calo / 100g | Input number |
| Protein / 100g | Input number |
| Carb / 100g | Input number |
| Chất béo / 100g | Input number |
| Danh sách nguyên liệu | Dynamic list |
| Nút Lưu / Hủy | Buttons |

---

#### Màn hình 4.4: Thống kê hệ thống (`/admin/stats`)

**Mục đích:** UC18 – Xem các chỉ số hoạt động của hệ thống.

**Thành phần:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Bộ chọn khoảng thời gian | Date range picker | VD: 7 ngày / 30 ngày / 3 tháng / Tùy chỉnh |
| Biểu đồ người dùng mới theo ngày/tháng | Line chart | |
| Biểu đồ số kế hoạch được tạo | Bar chart | |
| Bảng Top 10 món ăn được dùng nhiều nhất | Table | Tên món + số lần xuất hiện trong kế hoạch |
| Tổng số người dùng | Stat card | |
| Người dùng mới trong kỳ | Stat card | |
| Tổng kế hoạch trong kỳ | Stat card | |

---

#### Màn hình 4.5: Quản lý phản hồi người dùng (`/admin/feedbacks`)

**Mục đích:** UC19 – Xem và xử lý phản hồi từ người dùng.

**Thành phần:**

| Thành phần | Loại | Ghi chú |
|---|---|---|
| Bộ lọc trạng thái | Tabs hoặc Select | Tất cả / Chưa xử lý / Đang xử lý / Đã xử lý |
| Danh sách phản hồi | List/Table | Sắp xếp mặc định theo thời gian mới nhất |

**Mỗi item phản hồi hiển thị:**
- Tên người gửi + Email
- Ngày gửi
- Nội dung tóm tắt (truncate 100 ký tự)
- Badge trạng thái: Chưa xử lý (đỏ, in đậm) / Đang xử lý (vàng) / Đã xử lý (xanh)
- Nút "Xem chi tiết"

**Modal chi tiết phản hồi:**
- Nội dung đầy đủ của phản hồi
- Thông tin người gửi
- Dropdown cập nhật trạng thái: Chưa xử lý / Đang xử lý / Đã xử lý
- Ô "Ghi chú của Admin" (textarea)
- Nút "Lưu" | Nút "Đóng"

**Lưu ý:** Admin chỉ được thay đổi trạng thái và ghi chú, không được sửa nội dung phản hồi.

---

## 6. Dashboard người dùng (`/dashboard`)

**Layout:** Trang tổng quan sau khi đăng nhập.

**Thành phần:**

| Thành phần | Ghi chú |
|---|---|
| Lời chào (VD: "Xin chào, [Tên]!") | |
| KPI hôm nay: Tổng calo nạp vào / Mục tiêu | Progress bar |
| KPI hôm nay: Protein / Carb / Chất béo | 3 mini progress bars |
| Card "Kế hoạch hôm nay" | Tóm tắt 4 bữa ăn, nút "Xem chi tiết" |
| Card "Kế hoạch tuần này" | Mini calendar, ngày nào có kế hoạch thì đánh dấu |
| Card "Gợi ý điều chỉnh" | Nếu chưa đạt mục tiêu → hiển thị gợi ý |
| Shortcut buttons | "Tạo kế hoạch hôm nay" / "Tìm món ăn" |

---

## 7. Thông báo và Feedback UI

### 7.1 Toast Notifications

Hiển thị ở góc trên phải màn hình, tự động ẩn sau 3–5 giây.

| Loại | Màu | Ví dụ |
|---|---|---|
| Success | Xanh lá | "Lưu thành công!" |
| Error | Đỏ | "Đã xảy ra lỗi. Vui lòng thử lại." |
| Warning | Vàng | "Bạn chưa đạt mục tiêu calo hôm nay." |
| Info | Xanh dương | "Kế hoạch mẫu đã được tải." |

### 7.2 Confirmation Dialogs

Sử dụng cho các hành động không thể hoàn tác (xóa kế hoạch, khóa tài khoản, xóa món ăn). Luôn có 2 nút: Xác nhận (primary/danger) và Hủy (secondary).

### 7.3 Loading States

- Skeleton loader khi tải danh sách
- Spinner khi submit form
- Vô hiệu hóa nút submit khi đang xử lý

### 7.4 Empty States

- Khi không có dữ liệu: hiển thị icon minh họa + văn bản mô tả + nút hành động gợi ý

---

## 8. Màu sắc & Design tokens (gợi ý cho Stitch)

| Token | Giá trị gợi ý | Mô tả |
|---|---|---|
| Primary color | `#4CAF50` (xanh lá) | Màu chính, nút primary |
| Secondary color | `#2196F3` (xanh dương) | Màu phụ |
| Danger color | `#F44336` (đỏ) | Xóa, cảnh báo |
| Warning color | `#FF9800` (cam) | Cảnh báo nhẹ |
| Success color | `#4CAF50` | Thành công |
| Background | `#F5F5F5` | Nền trang |
| Card background | `#FFFFFF` | Nền card |
| Text primary | `#212121` | |
| Text secondary | `#757575` | |
| Border | `#E0E0E0` | |

---

## 9. Tóm tắt danh sách tất cả màn hình

| STT | Màn hình | Route | Module |
|---|---|---|---|
| 1 | Trang chủ / Giới thiệu | `/` | — |
| 2 | Đăng ký | `/register` | M1 |
| 3 | Đăng nhập | `/login` | M1 |
| 4 | Quên mật khẩu | `/forgot-password` | M1 |
| 5 | Đặt lại mật khẩu | `/reset-password` | M1 |
| 6 | Hồ sơ cá nhân | `/profile` | M1 |
| 7 | Thiết lập mục tiêu | `/profile/goals` | M1 |
| 8 | Dashboard | `/dashboard` | — |
| 9 | Lịch kế hoạch tuần | `/meal-plan` | M2 |
| 10 | Chi tiết kế hoạch ngày | `/meal-plan/:date` | M2 |
| 11 | Tạo kế hoạch mới | `/meal-plan/create` | M2 |
| 12 | Thư viện món ăn | `/dishes` | M3 |
| 13 | Chi tiết món ăn | `/dishes/:id` | M3 |
| 14 | Món ăn của tôi | `/my-dishes` | M3 |
| 15 | Thêm/sửa món tùy chỉnh | `/my-dishes/create` | M3 |
| 16 | Món ăn yêu thích | `/favorites` | M3 |
| 17 | Admin Dashboard | `/admin` | M4 |
| 18 | Quản lý người dùng | `/admin/users` | M4 |
| 19 | Quản lý món ăn | `/admin/dishes` | M4 |
| 20 | Thống kê hệ thống | `/admin/stats` | M4 |
| 21 | Quản lý phản hồi | `/admin/feedbacks` | M4 |

---

*Tài liệu này mô tả đầy đủ các màn hình, thành phần UI và luồng điều hướng phục vụ cho việc triển khai giao diện frontend bằng Google Stitch.*
