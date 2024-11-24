/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./themes/landing/layouts/**/*.html",
    "./layouts/**/*.html",
    "./content/**/*.{html,md}"
  ],
  theme: {
    extend: {
      colors: {
        // Suas cores existentes
        'primary': {
          50: '#f0f9f9',
          100: '#d0eef0',
          200: '#a3e0e4',
          300: '#70cdd3',
          400: '#44b3bc',
          500: '#2b949d',
          600: '#207780',
          700: '#1a5c64',
          800: '#164950',
          900: '#133c42',
        },
        'accent': {
          50: '#ebfaf4',
          100: '#c7f2e3',
          200: '#92e4cb',
          300: '#4ed0af',
          400: '#25b894',
          500: '#1a9577',
          600: '#157a62',
          700: '#136152',
          800: '#114b41',
          900: '#0f3d36',
        },
        'secondary': {
          50: '#edf6fc',
          100: '#cce5f5',
          200: '#99ccea',
          300: '#66b2de',
          400: '#3399d2',
          500: '#2680b3',
          600: '#1e6691',
          700: '#184d6e',
          800: '#133a52',
          900: '#0f2d3f',
        }
      },
      // Novas configurações para tipografia
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            maxWidth: 'none',
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '700',
              fontSize: theme('fontSize.3xl'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4')
            },
            h2: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              fontSize: theme('fontSize.2xl'),
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.6')
            },
            h3: {
              color: theme('colors.gray.800'),
              fontWeight: '500',
              fontSize: theme('fontSize.xl'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4')
            },
            p: {
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
              lineHeight: '1.75'
            },
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.primary.700')
              }
            },
            ul: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              paddingLeft: theme('spacing.6')
            },
            li: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2')
            }
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),  
  ]
}