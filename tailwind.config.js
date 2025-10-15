/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E5FFF9',
          100: '#D1FFF4',
          200: '#9EFFE8',
          300: '#70FFDE',
          400: '#42FFD3',
          500: '#11FFC6',
          600: '#00DBA8',
          700: '#00A37D',
          800: '#006B52',
          900: '#00382B',
          950: '#001914'
        },
        secondary: {
          50: '#FFE5F5',
          100: '#FFCCEB',
          200: '#FF99D6',
          300: '#FF66C2',
          400: '#FF33AD',
          500: '#FF0099',
          600: '#CC0077',
          700: '#990059',
          800: '#66003B',
          900: '#33001D',
          950: '#1A000F'
        },
        charcoal: {
          50: '#FFFFFF',
          100: '#F2F2F2',
          200: '#D9D9D9',
          300: '#BFBFBF',
          400: '#A6A6A6',
          500: '#8C8C8C',
          600: '#737373',
          700: '#595959',
          800: '#404040',
          900: '#262626',
          950: '#1A1A1A'
        },
        'chilled-gray': {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#868E96',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
          950: '#16191C'
        },
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554'
        },
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16'
        }
      },
      fontFamily: {
        sans: ['SVN-Gilroy', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // H1
        'h1-light': ['64px', { lineHeight: '4rem', fontWeight: '300' }],
        'h1': ['64px', { lineHeight: '4rem', fontWeight: '400' }],
        'h1-medium': ['64px', { lineHeight: '4rem', fontWeight: '500' }],
        'h1-semibold': ['64px', { lineHeight: '4rem', fontWeight: '600' }],
        'h1-bold': ['64px', { lineHeight: '4rem', fontWeight: '700' }],
        
        // H2
        'h2-light': ['48px', { lineHeight: '3rem', fontWeight: '300' }],
        'h2': ['48px', { lineHeight: '3rem', fontWeight: '400' }],
        'h2-medium': ['48px', { lineHeight: '3rem', fontWeight: '500' }],
        'h2-semibold': ['48px', { lineHeight: '3rem', fontWeight: '600' }],
        'h2-bold': ['48px', { lineHeight: '3rem', fontWeight: '700' }],
        
        // H3
        'h3-light': ['40px', { lineHeight: '2.5rem', fontWeight: '300' }],
        'h3': ['40px', { lineHeight: '2.5rem', fontWeight: '400' }],
        'h3-medium': ['40px', { lineHeight: '2.5rem', fontWeight: '500' }],
        'h3-semibold': ['40px', { lineHeight: '2.5rem', fontWeight: '600' }],
        'h3-bold': ['40px', { lineHeight: '2.5rem', fontWeight: '700' }],
        
        // H4
        'h4-light': ['32px', { lineHeight: '2rem', fontWeight: '300' }],
        'h4': ['32px', { lineHeight: '2rem', fontWeight: '400' }],
        'h4-medium': ['32px', { lineHeight: '2rem', fontWeight: '500' }],
        'h4-semibold': ['32px', { lineHeight: '2rem', fontWeight: '600' }],
        'h4-bold': ['32px', { lineHeight: '2rem', fontWeight: '700' }],
        
        // H5
        'h5-light': ['24px', { lineHeight: '1.5rem', fontWeight: '300' }],
        'h5': ['24px', { lineHeight: '1.5rem', fontWeight: '400' }],
        'h5-medium': ['24px', { lineHeight: '1.5rem', fontWeight: '500' }],
        'h5-semibold': ['24px', { lineHeight: '1.5rem', fontWeight: '600' }],
        'h5-bold': ['24px', { lineHeight: '1.5rem', fontWeight: '700' }],
        
        // H6
        'h6-light': ['16px', { lineHeight: '1rem', fontWeight: '300' }],
        'h6': ['16px', { lineHeight: '1rem', fontWeight: '400' }],
        'h6-medium': ['16px', { lineHeight: '1rem', fontWeight: '500' }],
        'h6-semibold': ['16px', { lineHeight: '1rem', fontWeight: '600' }],
        'h6-bold': ['16px', { lineHeight: '1rem', fontWeight: '700' }],
        
        // Small
        'small-light': ['13px', { lineHeight: '0.8125rem', fontWeight: '300' }],
        'small': ['13px', { lineHeight: '0.8125rem', fontWeight: '400' }],
        'small-medium': ['13px', { lineHeight: '0.8125rem', fontWeight: '500' }],
        'small-semibold': ['13px', { lineHeight: '0.8125rem', fontWeight: '600' }],
        'small-bold': ['13px', { lineHeight: '0.8125rem', fontWeight: '700' }],
        
        // P2 (Body)
        'p2-light': ['16px', { lineHeight: '1rem', fontWeight: '300' }],
        'p2': ['16px', { lineHeight: '1rem', fontWeight: '400' }],
        'p2-medium': ['16px', { lineHeight: '1rem', fontWeight: '500' }],
        'p2-semibold': ['16px', { lineHeight: '1rem', fontWeight: '600' }],
        'p2-bold': ['16px', { lineHeight: '1rem', fontWeight: '700' }],
      },
      boxShadow: {
        'xs': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'sm': '0 16px 32px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 24px 48px 0 rgba(0, 0, 0, 0.1)',
        'lg': '0 40px 80px 0 rgba(0, 0, 0, 0.1)',
        'xl': '0 56px 112px 0 rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      }
    },
  },
  plugins: [],
}