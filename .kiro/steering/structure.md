# Project Structure

## Architecture Pattern

The project follows **Clean Architecture** principles with clear separation of concerns:

- **Presentation Layer**: Components and Pages
- **Business Logic Layer**: Services and Hooks
- **Data Layer**: API configuration and State management

## Folder Organization

```
src/
├── api/              # API configuration
│   ├── axiosConfig.js    # Axios instance with interceptors
│   └── endpoints.js      # API endpoint constants
│
├── assets/           # Static assets
│   ├── icons/           # SVG icons
│   └── images/          # Images and graphics
│
├── components/       # React components
│   ├── common/          # Reusable UI components (Button, Input, Card, Modal, etc.)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── features/        # Feature-specific components
│   └── signup/          # Signup flow components
│
├── pages/            # Page-level components (route targets)
│   ├── Home/
│   ├── Login/
│   ├── SignUp/
│   ├── Dashboard/
│   ├── FindCaregiver/
│   ├── CustomerInfo/
│   ├── EmployeeProfile/
│   └── NotFound/
│
├── hooks/            # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   ├── useApi.js        # API call hook
│   └── useLocalStorage.js
│
├── services/         # Business logic & API calls
│   ├── authService.js
│   ├── customerService.js
│   ├── caregiverService.js
│   ├── adminService.js
│   ├── notificationService.js
│   └── supportService.js
│
├── store/            # State management (Zustand)
│   ├── authStore.js     # Auth state
│   ├── notificationStore.js
│   └── slices/          # Store slices
│
├── routes/           # Route configuration
│
├── constants/        # Application constants
│   ├── config.js        # App configuration
│   ├── routes.js        # Route paths
│   └── home.js          # Home page constants
│
├── utils/            # Utility functions
│   ├── helpers.js       # General helpers
│   ├── validation.js    # Validation utilities
│   └── apiTest.js       # API testing utilities
│
└── styles/           # Global styles
    ├── index.css
    └── tailwind.css
```

## Component Organization

Each component folder follows this pattern:

```
ComponentName/
├── ComponentName.jsx    # Component implementation
└── index.js            # Re-export for cleaner imports
```

## Naming Conventions

- **Components**: PascalCase (e.g., `Button.jsx`, `UserProfile.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`, `useApi.js`)
- **Services**: camelCase with `Service` suffix (e.g., `authService.js`)
- **Stores**: camelCase with `Store` suffix (e.g., `authStore.js`)
- **Constants**: camelCase for files, UPPER_SNAKE_CASE for exports
- **Utils**: camelCase (e.g., `helpers.js`, `validation.js`)

## Import Patterns

Use path aliases for cleaner imports:

```javascript
// Good
import { Button } from '@components/common';
import { useAuth } from '@hooks';
import { authService } from '@services';

// Avoid
import { Button } from '../../../components/common/Button';
```

## State Management

- **Zustand stores** for global state (auth, notifications)
- **Custom hooks** for shared logic and local state
- **React Hook Form** for form state
- **localStorage** for persistence (via services)

## Service Layer Pattern

Services handle all API calls and business logic:

```javascript
export const authService = {
  login: async (credentials) => { /* ... */ },
  logout: () => { /* ... */ },
  getCurrentUser: () => { /* ... */ },
  // Token and user data stored in localStorage
};
```

## Page Structure

Pages are route-level components that:
- Compose smaller components
- Use hooks for data and logic
- Handle routing and navigation
- Manage page-specific state
