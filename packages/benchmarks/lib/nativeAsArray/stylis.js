import stylis from 'stylis';

export default function run({ css, timer }) {
  return timer(() => {
    css.forEach(cssPart => {
      stylis('.global', cssPart);
    });
  });
}
