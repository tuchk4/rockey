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
} from './schema';

import { ALPHABETICAL } from './schema/markers';

const ROOT_BLOCK = 'ROOT';
const COMMENTS_BLOCK = 'COMMENTS';
const SELECTOR_BLOCK = 'SELECTOR';
const DECLARATION_BLOCK = 'DECLARATION';
// const DECLARATION_BODY_BLOCK = 'DECLARATION_BODY';
const RULE_BLOCK = 'RULE';

function clearContext(context) {
  context.clear();
}

export default function factory({
  actions: {
    // selectors
    selectorStart,
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
    COMMENTS_BLOCK,
    // ----
    rule(step('/*'), step('*/', clearContext), block.out())
  );

  const START_SELECTOR_LABEL = 'START_SELECTOR';
  schema.block(
    SELECTOR_BLOCK,
    // ----
    label(START_SELECTOR_LABEL),
    rule.repeat(
      branch(
        selector(ALPHABETICAL, selectorStart, selectorEnd),
        selector('.', selectorStart, selectorEnd),
        selector('#', selectorStart, selectorEnd),
        rule(step(':', pseudoSelector), link(START_SELECTOR_LABEL))
        // rule(step('&', withParentSelector), link(START_SELECTOR_LABEL))
      ),
      branch.maybe(
        step(' ', selectorSpaceSeparated),
        rule(step(',', selectorComaSeparated), link(START_SELECTOR_LABEL)),
        rule(step(':', pseudoSelector), link(START_SELECTOR_LABEL))
      ),
      block.out()
    )
  );

  schema.block(
    RULE_BLOCK,
    {
      blockStartAction: context => {
        context.startRule();
      },
      blockEndAction: context => {
        context.endRule();
      },
    },
    block('SELECTOR'),
    step('{', declarationStart),
    rule.repeat.maybe(
      property(propertyStart, propertyEnd),
      step(':', clearContext),
      propertyValue(valueStart, valueEnd),
      step(';', clearContext)
    ),
    step('}', declarationEnd),
    block.out()
  );

  schema.main(rule.repeat(branch(block(COMMENTS_BLOCK), block(RULE_BLOCK))));

  return schema;
}
