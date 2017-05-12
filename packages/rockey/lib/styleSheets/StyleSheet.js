import asap from 'asap';
import { stringify } from 'rockey-css-parse/stringify';
import initFragments from './utils/initFragments';

const INSERT_DELTA_TIME_THRESHOLD = 50;
const MAX_QUEUE_SIZE = 20000;

export default class StyleSheet {
  queue = [];
  prevInsertTime = 0;

  constructor(speedy = false) {
    this.speedy = speedy;
    this.fragments = initFragments(speedy);
    this.fragments.createFragments();
  }

  enableSpeedy() {
    this.speedy = true;
  }

  disabledSpeedy() {
    this.speedy = false;
  }

  getRules() {
    return {};
  }

  clear() {
    this.queue.length = 0;
  }

  insertWithQueue(precss) {
    const delta = Date.now() - this.prevInsertTime;
    this.prevInsertTime = Date.now();

    precss.forEach(p => {
      this.queue.push(p);
    });

    // this.queue = this.queue.concat(precss);

    if (delta <= INSERT_DELTA_TIME_THRESHOLD) {
      if (this.queue.length > MAX_QUEUE_SIZE) {
        this.flush();
      } else {
        asap(() => {
          this.flush();
        });
      }
    } else {
      this.flush();
    }
  }

  insert(precss) {
    if (this.speedy) {
      precss.forEach(pre => {
        const f = this.fragments.requestFragment();
        f.selectorText = pre.selector.join(' ');

        Object.keys(pre.styles).forEach(key => {
          /**
           * Note: value must not contain "!important" -- that should be set using the priority parameter.
           * https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty
           */
          f.style.setProperty(
            key,
            pre.styles[key].replace('!important', ''),
            pre.styles[key].indexOf('!important') !== -1 ? 'important' : null
          );
        });
      });
    } else {
      precss.forEach(pre => {
        const css = stringify(pre);

        const f = this.fragments.requestFragment();
        f.textContent = css;
      });
    }
  }

  flush(type) {
    if (this.queue.length) {
      this.insert(this.queue);
      this.queue = [];
    }
  }
}
