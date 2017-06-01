import * as DOMFragments from './DOMFragments';
import * as CSSStyleSheetFragments from './CSSStyleSheetFragments';
// import * as VirtualFragments from './VirtualFragments';

const fragments = isProd => {
  const fragments = isProd ? CSSStyleSheetFragments : DOMFragments;
  fragments.createInitialNode();

  return fragments;
};

export default fragments;
