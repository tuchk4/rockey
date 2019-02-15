import { rule, branch, block, Schema } from 'rockster/schema';

import registerSelectors, {
  blocks as SELECTORS_BLOCKS,
} from './blocks/selectors';
import registerMedia, { blocks as MEDIA_BLOCKS } from './blocks/media';
import registerComments, { blocks as COMMENTS_BLOCKS } from './blocks/comments';
import registerImport, { blocks as IMPORT_BLOCKS } from './blocks/import';
import registerCSSRule, { blocks as CSS_RULE_BLOCKS } from './blocks/rule';
import registerKeyframes, {
  blocks as KEYFRAMES_BLOCKS,
} from './blocks/keyframes';

export default function factory() {
  const schema = new Schema();

  const blocks = {
    ...SELECTORS_BLOCKS,
    ...MEDIA_BLOCKS,
    ...IMPORT_BLOCKS,
    ...COMMENTS_BLOCKS,
    ...CSS_RULE_BLOCKS,
    ...KEYFRAMES_BLOCKS,
  };

  registerSelectors({
    schema,
    blocks,
  });

  registerMedia({
    blocks,
    schema,
  });

  registerComments({
    blocks,
    schema,
  });

  registerImport({
    blocks,
    schema,
  });

  registerCSSRule({
    blocks,
    schema,
  });

  registerKeyframes({
    blocks,
    schema,
  });

  schema.main(
    rule.repeat(
      branch(
        block(blocks.CSS_RULE_BLOCK)
        // block(blocks.MEDIA_BLOCK),
        // block(blocks.COMMENTS_BLOCK),
        // block(blocks.IMPORT_BLOCK)
      )
    )
  );

  return schema;
}
