/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070707',
          900: '#0A0A0A', // Fondo principal azabache
          850: '#111111', // Superficies elevadas nivel 1
          800: '#171717', // Superficies elevadas nivel 2 (tarjetas)
          700: '#222222', // Bordes e inputs
          600: '#2E2E2E',
        },
        gold: {
          300: '#F5DE88',
          400: '#E5C158', // Dorado claro brillante
          500: '#D4AF37', // Dorado clásico Alpha Lash
          600: '#B89020',
          700: '#8C6C10',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'md3-1': '0 1px 3px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.4)',
        'md3-2': '0 3px 6px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)',
        'md3-3': '0 10px 20px rgba(0, 0, 0, 0.8), 0 3px 6px rgba(0, 0, 0, 0.6)',
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'gold-glow-lg': '0 0 40px -10px rgba(212, 175, 55, 0.45)',
      },
      borderRadius: {
        'md3': '1rem',
        'md3-lg': '1.5rem',
        'md3-xl': '2rem',
      },
    },
  },
  plugins: [],
};
