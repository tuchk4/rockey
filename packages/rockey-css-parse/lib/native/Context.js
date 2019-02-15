export const PREFIX_TYPES = {
  SPACE: 1,
  DOT: 2,
  HASH: 3,
  COLUMN: 4,
  NOT: 5,
};

export default class Context {
  buffer = '';
  output = [];

  condition = null;
  selectors = {};
  css = '';

  prefix = null;
  prefixSymbol = '';

  constructor({ updateClassName } = {}) {
    this.updateClassName = updateClassName;
  }

  trim() {
    this.buffer = this.buffer.trim();
  }

  append(char) {
    this.buffer += char;
  }

  clear() {
    this.buffer = '';
  }

  appendCSS(css) {
    this.css += css;
  }

  addImport() {
    // todo
  }

  mediaStart(condition) {
    if (this.condition) {
      // TODO: merge conditions
    }

    this.condition = condition;
  }

  mediaEnd() {
    this.condition = null;
  }

  ruleStart() {
    this.selectors = {};
    this.css = '';
  }

  ruleEnd() {
    this.output.push({
      classnames: this.selectors,
      css: this.css,
    });
  }

  addProperty(prop) {
    this.appendCSS(`${prop}:`);
  }

  addValue(value) {
    this.appendCSS(`${value};`);
  }

  declarationStart() {
    this.appendCSS('{');
  }

  declarationEnd() {
    this.appendCSS('}');
  }

  addSelector(selector, type, symbol) {
    let processedSelector = selector;

    switch (type) {
      case PREFIX_TYPES.DOT:
        processedSelector = this.updateClassName
          ? this.updateClassName(selector, type, symbol)
          : selector;

        this.selectors[selector] = processedSelector;
        break;
    }

    this.css += `${symbol}${processedSelector}`;
  }

  export() {
    return this.output;
  }
}
