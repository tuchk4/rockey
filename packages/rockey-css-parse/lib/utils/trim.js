const left = /^[\s\u00A0]+/;
const right = /[\s\u00A0]+$/;

export default function trim(string) {
  return string.replace(left, '').replace(right, '');
}
