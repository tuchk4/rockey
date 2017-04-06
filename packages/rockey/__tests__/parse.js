import parse from '../lib/css/parse';

export const styles = {
  empty: '',
  //-----
  onlyStyles: `
    color: white;
    font-weight: bold;
  `,
  //-----
  withComponents: `
    Button {
      color: red;
    }
  `,
  //-----
  withNestedComponents: `
    Button {
      color: red;

      Icon {
        color: blue;
      }
    }
  `,
  //-----
  withModificators: `
    Button {
      color: red;

      :hover {
        color: purple;
      }

      ::before {
        width: 16px;
      }

      Icon {
        color: blue;
      }
    }
  `,
  //-----
  withComponentsInsideModificators: `
    Button {
      color: red;

      :hover {
        color: purple;

        Icon {
          color: blue;
        }
      }
    }
  `,

  //-----
  withModificatorsInsideComponents: `
    Button {
      color: red;

      Icon {
        color: blue;

        :hover {
          color: purple;
        }
      }
    }
  `,

  //-----
  withMedia: `
    Button {
      color: red;

      Icon {
        color: blue;

        @media (max-width: 699px) {
          background: green;

          :hover {
            color: purple;
          }
        }

        :hover {
          color: purple;
        }
      }

      @media screen and (max-width: 699px) and (min-width: 520px) {
        background: yellow;
      }
    }
  `,
  // ---
  multipleMediaAtOneLevel: `
    Button {
      @media (max-width: 699px) {
        background: green;
        :hover {
          color: green;
        }
      }
    }

    Button2 {
      @media (max-width: 699px) {
        background: blue;
        :hover {
          color: blue;
        }
      }
    }
  `,

  // ---
  withFallbackValues: `
    Button {
      color: rgba(0, 255, 0, 0.3);
      color: #00ff00;
    }
  `,

  // ---
  withKeyframes: `
    Button {
      @keyframes example-first {
        0% { color: red; }
        50% { color: yellow; }
        100% { color: red; }
      }

      animation: example-first 1s infinity;
    }

    Button2 {
      @keyframes example-second {
        0% { color: purple; }
        100% { color: black; }
      }

      animation-name: example-second;
      animation-iteration-count: infinity;
      animation-duraiton: 1s;
    }
  `,

  // ---
  withTagSelectors: `
    Button {
      color: red;

      span.text {
        color: black;
      }

      div#hardcode {
        color: white;
      }
    }
  `,

  // ---
  withMostModificators: `
    Button {
      color: red;

      ::first-line {
        background-color: yellow;
      }

      :disabled {
        color: green;
      }

      :hover {
        color: blue;
      }

      ::after {
        color: purple;
      }

      :nth-child(2) {
        color: white;
      }

      :not(.hardcodeClass) {
        color: yellow;
      }

      :not(Icon) {
        color: orange;
      }
    }
  `,
};

export const struct = {
  mixins: [],
  components: {},
  styles: {},
  modificators: {},
  combinedComponents: [],
};

describe('parse', () => {
  it('empty', () => {
    const parsed = parse(styles.empty);
    expect(parsed).toEqual(struct);
  });

  it('onlyStyles', () => {
    const parsed = parse(styles.onlyStyles);

    expect(parsed).toEqual({
      ...struct,
      styles: {
        color: 'white',
        'font-weight': 'bold',
      },
    });
  });

  it('withComponents', () => {
    const parsed = parse(styles.withComponents);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          styles: {
            color: 'red',
          },
        },
      },
    });
  });

  it('withNestedComponents', () => {
    const parsed = parse(styles.withNestedComponents);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          styles: {
            color: 'red',
          },
          components: {
            Icon: {
              ...struct,
              styles: {
                color: 'blue',
              },
            },
          },
        },
      },
    });
  });

  it('withModificators', () => {
    const parsed = parse(styles.withModificators);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          modificators: {
            ':hover': {
              ...struct,
              styles: {
                color: 'purple',
              },
            },
            '::before': {
              ...struct,
              styles: {
                width: '16px',
              },
            },
          },
          styles: {
            color: 'red',
          },
          components: {
            Icon: {
              ...struct,
              styles: {
                color: 'blue',
              },
            },
          },
        },
      },
    });
  });

  it('withComponentsInsideModificators', () => {
    const parsed = parse(styles.withComponentsInsideModificators);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          modificators: {
            ':hover': {
              ...struct,
              components: {
                Icon: {
                  ...struct,
                  styles: {
                    color: 'blue',
                  },
                },
              },
              styles: {
                color: 'purple',
              },
            },
          },
          styles: {
            color: 'red',
          },
        },
      },
    });
  });

  it('withModificatorsInsideComponents', () => {
    const parsed = parse(styles.withModificatorsInsideComponents);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          styles: {
            color: 'red',
          },
          components: {
            Icon: {
              ...struct,
              modificators: {
                ':hover': {
                  ...struct,
                  styles: {
                    color: 'purple',
                  },
                },
              },
              styles: {
                color: 'blue',
              },
            },
          },
        },
      },
    });
  });

  it('withMedia', () => {
    const parsed = parse(styles.withMedia);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          components: {
            Icon: {
              ...struct,
              styles: {
                color: 'blue',
              },
              modificators: {
                '@media (max-width: 699px)': {
                  ...struct,
                  styles: {
                    background: 'green',
                  },
                  modificators: {
                    ':hover': {
                      ...struct,
                      styles: {
                        color: 'purple',
                      },
                    },
                  },
                },
                ':hover': {
                  ...struct,
                  styles: {
                    color: 'purple',
                  },
                },
              },
            },
          },
          styles: {
            color: 'red',
          },
          modificators: {
            '@media screen and (max-width: 699px) and (min-width: 520px)': {
              ...struct,
              styles: {
                background: 'yellow',
              },
            },
          },
        },
      },
    });
  });

  it('multipleMediaAtOneLevel', () => {
    const parsed = parse(styles.multipleMediaAtOneLevel);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          modificators: {
            '@media (max-width: 699px)': {
              ...struct,
              modificators: {
                ':hover': {
                  ...struct,
                  styles: {
                    color: 'green',
                  },
                },
              },
              styles: {
                background: 'green',
              },
            },
          },
        },
        Button2: {
          ...struct,
          modificators: {
            '@media (max-width: 699px)': {
              ...struct,
              modificators: {
                ':hover': {
                  ...struct,
                  styles: {
                    color: 'blue',
                  },
                },
              },
              styles: {
                background: 'blue',
              },
            },
          },
        },
      },
    });
  });

  it('withFallbackValues', () => {
    const parsed = parse(styles.withFallbackValues);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          styles: {
            color: ['rgba(0, 255, 0, 0.3)', '#00ff00'],
          },
        },
      },
    });
  });

  it('withKeyframes', () => {
    const parsed = parse(styles.withKeyframes);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          modificators: {
            '@keyframes example-first': {
              ...struct,
              components: {
                '0%': {
                  ...struct,
                  styles: {
                    color: 'red',
                  },
                },
                '50%': {
                  ...struct,
                  styles: {
                    color: 'yellow',
                  },
                },
                '100%': {
                  ...struct,
                  styles: {
                    color: 'red',
                  },
                },
              },
            },
          },
          styles: {
            animation: 'example-first 1s infinity',
          },
        },
        Button2: {
          ...struct,
          modificators: {
            '@keyframes example-second': {
              ...struct,
              components: {
                '0%': {
                  ...struct,
                  styles: {
                    color: 'purple',
                  },
                },
                '100%': {
                  ...struct,
                  styles: {
                    color: 'black',
                  },
                },
              },
            },
          },
          styles: {
            'animation-name': 'example-second',
            'animation-iteration-count': 'infinity',
            'animation-duraiton': '1s',
          },
        },
      },
    });
  });

  it('withTagSelectors', () => {
    const parsed = parse(styles.withTagSelectors);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          styles: {
            color: 'red',
          },
          components: {
            'span.text': {
              ...struct,
              styles: {
                color: 'black',
              },
            },
            'div#hardcode': {
              ...struct,
              styles: {
                color: 'white',
              },
            },
          },
        },
      },
    });
  });

  it('withMostModificators', () => {
    const parsed = parse(styles.withMostModificators);

    expect(parsed).toEqual({
      ...struct,
      components: {
        Button: {
          ...struct,
          styles: {
            color: 'red',
          },
          modificators: {
            '::first-line': {
              ...struct,
              styles: {
                'background-color': 'yellow',
              },
            },
            ':disabled': {
              ...struct,
              styles: {
                color: 'green',
              },
            },
            ':hover': {
              ...struct,
              styles: {
                color: 'blue',
              },
            },
            '::after': {
              ...struct,
              styles: {
                color: 'purple',
              },
            },
            ':nth-child(2)': {
              ...struct,
              styles: {
                color: 'white',
              },
            },
            ':not(.hardcodeClass)': {
              ...struct,
              styles: {
                color: 'yellow',
              },
            },
            ':not(Icon)': {
              ...struct,
              styles: {
                color: 'orange',
              },
            },
          },
        },
      },
    });
  });
});

test('parse: customStyles', () => {
  const parsed = parse(
    `
    Button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, .26);

      Icon {
        color: #fff
      }

      margin: 5px 6px;
    }
  `
  );

  expect(parsed).toMatchSnapshot();
});
