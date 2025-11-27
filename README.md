# Online Library Management System

Hệ thống quản lý thư viện trực tuyến hiện đại, hỗ trợ tìm kiếm, đọc sách online và quản lý kho sách cá nhân.

Live Demo: https://onlinelibmana.online

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Đóng góp](#đóng-góp)
- [Team Members](#team-members)
- [License](#license)

## Giới thiệu

**Online Library Management** là hệ thống quản lý thư viện trực tuyến được xây dựng với mục tiêu:

- Cung cấp nền tảng đọc sách trực tuyến tiện lợi
- Tìm kiếm và khám phá sách nhanh chóng
- Quản lý kho sách cá nhân (bookshelf)
- Phân quyền người dùng rõ ràng
- Dashboard thống kê dành cho Admin

Dự án được phát triển bởi nhóm 4 sinh viên nhằm học tập và thực hành các công nghệ web hiện đại.

## Tính năng

### Người dùng thường
- Đăng ký / Đăng nhập (JWT + Magic Link qua email)
- Tìm kiếm sách theo tên, tác giả, thể loại, năm xuất bản
- Đọc sách online 
- Kệ sách cá nhân: thêm/xóa sách, theo dõi tiến độ đọc
- Đánh giá sao 

### Admin
- Dashboard tổng quan: thống kê người dùng, sách, lượt đọc
- Quản lý sách (CRUD + upload bìa)
- Quản lý người dùng, phân quyền, khóa tài khoản
- Báo cáo sách được đọc nhiều nhất, người dùng active

## Công nghệ sử dụng

### Frontend
| Công nghệ         | Version | Mô tả                               |
|-------------------|---------|-------------------------------------|
| Next.js           | 14.x    | React framework (App Router)        |
| React             | 18.x    | Thư viện giao diện                  |
| Tailwind CSS      | 3.x     | Utility-first CSS                   |
| Axios             | 1.x     | HTTP client                         |
| React Hook Form   | latest  | Form validation                     |
| Zustand           | latest  | Lightweight state management        |

### Backend
| Công nghệ         | Version | Mô tả                               |
|-------------------|---------|-------------------------------------|
| Java              | 21      | Ngôn ngữ chính                      |
| Spring Boot       | 3.x     | Framework backend                   |
| Spring Security   | -       | Xác thực & phân quyền               |
| Spring Data JPA   | -       | ORM                                 |
| JWT               | -       | Token authentication                |
| Maven             | 3.9+    | Quản lý dependency & build          |

### Database & DevOps
- **MySQL 8.0** (có thể dùng local hoặc AWS RDS MySQL)
- AWS EC2 + Nginx + Let's Encrypt + GitHub Actions + PM2 + Systemd

## Cấu trúc dự án

```
OnlineLibMana/
├── backend/                    # Spring Boot
│   ├── src/main/java/com/onlinelibmana/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── config/
│   │   └── OnlineLibManaApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── static/
│   ├── pom.xml
│   └── .env
│
├── frontend/                   # Next.js 14 (App Router)
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (user)/
│   │   ├── (admin)/
│   │   └── layout.tsx
│   ├── components/
│   ├── public/
│   ├── styles/
│   ├── next.config.js
│   ├── package.json
│   └── .env.local
│
├── .github/workflows/           # CI/CD GitHub Actions
├── .gitignore
└── README.md
```

## Kiến trúc hệ thống

```
Internet
   ↓
Domain: onlinelibmana.online → Elastic IP
   ↓
Nginx (443) → SSL + Reverse Proxy
   ├── /api/*             → Backend Spring Boot (:8080)
   ├── /magic/login/*     → Backend (:8080)
   └── /*                 → Frontend Next.js (:3000)
         ↓
       MySQL (local hoặc AWS RDS)
```

## Cài đặt và chạy dự án

### Yêu cầu
- Java 21+
- Node.js 18+
- Maven 3.9+
- MySQL 8.0+

### Các bước chạy local

```bash
# 1. Clone và chuyển sang nhánh develop
git clone https://github.com/JohnWickCP/OnlineLibMana.git
cd OnlineLibMana
git checkout develop

# 2. Backend (Spring Boot)
cd backend

# Tạo file .env (copy từ .env.example nếu có)
cat > .env << EOF
DB_URL=jdbc:mysql://localhost:3306/onlinelib?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
JWT_SECRET=your_very_long_random_secret_key_here_min_256_bits
SERVER_PORT=8080
EOF

mvn clean install
mvn spring-boot:run
# → http://localhost:8080
```

```bash
# 3. Frontend (Next.js)
cd ../frontend

yarn install
# hoặc npm install

cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF

yarn dev
# → http://localhost:3000
```

```sql
-- 4. Tạo database MySQL
CREATE DATABASE onlinelib CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Spring Boot sẽ tự tạo bảng khi khởi động (Hibernate)
```

## Quy trình phát triển

- `main` → Production (auto deploy)
- `develop` → Development (nhánh chính để làm việc)

```bash
git checkout develop
git pull origin develop
git checkout -b feature/ten-tinh-nang-ngan-gon
```


## API Documentation

Swagger UI (khi chạy local): http://localhost:8080/swagger-ui.html  

Một số endpoint chính:

| Method | Endpoint                  | Mô tả                     | Quyền       |
|--------|---------------------------|---------------------------|-------------|
| POST   | /api/auth/register        | Đăng ký                   | Public      |
| POST   | /api/auth/login           | Đăng nhập                 | Public      |
| GET    | /api/books                | Danh sách sách            | Public      |
| GET    | /api/books/{id}           | Chi tiết sách             | Public      |
| POST   | /api/books                | Thêm sách                 | Admin       |

## Deployment

GitHub Actions tự động build + deploy lên EC2 khi merge vào `main`.

## Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp!

1. Fork repository
2. Tạo branch: `feature/xxx` hoặc `fix/xxx`
3. Commit theo convention commit ở trên
4. Mở Pull Request vào nhánh `develop`

## Team Members

| STT | Thành viên                          | Mã sinh viên | Vai trò                | GitHub |
|-----|-------------------------------------|--------------|--------------------------------|--------|
| 1   | Cao Xuân Phồn                        | 223630701     | Leader & DevOps            | [@JohnWickCP](https://github.com/JohnWickCP) |
| 2   | Nguyễn Trọng Hiển                    | 223630689     | Backend Developer              | [@BaggioHin](https://github.com/BaggioHin)     |
| 3   | DƯƠNG TRUNG HIẾU                     | 223630690      | Tester            | [@Kenge-cyber](https://github.com/Kenge-cyber)         |
| 4   | HỒ KHẮC NHẬT                          | 223630700     | UI/UX & Frontend Developer            | [@khacnhat](https://github.com/khacnhat2k3)     |

## License

Dự án được phát hành dưới **MIT License** – bạn có thể sử dụng, chỉnh sửa, phân phối tự do.

```text
MIT License

Copyright (c) 2025 Online Library Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
