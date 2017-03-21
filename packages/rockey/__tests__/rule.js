import rule, { staticRule, clearStylesCache } from '../lib/rule';
import when from '../lib/when';
import { getClassName } from '../lib/css/getClassName';
import * as styleSheetsModule from '../lib/styleSheets';

jest.mock('../lib/utils/hash', () => {
  return () => '{{ hash }}';
});

const insertRules = jest.fn();
const insertMixins = jest.fn();

styleSheetsModule.insertRules = insertRules;
styleSheetsModule.insertMixins = insertMixins;

console.warn = jest.fn();

const primary = props => props.isPrimary ? `color: blue` : null;

describe('rule', () => {
  beforeEach(() => {
    insertRules.mockClear();
    insertMixins.mockClear();
    clearStylesCache();
  });

  it('empty rule', () => {
    const css = rule``;
    const classList = css.getClassList();

    expect(classList).toEqual({});
  });

  it('empty rule with wrap', () => {
    const css = rule``;
    css.wrapWith('Layer');

    const classList = css.getClassList();

    expect(classList).toEqual({
      Layer: ['Layer-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(0);
  });

  it('empty rule with parent', () => {
    const css = rule``;
    css.addParent(
      rule`
      Layer {
        color: green
      }
    `
    );

    const classList = css.getClassList();

    expect(classList).toEqual({});

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Layer-{{ hash }}': {
        color: 'green',
      },
    });
  });

  // ----

  it('classList without mixins', () => {
    const css = rule`
      Button {
        color: green;
      }

      Layer {
        color: red;
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
      Layer: ['Layer-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'green',
      },
      '.Layer-{{ hash }}': {
        color: 'red',
      },
    });
  });

  it('classList with mixins #1', () => {
    const css = rule`
      Button {
        color: green;

        ${primary}
      }

      Layer {
        color: red;

        ${primary}
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
      Layer: ['Layer-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'green',
      },
      '.Layer-{{ hash }}': {
        color: 'red',
      },
    });
  });

  it('classList with proced mixins #1', () => {
    const css = rule`
      Button {
        color: green;

        ${primary}
      }

      Layer {
        color: red;

        ${primary}
      }
    `;

    const classList = css.getClassList({
      isPrimary: true,
    });

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-primary-{{ hash }}-1'],
      Layer: ['Layer-{{ hash }}', 'Mixin-primary-{{ hash }}-1'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'green',
      },
      '.Layer-{{ hash }}': {
        color: 'red',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(1);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '.Mixin-primary-{{ hash }}-1.Button-{{ hash }}': {
        color: 'blue',
      },
      '.Mixin-primary-{{ hash }}-1.Layer-{{ hash }}': {
        color: 'blue',
      },
    });
  });

  it('classList with mixins #2', () => {
    const css = rule`
      Button {
        color: green;

        ${primary}
        ${primary}
        ${props => props.isRaised ? `color: green` : null}
      }

      Layer {
        color: red;

        ${primary}
        ${primary}
        ${props => props.isRaised ? `color: green` : null}
      }
    `;

    const classList = css.getClassList();

    expect(classList).toEqual({
      Button: ['Button-{{ hash }}'],
      Layer: ['Layer-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'green',
      },
      '.Layer-{{ hash }}': {
        color: 'red',
      },
    });
  });

  it('classList with proced mixins #2', () => {
    const css = rule`
      Button {
        color: green;

        ${primary}
        ${primary}
        ${props => props.isRaised ? `color: green` : null}
      }

      Layer {
        color: red;

        ${primary}
        ${primary}
        ${props => props.isRaised ? `color: green` : null}
      }
    `;

    const classList = css.getClassList({
      isPrimary: true,
      isRaised: true,
    });

    expect(classList).toEqual({
      Button: [
        'Button-{{ hash }}',
        'Mixin-primary-{{ hash }}-1',
        'Mixin-primary-{{ hash }}-1',
        'Mixin-anon-{{ hash }}-1',
      ],
      Layer: [
        'Layer-{{ hash }}',
        'Mixin-primary-{{ hash }}-1',
        'Mixin-primary-{{ hash }}-1',
        'Mixin-anon-{{ hash }}-1',
      ],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'green',
      },
      '.Layer-{{ hash }}': {
        color: 'red',
      },
    });
  });

  // ----

  it('classList with anon when', () => {
    const color = 'blue';

    const css = rule`
      Button {
        color: red;

        ${when(props => props.isPrimary)`
            color: ${color};
          `}
      }
    `;

    expect(css.getClassList()).toEqual({
      Button: ['Button-{{ hash }}'],
    });
  });

  it('classList with proced anon when', () => {
    const color = 'blue';

    const css = rule`
      Button {
        color: red;

        ${when(props => props.isPrimary)`
            color: ${color};
          `}
      }
    `;

    expect(
      css.getClassList({
        isPrimary: true,
      })
    ).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-anonWhen-{{ hash }}-1'],
    });
  });

  it('classList with named when', () => {
    const color = 'blue';

    const css = rule`
      Button {
        color: red;

        ${when('isPrimary', props => props.isPrimary)`
          color: ${color};
          `}
      }
    `;

    expect(css.getClassList()).toEqual({
      Button: ['Button-{{ hash }}'],
    });
  });

  it('classList with proced named when', () => {
    const color = 'blue';

    const css = rule`
      Button {
        color: red;

        ${when('isPrimary', props => props.isPrimary)`
          color: ${color};
          `}
      }
    `;

    expect(
      css.getClassList({
        isPrimary: true,
      })
    ).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-isPrimary-{{ hash }}-1'],
    });
  });

  it('classList with proced mixin', () => {
    const background = '#ccc';

    const css = rule`
      Button {
        color: red;

        ${primary}

        ${function isRaised(props) {
      return props.isRaised ? `background: ${background}` : null;
    }}
      }
    `;

    expect(
      css.getClassList({
        isPrimary: true,
        isRaised: true,
      })
    ).toEqual({
      Button: [
        'Button-{{ hash }}',
        'Mixin-primary-{{ hash }}-1',
        'Mixin-isRaised-{{ hash }}-1',
      ],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'red',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(1);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '.Mixin-primary-{{ hash }}-1.Button-{{ hash }}': {
        color: 'blue',
      },
      '.Mixin-isRaised-{{ hash }}-1.Button-{{ hash }}': {
        background: '#ccc',
      },
    });
  });

  it('classList with proced mixin and wrapped with component', () => {
    const css = rule`
      Button {
        color: red;

        ${primary}
      }
    `;

    css.wrapWith('Layer');

    expect(
      css.getClassList({
        isPrimary: true,
      })
    ).toEqual({
      Layer: ['Layer-{{ hash }}', 'Mixin-primary-{{ hash }}-1'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Layer-{{ hash }} .Button-{{ hash }}': {
        color: 'red',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(1);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '.Mixin-primary-{{ hash }}-1.Layer-{{ hash }} .Button-{{ hash }}': {
        color: 'blue',
      },
    });
  });

  it('staticRule', () => {
    const css = staticRule`
      Button {
        color: red;
      }
    `;

    expect(css.getClassList()).toEqual({
      Button: ['Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'red',
      },
    });
  });

  it('staticRule with mixin', () => {
    expect(
      () => staticRule`
      Button {
        color: red;
      }

      ${primary}
    `
    ).toThrow('Static rule should not contain mixins');
  });

  it('staticRule with variables', () => {
    const color = 'green';
    const css = staticRule`
      Button {
        color: ${color};
      }
    `;

    expect(css.getClassList()).toEqual({
      Button: ['Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'green',
      },
    });
  });

  it('rule with dynamic mixins', () => {
    const css = rule`
      Button {
        color: red;

        ${function colored(props) {
      return `color: ${props.color}`;
    }}
      }
    `;

    expect(
      css.getClassList({
        color: '#ffcc33',
      })
    ).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-colored-{{ hash }}-1'],
    });

    expect(
      css.getClassList({
        color: '#cc0000',
      })
    ).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-colored-{{ hash }}-2'],
    });

    expect(
      css.getClassList({
        color: '#3399ff',
      })
    ).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-colored-{{ hash }}-3'],
    });

    expect(
      css.getClassList({
        color: '#ffcc33',
      })
    ).toEqual({
      Button: ['Button-{{ hash }}', 'Mixin-colored-{{ hash }}-1'],
    });

    expect(insertRules.mock.calls.length).toEqual(1);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'red',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(3);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '.Mixin-colored-{{ hash }}-1.Button-{{ hash }}': {
        color: '#ffcc33',
      },
    });
    expect(insertMixins.mock.calls[1][0]).toEqual({
      '.Mixin-colored-{{ hash }}-2.Button-{{ hash }}': {
        color: '#cc0000',
      },
    });
    expect(insertMixins.mock.calls[2][0]).toEqual({
      '.Mixin-colored-{{ hash }}-3.Button-{{ hash }}': {
        color: '#3399ff',
      },
    });
  });

  it('rule add parent', () => {
    const parent = rule`
      Button {
        color: red;
        font-size: 10px;

        ${primary}
      }
    `;

    const child = rule`
      PrimaryButton {
        color: blue;
      }
    `;

    child.addParent(parent);

    expect(child.getClassList()).toEqual({
      PrimaryButton: ['PrimaryButton-{{ hash }}', 'Button-{{ hash }}'],
    });

    expect(insertRules.mock.calls.length).toEqual(2);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'red',
        'font-size': '10px',
      },
    });

    expect(insertRules.mock.calls[1][0]).toEqual({
      '.PrimaryButton-{{ hash }}': {
        color: 'blue',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(0);
  });

  it('rule add parent with proced mixin', () => {
    const parent = rule`
      Button {
        color: red;
        font-size: 10px;

        ${function colored(props) {
      return `color: ${props.color}`;
    }}
      }
    `;

    const child = rule`
      PrimaryButton {
        color: blue;
      }
    `;

    child.addParent(parent);

    expect(
      child.getClassList({
        color: '#ffcc33',
      })
    ).toEqual({
      PrimaryButton: [
        'PrimaryButton-{{ hash }}',
        'Button-{{ hash }}',
        'Mixin-colored-{{ hash }}-1',
      ],
    });

    expect(insertRules.mock.calls.length).toEqual(2);
    expect(insertRules.mock.calls[0][0]).toEqual({
      '.Button-{{ hash }}': {
        color: 'red',
        'font-size': '10px',
      },
    });

    expect(insertRules.mock.calls[1][0]).toEqual({
      '.PrimaryButton-{{ hash }}': {
        color: 'blue',
      },
    });

    expect(insertMixins.mock.calls.length).toEqual(1);
    expect(insertMixins.mock.calls[0][0]).toEqual({
      '.Mixin-colored-{{ hash }}-1.Button-{{ hash }}': {
        color: '#ffcc33',
      },
    });
  });
});
