import mount from './mount';
import { STYLES_SIZE_PER_NODE, INITIAL_SIZE, FILL_SIZE } from './constants';

const availableFragments = [];

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

let node = null;
let size = 0;

export const createInitialNode = () => {
  node = mount();
};

export const insertRule = css => {
  if (size === STYLES_SIZE_PER_NODE) {
    node = mount();
    size = 0;
  }

  let sheet = getSheetForTag(node);
  let index = sheet.cssRules.length;

  sheet.insertRule(css, sheet.cssRules.length);
  size++;

  return sheet.cssRules[index];
};

const create = length => {
  if (!node) {
    node = mount();
  }

  let sheet = getSheetForTag(node);

  for (let i = 0; i < length; i++) {
    if (size === STYLES_SIZE_PER_NODE) {
      node = mount();
      size = 0;
    }

    let index = sheet.cssRules.length;
    sheet.insertRule('noscript {}', sheet.cssRules.length);
    const rule = sheet.cssRules[index];

    size++;

    availableFragments.push(rule);
  }
};

const fillFraments = () => {
  create(FILL_SIZE);
};

export const createFragments = () => {
  create(INITIAL_SIZE);
};

let j = 0;
export const requestFragment = () => {
  const fragment = availableFragments[j];
  j++;

  if (j === availableFragments.length) {
    fillFraments();
  }

  return fragment;
};
