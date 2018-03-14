import Context from 'rockster/Context';
import { selector } from '../schema/index';

export const SELECTORS = {
  CLASS: 0,
  ID: 1,
  PSEUDO: 2,
  TAG: 3,
};

export const SELECTOR_SEPARATORS = {
  NONE: 0,
  COMMA: 1,
  WITH_PARENT: 2,
  SPACE: 3,
  PSEUDO: 4,
  NOT: 5,
};

const NESTED_SELECTORS = {
  NONE: 0,
  NOT_SELECTOR: 1,
};

export default class CSSContext extends Context {
  selectorSeparator = SELECTOR_SEPARATORS.NONE;

  condition = '';

  css = '';
  output = [];

  property = '';

  parentSelectors = '';

  hasProperties = false;

  openedNotSelectors = 0;
  // nestedSelectorType = NESTED_SELECTORS.NONE;
  // selectors = '';
  // selectorsMap = {};
  // selectorsBackups = [];

  classnames = {};

  constructor(options = {}) {
    super(options);
    this.updateSelector = options.updateSelector;
  }

  startRule() {
    this.hasProperties = false;
    this.classnames = {};
    this.css = '';
  }

  endRule() {
    if (this.hasProperties) {
      if (this.condition) {
        this.output.push(`@media${this.condition}{${this.css}}`);
        // this.output.push({
        //   selectors: {},
        //   css: `@media${this.condition}{${this.css}}`,
        // });
      } else {
        // this.output.push(this.css);
        this.output.push({
          classnames: this.classnames,
          css: `${this.css}`,
        });
      }
    }
  }

  startMedia() {
    this.condition = '';
  }

  endMedia() {
    this.condition = null;
    this.appendCSS('}');
  }

  addCondition(condition) {
    this.condition += condition;
  }

  appendCSS(css) {
    this.css += css;
  }

  appendRule(rule) {
    this.output.push(rule);
  }

  startNotSelector() {
    this.appendCSS(':not(');
    this.selectorSeparator = SELECTOR_SEPARATORS.NONE;
  }

  endNotSelector() {
    this.appendCSS(')');
    this.selectorSeparator = SELECTOR_SEPARATORS.NONE;
  }

  addSelector(raw) {
    let selector = this.updateSelector
      ? this.updateSelector(raw, this.selectorType)
      : raw;

    switch (this.selectorType) {
      case SELECTOR_TYPES.CLASS:
        this.classnames[raw.slice(1)] = selector;
        break;
    }

    let appendSelector = selector;

    switch (this.selectorSeparator) {
      // case SELECTOR_SEPARATORS.NOT:
      //   this.appendCSS(`:not(${appendSelector}`);
      //   break;

      case SELECTOR_SEPARATORS.COMMA:
        this.appendCSS(`,${appendSelector}`);

        break;
      case SELECTOR_SEPARATORS.SPACE:
        this.appendCSS(` ${appendSelector}`);

        break;
      case SELECTOR_SEPARATORS.PSEUDO:
      case SELECTOR_SEPARATORS.NONE:
        this.appendCSS(appendSelector);

        break;
    }
  }

  export() {
    return this.output;
  }
}
