# API Integration Guide - CareFE

## 🎯 Tổng quan

Frontend CareFE đã được tích hợp hoàn chỉnh với backend Care. Tài liệu này hướng dẫn cách sử dụng và test các tính năng.

## 🔧 Cấu hình

### 1. Environment Variables
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Nội dung file `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=CareFE
VITE_APP_ENV=development
```

### 2. Khởi động Backend
Đảm bảo backend Care đang chạy tại `http://localhost:8080`

### 3. Khởi động Frontend
```bash
npm install
npm run dev
```

## 📚 Cấu trúc API Integration

### Services Layer
```
src/services/
├── authService.js          # Authentication APIs
├── customerService.js      # Customer APIs  
├── caregiverService.js     # Caregiver APIs
├── adminService.js         # Admin APIs
├── supportService.js       # Support APIs
├── notificationService.js  # Notification APIs
└── index.js               # Export all services
```

### State Management
```
src/store/
├── authStore.js           # Authentication state
├── notificationStore.js   # Notifications state
└── index.js              # Export all stores
```

### Custom Hooks
```
src/hooks/
├── useAuth.js            # Authentication hook
├── useApi.js             # API calls hook
└── index.js              # Export all hooks
```

## 🚀 Cách sử dụng

### 1. Authentication

#### Đăng nhập
```javascript
import { useAuthStore } from '../store/authStore';

const { login, loading } = useAuthStore();

const handleLogin = async () => {
  try {
    const response = await login({
      email: 'admin@careservice.com',
      password: 'admin123'
    });
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Đăng ký Customer
```javascript
const { registerCustomer } = useAuthStore();

const handleRegisterCustomer = async () => {
  try {
    const response = await registerCustomer({
      email: 'customer@example.com',
      password: 'password123',
      fullName: 'Nguyễn Văn A',
      phoneNumber: '0901234567',
      address: '123 ABC Street'
    });
    console.log('Registration successful:', response);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

#### Đăng ký Caregiver
```javascript
const { registerCaregiver } = useAuthStore();

const handleRegisterCaregiver = async () => {
  try {
    const response = await registerCaregiver({
      email: 'caregiver@example.com',
      password: 'password123',
      fullName: 'Trần Thị B',
      phoneNumber: '0912345678',
      address: '456 XYZ Street',
      idCardNumber: '079123456789',
      bio: 'Experienced caregiver',
      skills: 'Elder care, nursing',
      yearsOfExperience: 5
    });
    console.log('Registration successful:', response);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### 2. API Calls với Services

#### Customer Service
```javascript
import { customerService } from '../services';

// Tìm kiếm caregivers
const caregivers = await customerService.searchCaregivers({
  location: 'Hanoi',
  skills: 'elder care'
});

// Tạo booking
const booking = await customerService.createBooking({
  caregiverId: 1,
  startTime: '2024-01-01T09:00:00',
  endTime: '2024-01-01T17:00:00',
  notes: 'Need help with daily activities'
});
```

#### Caregiver Service
```javascript
import { caregiverService } from '../services';

// Lấy bookings
const bookings = await caregiverService.getBookings();

// Chấp nhận booking
await caregiverService.acceptBooking(bookingId);

// Hoàn thành booking
await caregiverService.completeBooking(bookingId);
```

### 3. Sử dụng Custom Hooks

#### useAuth Hook
```javascript
import { useAuth } from '../hooks';

function MyComponent() {
  const { user, isAuthenticated, login, logout, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <h1>Welcome, {user.fullName}</h1>
      {hasRole('ROLE_ADMIN') && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### useApi Hook
```javascript
import { useApi } from '../hooks';
import { customerService } from '../services';

function CaregiverList() {
  const { data: caregivers, loading, error, refetch } = useApi(
    () => customerService.searchCaregivers(),
    [] // dependencies
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {caregivers?.data?.map(caregiver => (
        <div key={caregiver.id}>{caregiver.fullName}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

## 🧪 Testing API

### 1. Test Connection
```javascript
import { runApiTests } from '../utils/apiTest';

// Chạy trong console
runApiTests();
```

### 2. Test Components
- Truy cập `/login` để test đăng nhập
- Truy cập `/signup` để test đăng ký
- Sử dụng component `<ApiTester />` để test tất cả APIs
- Tài khoản test có sẵn trong database:
  - **Admin:** `admin@careservice.com` / `admin123`
  - **Support:** `support@careservice.com` / `support123`
  - **Customer:** `customer@example.com` / `customer123`
  - **Caregiver:** `caregiver@example.com` / `caregiver123`

### 3. CORS Configuration
Backend đã được cấu hình để cho phép CORS từ:
- `http://localhost:3000` (React default)
- `http://localhost:4200` (Angular default)
- `http://localhost:5173` (Vite default)

Nếu frontend chạy trên port khác, cần cập nhật `SecurityConfig.java`

## 🔍 Debugging

### 1. Check Network Tab
- Mở Developer Tools > Network
- Xem các API calls và responses
- Kiểm tra status codes và error messages

### 2. Console Logs
- Services tự động log requests và responses
- Check console để xem chi tiết lỗi

### 3. Common Issues

#### CORS Error
```javascript
// Backend cần cấu hình CORS cho localhost:5173
// Hoặc thay đổi port frontend trong vite.config.js
```

#### 401 Unauthorized
```javascript
// Token hết hạn hoặc không hợp lệ
// Logout và login lại
```

#### 404 Not Found
```javascript
// Kiểm tra endpoint URL
// Đảm bảo backend đang chạy
```

## 📝 Validation

### Form Validation
```javascript
import { validateCustomerForm, validateCaregiverForm } from '../utils/validation';

const validation = validateCustomerForm(formData);
if (!validation.isValid) {
  setErrors(validation.errors);
  return;
}
```

### Available Validators
- `validateEmail(email)`
- `validatePhone(phone)` - Vietnamese format
- `validatePassword(password)` - Min 6 chars
- `validateFullName(name)` - 2-100 chars
- `validateIdCard(idCard)` - 9-12 digits
- `validateRequired(value)`

## 🎨 UI Components

### Form Components
- Tất cả form components đã được cập nhật để sử dụng real API
- Error handling và loading states
- Validation feedback

### Dashboard
- Role-based content display
- Real-time notifications
- User profile information

## 🔄 Next Steps

1. **File Upload**: Implement file upload cho avatar, CCCD, CV
2. **Real-time**: WebSocket cho notifications
3. **Caching**: Implement caching với React Query
4. **Error Boundary**: Global error handling
5. **Testing**: Unit tests cho services và components

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra backend có đang chạy không
2. Xem console logs để debug
3. Kiểm tra network requests trong DevTools
4. Đảm bảo .env file được cấu hình đúng