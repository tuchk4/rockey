import { rule, branch, block, Schema } from 'rockster/schema';

import registerSelectors, { NAME as SELECTORS_BLOCK } from './blocks/selectors';
import registerMedia, { NAME as MEDIA_BLOCK } from './blocks/media';
import registerComments, { NAME as COMMENTS_BLOCK } from './blocks/comments';
import registerImport, { NAME as IMPORT_BLOCK } from './blocks/import';
import registerCSSRule, { NAME as CSS_RULE_BLOCK } from './blocks/rule';

export default function factory() {
  const schema = new Schema();

  const blocks = {
    SELECTORS_BLOCK,
    MEDIA_BLOCK,
    IMPORT_BLOCK,
    COMMENTS_BLOCK,
    CSS_RULE_BLOCK,
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

  schema.main(
    rule.repeat(
      // branch(
      block(CSS_RULE_BLOCK)
      // block(MEDIA_BLOCK),
      // block(COMMENTS_BLOCK),
      // block(IMPORT_BLOCK)
      // )
    )
  );

  return schema;
}
