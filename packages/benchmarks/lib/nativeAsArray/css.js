import cssParser from 'css';

export default function run({ css, timer }) {
  return timer(() => {
    css.forEach(cssPart => {
      cssParser.stringify(cssParser.parse(cssPart));
    });
  });
}
