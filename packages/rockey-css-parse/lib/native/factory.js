import {
  rule,
  branch,
  label,
  link,
  propertyValue,
  property,
  step,
  block,
  selector,
  alphabetical,
  Schema,
} from '../schema';

import { ALPHABETICAL } from '../schema/markers';

const COMMENTS_BLOCK = 'COMMENTS';
const SELECTOR_BLOCK = 'SELECTOR';
const MEDIA_BLOCK = 'MEDIA';
const IMPORT_BLOCK = 'IMPORT';

const RULE_BLOCK = 'RULE';

function clearContext(context) {
  context.clear();
}

export default function factory({
  actions: {
    // selectors
    startTagSelector,
    startClassSelector,
    startIdSelector,
    startPseudoSelector,
    //
    selectorEnd,
    selectorComaSeparated,
    selectorSpaceSeparated,
    pseudoSelector,
    withParentSelector,
    // declaraion
    declarationStart,
    declarationEnd,
    // prop
    propertyStart,
    propertyEnd,
    // value
    valueStart,
    valueEnd,

    //---
    startChildWithPseudo,
    endChildWithPseudo,
  },
}) {
  const schema = new Schema();

  schema.block(
    IMPORT_BLOCK,
    step('@import'),
    step(';', context => {
      context.appendRule(context.buffer);
    })
  );

  schema.block(
    MEDIA_BLOCK,
    {
      onEnter: context => {
        context.startMedia();
      },
      onLeave: context => {
        context.endMedia();
      },
    },
    step('@media', clearContext, context => {
      context.addCondition(context.buffer.trim());
    }),
    step('{', clearContext),
    block(RULE_BLOCK),
    step('}', {
      endAction: clearContext,
    }),
    block.out()
  );

  schema.block(
    COMMENTS_BLOCK,
    step('/*'),
    step('*/', {
      endAction: clearContext,
    }),
    block.out()
  );

  const START_SELECTOR_LABEL = 'START_SELECTOR';
  schema.block(
    SELECTOR_BLOCK,
    // {
    //   onEnter: context => {
    //     context.startSelectors();
    //   },
    //   onLeave: context => {
    //     context.endSelectors();
    //   },
    // },
    // ----
    label(START_SELECTOR_LABEL),
    rule.repeat(
      branch(
        selector(ALPHABETICAL, startTagSelector, selectorEnd),
        selector('.', startClassSelector, selectorEnd),
        // selector('#', startIdSelector, selectorEnd),
        rule(step(':', startPseudoSelector), link(START_SELECTOR_LABEL))
      ),
      branch.maybe(
        step(' ', selectorSpaceSeparated),
        rule(step(',', selectorComaSeparated), link(START_SELECTOR_LABEL)),
        rule(step(':', pseudoSelector), link(START_SELECTOR_LABEL))
        // rule(
        //   step(':not(', context => {
        //     context.clear();
        //     context.startNotSelector();
        //   }),
        //   block(SELECTOR_BLOCK),
        //   step(')', context => {
        //     context.clear();
        //     context.endNotSelector();
        //   })
        // )
      )
    ),

    block.out()
  );

  schema.block(
    RULE_BLOCK,
    {
      onEnter: context => {
        context.startRule();
      },
      onLeave: context => {
        context.endRule();
      },
    },

    block(SELECTOR_BLOCK),
    step('{', declarationStart),

    rule.repeat.maybe(
      branch(
        block(COMMENTS_BLOCK),
        rule(
          property(propertyStart, propertyEnd),
          step(':', clearContext),
          propertyValue(valueStart, valueEnd),
          step(';', clearContext)
        )
      )
    ),

    step('}', declarationEnd),
    block.out()
  );

  // prettier-ignore
  schema.main(
    rule.repeat(
      block(RULE_BLOCK), 
      // branch(
        
      //   block(COMMENTS_BLOCK),
      //   block(MEDIA_BLOCK)
      // )
    )
  );

  return schema;
}
