import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      translate: {
        center: '-50%',
      },
      textColor: () => ({
        primary: '#fff',
        silver: '#d9d5d5',
        silver100: '#ededed',
        secondary: '#ffed4a',
        danger: '#BE4D31',
      }),
      backgroundColor: () => ({
        primary: '#3a3660',
        silver: '#E4E4E4',
        danger: '#BE4D31',
      }),
      margin: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        xxl: '60px',
        auto: 'auto',
      },
      padding: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        auto: 'auto',
      },
      fontSize: {
        xs: '.75rem',
        sm: '.875rem',
        tiny: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      fontFamily: {
        Pretendard: ['Pretendard'],
      },
      container: {
        padding: {
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
} satisfies Config;
