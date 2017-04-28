import isArray from 'lodash/isArray';
import { mountMixinsNode } from './mount';

const isNode = typeof process === 'object';

// fix this shit
const raf = !isNode ? window.requestAnimationFrame : setTimeout;
const cancelRaf = !isNode ? window.cancelAnimationFrame : clearTimeout;

const isContainer = key => key.indexOf('@media') === 0;
const isKeyFrames = key => key.indexOf('@keyframes') === 0;

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

export const stringifyRules = tree => {
  let css = '';

  for (const className of Object.keys(tree)) {
    css += stringifyRule(className, tree[className]);
  }

  return css;
};

const toArray = tree => {
  let rules = [];

  for (const selector of Object.keys(tree)) {
    let css = null;

    if (isContainer(selector)) {
      css = `
        ${selector} {
          ${stringifyRules(tree[selector])}
        }
      `;
    } else if (isKeyFrames(selector)) {
      css = `
        ${selector} {
          ${stringifyRules(tree[selector])}
        }
      `;
    } else {
      css = stringifyRule(selector, tree[selector]);
    }

    rules.push(css);
  }

  return rules;
};

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

const INSERT_DELTA_TIME_THRESHOLD = 5;
const MAX_QUEUE_SIZE = 100;
const ELEMENT_STYLES_SIZE_THRESHOLD = 500;

const insert = (node, tree) => {
  const fragment = document.createDocumentFragment();

  let size = 0;
  tree.map(decl => toArray(decl)).forEach(rule => {
    // fragment.appendChild(document.createTextNode(rule.join(' ')));
    // size += rule.length;
    rule.forEach(css => {
      size++;
      fragment.appendChild(document.createTextNode(css));
    });
  });

  node.appendChild(fragment);

  return size;
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
      cancelRaf(this.rafIds.mixins);
    }

    if (this.rafIds.rules) {
      cancelRaf(this.rafIds.rules);
    }

    this.queue.rules.length = 0;
    this.queue.mixins.length = 0;

    this.nodes.rules.textContent = '';
    this.nodes.mixins.textContent = '';
  }

  insert(tree, type) {
    if (this.rafIds[type]) {
      cancelRaf(this.insertTimeout);
    }

    const delta = Date.now() - this.prevInsertTime;
    this.prevInsertTime = Date.now();

    this.queue[type].push(tree);

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
        this.nodes[type] = mountMixinsNode();
        this.sizes[type] = 0;
      }

      if (this.speedy) {
        const sheet = getSheetForTag(this.nodes[type]);

        for (let i = 0, size = this.queue[type].length; i < size; i++) {
          const rule = toArray(this.queue[type][i]);
          rule.forEach(r => {
            sheet.insertRule(r, this.sizes[type]);
            this.sizes[type]++;
          });
        }
      } else {
        this.sizes[type] += insert(this.nodes[type], this.queue[type]);
      }

      this.queue[type].length = 0;
    }
  }

  insertRules(tree) {
    this.insert(tree, 'rules');
  }

  insertMixins(tree) {
    this.insert(tree, 'mixins');
  }
}
