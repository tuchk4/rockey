import { stringify } from 'rockey-css-parse/stringify';
import initFragments from './utils/initFragments';

// const INSERT_DELTA_TIME_THRESHOLD = 20;
// const MAX_QUEUE_SIZE = 400;

const isProd = process.env.NODE_ENV === 'production';

export default class StyleSheet {
  queue = [];
  prevInsertTime = 0;

  constructor() {
    this.fragments = initFragments(isProd);

    if (isProd) {
      this.fragments.createFragments();
    }
  }

  insert(precss) {
    if (isProd) {
      precss.forEach(pre => {
        const css = stringify(pre);
        this.fragments.insertRule(css);

        // const f = this.fragments.requestFragment();
        //
        // if (pre.frames || pre.media) {
        //   const css = stringify(pre);
        //   this.fragments.insertRule(css);
        // } else {
        //   f.selectorText = pre.selector.join(' ');
        //
        //   Object.keys(pre.styles).forEach(key => {
        //     /**
        //      * Note: value must not contain "!important" -- that should be set using the priority parameter.
        //      * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty
        //      */
        //     f.style.setProperty(
        //       key,
        //       pre.styles[key].replace('!important', ''),
        //       pre.styles[key].indexOf('!important') !== -1 ? 'important' : null
        //     );
        //   });
        // }
      });
    } else {
      precss.forEach(pre => {
        const css = stringify(pre);
        this.fragments.insertRule(css);
        // const f = this.fragments.requestFragment();
        // f.data = css;
      });
    }
  }
}
