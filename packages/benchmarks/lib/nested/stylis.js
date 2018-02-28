import stylis from 'stylis';

export default function run({ css, timer }) {
  return timer(() => {
    stylis('', css);
  });
}
