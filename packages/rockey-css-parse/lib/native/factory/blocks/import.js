import { step, block } from 'rockster/schema';

const IMPORT_BLOCK = 'IMPORT_BLOCK';
export const NAME = IMPORT_BLOCK;

function addImport(context) {
  context.addImport(context.buffer);
}

export default function mediaBlock({ schema }) {
  schema.block(
    IMPORT_BLOCK,
    step('@import'),
    step(';', addImport),
    block.out()
  );
}
