/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
      },
      colors: {
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          neutral: '#6B7280',
        },
        metric: {
          revenue: '#3B82F6',
          users: '#8B5CF6',
          conversion: '#10B981',
          engagement: '#F59E0B',
          default: '#6B7280',
        },
      },
      screens: {
        'tablet': '768px',
      },
    },
  },
  plugins: [],
};