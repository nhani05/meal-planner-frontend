# Documentation — Meal Planner System (Backend)

> Thư mục tài liệu chuẩn cho dự án Spring Boot. Các tài liệu ở đây được dùng để **Frontend Developer** hiểu rõ API, schema và kế hoạch triển khai.

---

## 📂 Cấu trúc thư mục

```
docs/
├── README.md                          # File này — Index & hướng dẫn
├── API.md                             # Tài liệu API Endpoints đầy đủ (request/response/enum)
├── OPENAPI.yaml                       # OpenAPI 3.0 Specification — import vào Swagger UI
├── POSTMAN_COLLECTION.json            # Postman Collection — test API nhanh
├── database/
│   └── ENTITY_DOCUMENTATION.md        # Mô tả chi tiết các Entity & bảng CSDL
└── planning/
    ├── IMPLEMENTATION_PLAN.md         # Kế hoạch triển khai tổng thể & trạng thái
    ├── IMPLEMENTATION_DOCUMENT.md     # Tài liệu thiết kế chi tiết (ERD, bảng, rule)
    └── BACKEND_COMPLETION_PLAN.md     # Lịch sử kế hoạch hoàn thiện các endpoint
```

---

## 🚀 Hướng dẫn sử dụng cho Frontend Developer

### 1. Tìm hiểu API

| Nhu cầu | File tham khảo |
|---|---|
| Xem danh sách endpoint, method, auth, request/response | `API.md` |
| Import spec vào Swagger/Swagger UI | `OPENAPI.yaml` |
| Test trực tiếp trên Postman | `POSTMAN_COLLECTION.json` |

### 2. Hiểu Schema & Entity

| Nhu cầu | File tham khảo |
|---|---|
| Cấu trúc bảng, khóa chính, quan hệ | `database/ENTITY_DOCUMENTATION.md` |
| Chi tiết thiết kế hệ thống | `planning/IMPLEMENTATION_DOCUMENT.md` |

### 3. Theo dõi tiến độ

| Nhu cầu | File tham khảo |
|---|---|
| Trạng thái triển khai các phase | `planning/IMPLEMENTATION_PLAN.md` |
| Lịch sử endpoint đã hoàn thành | `planning/BACKEND_COMPLETION_PLAN.md` |

---

## 🔗 Liên kết nhanh

- [API Endpoints](./API.md)
- [OpenAPI Spec](./OPENAPI.yaml)
- [Postman Collection](./POSTMAN_COLLECTION.json)
- [Entity Documentation](./database/ENTITY_DOCUMENTATION.md)
- [Implementation Plan](./planning/IMPLEMENTATION_PLAN.md)
- [Implementation Document](./planning/IMPLEMENTATION_DOCUMENT.md)
- [Backend Completion History](./planning/BACKEND_COMPLETION_PLAN.md)

---

> **Lưu ý:** Tất cả tài liệu API được đồng bộ với code backend tại nhánh `main`. Nếu phát hiện sai lệch, vui lòng tạo issue hoặc PR.
