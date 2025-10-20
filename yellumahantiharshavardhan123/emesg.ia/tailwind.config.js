export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        bg: {
          dark900: '#0A0A0A',
          dark800: '#101828',
        },
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
}
