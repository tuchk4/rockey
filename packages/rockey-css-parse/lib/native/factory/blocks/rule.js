import { rule, block, step, branch } from 'rockster/schema';
import { clearContext, AZ_MARKER } from './utils';

const CSS_RULE_BLOCK = 'CSS_RULE_BLOCK';
const DEFINITION_BLOCK = 'DEFINITION_BLOCKS';

export const blocks = {
  CSS_RULE_BLOCK,
  DEFINITION_BLOCK,
};

function ruleStart(context) {
  context.ruleStart();
}

function ruleEnd(context) {
  context.ruleEnd();
}

function declarationStart(context) {
  context.declarationStart();
}

function declarationEnd(context) {
  context.declarationEnd();
}

// function propertyStart() {}
function propertyEnd(context) {
  context.addProperty(context.buffer);
}

// function valueStart() {}
function valueEnd(context) {
  context.addValue(context.buffer);
}

export default function ruleBlock({ schema, blocks }) {
  schema.block(
    DEFINITION_BLOCK,
    rule.repeat.maybe(
      branch(
        block(blocks.COMMENTS_BLOCK),
        rule(
          step(AZ_MARKER, {
            beforeEnter: clearContext,
            onLeave: propertyEnd,
          }),
          step(':', clearContext),
          step(AZ_MARKER, {
            beforeEnter: clearContext,
            onLeave: valueEnd,
          }),
          step(';', clearContext)
        )
      )
    ),
    block.out()
  );

  schema.block(
    CSS_RULE_BLOCK,
    {
      onEnter: ruleStart,
      onLeave: ruleEnd,
    },

    block(blocks.SELECTORS_BLOCK),
    step('{', declarationStart),

    block(DEFINITION_BLOCK),

    step('}', declarationEnd),
    block.out()
  );
}
