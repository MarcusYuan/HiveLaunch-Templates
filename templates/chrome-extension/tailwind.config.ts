import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './entry/**/*.html',
    './entry/**/*.tsx',
    './components/**/*.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
