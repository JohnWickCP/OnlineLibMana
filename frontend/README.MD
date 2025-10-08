# Hướng dẫn cài đặt dự án Next.js

## Yêu cầu hệ thống

- Node.js 18.17+
- Yarn package manager
- Git

## Cài đặt nhanh

### 1. Cài đặt công cụ cần thiết

**Windows:**
- Tải [Node.js](https://nodejs.org/) (phiên bản LTS)
- Tải [Git](https://git-scm.com/download/win)
- Cài Yarn: `npm install -g yarn`

**macOS:**
```bash
brew install node yarn git
```

**Linux:**
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Yarn
npm install -g yarn

# Git
sudo apt install git
```

### 2. Clone và cài đặt dự án

```bash
# Clone dự án
git clone <repository-url>
cd <project-folder>

# Cài đặt dependencies
yarn install
```

### 3. Chạy dự án

```bash
yarn dev
```

Mở trình duyệt tại: **http://localhost:3000**

## Các lệnh thường dùng

```bash
yarn dev          # Chạy development server
yarn build        # Build production
yarn start        # Chạy production server
yarn lint         # Kiểm tra lỗi code
yarn add <pkg>    # Thêm package mới
```

## Cấu trúc dự án

```
├── app/              # Pages và layouts
├── public/           # Static files
├── package.json      # Cấu hình dự án
└── yarn.lock         # Lock file (commit lên Git)
```

## Lưu ý quan trọng

⚠️ **Luôn dùng `yarn` thay vì `npm`**

⚠️ **Commit file `yarn.lock` lên Git**

## Xử lý lỗi

**Port 3000 đã dùng:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Lỗi dependencies:**
```bash
rm -rf node_modules yarn.lock
yarn install
```

## Deploy

Deploy nhanh lên [Vercel](https://vercel.com):
1. Kết nối GitHub repository
2. Click Deploy
3. Xong!

## Tài liệu

- [Next.js Docs](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Yarn Docs](https://yarnpkg.com/)

---

