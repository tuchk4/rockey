import parse from './index';

console.time('parse');

const css = parse(
  `
.bar { 
  color: yellow;
}    
`.repeat(1)
);

console.timeEnd('parse');

console.log('');

console.log(css);
