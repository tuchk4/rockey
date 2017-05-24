export default class RockeySyntaxError extends Error {
  rockeyError = true;

  constructor(rule, message) {
    super(`Syntax error${message ? `: ${message}` : ''}`);
    this.rule = rule;
  }
}
