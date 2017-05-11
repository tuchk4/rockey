import * as DOMFragments from './DOMFragments';
import * as CSSStyleSheetFragments from './CSSStyleSheetFragments';
// import * as VirtualFragments from './VirtualFragments';

const fragments = speedy => {
  return speedy ? CSSStyleSheetFragments : DOMFragments;
};

export default fragments;
