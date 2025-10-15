/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../shared/**/*.{js,ts,jsx,tsx}', // 공용폴더의 tailwind 도 가져와야 동작이 됨
  ],
  theme: {
    extend: {
      // spacing → margin, padding, width, height
      // borderRadius → rounded-xl 같은 클래스 생성
      colors: {
        main: '#E12403',
        primary: {
          DEFAULT: '#628EF0',
          foreground: '#ffffff',
        },

        destructive: {
          DEFAULT: '#F06E62',
          foreground: '#ffffff',
        },
      },
      transitionDuration: {
        2000: '2000ms', // 사용자 정의
      },
      width: {
        'gnb-open': '250px',
        'gnb-close': '56px',
        'gnb-content': '218px',
        'gnb-icon': '24px',
      },
      maxWidth: {
        'gnb-open': '250px',
      },
      minWidth: {
        // IPadMini 768 - 250(gnb-open)
        viewport: '768px',
        'min-limit': '768px',
      },
      height: {
        'gnb-footer': '100px',
        'gnb-footer-close': '60px',
        'gnb-icon': '24px',
      },
      padding: {
        gnb: '16px',
        'gnb-footer': '100px',
        'gnb-footer-close': '60px',
      },
      gap: {
        gnb: '16px',
      },
      zIndex: {
        gnb: 50,
        /*
          z-max : 절대적인 최고 레벨
          z-top : 시각적 “맨 위” 의미
          z-overlay : 모달, 팝업 등 최상단 UI용
          z-highest : 다른 z-index 대비 최고
          z-ultimate : 완전히 최상위
        */
      },
    },
  },
  plugins: [],
};
