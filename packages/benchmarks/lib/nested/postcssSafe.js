import postcss from 'postcss';
import postcssSafeParser from 'postcss-safe-parser';
import postcssNested from 'postcss-nested';

export default function run({ css, timer }) {
  return timer(() => {
    return postcss([postcssNested])
      .process(css, {
        parser: postcssSafeParser,
      })
      .then(result => {});
  });
}
