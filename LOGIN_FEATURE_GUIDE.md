# Hướng dẫn tính năng Đăng nhập

## Tính năng đã triển khai

### 1. Điều hướng theo vai trò người dùng
Sau khi đăng nhập thành công, hệ thống sẽ tự động điều hướng người dùng đến trang phù hợp với vai trò:

- **Admin** → `/dashboard` - Trang quản trị hệ thống
- **Support** → `/dashboard` - Trang hỗ trợ khách hàng
- **Customer** → `/` - Trang chủ dành cho khách hàng
- **Caregiver** → `/employee-profile` - Trang hồ sơ chuyên viên

### 2. Ghi nhớ đăng nhập
- Checkbox "Ghi nhớ đăng nhập" cho phép lưu email người dùng
- Khi quay lại trang đăng nhập, email sẽ được tự động điền
- Thông tin được lưu trong `localStorage`

### 3. Bảo vệ routes theo vai trò
Sử dụng component `ProtectedRoute` để:
- Kiểm tra người dùng đã đăng nhập chưa
- Kiểm tra quyền truy cập theo vai trò
- Tự động redirect nếu không có quyền

### 4. Khôi phục session
- Khi reload trang, hệ thống tự động khôi phục thông tin đăng nhập từ `localStorage`
- Nếu đã đăng nhập, tự động redirect đến trang phù hợp

## Cấu trúc code

### Components mới
1. **ProtectedRoute** (`src/components/common/ProtectedRoute.jsx`)
   - Bảo vệ routes theo authentication và role
   - Redirect về `/login` nếu chưa đăng nhập
   - Redirect về `/` nếu không có quyền

2. **Dashboard** (`src/pages/Dashboard/Dashboard.jsx`)
   - Trang dashboard cho Admin và Support
   - Hiển thị thông tin người dùng
   - Nút đăng xuất

### Cập nhật
1. **Login.jsx**
   - Thêm checkbox "Ghi nhớ đăng nhập"
   - Logic điều hướng theo vai trò
   - Khôi phục email đã lưu
   - Auto redirect nếu đã đăng nhập

2. **App.jsx**
   - Khởi tạo auth state khi app load
   - Gọi `initAuth()` từ authStore

3. **AppRoutes.jsx**
   - Thêm protected routes
   - Phân quyền truy cập theo role

## Tài khoản test

```javascript
// Admin
Email: admin@careservice.com
Password: admin123
→ Redirect to: /dashboard

// Support
Email: support@careservice.com
Password: support123
→ Redirect to: /dashboard

// Customer
Email: customer@example.com
Password: customer123
→ Redirect to: /

// Caregiver
Email: caregiver@example.com
Password: caregiver123
→ Redirect to: /employee-profile
```

## Cách sử dụng

### 1. Đăng nhập
- Nhập email và mật khẩu
- Chọn "Ghi nhớ đăng nhập" nếu muốn lưu email
- Click "Đăng nhập"
- Hệ thống tự động redirect theo vai trò

### 2. Đăng xuất
- Click nút "Đăng xuất" trên Dashboard
- Token và thông tin user sẽ bị xóa
- Redirect về trang đăng nhập

### 3. Bảo vệ route
```jsx
// Ví dụ bảo vệ route chỉ cho Admin
<Route 
  path="/admin-panel" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>

// Bảo vệ route cho nhiều roles
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['admin', 'support']}>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Lưu ý kỹ thuật

### LocalStorage keys
- `token` - JWT token
- `user` - Thông tin user (JSON)
- `rememberedEmail` - Email đã lưu
- `rememberMe` - Flag ghi nhớ đăng nhập

### Role detection
Hệ thống hỗ trợ 2 cách lưu role:
- `user.role` - Single role (string)
- `user.roles[0]` - Multiple roles (array)

### Security
- Token được lưu trong localStorage
- Protected routes kiểm tra authentication
- Role-based access control (RBAC)
