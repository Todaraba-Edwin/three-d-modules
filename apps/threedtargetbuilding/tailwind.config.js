/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared/**/*.{js,ts,jsx,tsx}', // 공용폴더의 tailwind 도 가져와야 동작이 됨
  ],
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
