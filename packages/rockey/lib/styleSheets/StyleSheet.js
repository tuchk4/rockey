import isArray from 'lodash/isArray';
import raf from 'raf';

import { mountStyleNode } from './mount';

const INSERT_DELTA_TIME_THRESHOLD = 20;
const MAX_QUEUE_SIZE = 2000;
const ELEMENT_STYLES_SIZE_THRESHOLD = 600;

// const isContainer = key => key.indexOf('@media') === 0;
// const isKeyFrames = key => key.indexOf('@keyframes') === 0;

const getSheetForTag = tag => {
  if (tag.sheet) {
    return tag.sheet;
  }

  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  }
};

const stringifyRule = (className, description) => {
  return `
    ${className} {
        ${Object.keys(description)
    .map(key => {
      if (isArray(description[key])) {
        return description[key].map(value => `${key}:${value};`).join('');
      } else {
        return `${key}:${description[key]};`;
      }
    })
    .join('')}
  }
  `;
};

export const stringify = ({ selector, styles, frames, media }) => {
  let css = '';

  if (styles) {
    if (media) {
      css = `
        ${media} {
          ${stringifyRule(selector, styles)}
        }
      `;
    } else {
      css = stringifyRule(selector, styles);
    }
  } else if (frames) {
    if (media) {
      css = `
        ${media} {
          ${stringifyRule(selector, styles)}
        }
      `;
    } else {
      css = `${selector} {
        ${frames.map(stringify).join(' ')}
      }`;
    }
  }

  return css;
};

export const stringifyRules = precss => {
  let css = '';

  precss.forEach(p => {
    css += stringify(p);
  });

  return css;
};

const insert = (node, precss) => {
  const css = stringifyRules(precss);
  const fragment = document.createTextNode(css);

  node.appendChild(fragment);

  return precss.length;
};

export default class StyleSheet {
  sizes = {
    rules: 0,
    mixins: 0,
  };

  rafIds = {
    insert: null,
    mixins: null,
  };

  queue = {
    rules: [],
    mixins: [],
  };

  queueSize = 0;

  counter = {
    rueles: 0,
    mixins: 0,
  };

  rules = {};

  prevInsertTime = 0;

  constructor(sheets, speedy = false) {
    this.speedy = speedy;
    this.nodes = {
      rules: sheets.rules,
      mixins: sheets.mixins,
    };
  }

  enableSpeedy() {
    this.speedy = true;
  }

  getRules() {
    return this.rules;
  }

  getMixins() {
    return this.mixins;
  }

  clear() {
    this.mixins = 0;
    this.rules = 0;

    if (this.rafIds.mixins) {
      raf.cancel(this.rafIds.mixins);
    }

    if (this.rafIds.rules) {
      raf.cancel(this.rafIds.rules);
    }

    this.queue.rules.length = 0;
    this.queue.mixins.length = 0;

    this.nodes.rules.textContent = '';
    this.nodes.mixins.textContent = '';
  }

  insert(precss, type) {
    if (this.rafIds[type]) {
      raf.cancel(this.rafIds[type]);
    }

    const delta = Date.now() - this.prevInsertTime;
    this.prevInsertTime = Date.now();

    this.queue[type] = this.queue[type].concat(precss);

    if (delta <= INSERT_DELTA_TIME_THRESHOLD) {
      if (this.queue[type].length > MAX_QUEUE_SIZE) {
        this.flush(type);
      } else {
        this.rafIds[type] = raf(() => {
          this.flush(type);
        });
      }
    } else {
      this.flush(type);
    }
  }

  flush(type) {
    if (this.queue[type].length) {
      if (this.sizes[type] >= ELEMENT_STYLES_SIZE_THRESHOLD) {
        this.nodes[type] = mountStyleNode();
        this.sizes[type] = 0;
      }

      if (this.speedy) {
        const sheet = getSheetForTag(this.nodes[type]);

        this.queue[type].forEach(precss => {
          const css = stringify(precss);
          sheet.insertRule(css, this.sizes[type]);
          // this.rules[s] = sheet.rules[this.sizes[type]++];
          this.sizes[type]++;
        });
      } else {
        this.sizes[type] += insert(this.nodes[type], this.queue[type]);
      }

      this.queue[type] = [];
    }
  }

  insertRules(precss) {
    this.insert(precss, 'rules');
  }

  insertMixins(precss) {
    this.insert(precss, 'mixins');
  }
}
