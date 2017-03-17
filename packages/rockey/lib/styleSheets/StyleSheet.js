import isArray from 'lodash/isArray';

const isContainer = key => key.indexOf('@media') === 0;
const isKeyFrames = key => key.indexOf('@keyframes') === 0;

// TODO: add className + description cache
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
    }
    if (isKeyFrames(selector)) {
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

const sheetForTag = tag => {
  if (tag.sheet) {
    return tag.sheet;
  }

  // this weirdness brought to you by firefox
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i];
    }
  }
};

const QUEUE_THRESHOLD = 200;

export default class StyleSheet {
  rules = [];
  mixins = [];

  timeouts = {
    insert: null,
    mixins: null,
  };

  queue = {
    rules: [],
    mixins: [],
  };

  counter = {
    rueles: 0,
    mixins: 0,
  };

  constructor(sheets) {
    this.styleNode = sheets.main;
    this.styleMixinsNode = sheets.mixins;
  }

  getRules() {
    return this.rules;
  }

  getMixins() {
    return this.mixins;
  }

  clear() {
    this.mixins = [];
    this.rules = [];

    if (this.timeouts.mixins) {
      clearTimeout(this.timeouts.mixins);
    }

    if (this.timeouts.rules) {
      clearTimeout(this.timeouts.rules);
    }

    this.styleNode.textContent = '';
    this.styleMixinsNode.textContent = '';
  }

  insertMixins(tree) {
    const rules = toArray(tree);

    this.queue.mixins = this.queue.mixins.concat(rules);

    if (this.queue.mixins.length >= 150) {
      this.styleMixinsNode.appendChild(
        document.createTextNode(this.queue.mixins.join(''))
      );

      this.mixins = this.mixins.concat(this.queue.mixins);
      this.queue.mixins.length = 0;
      return;
    }

    if (this.timeouts.mixins) {
      clearTimeout(this.timeouts.mixins);
    }

    this.timeouts.mixins = setTimeout(() => {
      this.styleMixinsNode.appendChild(
        document.createTextNode(this.queue.mixins.join(''))
      );

      this.mixins = this.mixins.concat(this.queue.mixins);
      this.queue.mixins.length = 0;
    });
  }

  insertRules(tree) {
    const rules = toArray(tree);
    this.queue.rules = this.queue.rules.concat(rules);

    if (this.queue.rules.length >= QUEUE_THRESHOLD) {
      this.styleNode.appendChild(
        document.createTextNode(this.queue.rules.join(''))
      );

      this.rules = this.rules.concat(this.queue.rules);
      this.queue.rules.length = 0;
      return;
    }

    if (this.timeouts.insert) {
      clearTimeout(this.timeouts.insert);
    }

    this.timeouts.insert = setTimeout(() => {
      this.styleNode.appendChild(
        document.createTextNode(this.queue.rules.join(''))
      );

      this.rules = this.rules.concat(this.queue.rules);
      this.queue.rules.length = 0;
    });
  }
}
