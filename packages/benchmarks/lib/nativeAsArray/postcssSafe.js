import postcss from 'postcss';
import postcssSafeParser from 'postcss-safe-parser';

export default function run({ css, timer }) {
  return timer(() => {
    return css.map(cssPart => {
      return postcss()
        .process(cssPart, {
          parser: postcssSafeParser,
        })
        .then(result => {});
    });
  });
}
