import pegjsCSSParser from './pegjs/pegjsCSS';

export default function run({ css, timer }) {
  console.log(
    'NOTE: pegjs CSS bench: parse CSS string into AST without stringify back'
  );

  return timer(() => {
    css.forEach(cssPart => pegjsCSSParser.parse(cssPart));
  });
}
