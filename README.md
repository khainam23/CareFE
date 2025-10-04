# CareFE - React + Vite Clean Architecture

## 📋 Mô tả dự án
Dự án React sử dụng Vite với clean architecture, được thiết kế để dễ dàng mở rộng và bảo trì.

## 🛠️ Công nghệ sử dụng
- **React 18** - Thư viện UI
- **Vite** - Build tool
- **Tailwind CSS** - CSS framework
- **React Router v6** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Lucide React** - Icons

## 📁 Cấu trúc thư mục

```
CareFE/
├── public/
│   └── assets/          # Static assets
├── src/
│   ├── api/             # API configuration
│   ├── assets/          # Images, icons, fonts
│   ├── components/      # React components
│   │   ├── common/      # Reusable components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom hooks
│   ├── services/        # Business logic & API calls
│   ├── store/           # State management
│   ├── utils/           # Utility functions
│   ├── constants/       # Constants
│   ├── routes/          # Route configuration
│   └── styles/          # Global styles
├── .env.example         # Environment variables template
└── vite.config.js       # Vite configuration
```

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

## 🔧 Cấu hình

### Environment Variables
Copy file `.env.example` thành `.env` và cập nhật các giá trị:

```env
VITE_API_BASE_URL=your_api_url
VITE_APP_NAME=your_app_name
```

## 📚 Tài liệu
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)

## 👨‍💻 Phát triển
Dự án sử dụng clean architecture để tách biệt các concerns:
- **Presentation Layer**: Components, Pages
- **Business Logic Layer**: Services, Hooks
- **Data Layer**: API, Store

## 📄 License
MIT
