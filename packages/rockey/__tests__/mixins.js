import parse from '../lib/css/parse';
import interpolateWithMixins from '../lib/mixins/interpolateWithMixins';

console.warn = jest.fn();

const primary = props => {
  if (props.isPrimary) {
    return `color: blue`;
  }
};

const isRaised = props => {
  if (props.isPrimary) {
    return `color: black`;
  }
};

describe('mixins', () => {
  beforeEach(() => {
    console.warn.mockClear();
  });

  it('1 mixin', () => {
    const { raw } = interpolateWithMixins`
      Button {
        color: yellow;

        ${primary}
      }
    `;

    const generated = parse(raw);
    expect(generated.components.Button.mixins.length).toEqual(1);
  });

  // it('2 mixins', () => {
  //   const { raw } = interpolateWithMixins`
  //     Button {
  //       color: yellow;
  //
  //       ${primary}
  //       ${isRaised}
  //     }
  //   `;
  //
  //    parse(raw);
  //
  //   const classNameMap = generated.classNameMap;
  //   expect(generated.components.Button.mixins.length).toEqual(2);
  // });

  it('wrong mixin position #1 (named mixin)', () => {
    const { raw } = interpolateWithMixins`
      Button {
        color: red;
        background: ${isRaised}
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][1]).toEqual(
      'Button - color: red; background: _MIXIN_isRaised1'
    );
  });

  it('wrong mixin position #2', () => {
    const { raw } = interpolateWithMixins`
      Button {
        color: red;

        Icon {
          background: ${primary}
        }
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][1]).toEqual(
      'Icon - background: _MIXIN_primary1'
    );
  });

  it('wrong mixin position #3', () => {
    const { raw } = interpolateWithMixins`
      Button {
        color: red;

        :hover {
          background: ${primary}
        }
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][1]).toEqual(
      ':hover - background: _MIXIN_primary1'
    );
  });

  it('wrong mixin position #4', () => {
    const { raw } = interpolateWithMixins`
      ${primary}

      Button {
        color: red;
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][1]).toEqual(
      'mixin should not be at root'
    );
  });

  it('wrong mixin position #5', () => {
    const { raw } = interpolateWithMixins`

      Button {
        color: red;
      }

      ${primary}
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(1);
    expect(console.warn.mock.calls[0][1]).toEqual(
      'mixin should not be at root'
    );
  });

  it('correct mixin position #1', () => {
    const { raw } = interpolateWithMixins`
      Button {
        color: red;

        :hover {
          ${primary}
        }
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('correct mixin position #2', () => {
    const { raw } = interpolateWithMixins`
      Button {
        color: red;

        ${primary}
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('correct mixin position #3', () => {
    const { raw } = interpolateWithMixins`
      Button {
        ${primary}

        color: red;
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('correct mixin position #4', () => {
    const { raw } = interpolateWithMixins`
      Button {

        @media(min-width: 300px) {
          ${primary}
        }

        color: red;
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('correct mixin position #5', () => {
    const { raw } = interpolateWithMixins`
      Button {

        @media(min-width: 300px) {
          color: red;
          ${primary}
        }
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  it('correct mixin position #6', () => {
    const { raw } = interpolateWithMixins`
      Button {

        @media(min-width: 300px) {
          color: red;
          :hover {
            Icon {
              ${primary}
            }
          }
        }
      }
    `;

    parse(raw);

    expect(console.warn.mock.calls.length).toEqual(0);
  });

  // ---
  // it('mixins results should contain only strings', () => {
  //   const { raw } = interpolateWithMixins`
  //     Button {
  //       color: red
  //       ${() => {
  //         return `
  //           color: blue;
  //           ${() => {}}
  //         `
  //       }}
  //     }
  //   `;
  //
  //    parse(raw);
  //
  //   expect(console.warn.mock.calls.length).toEqual(0);
  // });
});
