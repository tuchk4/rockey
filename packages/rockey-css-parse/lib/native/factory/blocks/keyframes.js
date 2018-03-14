import { rule, block, branch, step } from 'rockster/schema';
import { clearContext, AZ_MARKER } from './utils';

const KEYFRAMES_BLOCK = 'KEYFRAMES_BLOCK';

export const blocks = {
  KEYFRAMES_BLOCK,
};

function keyframesStart(context) {
  //   context.mediaStart(context.buffer);
}

function keyframesEnd(context) {
  //   context.mediaEnd();
}

export default function keyframesBlock({ schema, blocks }) {
  schema.block(
    KEYFRAMES_BLOCK,
    {
      // onEnter: mediaStart,
      // onLeave: mediaEnd,
    },
    step('@keyframes', clearContext, keyframesStart),
    step(AZ_MARKER, {}),
    step('{', clearContext),
    //---
    step(AZ_MARKER),
    step('{'),
    block('DEFINITIONS'),
    step('}'),
    //---
    step('}', {
      endAction: keyframesEnd,
    }),
    block.out()
  );
}
