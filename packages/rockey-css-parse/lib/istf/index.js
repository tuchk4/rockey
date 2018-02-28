import Context from 'rockster/Context';
import istfToCSS from './istfToCSS';

// export type ISTF = Array<number | string>;

export default class CSSContext extends Context {
  // nested = 0;
  ruleStarted = false;
  selectors = [];

  istf = [];

  appendIstf(...istf) {
    if (!this.istf[this.depth]) {
      this.istf[this.depth] = [];
    }

    this.istf[this.depth].push(...istf);
  }

  onBackup() {
    if (!this.istf[this.depth]) {
      this.istf[this.depth] = [];
    }

    return {};
  }

  export() {
    // console.log(this.istf);

    return istfToCSS(this.istf[0]);
  }
}
