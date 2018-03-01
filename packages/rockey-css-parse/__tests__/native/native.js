import create from '../../native';
import { SELECTOR_TYPES } from '../../native/NativeContext';

let id = 0;

function resetId() {
  id = 0;
}

const parse = create({
  updateSelector: (selector, type) => {
    switch (type) {
      case SELECTOR_TYPES.CLASS:
      case SELECTOR_TYPES.ID:
        return `${selector}-${++id}`;
      default:
        return selector;
    }
  },
});

describe('native css', () => {
  beforeEach(() => resetId());

  test('simple', () => {
    const context = parse(`
.bar { 
  color: yellow;
}`);

    expect(context.export()).toMatchSnapshot();
  });

  test('few rules', () => {
    const context = parse(`
.bar { 
  color: yellow;
}

.foo {
  color: orange; 
}`);

    expect(context.export()).toMatchSnapshot();
  });
});
