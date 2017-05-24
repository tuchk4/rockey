import createParser from '../lib/parse';
import { stringify } from '../lib/stringify';

const parse = createParser({
  getClassName: component => `c-${component}-hash`,
  getMixinClassName: component => `m-${component}-hash`,
  getAnimationName: component => `a-${component}-hash`,
});

// let cssWithoutMixins = null;

test('not closed', () => {
  expect(() =>
    parse(`
    Button {
      color: red;

    `)
  ).toThrowError();
});

test('not opened', () => {
  expect(() =>
    parse(`
    Button
      color: red;
    }
    `)
  ).toThrowError();
});

test('wrong rule', () => {
  expect(() =>
    parse(`
    Button {
      color red;
    }
    `)
  ).toThrowError();
});

test('media inside media', () => {
  expect(() =>
    parse(`
    @media (max-width: 199px) {
      color: purple;

      @media (max-width: 299px) {
        color: purple;
      }
    }
    `)
  ).toThrowError();
});

test('keyframes inside media', () => {
  expect(() =>
    parse(`
    @media (max-width: 199px) {
      color: purple;

      @keyframes colorized {
        from { color: red; }
        to { color: #fc3; }
      }
    }
    `)
  ).toThrowError();
});

test('duplicated keyframes', () => {
  expect(() =>
    parse(`
    @keyframes colorized {
      from { color: red; }
      to { color: #fc3; }
    }

    @keyframes colorized {
      from { color: red; }
      to { color: #fc3; }
    }
    `)
  ).toThrowError();
});

test('not opened mod', () => {
  expect(() =>
    parse(`
    Button:hover
      color: green;
    }
    `)
  ).toThrowError();
});

test('not closed mod', () => {
  expect(() =>
    parse(`
    Button:hover {
      color: green;

    `)
  ).toThrowError();
});

test('not opened mod #2', () => {
  expect(() =>
    parse(`
    Button {
      :hover
        color: green;
      }
    }
    `)
  ).toThrowError();
});

test('not closed mod #2', () => {
  expect(() =>
    parse(`
    Button {
      :hover {
        color: green;

    }
    `)
  ).toThrowError();
});

test('wrong mod', () => {
  expect(() =>
    parse(`
    Button {
      :hover {
        color green;
      }
    }
    `)
  ).toThrowError();
});
