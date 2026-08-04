import tailwindcss from 'tailwindcss';
import tailwindcssNesting from '@tailwindcss/postcss';

export default {
  plugins: [tailwindcssNesting(tailwindcss)],
};
