/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:         'var(--color-bg)',
        surface:    'var(--color-surface)',
        surface2:   'var(--color-surface2)',
        border:     'var(--color-border)',
        text:       'var(--color-text)',
        muted:      'var(--color-muted)',
        accent:     'var(--color-accent)',
        'accent-dim':'var(--color-accent-dim)',
        accent2:    'var(--color-accent2)',
        danger:     'var(--color-danger)',
        warning:    'var(--color-warning)',
        caution:    'var(--color-caution)',
        success:    'var(--color-success)',
        brand:      'var(--color-brand)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
        serif: ['Georgia', 'serif'],
      },
      borderRadius: {
        card: 'var(--radius)',
        sm:   'var(--radius-sm)',
      },
    },
  },
  plugins: [],
}
