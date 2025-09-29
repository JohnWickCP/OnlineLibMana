# Hướng dẫn cài đặt và chạy dự án Next.js

## Yêu cầu hệ thống

- **Node.js** phiên bản 18.17 trở lên
- **Yarn** package manager
- **Visual Studio Code** (khuyến nghị)
- **Git** (để clone dự án)

---

## Bước 1: Cài đặt Visual Studio Code

### Windows
1. Truy cập [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Tải xuống bản cài đặt cho Windows
3. Chạy file `.exe` và làm theo hướng dẫn cài đặt
4. Chọn các tùy chọn:
   - ✅ Add "Open with Code" action to Windows Explorer file context menu
   - ✅ Add "Open with Code" action to Windows Explorer directory context menu
   - ✅ Add to PATH

### macOS
1. Truy cập [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Tải xuống bản cài đặt cho macOS
3. Mở file `.dmg` và kéo Visual Studio Code vào thư mục Applications
4. Mở VS Code và cài đặt command line tool:
   - Nhấn `Cmd + Shift + P`
   - Gõ "shell command"
   - Chọn "Shell Command: Install 'code' command in PATH"

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install software-properties-common apt-transport-https wget
wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
sudo apt update
sudo apt install code
```

---

## Bước 2: Cài đặt Node.js và Yarn

### Windows
1. Tải và cài đặt Node.js từ [https://nodejs.org/](https://nodejs.org/) (phiên bản LTS)
2. Mở Command Prompt hoặc PowerShell và cài đặt Yarn:
```bash
npm install -g yarn
```
3. Kiểm tra cài đặt:
```bash
node --version
yarn --version
```

### macOS
```bash
# Cài đặt Homebrew (nếu chưa có)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài đặt Node.js và Yarn
brew install node
brew install yarn

# Kiểm tra
node --version
yarn --version
```

### Linux (Ubuntu/Debian)
```bash
# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn

# Kiểm tra
node --version
yarn --version
```

---

## Bước 3: Cài đặt Git

### Windows
1. Tải Git từ [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Chạy file cài đặt và làm theo hướng dẫn
3. Kiểm tra: `git --version`

### macOS
```bash
# Cài qua Homebrew
brew install git

# Hoặc cài qua Xcode Command Line Tools
xcode-select --install
```

### Linux
```bash
sudo apt update
sudo apt install git
```

---

## Bước 4: Clone dự án từ GitHub

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd <project-folder>

# Mở dự án trong VS Code
code .
```

---

## Bước 5: Cài đặt Dependencies

⚠️ **Quan trọng**: Dự án này sử dụng Yarn package manager.

Mở terminal trong VS Code (`Ctrl + ~` hoặc `Cmd + ~`) và chạy:

```bash
yarn install
```

**Lưu ý**: 
- **KHÔNG** sử dụng `npm install`
- Luôn sử dụng `yarn` để đảm bảo tính nhất quán của dependencies
- File `yarn.lock` đảm bảo tất cả người dùng có cùng phiên bản dependencies

---

## Bước 6: Cài đặt Extensions cho VS Code (Khuyến nghị)

Nhấn `Ctrl + Shift + X` (Windows/Linux) hoặc `Cmd + Shift + X` (macOS) và cài đặt:

1. **ES7+ React/Redux/React-Native snippets** - Snippets cho React
2. **Prettier - Code formatter** - Format code tự động
3. **ESLint** - Kiểm tra lỗi JavaScript/TypeScript
4. **Auto Rename Tag** - Tự động đổi tên tag HTML
5. **Path Intellisense** - Tự động hoàn thành đường dẫn file
6. **GitLens** - Công cụ Git nâng cao

---

## Bước 7: Chạy Development Server

```bash
yarn dev
```

Server sẽ chạy tại: [http://localhost:3000](http://localhost:3000)

Mở trình duyệt và truy cập địa chỉ trên để xem kết quả.

---

## Cấu trúc thư mục dự án

```
project-name/
├── app/
│   ├── page.js          # Trang chủ
│   ├── layout.js        # Layout chính
│   └── globals.css      # CSS toàn cục
├── public/              # Static files (images, fonts, icons...)
├── node_modules/        # Dependencies (không commit lên Git)
├── .next/               # Build output (không commit lên Git)
├── package.json         # Cấu hình project
├── yarn.lock            # Lock file của Yarn (commit lên Git)
├── next.config.js       # Cấu hình Next.js
├── .gitignore           # Files/folders không commit
└── README.md            # File này
```

---

## Các lệnh thường dùng

```bash
# Cài đặt dependencies
yarn install

# Chạy development server
yarn dev

# Build production
yarn build

# Chạy production server (sau khi build)
yarn start

# Kiểm tra lỗi code
yarn lint

# Thêm package mới
yarn add <package-name>

# Thêm dev dependency
yarn add -D <package-name>

# Xóa package
yarn remove <package-name>
```

---

## Chỉnh sửa và phát triển

1. Mở file `app/page.js` trong VS Code
2. Thực hiện thay đổi code
3. Lưu file (`Ctrl + S` hoặc `Cmd + S`)
4. Trình duyệt sẽ tự động refresh (Hot Reload)

### Font tối ưu
Dự án sử dụng [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) để tự động tối ưu và load font [Geist](https://vercel.com/font).

---

## Quy trình làm việc với Git

```bash
# Tạo branch mới cho feature
git checkout -b feature/ten-tinh-nang

# Xem thay đổi
git status

# Add files
git add .

# Commit
git commit -m "Mô tả thay đổi"

# Push lên GitHub
git push origin feature/ten-tinh-nang

# Tạo Pull Request trên GitHub
```

---

## Deploy lên Vercel

Cách dễ nhất để deploy Next.js app là sử dụng [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Bước deploy:

1. Tạo tài khoản tại [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import repository từ GitHub
4. Vercel tự động nhận diện Next.js và cấu hình build
5. Click "Deploy"

Xem chi tiết: [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying)

---

## Xử lý lỗi thường gặp

### ❌ Port 3000 đã được sử dụng

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### ❌ Module not found hoặc dependency conflict

```bash
# Xóa node_modules và yarn.lock
rm -rf node_modules yarn.lock

# Cài đặt lại
yarn install
```

### ❌ Lỗi cache Next.js

```bash
# Xóa thư mục .next
rm -rf .next

# Chạy lại dev server
yarn dev
```

### ❌ Yarn command not found

```bash
# Cài đặt lại Yarn globally
npm install -g yarn
```

---

## Tài nguyên học tập

- [Next.js Documentation](https://nextjs.org/docs) - Tài liệu chính thức của Next.js
- [Learn Next.js](https://nextjs.org/learn) - Tutorial tương tác từ cơ bản đến nâng cao
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Source code và community
- [Yarn Documentation](https://yarnpkg.com/) - Tài liệu Yarn package manager

---

## Contributing

Nếu bạn muốn đóng góp cho dự án:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

---

## License

[Thêm license của dự án ở đây]

---

## Liên hệ

[Thêm thông tin liên hệ hoặc link đến team/organization]

---

**Lưu ý**: Luôn đảm bảo file `yarn.lock` được commit lên Git để đảm bảo tất cả thành viên trong team sử dụng cùng phiên bản dependencies.