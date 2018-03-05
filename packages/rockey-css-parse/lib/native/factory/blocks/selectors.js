import { rule, label, block, link, branch, step } from 'rockster/schema';
import { clearContext } from './utils';
import { PREFIX_TYPES } from '../../Context';

const SELECTOR_BLOCK = 'SELECTOR_BLOCK';
export const NAME = SELECTOR_BLOCK;

const belongsAlphabetical = char => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

const AZ_MARKER = char => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

const SELECTOR_REGEXP = /^([a-z|.|:|#])[a-z|0-9]+(-[a-z|0-9]+)?$/;
export const selector = (marker, onEnter, onLeave) =>
  step(marker, {
    onEnter,
    onLeave,
    belongs: belongsAlphabetical,
    validate: (context, throwSyntaxError) => {
      if (!SELECTOR_REGEXP.test(context.buffer.trim())) {
        throwSyntaxError(
          `CSS Selector should conatin only "a-z" and "-" symbols. "${context.buffer.trim()}"`
        );
      }
    },
  });

// function startSelector({ type }) {
//   return function(context, value) {
//     context.addSelector({ type, selector: value });
//   };
// }

// function endSelector(context) {
//   context.endSelector();
// }

// const startTag = startSelector({
//   type: 'TAG',
// });

// const startClass = startSelector({
//   type: 'CLASS',
// });

// const startPseudo = startSelector({
//   type: 'PSEUDO',
// });

// const startNot = startSelector({
//   type: 'NOT',
// });

// function separatorSpace(context) {
//   context.separator = ' ';
// }

// function separatorComa(context) {
//   context.separator = ',';
// }

const SELECTOR_START = 'SELECTOR_START';
const SELECTOR_END = 'SELECTOR_END';

// const PREFIX_TYPES = {
//   SPACE: 1,
//   DOT: 2,
//   HASH: 3,
//   COLUMN: 4,
//   NOT: 5,
// };

const PSEUDO_SELECTORS = ['hover', 'active'];

function validateSelector(context, throwSyntaxError) {
  switch (context.prefix) {
    // case PREFIX_TYPES.DOT:
    // case PREFIX_TYPES.HASH:
    //   if (!SELECTOR_REGEXP.test(context.buffer.trim())) {
    //     throwSyntaxError(
    //       `CSS Selector should conatin only "a-z" and "-" symbols. "${context.buffer.trim()}"`
    //     );
    //   }
    // break;

    case PREFIX_TYPES.COLUMN:
      if (PSEUDO_SELECTORS.indexOf(context.buffer.trim()) === -1) {
        throwSyntaxError(
          `Not valid pseudo selector "${context.buffer.trim()}"`
        );
      }
      break;

    default:
      if (!SELECTOR_REGEXP.test(context.buffer.trim())) {
        throwSyntaxError(
          `CSS Selector should conatin only "a-z" and "-" symbols. "${context.buffer.trim()}"`
        );
      }
  }
}

// function validatePseudoSelector(context, throwSyntaxError) {
//   if (PSEUDO_SELECTORS.indexOf(context.buffer.trim()) === -1) {
//     throwSyntaxError(`Not valid pseudo selector"${context.buffer.trim()}"`);
//   }
// }

function addPrefix(prefix, symbol) {
  return function addSelectorPrefix(context) {
    context.prefix = prefix;
    context.prefixSymbol = symbol;
    context.clear();
  };
}

function addSelector(context) {
  context.addSelector(context.buffer, context.prefix, context.prefixSymbol);
  context.prefix = null;
  context.prefixSymbol = '';
}

function notSelectorStart(context) {
  context.appendCSS(':not(');
  context.clear();
}

function notSelectorEnd(context) {
  context.appendCSS(')');
  context.clear();
}

export default function selectorsBlock({ schema }) {
  // prettier-ignore
  schema.block(
    SELECTOR_BLOCK,
    label(SELECTOR_START),
    rule.repeat(
      branch.maybe(
        step('.', addPrefix(PREFIX_TYPES.DOT, '.')),
        step('#', addPrefix(PREFIX_TYPES.HASH, '#')),
        step(':', {
          onEnter: addPrefix(PREFIX_TYPES.COLUMN, ':'), 
        }),
        rule(
          step(':not(', notSelectorStart),
          block(SELECTOR_BLOCK),
          step(')', notSelectorEnd),
          link(SELECTOR_END)
        )
      ),
      step(AZ_MARKER, {
        // onEnter: context => {
        //   console.log(context.buffer)
        // },
        beforeEnter: clearContext,
        onLeave: addSelector,
        belongs: belongsAlphabetical,
        validate: validateSelector,
      }),
      label(SELECTOR_END),
      branch.maybe(
        // step(':', {
          // onEnter: addPrefix(PREFIX_TYPES.COLUMN, ':'), 
          // onLeave: addSelector,
          // validate: validatePseudoSelector
        // }),
        // rule(
        //   step(':not(', addPrefix(PREFIX_TYPES.NOT)),
        //   block(SELECTOR_BLOCK),
        //   step(')', clearContext),
        // ),
        step(',', function addComaSeparator(context) {
          context.appendCSS(',');
        }),
        step(' ', function addSpaceSeparator(context) {
          context.appendCSS(' ');
        })
      ),
    ),
    block.out()
  );
}
