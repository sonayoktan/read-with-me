/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Lora"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        digital: ['"VT323"', 'monospace'],
      },
      colors: {
        cozy: {
          dark: '#0f0e17',
          card: 'rgba(23, 22, 34, 0.65)',
          lightCard: 'rgba(255, 255, 255, 0.12)',
          accent: '#ff8906',
          secondary: '#f25f4c',
          tertiary: '#e53170',
          highlight: '#fffffe',
          muted: '#a7a9be',
          subtle: '#2e2f3e',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
