# Tech Stack

## Build System & Tooling

- **Vite 7** - Fast build tool and dev server
- **Node.js >= 18** - Runtime requirement
- **ESLint** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

## Core Technologies

- **React 19** - UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling and validation
- **Lucide React** - Icon library
- **SweetAlert2** - Alert/modal dialogs

## Path Aliases

The project uses Vite path aliases for cleaner imports:

```javascript
@/ → src/
@components/ → src/components/
@pages/ → src/pages/
@hooks/ → src/hooks/
@services/ → src/services/
@store/ → src/store/
@utils/ → src/utils/
@constants/ → src/constants/
@api/ → src/api/
@assets/ → src/assets/
```

## Common Commands

```bash
# Development
npm run dev          # Start dev server on port 5173

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## Environment Variables

Use `.env` file (copy from `.env.example`):

```env
VITE_API_BASE_URL=your_api_url
VITE_APP_NAME=your_app_name
```

Access in code via `import.meta.env.VITE_*`

## API Configuration

- Axios instance configured in `src/api/axiosConfig.js`
- Base URL from environment variable
- 10-second timeout
- Automatic Bearer token injection from localStorage
- 401 responses trigger automatic logout and redirect to login
