/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0D13',
        surface: {
          DEFAULT: '#121620',
          hover: '#181E2C',
          active: '#1E2537',
          subtle: '#0F121A',
        },
        border: {
          DEFAULT: '#1E2536',
          light: '#2B344B',
        },
        brand: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          subtle: 'rgba(59, 130, 246, 0.1)',
        },
        accent: {
          emerald: '#10B981',
          emeraldSubtle: 'rgba(16, 185, 129, 0.1)',
          amber: '#F59E0B',
          amberSubtle: 'rgba(245, 158, 11, 0.1)',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
