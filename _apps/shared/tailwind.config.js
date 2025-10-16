import { colors } from './src/styles/colors.js';
import { fontSize } from './src/styles/fontSize.js';
import { width } from './src/styles/width.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionDuration: {
        2000: '2000ms', // 사용자 정의
      },
      colors,
      width,
      maxWidth: width,
      fontSize,
    },

    fontFamily: {
      body: ['Noto Sans KR'],
    },
  },
  plugins: [],
};
