/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: {
          DEFAULT: '#ffffff',
          hover: '#f8fafc',
          active: '#f1f5f9',
          subtle: '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          light: '#cbd5e1',
        },
        brand: {
          DEFAULT: '#4f46e5',
          hover: '#4338ca',
          subtle: 'rgba(79, 70, 229, 0.08)',
        },
        accent: {
          emerald: '#059669',
          emeraldSubtle: 'rgba(5, 150, 105, 0.08)',
          amber: '#d97706',
          amberSubtle: 'rgba(217, 119, 6, 0.08)',
        },
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8',
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
