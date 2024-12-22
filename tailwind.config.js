/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './themes/landing/layouts/**/*.html',
    './layouts/**/*.html',
    './content/**/*.{html,md}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#F2B266', // laranja principal
          400: '#E89B4B',
          500: '#D87D2D',
          600: '#C4863D', // laranja escuro
          700: '#A35A1B',
          800: '#854D17',
          900: '#623D2B', // marrom
        },
        accent: {
          50: '#FEF5F3',
          100: '#FDE8E4',
          200: '#FAC7BD',
          300: '#F7A697',
          400: '#F48571',
          500: '#E46A54',
          600: '#D25440',
          700: '#B33E2D',
          800: '#932F21',
          900: '#7A2518',
        },
        neutral: {
          50: '#F7F6F2', // background claro
          100: '#E8E6E1',
          200: '#D3CEC4',
          300: '#B8B2A7',
          400: '#A39E93',
          500: '#8C8A88', // texto secundário
          600: '#716B61',
          700: '#3B3B3B', // texto principal
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      fontSize: {
        'display-1': ['4em', { lineHeight: '1.25', letterSpacing: '-0.075rem' }],
        'display-2': ['3.5em', { lineHeight: '1.3', letterSpacing: '-0.05rem' }],
        'display-3': ['3em', { lineHeight: '1.35', letterSpacing: '-0.025rem' }],
      },
      letterSpacing: {
        'tighter': '-0.075rem',
        'tight': '-0.05rem',
        'snug': '-0.025rem',
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme('colors.neutral.700'),
            fontFamily: theme('fontFamily.sans').join(', '),
            h1: {
              fontFamily: theme('fontFamily.display').join(', '),
              color: theme('colors.neutral.800'),
              fontWeight: '300',
              letterSpacing: '-0.075rem',
              fontSize: '4em',
              lineHeight: '1.25',
            },
            h2: {
              fontFamily: theme('fontFamily.display').join(', '),
              color: theme('colors.neutral.800'),
              fontWeight: '300',
              letterSpacing: '-0.05rem',
              fontSize: '3.5em',
              lineHeight: '1.3',
            },
            h3: {
              fontFamily: theme('fontFamily.display').join(', '),
              color: theme('colors.neutral.800'),
              fontWeight: '300',
              letterSpacing: '-0.025rem',
              fontSize: '3em',
              lineHeight: '1.35',
            },
            p: {
              color: theme('colors.neutral.700'),
              fontSize: '1rem',
              lineHeight: '1.75',
            },
            a: {
              color: theme('colors.primary.300'),
              '&:hover': {
                color: theme('colors.primary.400'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};