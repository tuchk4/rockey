import mount from './mount';
import { STYLES_SIZE_PER_NODE, INITIAL_SIZE, FILL_SIZE } from './constants';

const availableFragments = [];

let node = null;
let size = 0;

const create = length => {
  let fragment = document.createDocumentFragment();

  node = mount();

  for (let i = 0; i < length; i++) {
    if (size === STYLES_SIZE_PER_NODE) {
      node.appendChild(fragment);
      fragment = document.createDocumentFragment();
      node = mount();
      size = 0;
    }

    const text = document.createTextNode('');
    fragment.appendChild(text);
    size++;

    availableFragments.push(text);
  }

  node.appendChild(fragment);
};

const fillFraments = () => {
  create(FILL_SIZE);
};

export const createFragments = () => {
  create(INITIAL_SIZE);
};

export const requestFragment = () => {
  const fragment = availableFragments.shift();

  if (availableFragments.length < 10) {
    fillFraments();
  }

  return fragment;
};
