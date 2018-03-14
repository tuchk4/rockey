import { rule, block, step } from 'rockster/schema';
import { clearContext } from './utils';

const MEDIA_BLOCK = 'MEDIA_BLOCK';

export const blocks = {
  MEDIA_BLOCK,
};

function mediaStart(context) {
  context.mediaStart(context.buffer);
}

function mediaEnd(context) {
  context.mediaEnd();
}
export default function mediaBlock({ schema, blocks }) {
  schema.block(
    MEDIA_BLOCK,
    {
      // onEnter: mediaStart,
      onLeave: mediaEnd,
    },
    step('@media(', clearContext, mediaStart),
    step(')'),
    step('{', clearContext),
    block(blocks.CSS_RULE_BLOCK),
    step('}', {
      endAction: clearContext,
    }),
    block.out()
  );
}
