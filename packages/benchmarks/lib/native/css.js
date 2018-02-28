import cssParser from 'css';

export default function run({ css, timer }) {
  return timer(() => {
    return cssParser.stringify(cssParser.parse(css));
  });
}
