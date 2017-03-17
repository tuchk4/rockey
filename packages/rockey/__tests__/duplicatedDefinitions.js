import rule from '../lib/rule';
import { clearCachedClassNames } from '../lib/css/getClassName';

console.warn = jest.fn();

describe('duplicated definitions', () => {
  beforeEach(() => {
    console.warn.mockClear();
    clearCachedClassNames();
  });

  it('no duplication', () => {
    const css = rule`
      Button {
        color: red;
      }

      Button1 {
        color: red;
      }
    `;

    css.getClassList();
    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('duplication (parse error)', () => {
    const css = rule`
      Button {
        color: red;
      }

      Button {
        color: green;
      }
    `;

    expect(() => css.getClassList()).toThrow(
      '(parse error) "Button" duplicated definiton at one block'
    );
  });

  it('duplication (parse error)', () => {
    const css = rule`
      Button {
        color: red;

        :hover {
          color: green;
        }

        :hover {
          color: purple;
        }
      }
    `;

    expect(() => css.getClassList()).toThrow(
      '(parse error) ":hover" duplicated definiton at one block'
    );
  });

  it('duplication (generate error)', () => {
    const css1 = rule`
      Button {
        color: red;
      }
    `;

    const css2 = rule`
      Button {
        color: red;
      }
    `;

    css1.getClassList();
    css2.getClassList();

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][0]).toEqual(
      '(generate error) "Button" was already defined as root component'
    );
  });

  it('no duplication if disabled classMap', () => {
    const css1 = rule`
      Button {
        color: red;
      }
    `;

    const css2 = rule`
      Button {
        color: red;
      }
    `;

    css1.getClassList();

    css2.isRoot(false);
    css2.getClassList();

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('no duplication with nested comopnents', () => {
    const css = rule`
      Button {
        color: red;

        Icon {
          color: blue;
        }
      }

      Icon {
        color: green;
      }
    `;

    css.getClassList();

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('duplication addParent (generate error)', () => {
    const css1 = rule`
      Button {
        color: red;
      }
    `;

    const css2 = rule`
      Button {
        color: green;
      }
    `;

    css1.addParent(css2);
    css1.getClassList();

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][0]).toEqual(
      '(generate error) "Button" was already defined as root component'
    );
  });

  it('no duplication wrapWith', () => {
    const css = rule`
      Button {
        color: red;
      }
    `;

    css.wrapWith('Button');
    css.getClassList();

    expect(console.warn.mock.calls.length).toEqual(0);
  });
});
