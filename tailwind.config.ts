import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid':
          'linear-gradient(to right, rgba(0,200,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,200,255,0.06) 1px, transparent 1px)',
      },
      colors: {
        cyber: {
          bg: '#050816',
          surface: '#0B1120',
          primary: '#00C8FF',
          secondary: '#3B82F6',
          accent: '#00FFD5',
          text: '#FFFFFF',
          muted: '#94A3B8',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glitch: {
          '0%, 92%, 100%': { transform: 'translate(0,0)', opacity: '1' },
          '93%': { transform: 'translate(-2px,1px)', opacity: '0.85' },
          '94%': { transform: 'translate(2px,-1px)', opacity: '1' },
          '95%': { transform: 'translate(-1px,-1px)', opacity: '0.9' },
          '96%': { transform: 'translate(1px,1px)', opacity: '1' },
        },
        'text-sweep': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'border-scan': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        'corner-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        'scan-beam': {
          '0%': { transform: 'translateY(-30%)', opacity: '0' },
          '8%': { opacity: '1' },
          '92%': { opacity: '1' },
          '100%': { transform: 'translateY(130%)', opacity: '0' },
        },
        'rgb-shift-a': {
          '0%, 90%, 100%': { transform: 'translate(0,0)', opacity: '0' },
          '92%, 98%': { transform: 'translate(-3px,1px)', opacity: '0.7' },
        },
        'rgb-shift-b': {
          '0%, 90%, 100%': { transform: 'translate(0,0)', opacity: '0' },
          '92%, 98%': { transform: 'translate(3px,-1px)', opacity: '0.7' },
        },
        'glow-breathe': {
          '0%, 100%': {
            textShadow: '0 0 16px rgba(0,200,255,0.35), 0 0 36px rgba(0,200,255,0.12)',
          },
          '50%': {
            textShadow: '0 0 26px rgba(0,255,213,0.6), 0 0 60px rgba(0,255,213,0.25)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-shift': 'gradient-shift 18s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        scan: 'scan 4s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        glitch: 'glitch 4s infinite steps(1)',
        'text-sweep': 'text-sweep 6s ease-in-out infinite',
        'border-scan': 'border-scan 3s linear infinite',
        'corner-pulse': 'corner-pulse 2.4s ease-in-out infinite',
        'scan-beam': 'scan-beam 5s ease-in-out infinite',
        'rgb-shift-a': 'rgb-shift-a 4s steps(1) infinite',
        'rgb-shift-b': 'rgb-shift-b 4s steps(1) infinite',
        'glow-breathe': 'glow-breathe 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
