import { rule, block, step, branch } from 'rockster/schema';
import { clearContext, AZ_MARKER } from './utils';

const RULE_BLOCK = 'RULE_BLOCK';
export const NAME = RULE_BLOCK;

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

export default function mediaBlock({ schema, blocks }) {
  schema.block(
    RULE_BLOCK,
    {
      onEnter: ruleStart,
      onLeave: ruleEnd,
    },

    block(blocks.SELECTORS_BLOCK),
    step('{', declarationStart),

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

    step('}', declarationEnd),
    block.out()
  );
}
