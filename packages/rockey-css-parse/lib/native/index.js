import prepare from 'rockster/parsers/crossrefs/encode';
import createParser from 'rockster/parsers/crossrefs';

import factory from './factory/index';
import Context from './Context';

const schema = factory();

const segments = prepare(schema.compose());

export default function create(options) {
  return createParser({
    createContext: () => new Context(options),
    segments,
  });
}
