import prepare from 'rockster/parsers/crossrefs/encode';
import createParser from 'rockster/parsers/crossrefs';

import factory from './factory';
import * as actions from './actions';
import NativeContext from './NativeContext';

const schema = factory({
  actions,
});

const segments = prepare(schema.compose());

export default function create({ updateSelector } = {}) {
  return createParser({
    createContext: () =>
      new NativeContext({
        updateSelector,
      }),
    segments,
  });
}
