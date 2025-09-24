# Thư viện Điện tử (Digital Library)

Hệ thống thư viện điện tử được phát triển bằng **Spring Boot 3.4.5**, cung cấp các tính năng:

- 🔐 **Quản lý tài khoản & bảo mật**: Spring Security + JWT Authentication
- 📊 **Quản lý dữ liệu**: Spring Data JPA + MySQL Database
- 📧 **Gửi email tự động**: SMTP Integration
- 🌐 **API RESTful**: Thiết kế RESTful API standards
- ⚡ **Tối ưu code**: MapStruct + Lombok để giảm boilerplate code

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Java | 21 | Ngôn ngữ lập trình chính |
| Spring Boot | 3.4.5 | Framework chính |
| Spring Security | - | Authentication & Authorization |
| Spring Data JPA | - | Data Access Layer |
| MySQL | - | Database |
| MapStruct | - | Object Mapping |
| Lombok | - | Code Generation |
| Maven | - | Build Tool & Dependency Management |

## 📂 Cấu trúc thư mục

```
Project1/
├── .idea/              # IntelliJ IDEA configuration
├── .mvn/               # Maven wrapper files
├── src/                # Source code
│   ├── main/
│   └── test/
├── target/             # Build output
├── .env                # Environment variables (local)
├── .env.example        # Environment template
├── .gitattributes      # Git attributes
├── .gitignore          # Git ignore rules
├── HELP.md             # Spring Boot help
├── mvnw                # Maven wrapper (Unix)
├── mvnw.cmd            # Maven wrapper (Windows)
├── pom.xml             # Maven configuration
└── README.md           # Project documentation
```

## ⚙️ Cấu hình môi trường

### 1. Tạo file `.env`

Sao chép từ template và điền thông tin:

```bash
cp .env.example .env
```

### 2. Nội dung file `.env.example`:

```properties
# Database Configuration
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_URL=jdbc:mysql://127.0.0.1:3306/Project1?createDatabaseIfNotExist=true

# Email Configuration
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_email_app_password

# JWT Configuration
JWT_SIGNER_KEY=your_secret_key_minimum_32_characters
JWT_VALID_DURATION=3600
JWT_REFRESHABLE_DURATION=36000
```

### 3. Nạp biến môi trường

**Linux/macOS:**
```bash
export $(cat .env | xargs)
```

**Windows PowerShell:**
```powershell
Get-Content .env | ForEach-Object {
    if ($_ -match "^(.*?)=(.*)$") {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}
```

## 🚀 Chạy ứng dụng

### Phương pháp 1: Chạy trực tiếp với Maven
```bash
mvn spring-boot:run
```

### Phương pháp 2: Build JAR và chạy

**Bước 1: Build JAR file**
```bash
mvn clean package -DskipTests
```

**Bước 2: Chạy JAR file**
```bash
java -jar target/Project1-0.0.1-SNAPSHOT.jar
```

## 🧪 Testing

### Chạy tất cả test cases:
```bash
mvn test
```

### Chạy test với coverage report:
```bash
mvn test jacoco:report
```

## 🔧 Development

### Prerequisites
- Java 21 trở lên
- MySQL Server 8.0+
- Maven 3.6+
- IDE hỗ trợ Spring Boot (IntelliJ IDEA, VS Code, Eclipse)

### Chạy môi trường development:
```bash
# Khởi động MySQL service
sudo service mysql start

# Nạp biến môi trường
source .env

# Chạy ứng dụng
mvn spring-boot:run
```

## 📋 API Documentation

Sau khi khởi động ứng dụng, truy cập:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phát hành dưới [MIT License](LICENSE).

---

**Phát triển bởi**: [Tên nhóm/cá nhân]  
**Liên hệ**: [email@example.com]