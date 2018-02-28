import postcss from 'postcss';
import postcssSafeParser from 'postcss-safe-parser';

export default function run({ css, timer }) {
  return timer(() => {
    return postcss()
      .process(css, {
        parser: postcssSafeParser,
      })
      .then(result => {});
  });
}
