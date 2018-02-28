import postcss from 'postcss';

export default function run({ css, timer }) {
  return timer(() => {
    return postcss()
      .process(css)
      .then(result => {});
  });
}
