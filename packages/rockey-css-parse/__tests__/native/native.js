import create from '../../native';

describe('native css', () => {
  test('simple', () => {
    const parse = create();
    const context = parse(`
.bar   .foo {
  color: yellow;
}`);

    expect(context.export()).toMatchSnapshot();
  });

  test('simple - updateClassName', () => {
    const parse = create({
      updateClassName: classname => `${classname}-hash`,
    });

    const context = parse(`
.bar   .foo {
  color: yellow;
}`);

    expect(context.export()).toMatchSnapshot();
  });

  test('not selector', () => {
    const parse = create({
      updateClassName: classname => `${classname}-hash`,
    });

    const context = parse(`
.bar:not(:hover, .foo) { 
  color: yellow;
}`);

    expect(context.export()).toMatchSnapshot();
  });

  test('few rules', () => {
    const parse = create();

    const context = parse(`
.bar {
  color: yellow;
}

.foo {
  color: orange;
}`);

    expect(context.export()).toMatchSnapshot();
  });

  test('tag and classname', () => {
    const parse = create({
      updateClassName: classname => `${classname}-hash`,
    });

    const context = parse(`
span.foo, div.bar:not(div:hover) {
  color: yellow;
}

span.active {
  display: flex;
}
`);

    expect(context.export()).toMatchSnapshot();
  });

  test('multiple classes', () => {
    const parse = create({
      updateClassName: classname => `${classname}-hash`,
    });

    const context = parse(`
span.foo.bar {
  color: red;
}

div.item.active {
  color: red;
}
`);

    expect(context.export()).toMatchSnapshot();
  });

  test('keyframes', () => {
    const parse = create({
      updateClassName: classname => `${classname}-hash`,
    });

    const context = parse(`
@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%; 
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
`);

    console.log(context.export());

    // expect(context.export()).toMatchSnapshot();
  });
});
