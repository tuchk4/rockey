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

import { SELECTORS, SELECTOR_SEPARATORS } from './NativeContext';
import { ALPHABETICAL } from '../schema/markers';

const COMMENTS_BLOCK = 'COMMENTS';
const SELECTOR_BLOCK = 'SELECTOR';
const MEDIA_BLOCK = 'MEDIA';
const IMPORT_BLOCK = 'IMPORT';

const RULE_BLOCK = 'RULE';

function clearContext(context) {
  context.clear();
}

export default function factory({ actions }) {
  const schema = new Schema();

  /**
   * IMPORT BLOCK
   */
  schema.block(
    IMPORT_BLOCK,
    step('@import'),
    step(';', context => {
      context.appendRule(context.buffer);
    })
  );

  /**
   * MEDIA BLOCK
   */
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

  /**
   * COMMENTS_BLOCK
   */
  schema.block(
    COMMENTS_BLOCK,
    step('/*'),
    step('*/', {
      endAction: clearContext,
    }),
    block.out()
  );

  /**
   * SELECTOR_BLOCK
   */
  const START_SELECTOR_LABEL = 'START_SELECTOR';
  schema.block(
    SELECTOR_BLOCK,
    // ----
    label(START_SELECTOR_LABEL),
    rule.repeat(
      branch(
        //--
        selector(
          ALPHABETICAL,
          actions.selector({
            type: SELECTORS.TAG,
          }),
          actions.selectorEnd()
        ),
        //--
        selector(
          '.',
          actions.selector({
            type: SELECTORS.CLASS,
          }),
          actions.selectorEnd()
        ),
        //--
        rule(
          step(
            ':',
            actions.selector({
              type: SELECTORS.PSEUDO,
            })
          ),
          link(START_SELECTOR_LABEL)
        )
      ),
      branch.maybe(
        step(
          ' ',
          actions.selectorSeparator({
            type: SELECTOR_SEPARATORS.SPACE,
          })
        ),
        rule(
          step(
            ',',
            actions.selectorSeparator({
              type: SELECTOR_SEPARATORS.COMMA,
            })
          ),
          link(START_SELECTOR_LABEL)
        ),
        rule(
          step(
            ':',
            actions.selectorSeparator({
              type: SELECTOR_SEPARATORS.PSEUDO,
            })
          ),
          link(START_SELECTOR_LABEL)
        ),
        rule(
          step(':not(', context => {
            context.clear();
            context.startNotSelector();
          }),
          block(SELECTOR_BLOCK),
          step(')', context => {
            context.clear();
            context.endNotSelector();
          })
        )
      )
    ),

    block.out()
  );

  /**
   * Rule
   */
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
    step('{', actions.declarationStart()),

    rule.repeat.maybe(
      branch(
        block(COMMENTS_BLOCK),
        rule(
          property(actions.propertyStart(), actions.propertyEnd()),
          step(':', clearContext),
          propertyValue(actions.valueStart(), actions.valueEnd()),
          step(';', clearContext)
        )
      )
    ),

    step('}', actions.declarationEnd()),
    block.out()
  );

  // prettier-ignore
  schema.main(
    rule.repeat(
      branch(
        block(RULE_BLOCK), 
        block(COMMENTS_BLOCK),
        block(MEDIA_BLOCK),
      )
    )
  );

  return schema;
}
