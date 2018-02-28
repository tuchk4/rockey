// import prepare from 'rockster/parsers/default/prepare';
import prepare from 'rockster/parsers/crossrefs/prepare';
import createParser from 'rockster/parsers/crossrefs';

import factory from '../factory';
import * as actions from './actions';
import QuickContext from './QuickContext';

const schema = factory({
  actions,
});

const segments = prepare(schema.compose());

// export default segments;
// console.log(JSON.stringify(segments, 2, 2));

export default createParser({
  segments,
  createContext: () => new QuickContext(),
});
