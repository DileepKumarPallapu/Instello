/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#0B0F17',
          card: 'rgba(21, 28, 44, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#6366F1',
          accentGlow: '#818CF8',
          pinkGlow: '#EC4899',
          purpleGlow: '#8B5CF6',
          textMuted: '#94A3B8',
        },
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        neon: '0 0 20px rgba(99, 102, 241, 0.4)',
        pinkNeon: '0 0 20px rgba(236, 72, 153, 0.4)',
      },
    },
  },
  plugins: [],
};
