import { block, step } from 'rockster/schema';
import { clearContext } from './utils';

const COMMENTS_BLOCK = 'COMMENTS_BLOCK';

export const blocks = {
  COMMENTS_BLOCK,
};

export default function commentsBlock({ schema }) {
  schema.block(
    COMMENTS_BLOCK,
    step('/*'),
    step('*/', {
      endAction: clearContext,
    }),
    block.out()
  );
}
