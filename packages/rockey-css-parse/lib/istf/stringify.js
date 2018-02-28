import {
  SELECTOR,
  PROPERTY,
  VALUE,
  RULE_START,
  RULE_END,
  SPACE_COMBINATOR,
  PARENT_SELECTOR,
} from './istf';

const s = `
      .foo div, .bar span {
          color: red;
          display: flex;
  
          & ._bar, ._baz .bla {
              color: green;
          }
      }
  `;

// prettier-ignore
const part = [
    RULE_START,
      SELECTOR, '.foo',
      SPACE_COMBINATOR, SELECTOR, 'div',
      SELECTOR, '.bar',
      SPACE_COMBINATOR, SELECTOR, 'span',
          PROPERTY, 'color',
              VALUE, 'red',
          PROPERTY, 'display',
              VALUE, 'flex',
      RULE_START,
          PARENT_SELECTOR,
          SELECTOR, '._bar',
          SELECTOR, '._baz',
          SPACE_COMBINATOR, SELECTOR, '.bla',
              PROPERTY, 'color',
                  VALUE, 'green',
      RULE_END,
    RULE_END,
  ];

const istf = [];
for (let i = 0; i < 100000; i++) {
  istf.push(...part);
}

const REPLACE_RE = /%/g;

console.time('s');
const css = istfToCSS(istf);
console.timeEnd('s');
// console.log(css);

function istfToCSS(istf) {
  const size = istf.length;
  let output = '';

  let selector = [];
  let parentSelector = [];
  let defenitions = [];

  let depth = 0;

  selector[depth] = '';
  defenitions[depth] = '';
  parentSelector[depth] = '';

  for (let i = 0; i < size; i++) {
    const rule = istf[i];
    switch (rule) {
      case RULE_START:
        depth++;
        selector[depth] = '';
        defenitions[depth] = '';
        parentSelector[depth] = '';

        break;

      case SELECTOR:
        i++;

        let sel = istf[i];

        if (istf[i + 1] === SPACE_COMBINATOR) {
          i += 3;
          sel += ' ' + istf[i];
        }

        if (parentSelector[depth - 1] && parentSelector[depth - 1].length) {
          sel = parentSelector[depth - 1].replace('%', ' ' + sel);
        }

        if (!selector[depth].length) {
          selector[depth] += sel;
          parentSelector[depth] += sel + '%';
        } else {
          selector[depth] += ', ' + sel;
          parentSelector[depth] += ', ' + sel + '%';
        }

        break;

      case PROPERTY:
        // i++;
        defenitions[depth] += istf[++i] + ' : ';
        break;
      case VALUE:
        // i++;
        defenitions[depth] += istf[++i] + '; ';
        break;
      case RULE_END:
        output +=
          `
          ` +
          selector[depth] +
          // r +
          ' { ' +
          defenitions[depth] +
          ' } ';

        depth--;

        selector.length = depth + 1;
        parentSelector.length = depth + 1;
        defenitions.length = depth + 1;

        break;

      case PARENT_SELECTOR:
        break;
      default:
        console.log(rule);
        throw new Error('wrong istf format');
    }
  }

  return output;
}

export default istfToCSS;
