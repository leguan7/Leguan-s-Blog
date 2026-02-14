/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Butterfly 主题色
        butterfly: {
          primary: '#49b1f5',
          hover: '#3ca5e8',
          light: '#a4d8fa',
          dark: '#0d7db5',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Lato', 'Roboto', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
