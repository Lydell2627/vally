
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#ce1215',
          dark: '#050505',
          light: '#f5f5f5',
          gray: '#ebebeb'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'serif'],
        display: ['var(--font-anton)', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'rays': 'rays-move 25s linear infinite',
        'subtle-drift': 'drift 20s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'rays-move': {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(0,-100%,0)' },
        },
        drift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
