import postcss from 'postcss';

export default function run({ css, timer }) {
  return timer(() => {
    return Promise.all(
      css.map(cssPart => {
        return postcss()
          .process(cssPart)
          .then(result => {});
      })
    );
  });
}
