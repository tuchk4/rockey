import create from 'rockey-css-parse/native';

const parse = create();
export default function run({ css, timer }) {
  return timer(() => {
    parse(css);
  });
}
