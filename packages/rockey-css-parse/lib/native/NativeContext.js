import Context from 'rockster/Context';
import { selector } from '../schema/index';

export const SELECTOR_TYPES = {
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
    // this.openedNotSelectors++;
    // this.nestedSelectorType = NESTED_SELECTORS.NOT_SELECTOR;
  }

  endNotSelector() {
    // this.openedNotSelectors--;
    this.appendCSS(')');
    this.selectorSeparator = SELECTOR_SEPARATORS.NONE;
    // this.nestedSelectorType = NESTED_SELECTORS.NONE;
  }

  startSelectors() {
    // this.selectorsBackups.push({
    //   selectors: this.selectors,
    //   selectorSeparator: this.selectorSeparator,
    //   nestedSelectorType: this.nestedSelectorType,
    // });
    // this.selectorSeparator = SELECTOR_SEPARATORS.NONE;
    // this.selectors = '';
  }

  endSelectors() {
    // const selectors = this.selectors;
    // if (this.selectorsBackups.length) {
    //   const memo = this.selectorsBackups.pop();
    //   this.selectorSeparator = memo.selectorSeparator;
    //   this.selectors = memo.selectors;
    //   this.nestedSelectorType = memo.nestedSelectorType;
    // } else {
    //   this.selectors = '';
    //   xx;
    // }
    // console.log(selectors);
    // switch (this.nestedSelectorType) {
    //   case NESTED_SELECTORS.NONE:
    //     this.selectors = `${this.selectors}${selectors}`;
    //     break;
    //   case NESTED_SELECTORS.NOT_SELECTOR:
    //     this.selectors = `${this.selectors}:not(${selectors})`;
    //     break;
    // }
    // console.log(this.selectors);
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
