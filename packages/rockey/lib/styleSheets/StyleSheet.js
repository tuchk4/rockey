import isArray from 'lodash/isArray';

const isContainer = key => key.indexOf('@media') === 0;
const isKeyFrames = key => key.indexOf('@keyframes') === 0;

// const cache = new Map();

// TODO: add className + description cache
const stringifyRule = (className, description) => {
  // const cacheKey = JSON.stringify(description);
  // if (cache.has(cacheKey)) {
  //
  //   return `
  //     ${className} {
  //       ${cache.get(cacheKey)
  //     }
  //   `;
  // }

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

  // cache.set(cacheKey, rule);

  // return `
  //   ${className} {
  //     ${rule}
  //   }
  // `;
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

const QUEUE_THRESHOLD = 200;
const INSERT_DELTA_TIME_THRESHOLD = 5;

const insert = (node, tree) => {
  const rules = tree.map(decl => toArray(decl).join(''));
  node.appendChild(document.createTextNode(rules.join('')));

  return rules;
};

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

    this.nodes.rules.textContent = '';
    this.nodes.mixins.textContent = '';
  }

  insert(tree, type) {
    if (this.speedy) {
      const rules = toArray(tree);
      this.queue[type] = this.queue[type].concat(rules);

      const sheet = getSheetForTag(this.nodes[type]);

      rules.forEach(rule => {
        sheet.insertRule(rule, this[type].length);
        this[type].push(rule);
      });

      return;
    }

    const delta = Date.now() - this.prevInsertTime;
    this.prevInsertTime = Date.now();

    // const rules = toArray(tree);
    this.queue[type] = this.queue[type].concat(tree);

    const pop = () => {
      if (this.queue.rules.length) {
        const insertedRules = insert(this.nodes.rules, this.queue.rules);

        this.rules = this.rules.concat(insertedRules);
        this.queue.rules.length = 0;
      }

      if (this.queue.mixins.length) {
        const insertedMixins = insert(this.nodes.mixins, this.queue.mixins);

        this.mixins = this.rules.concat(insertedMixins);
        this.queue.mixins.length = 0;
      }
    };

    if (delta <= INSERT_DELTA_TIME_THRESHOLD) {
      if (this.insertTimeout) {
        clearTimeout(this.insertTimeout);
      }

      this.insertTimeout = setTimeout(pop);
    } else {
      pop();
    }
  }

  insertRules(tree) {
    this.insert(tree, 'rules');
  }

  insertMixins(tree) {
    this.insert(tree, 'mixins');
  }
}
