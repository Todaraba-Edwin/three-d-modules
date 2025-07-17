/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#414066',
      },
      transitionDuration: {
        2000: '2000ms', // 사용자 정의
      },
    },
  },
  plugins: [],
};
