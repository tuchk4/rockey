import postcss from 'postcss';
import postcssNested from 'postcss-nested';

export default function run({ css, timer }) {
  return timer(() => {
    return postcss([postcssNested])
      .process(css)
      .then(result => {});
  });
}
