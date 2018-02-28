import Context from 'rockster/Context';
import { selector } from '../schema/index';

export const SELECTOR_SEPARATORS = {
  NONE: 0,
  COMMA: 1,
  WITH_PARENT: 2,
  SPACE: 3,
  PSEUDO: 4,
};

export default class CSSContext extends Context {
  backups = [];

  selectorSeparator = SELECTOR_SEPARATORS.NONE;

  css = '';
  output = [];

  property = '';

  selectors = [];
  selectorsSchema = [];
  parentSelectors = '';

  hasProperties = false;

  constructor(options = {}) {
    super(options);
    this.updateSelector = options.updateSelector;
  }

  startRule() {
    this.backups.push([
      this.css,
      this.selectors,
      this.parentSelectors,
      this.hasProperties,
    ]);

    let parentSelectors = [];
    if (this.parentSelectors.length) {
      const parentSelectorsSize = this.parentSelectors.length;
      const selectorsSize = this.selectors.length;

      for (let i = 0; i < parentSelectorsSize; i++) {
        for (let j = 0; j < selectorsSize; j++) {
          parentSelectors.push(
            `${this.parentSelectors[i]} ${this.selectors[j]}`
          );
        }
      }
    } else {
      parentSelectors = this.selectors;
    }

    this.parentSelectors = parentSelectors;

    this.hasProperties = false;
    this.selectors = [];
    this.css = '';
  }

  endRule() {
    if (this.hasProperties) {
      this.output.push(this.css);
    }

    if (this.backups.length) {
      [
        this.css,
        this.selectors,
        this.parentSelectors,
        this.hasProperties,
      ] = this.backups.pop();
    } else {
      this.css = '';
      this.selectors = [];

      this.parentSelectors = '';
    }
  }

  appendCSS(css) {
    this.css += css;
  }

  addSelector(raw) {
    let selector = this.updateSelector ? this.updateSelector(raw) : raw;
    let appendSelector = selector;

    if (this.parentSelectors.length) {
      appendSelector = this.parentSelectors
        .map(parent => parent + ' ' + selector)
        .join(',');
    }

    console.log(selector);

    switch (this.selectorSeparator) {
      case SELECTOR_SEPARATORS.COMMA:
        this.appendCSS(`,${appendSelector}`);
        this.selectors.push(selector);
        break;
      case SELECTOR_SEPARATORS.SPACE:
        this.appendCSS(` ${appendSelector}`);
        this.selectors[this.selectors.length - 1] += ` ${selector}`;
        break;
      case SELECTOR_SEPARATORS.NONE:
        this.appendCSS(appendSelector);
        this.selectors.push(selector);
        break;
      case SELECTOR_SEPARATORS.PSEUDO:
        // console.log(appendSelector);
        this.appendCSS(appendSelector);
        this.selectors[this.selectors.length - 1] += `${selector}`;
        break;
    }
  }

  export() {
    return this.output.join('');
  }
}
