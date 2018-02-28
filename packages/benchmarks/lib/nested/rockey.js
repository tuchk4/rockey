import rockeyCSSParse from 'rockey-css-parse/quick';

export default function run({ css, timer }) {
  return timer(() => {
    rockeyCSSParse(css);
  });
}
